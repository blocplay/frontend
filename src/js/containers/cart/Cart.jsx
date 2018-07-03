import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import CartComponent from '../../components/cart/screens/Cart';
import CheckoutComponent from '../../components/cart/screens/Checkout';
import PurchasedComponent from '../../components/cart/screens/Purchased';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';
import UI from '../../app/UI';
// TMP: E3DEMO
import GameItem from '../../app/CartItem/GameItem';

// END TMP

@inject('ui', 'auth', 'config')
@observer
class Cart extends ReactComponent {
	static propTypes = {
		onClose: PropTypes.func,
	};
	static defaultProps = {
		onClose: null,
	};

	@observable
	step = '';

	@observable
	loadingItems = false;

	/**
	 * True when we click "purchase" and the server is working
	 * @type {boolean}
	 */
	@observable
	purchasing = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	/**
	 * True if the user must provide her/his payment card info to complete the purchase. For
	 * example, this attribute would be false if the user is buying only games and has enough
	 * tokens. If the user added tokens, then it will probably be true (unless the credit card info
	 * are saved).
	 *
	 * @return {boolean}
	 */
	@computed
	get mustProvidePaymentCard() {
		const cart = this.getCart();
		return cart.hasTokenItem();
	}

	/**
	 * True if the user has enough tokens to buy the games in the cart.
	 */
	@computed
	get hasEnoughTokens() {
		const cart = this.getCart();
		return cart.getTotal().isLessThanOrEqualTo(this.user.tokenBalance);
	}

	componentWillMount() {
		this.step = 'cart';
		this.purchasing = false;
		this.user = this.props.auth.getUser();
		this.loadItems();
	}

	loadItems() {
		this.loadingItems = true;
		const gameAttributes = this.props.config.get('gameAttributes.cart');
		this.getCart().load(gameAttributes)
			.then(() => {
				this.loadingItems = false;
			});
	}

	close() {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	/**
	 * @return {Cart}
	 */
	getCart() {
		return this.user.getCart();
	}

	handleCheckoutClick = () => {
		this.step = 'checkout';
	};

	handleItemRemove = (item) => {
		this.getCart().removeItem(item);
	};

	handleCheckoutBack = () => {
		this.step = 'cart';
	};

	handlePurchase = () => {
		this.purchasing = true;
		// TMP: E3DEMO
		const games = this.getCart().getItems().filter(item => item.type === GameItem.TYPE).map(item => item.game);
		// END TMP

		this.getCart().buy()
			.then(() => {
				this.step = 'purchased';
				this.purchasing = false;
				// TMP: E3DEMO
				this.user.mockGames.push(...games);
				// END TMP
			});
	};

	handleGoToGames = () => {
		this.props.ui.router.goTo('/dashboard/home/games');
	};

	renderCart() {
		return (
			<CartComponent
				items={this.getCart().getItems()}
				total={this.getCart().getTotal()}
				loadingItems={this.loadingItems}
				purchasing={this.purchasing}
				mustProvidePaymentCard={this.mustProvidePaymentCard}
				hasEnoughTokens={this.hasEnoughTokens}
				onBack={this.props.onClose}
				onCheckoutClick={this.handleCheckoutClick}
				onPurchaseClick={this.handlePurchase}
				onItemRemove={this.handleItemRemove}
			/>
		);
	}

	renderCheckout() {
		return (
			<CheckoutComponent
				items={this.getCart().getItems()}
				purchasing={this.purchasing}
				total={this.getCart().getTotal()}
				onBack={this.handleCheckoutBack}
				onPurchaseClick={this.handlePurchase}
			/>
		);
	}

	renderPurchased() {
		return (
			<PurchasedComponent
				onBack={this.handleCheckoutBack}
				onGoToGamesClick={this.handleGoToGames}
			/>
		);
	}

	render() {
		if (this.step === 'checkout') {
			return this.renderCheckout();
		}

		if (this.step === 'purchased') {
			return this.renderPurchased();
		}

		return this.renderCart();
	}
}

// Injected props
Cart.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Cart;

import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import CartComponent from '../../components/cart/screens/Cart';
import CheckoutComponent from '../../components/cart/screens/Checkout';
import currentUser from '../../mock/currentUser';
import { cart } from '../../mock/shop';

@observer
class Cart extends ReactComponent {
	static propTypes = {
		onClose: PropTypes.func,
		onTokensAdd: PropTypes.func,
	};
	static defaultProps = {
		onClose: null,
		onTokensAdd: null,
	};

	@observable
	step = '';

	componentWillMount() {
		this.step = 'cart';
	}

	close() {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	handleCheckoutClick = () => {
		this.step = 'checkout';
	};

	handleItemRemove = (item) => {
		cart.items.remove(item);
	};

	handleCheckoutBack = () => {
		this.step = 'cart';
	};

	handlePurchase = () => {
		this.close();
	};

	renderCart() {
		return (
			<CartComponent
				balance={currentUser.tokenBalance}
				items={cart.items}
				total={cart.total}
				onBack={this.props.onClose}
				onCheckoutClick={this.handleCheckoutClick}
				onTokensAdd={this.props.onTokensAdd}
				onItemRemove={this.handleItemRemove}
			/>
		);
	}

	renderCheckout() {
		return (
			<CheckoutComponent
				balance={currentUser.tokenBalance}
				items={cart.items}
				total={cart.total}
				onBack={this.handleCheckoutBack}
				onPurchaseClick={this.handlePurchase}
			/>
		);
	}

	render() {
		if (this.step === 'checkout') {
			return this.renderCheckout();
		}

		return this.renderCart();
	}
}

export default Cart;

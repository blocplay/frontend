import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import AppBar from '../../AppBar';
import Back from '../../appBar/Back';
import ScrollableView from '../../ScrollableView';
import Summary from '../Summary';
import Icon from '../../icons/Icon';
import TokensBalance from '../../../containers/shop/TokensBalance';
import AbstractCartItem from '../../../app/CartItem/AbstractCartItem';
import Loading from '../../Loading';

@observer
class Cart extends Component {
	static propTypes = {
		items: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(AbstractCartItem)),
		loadingItems: PropTypes.bool,
		purchasing: PropTypes.bool,
		mustProvidePaymentCard: PropTypes.bool,
		hasEnoughTokens: PropTypes.bool,
		total: PropTypes.instanceOf(BigNumber),
		onBack: PropTypes.func,
		onItemRemove: PropTypes.func,
		onCheckoutClick: PropTypes.func,
		onPurchaseClick: PropTypes.func,
	};

	static defaultProps = {
		items: [],
		loadingItems: false,
		purchasing: false,
		mustProvidePaymentCard: false,
		hasEnoughTokens: false,
		total: 0,
		onBack: null,
		onItemRemove: null,
		onCheckoutClick: null,
		onPurchaseClick: null,
	};

	isEmpty() {
		return this.props.items.length === 0;
	}

	renderSummary() {
		let tokenDisclaimer = null;

		if (!this.props.mustProvidePaymentCard) {
			tokenDisclaimer = (
				<div className="cart__disclaimer">
					Clicking <strong>Purchase</strong> below will automatically purchase the
					items in your cart using your available tokens.
				</div>
			);
		}

		return (
			<Fragment>
				<Summary
					items={this.props.items}
					onRemove={this.props.onItemRemove}
					total={this.props.total}
					showRemove
				/>
				{tokenDisclaimer}
			</Fragment>
		)
	}

	renderEmpty() {
		return (
			<div className="cart__empty">Your cart is empty.</div>
		)
	}

	renderLoading() {
		return (
			<div className="cart__loading">
				<Loading />
			</div>
		);
	}

	renderContent() {
		if (this.props.loadingItems || this.props.purchasing) {
			return this.renderLoading();
		}

		if (this.isEmpty()) {
			return this.renderEmpty();
		}

		return this.renderSummary();
	}

	renderBuyButton() {
		if (this.props.loadingItems || this.props.purchasing || this.isEmpty()) {
			return null;
		}

		const disabled = !this.props.mustProvidePaymentCard && !this.props.hasEnoughTokens;
		const label = this.props.mustProvidePaymentCard ? 'Checkout' : 'Purchase';
		let clickCallback = null;

		if (!disabled) {
			clickCallback = this.props.mustProvidePaymentCard ? this.props.onCheckoutClick : this.props.onPurchaseClick;
		}

		return (
			<div className={`btn-yellow shopGame__purchase ${disabled ? 'shopGame__purchase--disabled': ''}`} onClick={clickCallback}>
				<button className="btn-yellow shopGame__purchase-button">{label}</button>
			</div>
		);
	}

	render() {
		return (
			<div className="flex-container">
				<AppBar title="Cart" pre={<Back onClick={this.props.onBack}/>}/>
				<TokensBalance />
				<ScrollableView>
					<div className="cart">
						<div className="streamList__title cart__title">
							<Icon icon="gamepad" />
							<h2 className="streamList__title-text">Cart</h2>
						</div>
						{this.renderContent()}
					</div>
				</ScrollableView>
				{this.renderBuyButton()}
			</div>
		);
	}
}

export default Cart;

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import numeral from 'numeral';
import AppBar from '../../AppBar';
import Back from '../../appBar/Back';
import ScrollableView from '../../ScrollableView';
import Summary from '../Summary';
import MockObject from '../../../mock/MockObject';
import Icon from '../../icons/Icon';

@observer
class Cart extends Component {
	static propTypes = {
		balance: PropTypes.number,
		items: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(MockObject)),
		total: PropTypes.number,
		onBack: PropTypes.func,
		onTokensAdd: PropTypes.func,
		onItemRemove: PropTypes.func,
		onCheckoutClick: PropTypes.func,
	};

	static defaultProps = {
		balance: 0,
		items: [],
		total: 0,
		onBack: null,
		onTokensAdd: null,
		onItemRemove: null,
		onCheckoutClick: null,
	};

	isEmpty() {
		return this.props.items.length === 0;
	}

	renderSummary() {
		return (
			<Fragment>
				<Summary
					items={this.props.items}
					onRemove={this.props.onItemRemove}
					total={this.props.total}
					showRemove
				/>
				<div className="cart__disclaimer">
					Clicking <strong>Checkout</strong> below will automatically purchase the
					items in your cart using your available tokens.
				</div>
			</Fragment>
		)
	}

	renderEmpty() {
		return (
			<div className="cart__empty">Your cart is empty.</div>
		)
	}

	renderContent() {
		if (this.isEmpty()) {
			return this.renderEmpty();
		}

		return this.renderSummary();
	}

	renderCheckoutButton() {
		if (this.isEmpty()) {
			return null;
		}

		return (
			<div className="btn-yellow shopGame__purchase" onClick={this.props.onCheckoutClick}>
				<button className="btn-yellow shopGame__purchase-button">Checkout</button>
			</div>
		);
	}

	render() {
		return (
			<div className="flex-container">
				<AppBar title="Cart" pre={<Back onClick={this.props.onBack}/>}/>
				<div className="shop__balance cart__balance">
					<div className="shop__balance-current">
						<Icon icon="tokenplay"/>
						<p>{numeral(this.props.balance).format('0,0')} Tokens Available</p>
					</div>
					<div>
						<button className="btn btn-sm btn-yellow" onClick={this.props.onTokensAdd}>
							Add
						</button>
					</div>
				</div>
				<ScrollableView>
					<div className="cart">
						<div className="streamList__title cart__title">
							<Icon icon="gamepad" />
							<h2 className="streamList__title-text">Cart</h2>
						</div>
						{this.renderContent()}
					</div>
				</ScrollableView>
				{this.renderCheckoutButton()}
			</div>
		);
	}
}

export default Cart;

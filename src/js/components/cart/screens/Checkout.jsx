import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import AppBar from '../../AppBar';
import Back from '../../appBar/Back';
import ScrollableView from '../../ScrollableView';
import Summary from '../Summary';
import Icon from '../../icons/Icon';
import TokensBalance from '../../../containers/shop/TokensBalance';
import AbstractCartItem from '../../../app/CartItem/AbstractCartItem';
import Loading from '../../Loading';

const propTypes = {
	items: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(AbstractCartItem)),
	total: PropTypes.number,
	purchasing: PropTypes.bool,
	onBack: PropTypes.func,
	onPurchaseClick: PropTypes.func,
};

const defaultProps = {
	items: [],
	total: 0,
	purchasing: false,
	onBack: null,
	onPurchaseClick: null,
};

function Cart(props) {
	let content = null;

	if (props.purchasing) {
		content = <Loading/>;
	} else {
		content = (
			<Fragment>
				<ScrollableView>
					<div>
						<div className="streamList__title cart__title">
							<Icon icon="gamepad" />
							<h2 className="streamList__title-text">Summary</h2>
						</div>
						<Summary items={props.items} total={props.total} />
						<form className="checkout">
							<div className="checkout__billing">
								<div className="welcome__form checkout__billing-form">
									<div className="streamList__title">
										<Icon icon="gamepad" />
										<h2>Billing Information</h2>
									</div>
									<input type="text" placeholder="First name" />
									<input type="text" placeholder="Last name" />
									<div className="select-wrapper">
										<select>
											<option>Country</option>
										</select>
									</div>
									<input type="text" placeholder="Billing Address" />
									<input type="text" placeholder="City" />
									<div className="select-wrapper">
										<select>
											<option>Province</option>
										</select>
									</div>
									<input type="text" placeholder="Postal code" />
								</div>
							</div>
							<div className="checkout__payment">
								<div className="welcome__form checkout__payment-form">
									<div className="streamList__title">
										<Icon icon="gamepad" />
										<h2>Payment Information</h2>
									</div>
									<input type="text" placeholder="Cardholder name" />
									<input type="text" placeholder="Credit card number" />
									<div className="checkout__credit-wrapper">
										<div className="checkout__credit">
											<input className="credit-input" type="text" placeholder="MM" />
											<input className="credit-input" type="text" placeholder="YY" />
											<input className="credit-input" type="text" placeholder="CVV" />
										</div>
										<div className="checkout__credit-icons">
											<Icon icon="cc-visa" />
											<Icon icon="cc-mastercard" />
											<Icon icon="cc-amex" />
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</ScrollableView>
				<div className="btn-yellow shopGame__purchase" onClick={props.onPurchaseClick}>
					<button className="btn-yellow shopGame__purchase-button">
						Purchase
					</button>
				</div>
			</Fragment>
		);
	}

	return (
		<div className="flex-container">
			<AppBar title="Checkout" pre={<Back onClick={props.onBack} />} />
			<TokensBalance />
			{content}
		</div>
	);
}

Cart.propTypes = propTypes;
Cart.defaultProps = defaultProps;

export default Cart;

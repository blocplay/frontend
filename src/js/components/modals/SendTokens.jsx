import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import omit from 'lodash/omit';
import numeral from 'numeral';
import MockObject from '../../mock/MockObject';

const INCREMENT_STEP = 25;

@observer
class SendTokens extends Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		initialAmount: PropTypes.number,
		type: PropTypes.oneOf(['send', 'add']),
		toUser: PropTypes.instanceOf(MockObject).isRequired,
		exchangeRate: PropTypes.number,
		onSend: PropTypes.func,
	};

	static defaultProps = {
		isOpen: false,
		initialAmount: 100,
		type: 'send',
		onSend: null,
		exchangeRate: null,
	};

	/**
	 * Amount
	 * @type {number}
	 */
	@observable
	amount = 0;

	/**
	 * Value in the input. This value will be parsed and put in this.amount if valid.
	 * @type {string}
	 */
	@observable
	value = '';

	componentWillMount() {
		this.amount = this.props.initialAmount;
		this.updateValue();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.isOpen && !this.props.isOpen) {
			this.amount = newProps.initialAmount;
			this.updateValue();
		}
	}

	getTitle() {
		return this.props.type === 'add' ? 'Add Tokens' : 'Send Tokens';
	}

	getButtonTitle() {
		return this.props.type === 'add' ? 'Add' : 'Send';
	}

	hasExchangeRate() {
		return typeof this.props.exchangeRate === 'number';
	}

	handleIncrement = () => {
		this.setAmount(this.amount + INCREMENT_STEP);
		this.updateValue();
	};

	handleDecrement = () => {
		this.setAmount(this.amount - INCREMENT_STEP);
		this.updateValue();
	};

	handleValueChange = (event) => {
		const { value } = event.target;
		const numericValue = Number.parseInt(value, 10);

		if (!Number.isNaN()) {
			this.setAmount(numericValue);
		}

		this.value = value;
	};

	/**
	 * @param {number} amount
	 */
	setAmount(amount) {
		this.amount = Math.max(0, amount);
	}

	updateValue() {
		this.value = `${this.amount}`;
	}

	renderAmountInput() {
		return (
			<div className="sendTokensModal__quantity-wrapper">
				<span className="sendTokensModal__quantity-control" onClick={this.handleDecrement}>&ndash;</span>
				<span>
					<input className="sendTokensModal__quantity-input" type="text" value={this.value} onChange={this.handleValueChange} />
				</span>
				<span className="sendTokensModal__quantity-control" onClick={this.handleIncrement}>+</span>
			</div>
		);
	}

	renderMoneyEstimate() {
		const estimate = this.amount * this.props.exchangeRate;

		return (
			<div>Estimated { numeral(estimate).format('$0,0.00') } USD</div>
		)
	}

	handleSubmit = () => {
		if (this.props.onSend) {
			this.props.onSend(this.amount);
		}
	};

	render() {
		const modalProps = {
			...omit(this.props, ['toUser', 'isCurrentUser', 'onSend', 'initialAmount']),
			ariaHideApp: false,
			portalClassName: 'modal sendTokensModal',
			overlayClassName: 'modal__overlay sendTokensModal__overlay',
			className: 'modal__content sendTokensModal__content',
			closeTimeoutMS: 300,
		};

		return (
			<ReactModal {...modalProps}>
				<div className="sendTokensModal__wrapper">
					<div className="sendTokensModal__title">{ this.getTitle() }</div>
					<div>{ this.renderAmountInput() }</div>
					{ this.hasExchangeRate() ? this.renderMoneyEstimate() : null }
					<button className="btn btn-yellow sendTokensModal__send" onClick={this.handleSubmit}>{ this.getButtonTitle() }</button>
				</div>
			</ReactModal>
		);
	}
}

export default SendTokens;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';
import Icon from '../icons/Icon';

class Item extends Component {
	static propTypes = {
		item: PropTypes.instanceOf(MockObject).isRequired,
		showRemove: PropTypes.bool,
		onRemove: PropTypes.func,
	};

	static defaultProps = {
		showRemove: false,
		onRemove: null,
	};

	renderGameItem() {
		const { game } = this.props.item;
		return (
			<div className="cart__meta">
				<img className="cart__thumb" src={game.medias.cover} alt={game.name} />
				<div className="cart__description">
					<div>{game.name}</div>
					<div className="cart__publisher">{game.publisher}</div>
					<div className="cart__price">
						<Icon icon="tokenplay" />
						<p>{game.tokenPrice}</p>
					</div>
				</div>
			</div>
		);
	}

	renderTokensItem() {
		const { amount } = this.props.item;
		return (
			<div className="cart__meta cart__tokens">
				<div className="cart__thumb">
					<Icon icon="tokenplay" />
				</div>
				<div className="cart__text cart__tokens-quantity">{amount}</div>
			</div>
		);
	}

	renderItem() {
		if (this.props.item.type === 'game') {
			return this.renderGameItem();
		}

		return this.renderTokensItem();
	}

	renderRemoveButton() {
		if (!this.props.showRemove) {
			return null;
		}

		return (
			<button className="btn cart__remove" onClick={this.props.onRemove}>
				<Icon icon="trash-alt" />
				<span>Remove</span>
			</button>
		);
	}

	render() {
		return (
			<div className="cart__item">
				{this.renderItem()}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default Item;

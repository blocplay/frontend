import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';
import AbstractCartItem from '../../app/CartItem/AbstractCartItem';
import GameItem from '../../app/CartItem/GameItem';
import Loading from '../Loading';
import { formatWei } from '../../app/utils';

class Item extends Component {
	static propTypes = {
		item: PropTypes.instanceOf(AbstractCartItem).isRequired,
		loading: PropTypes.bool,
		showRemove: PropTypes.bool,
		onRemove: PropTypes.func,
	};

	static defaultProps = {
		loading: false,
		showRemove: false,
		onRemove: null,
	};

	renderGameItem() {
		/** @type {Game} */
		const { game } = this.props.item;
		return (
			<div className="cart__meta">
				<img className="cart__thumb" src={game.images.cover.url} alt={game.name} />
				<div className="cart__description">
					<div>{game.name}</div>
					<div className="cart__publisher">{game.publisher.name}</div>
					<div className="cart__price">
						<Icon icon="tokenplay" />
						<p>{formatWei(game.price)}</p>
					</div>
				</div>
			</div>
		);
	}

	renderTokensItem() {
		const { quantity } = this.props.item;
		return (
			<div className="cart__meta cart__tokens">
				<div className="cart__thumb">
					<Icon icon="tokenplay" />
				</div>
				<div className="cart__text cart__tokens-quantity">{formatWei(quantity)}</div>
			</div>
		);
	}

	renderItem() {
		if (this.props.item.type === GameItem.TYPE) {
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

	renderLoading() {
		return <Loading/>;
	}

	render() {
		const content = this.props.loading ? this.renderLoading() : this.renderItem();

		return (
			<div className="cart__item">
				{content}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default Item;

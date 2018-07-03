import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import ItemComponent from '../../components/cart/Item';
import GameItem from '../../app/CartItem/GameItem';
import Config from '../../app/Config';
import AbstractCartItem from '../../app/CartItem/AbstractCartItem';

@inject('config')
@observer
class Item extends Component {
	static propTypes = {
		item: PropTypes.instanceOf(AbstractCartItem).isRequired,
	};
	static defaultProps = {};

	@observable
	loading = false;

	componentWillMount() {
		this.loadItem(this.props.item);
	}

	componentWillReceiveProps(newProps) {
		if (this.props.item !== newProps.item) {
			this.loadItem(newProps.item);
		}
	}

	loadItem(item) {
		if (item.type !== GameItem.TYPE) {
			this.loading = false;
			return;
		}

		const attributes = this.props.config.get('gameAttributes.cart');
		this.loading = true;
		item.game.fill(attributes)
			.then(() => {
				this.loading = false;
			});
	}

	render() {
		const componentProps = {
			...this.props,
			loading: this.loading,
		};
		return <ItemComponent {...componentProps} />;
	}
}

// Injected props
Item.wrappedComponent.propTypes = {
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Item;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import AppBarCartComponent from '../../components/shop/AppBarCart';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';

@inject('auth', 'config')
@observer
class AppBarCart extends Component {
	static propTypes = {
		onClick: PropTypes.func,
	};
	static defaultProps = {
		onClick: null,
	};

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	componentWillMount() {
		this.user = this.props.auth.getUser();
		this.loadCart();
	}

	loadCart() {
		const attributes = this.props.config.get('gameAttributes.cart');
		this.user.getCart().load(attributes);
	}

	render() {
		const items = this.user.getCart().getItems();

		return (
			<AppBarCartComponent
				onClick={this.props.onClick}
				isEmpty={items.length === 0}
			/>
		);
	}
}

// Injected props
AppBarCart.wrappedComponent.propTypes = {
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default AppBarCart;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import TokensBalanceComponent from '../../components/shop/TokensBalance';
import Authentication from '../../app/Authentication';
import currentUser from '../../mock/currentUser';
import UI from '../../app/UI';
import TokenItem from '../../app/CartItem/TokenItem';

@inject('auth', 'ui')
@observer
class TokensBalance extends Component {
	static propTypes = {
		onCartItemAdded: PropTypes.func,
	};
	static defaultProps = {
		onCartItemAdded: null,
	};

	@observable
	loading = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user = null;

	componentWillMount() {
		this.loading = false;
		this.user = this.props.auth.getUser();
		this.loadBalance();
	}

	loadBalance() {
		this.loading = true;
		// We reload the balance each time until we have an async socket
		this.user.fill(['tokenBalance'], true)
			.then(() => {
				this.loading = false;
			});
	}

	getTokenBalance() {
		return this.user.tokenBalance;
	}

	handleAdd = () => {
		this.props.ui.showSendTokensModal(currentUser, this.handleTokensAdded);
	};

	handleTokensAdded = (amount) => {
		const cart = this.user.getCart();
		const item = new TokenItem();
		item.quantity = (new BigNumber(amount)).multipliedBy(1e14);
		cart.addItem(item);

		if (this.props.onCartItemAdded) {
			this.props.onCartItemAdded();
		}
	};

	render() {
		return (
			<TokensBalanceComponent
				loading={this.loading}
				tokenBalance={this.getTokenBalance()}
				onAdd={this.handleAdd}
			/>
		);
	}
}

// Injected props
TokensBalance.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default TokensBalance;

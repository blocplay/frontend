import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/CreateAccount';
import UI from '../../../../app/UI';

@inject('ui')
@observer
class CreateAccount extends Component {
	static propTypes = {
	};
	static defaultProps = {};

	@observable
	working = false;

	handleLogin = () => {
		this.props.ui.router.goTo('/welcome/login');
	};

	/**
	 * For the prototype, we fake a create account delay. This will allow React to build the next
	 * screen while we show "creating account..."
	 */
	handleCreateAccount = () => {
		if (!this.working) {
			this.working = true;
			window.setTimeout(() => {
				this.props.ui.router.goTo('/dashboard/home/games');
			}, 50);
		}
	};

	render() {
		return (
			<Screen
				onLogin={this.handleLogin}
				onCreateAccount={this.handleCreateAccount}
				working={this.working}
			/>
		);
	}
}

// Injected props
CreateAccount.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default CreateAccount;

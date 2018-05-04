import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/Login';
import UI from '../../../../app/UI';

@inject('ui')
@observer
class Login extends Component {
	static propTypes = {
	};
	static defaultProps = {};

	@observable
	working = false;

	componentWillMount() {
		this.working = false;
	}

	/**
	 * For the prototype, we fake a login delay. This will allow React to build the next screen
	 * while we show "signing in..."
	 */
	handleLogin = () => {
		if (!this.working) {
			this.working = true;
			window.setTimeout(() => {
				this.props.ui.router.goTo('/dashboard/home/games');
			}, 50);
		}
	};

	handleCreateAccount = () => {
		if (!this.working) {
			this.props.ui.router.goTo('/welcome/createAccount');
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
Login.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Login;

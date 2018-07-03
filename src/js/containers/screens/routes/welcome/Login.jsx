import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/Login';
import UI from '../../../../app/UI';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';

@inject('ui', 'auth')
@observer
class Login extends Component {
	static propTypes = {
	};
	static defaultProps = {};

	@observable
	working = false;

	/**
	 * Last error code when we tried to log in
	 * @type {string|null}
	 */
	@observable
	error = null;

	componentWillMount() {
		this.working = false;
	}

	handleLogin = (username, password) => {
		if (!this.working) {
			this.working = true;
			const userAttributes = ['username', 'displayName', 'avatar'];
			this.props.auth.login(username, password, userAttributes)
				.then(() => {
					this.props.ui.router.goTo('/dashboard/home/games');
				})
				.catch((e) => {
					this.error = e instanceof ServerError ? e.code : ServerError.UNKNOWN_ERROR;
					this.working = false;
				});
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
				working={this.working}
				error={this.error}
				onLogin={this.handleLogin}
				onCreateAccount={this.handleCreateAccount}
			/>
		);
	}
}

// Injected props
Login.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default Login;

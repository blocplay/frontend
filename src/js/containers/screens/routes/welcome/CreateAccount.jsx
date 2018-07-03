import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Screen from '../../../../components/screens/routes/welcome/CreateAccount';
import UI from '../../../../app/UI';
import UserRepository from '../../../../app/Repositories/UserRepository';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';

@inject('ui', 'userRepository', 'auth')
@observer
class CreateAccount extends Component {
	static propTypes = {
	};
	static defaultProps = {};

	@observable
	working = false;

	/**
	 * Las error received when trying to create the account
	 * @type {ServerError|null}
	 */
	@observable
	error = null;

	componentWillMount() {
		this.working = false;
	}

	handleLogin = () => {
		this.props.ui.router.goTo('/welcome/login');
	};

	handleCreateAccount = (email, password, dateOfBirth) => {
		if (!this.working) {
			this.error = null;
			this.working = true;
			this.createAccount(email, password, dateOfBirth)
				.then(() => this.loginUser(email, password))
				.catch((e) => {
					this.error = e instanceof ServerError ? e : new ServerError(ServerError.UNKNOWN_ERROR);
					this.working = false;
				});
		}
	};

	/**
	 * @param {String} email
	 * @param {String} password
	 * @param {Moment} dateOfBirth
	 * @return {Promise<User>}
	 */
	createAccount(email, password, dateOfBirth) {
		/** @type {UserRepository} */
		const repo = this.props.userRepository;
		const dateOfBirthStr = dateOfBirth.format('YYYY-MM-DD');
		return repo.signup(email, password, dateOfBirthStr);

	}

	loginUser(email, password) {
		/** @type {Authentication} */
		const auth = this.props.auth;
		const userAttributes = ['username', 'displayName', 'avatar'];

		this.props.auth.invalidate();
		return auth.login(email, password, userAttributes)
			.then(() => {
				this.props.ui.router.goTo('/dashboard/home/games');
			});
	}

	render() {
		return (
			<Screen
				error={this.error}
				working={this.working}
				onLogin={this.handleLogin}
				onCreateAccount={this.handleCreateAccount}
			/>
		);
	}
}

// Injected props
CreateAccount.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default CreateAccount;

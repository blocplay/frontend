import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Icon from '../../../icons/Icon';
import ServerError from '../../../../app/Server/ServerError';

@observer
class Login extends Component {
	static propTypes = {
		working: PropTypes.bool,
		error: PropTypes.string,
		onLogin: PropTypes.func,
		onCreateAccount: PropTypes.func,
	};
	static defaultProps = {
		working: false,
		error: null,
		onLogin: null,
		onCreateAccount: null,
	};

	@observable
	username = '';

	@observable
	password = '';

	handleLogin = (event) => {
		event.preventDefault();
		if (this.props.onLogin) {
			this.props.onLogin(this.username, this.password);
		}
	};

	handleCreateAccount = () => {
		if (this.props.onCreateAccount) {
			this.props.onCreateAccount();
		}
	};

	renderError() {
		if (!this.props.error) {
			return null;
		}

		let message;

		if (this.props.error === ServerError.AUTH_FAILED) {
			message = 'Login failed. Check your email and password.';
		} else {
			message = 'We cannot log you in for the moment. Please try again later.';
		}

		return <div className="welcome__error">{message}</div>;
	}

	render() {
		return (
			<div className="welcome">
				<form className="welcome__form" onSubmit={this.handleLogin}>
					<input placeholder="Email address" value={this.username} onChange={e => {this.username = e.target.value; }} />
					<input placeholder="Password" type="password" value={this.password} onChange={e => {this.password = e.target.value; }} />
					{this.renderError()}
					<button
						className={`btn btn-yellow welcome__form-submit ${this.props.working ? 'welcome__form-submit--working' : ''}`}
						type="submit"
					>
						<Icon icon="loading"/>
						<span className="btn__label">
							{this.props.working ? 'Signing in...' : 'Sign In'}
						</span>
					</button>
				</form>
				<div className="welcome__switch">
					<span>New to Play?</span>
					<button className="btn-link" onClick={this.handleCreateAccount}>
						Create an account
					</button>
				</div>
			</div>
		);
	}
}

export default Login;

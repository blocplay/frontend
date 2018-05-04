import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../icons/Icon';

class Login extends Component {
	static propTypes = {
		working: PropTypes.bool,
		onLogin: PropTypes.func,
		onCreateAccount: PropTypes.func,
	};
	static defaultProps = {
		working: false,
		onLogin: null,
		onCreateAccount: null,
	};

	handleLogin = () => {
		if (this.props.onLogin) {
			this.props.onLogin();
		}
	};

	handleCreateAccount = () => {
		if (this.props.onCreateAccount) {
			this.props.onCreateAccount();
		}
	};

	render() {
		return (
			<div className="welcome">
				<div className="welcome__form">
					<input placeholder="Email address" />
					<input placeholder="Password" />
					<button
						className={`btn btn-yellow welcome__form-submit ${this.props.working ? 'welcome__form-submit--working' : ''}`}
						type="submit"
						onClick={this.handleLogin}
					>
						<Icon icon="loading"/>
						<span className="btn__label">
							{this.props.working ? 'Signing in...' : 'Sign In'}
						</span>
					</button>
				</div>
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

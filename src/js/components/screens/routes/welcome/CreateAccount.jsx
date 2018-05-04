import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../icons/Icon';

class CreateAccount extends Component {
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

	onDateFocus = () => {
		this.dateElement.type = 'date';
	};

	render() {
		return (
			<div className="welcome">
				<div className="welcome__form">
					<input placeholder="Email address" />
					<input type="password" placeholder="Password" />
					<input type="password" placeholder="Confirm Password" />
					<input
						placeholder="Date of Birth"
						ref={el => {
							this.dateInput = el;
						}}
					/>
					<div className="welcome__eula">
						<label className="welcome__eula-label" htmlFor="EULA">
							<input type="checkbox" id="EULA" />
							<span className="checkbox" />
							<span>Accept terms and conditions</span>
						</label>
					</div>
					<button
						type="submit"
						className={`btn btn-yellow welcome__form-submit ${
							this.props.working ? 'welcome__form-submit--working' : ''
						}`}
						onClick={this.handleCreateAccount}
					>
						<Icon icon="loading" />
						<span className="btn__label">{this.props.working ? 'Creating account...' : 'Create account'}</span>
					</button>
				</div>
				<div className="welcome__switch">
					<span>Already have an account?</span>
					<button className="btn-link" onClick={this.handleLogin}>
						Login
					</button>
				</div>
			</div>
		);
	}
}

export default CreateAccount;

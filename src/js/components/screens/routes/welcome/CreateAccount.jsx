import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Icon from '../../../icons/Icon';
import ServerError from '../../../../app/Server/ServerError';

// http://emailregex.com/
// eslint-disable-next-line no-useless-escape
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const dateSelectorBaseConfig = {
	maxDate: moment(),
	minDate: moment().subtract(100, 'years'),
	placeholderText: 'Date of Birth',
	showYearDropdown: true,
	showMonthDropdown: true,
	showDisabledMonthNavigation: true,
	scrollableYearDropdown: true,
	yearDropdownItemNumber: 50,
};

const ERROR_DEFAULT_MESSAGE = 'We cannot create your account for the moment. Please try again later.';

@observer
class CreateAccount extends Component {
	static propTypes = {
		working: PropTypes.bool,
		error: PropTypes.instanceOf(ServerError),
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
	email = '';

	@observable
	password = '';

	@observable
	confirmPassword = '';

	/**
	 * @type {Moment}
	 */
	@observable
	dateOfBirth = null;

	@observable
	eulaAccepted = false;

	handleLogin = () => {
		if (this.props.onLogin) {
			this.props.onLogin();
		}
	};

	handleCreateAccount = () => {
		const errors = this.validateForm();

		if (errors.length) {
			// eslint-disable-next-line no-console
			console.warn('Fields in error:', errors);
			return;
		}

		if (this.props.onCreateAccount) {
			this.props.onCreateAccount(this.email, this.password, this.dateOfBirth);
		}
	};

	handleFieldChange(field) {
		return (event) => {
			if (typeof this[field] === 'boolean') {
				this[field] = event.target.checked;
			} else {
				this[field] = event.target.value;
			}
		}
	}

	handleDateOfBirthChange = (date) => {
		this.dateOfBirth = date;
	};

	/**
	 * For now, simple form validation. Returns an array of fields in error
	 * @return {string[]}
	 */
	validateForm() {
		const errors = [];

		if (!emailRegExp.test(this.email)) {
			errors.push('email');
		}

		if (!this.password.length || this.password !== this.confirmPassword) {
			errors.push('confirmPassword');
		}

		// noinspection RedundantIfStatementJS
		if (!this.dateOfBirth) {
			errors.push('dateOfBirth');
		}

		if (!this.eulaAccepted) {
			errors.push('eulaAccepted');
		}

		return errors;
	}

	renderError() {
		/** @type {ServerError} */
		const error = this.props.error;

		if (!error) {
			return null;
		}

		const message = error.userMessage || error.message || ERROR_DEFAULT_MESSAGE;

		return <div className="welcome__error">{message}</div>;
	}

	render() {
		return (
			<div className="welcome">
				<div className="welcome__form">
					<input
						placeholder="Email address"
						onChange={this.handleFieldChange('email')}
						value={this.email}
					/>
					<input
						type="password"
						placeholder="Password"
						onChange={this.handleFieldChange('password')}
						value={this.password}
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						onChange={this.handleFieldChange('confirmPassword')}
						value={this.confirmPassword}
					/>
					<DatePicker
						{...dateSelectorBaseConfig}
						selected={this.dateOfBirth}
						onChange={this.handleDateOfBirthChange}
					/>
					<div className="welcome__eula">
						<label className="welcome__eula-label" htmlFor="EULA">
							<input
								type="checkbox"
								id="EULA"
								onChange={this.handleFieldChange('eulaAccepted')}
								checked={this.eulaAccepted}
							/>
							<span className="checkbox" />
							<span>Accept terms and conditions</span>
						</label>
					</div>
					{this.renderError()}
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

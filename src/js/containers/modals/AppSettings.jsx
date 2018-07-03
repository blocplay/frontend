import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import UI from '../../app/UI';
import Component from '../../components/modals/AppSettings';
import Authentication from '../../app/Authentication';
import Config from '../../app/Config';

@inject('ui', 'auth', 'config')
@observer
class AppSettings extends ReactComponent {
	static propTypes = {
		location: PropTypes.string.isRequired,
	};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	modalOpened = false;

	@observable
	loading = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.didMount = false;
		this.registerAsSettingsHandler();
		this.user = this.props.auth.getUser();
		this.loadUser();
	}

	componentDidMount() {
		this.didMount = true;
	}

	loadUser() {
		this.loading = true;
		const attributes = this.props.config.get('userAttributes.appSettings');
		this.user.fill(attributes)
			.then(() => {
				this.loading = false;
			});
	}

	/**
	 * Called by UI#showAppSettings. Will show or hide the 'settings' modal depending of the `show`value.
	 * @param {boolean} show
	 */
	handleShowSettings = (show) => {
		this.modalOpened = show;
	};

	handleLogOut = () => {
		this.props.auth.logout();
		this.props.ui.router.goTo('/welcome/login');
	};

	registerAsSettingsHandler() {
		this.props.ui.registerAppSettingsHandler(this.handleShowSettings);
	}

	close() {
		this.modalOpened = false;
	}

	handleClose = () => {
		this.close();
	};

	handleAddTokensClick = () => {
		this.close();
		this.props.ui.router.goTo('/dashboard/shop/index');
	};

	render() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation(this.props.location);

		if (!modalLocation) {
			return null;
		}

		return (
			<Component
				isOpen={this.modalOpened}
				parentSelector={() => modalLocation}
				onClose={this.handleClose}
				onRequestClose={this.handleClose}
				user={this.user}
				loading={this.loading}
				onAddTokensClick={this.handleAddTokensClick}
				onLogOut={this.handleLogOut}
			/>
		);
	}
}

// Injected props
AppSettings.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default AppSettings;

import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import UI from '../../app/UI';
import Component from '../../components/modals/AppSettings';
import currentUser from '../../mock/currentUser';

@inject('ui')
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

	componentWillMount() {
		this.didMount = false;
		this.registerAsSettingsHandler();
	}

	componentDidMount() {
		this.didMount = true;
	}

	/**
	 * Called by UI#showAppSettings. Will show or hide the 'settings' modal depending of the `show`value.
	 * @param {boolean} show
	 */
	handleShowSettings = (show) => {
		this.modalOpened = show;
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
				user={currentUser}
				onAddTokensClick={this.handleAddTokensClick}
			/>
		);
	}
}

// Injected props
AppSettings.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default AppSettings;

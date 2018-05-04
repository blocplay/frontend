import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import UI from '../../app/UI';
import SendTokens from '../../components/modals/SendTokens';
import currentUser from '../../mock/currentUser';

@inject('ui')
@observer
class SendTokensModalHandler extends Component {
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

	/**
	 * To which user the tokens are sent
	 * @type {MockObject}
	 */
	@observable
	toUser = null;

	/**
	 * Callback called when the amount is submitted
	 * @type {function}
	 */
	callback = null;

	componentWillMount() {
		this.didMount = false;
		this.registerAsSendTokensModalHandler();
	}

	componentDidMount() {
		this.didMount = true;
	}

	/**
	 * Called by UI#showSendTokensModal. Will show the 'send tokens' modal. The `callback` is the
	 * function to call with the amount when the amount is submitted.
	 * @param {MockObject} toUser
	 * @param {sendTokensModalCallback} callback
	 */
	handleShowSendTokensModal = (toUser, callback) => {
		this.toUser = toUser;
		this.callback = callback;
		this.modalOpened = true;
	};

	registerAsSendTokensModalHandler() {
		this.props.ui.registerSendTokensModalHandler(this.handleShowSendTokensModal);
	}

	close() {
		this.modalOpened = false;
	}

	handleSend = (amount) => {
		if (this.callback) {
			this.callback(amount);
		}
		this.close();
	};

	handleClose = () => {
		this.close();
	};

	render() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		if (!this.toUser) {
			return null;
		}

		const modalLocation = this.props.ui.getModalLocation(this.props.location);

		if (!modalLocation) {
			return null;
		}

		return (
			<SendTokens
				initialAmount={100}
				isOpen={this.modalOpened}
				parentSelector={() => modalLocation}
				type={this.toUser === currentUser ? 'add' : 'send'}
				toUser={this.toUser}
				onSend={this.handleSend}
				onRequestClose={this.handleClose}
				exchangeRate={this.toUser === currentUser ? 0.1423 : null}
			/>
		);
	}
}

// Injected props
SendTokensModalHandler.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default SendTokensModalHandler;

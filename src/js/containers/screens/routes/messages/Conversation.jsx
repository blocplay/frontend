import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../../../components/screens/routes/messages/Conversation';
import UI from '../../../../app/UI';
import ConversationRepository from '../../../../app/Repositories/ConversationRepository';
import Authentication from '../../../../app/Authentication';
import ServerError from '../../../../app/Server/ServerError';
import Config from '../../../../app/Config';
import UserEvent from '../../../../app/ConversationEvent/UserEvent';

@inject('ui', 'conversationRepository', 'auth', 'config')
@observer
class Conversation extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * @type {Conversation|null}
	 */
	@observable
	conversation = null;

	/**
	 * True while we are loading the conversation
	 * @type {boolean}
	 */
	@observable
	loading = false;

	/**
	 * List of users currently typing
	 * @type {ObservableArray<User>}
	 */
	@observable
	usersTyping = [];

	/**
	 * @type {ConversationSocket}
	 */
	socket = null;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.loadConversation(this.props.match.params.id);
		this.user = this.props.auth.getUser();
	}

	componentWillReceiveProps(newProps) {
		const newId = newProps.match.params.id;
		if (this.props.match.params.id !== newId) {
			this.loadConversation(newId);
		}
	}

	componentWillUnmount() {
		if (this.socket) {
			this.exitConversation();
			this.closeSocket();
		}
	}

	loadConversation(id) {
		this.loading = true;
		this.conversation = null;
		this.usersTyping.clear();
		if (this.socket) {
			this.exitConversation();
			this.closeSocket();
		}

		this.props.conversationRepository.load(id, ['username', 'avatar', 'displayName'])
			.then(c => {
				this.conversation = c;
				return c;
			})
			.catch(/** @type {ServerError} */ e => {
				this.loading = false;
				if (e.is(ServerError.NOT_FOUND)) {
					this.props.ui.router.goTo('/dashboard/messages/index');
				}
				return Promise.reject(e);
			})
			.then(() => {
				this.createSocket();
				this.enterConversation();
				this.loading = false;
			});
	}

	closeSocket() {
		this.clearSocketListener();
		this.socket.close();
		this.socket = null;
	}

	createSocket() {
		this.socket = this.conversation.getSocket(true);
		this.socket.open();
		this.listenToSocket();
	}

	enterConversation() {
		this.socket.sendEntered();
	}

	exitConversation() {
		this.socket.sendStopTyping();
		this.socket.sendExited();
	}

	clearSocketListener() {
		this.socket.removeListener('event', this.onSocketEvent);
		this.socket.removeListener('error', this.onSocketError);
	}

	listenToSocket() {
		this.socket.addListener('event', this.onSocketEvent);
		this.socket.addListener('error', this.onSocketError);
	}

	/**
	 * @param {SocketError} error
	 */
	onSocketError = (error) => {
		// eslint-disable-next-line no-console
		console.error('Socket error:', error);
	};

	/**
	 * @param {AbstractEvent} event
	 */
	onSocketEvent = (event) => {
		// When a user starts or stops typing, add or remove it from this.usersTyping
		if (event.type === UserEvent.TYPING_STARTED) {
			const user = event.user;
			if (this.usersTyping.indexOf(user) === -1) {
				this.usersTyping.push(user);
			}
		} else if (event.type === UserEvent.TYPING_STOPPED) {
			this.usersTyping.remove(event.user);
		}
	};

	handleCurrentUserMessage = (content) => {
		this.socket.sendTextMessage(content);
	};

	handleTypingStarted = () => {
		this.socket.sendStartTyping();
	};

	handleTypingStopped = () => {
		this.socket.sendStopTyping();
	};

	render() {
		const typingStopTimeout = this.props.config.get('conversations.typingStopTimeout', 2000);

		return (
			<Component
				loading={this.loading}
				conversation={this.conversation}
				currentUser={this.user}
				usersTyping={this.usersTyping}
				onMessage={this.handleCurrentUserMessage}
				onTypingStarted={this.handleTypingStarted}
				onTypingStopped={this.handleTypingStopped}
				typingStopTimeout={typingStopTimeout}
			/>
		);
	}
}

// Injected props
Conversation.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Conversation;

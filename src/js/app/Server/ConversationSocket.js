/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import EventEmitter from 'wolfy87-eventemitter';
import ConversationMessage from '../ConversationMessage';
import MessageEvent from '../ConversationEvent/MessageEvent';
import Conversation from '../Conversation';
import AbstractSocketConnector from './SocketConnector/AbstractSocketConnector';
import UserEvent from '../ConversationEvent/UserEvent';

/**
 * When an event is received, this instance emits an 'event' event with the AbstractEvent instance
 */
class ConversationSocket extends EventEmitter {
	/**
	 * @protected
	 * @type {AbstractSocketConnector}
	 */
	connector;

	/**
	 * @type {Conversation}
	 */
	conversation;

	/**
	 * @param {Conversation} conversation
	 * @param {AbstractSocketConnector} connector
	 */
	constructor(conversation, connector) {
		super();
		this.conversation = conversation;
		this.connector = connector;
		this.addConnectorListeners(connector);
	}

	/**
	 * Opens the socket.
	 */
	open() {
		this.connector.open();
	}

	/**
	 * Closes the socket
	 */
	close() {
		this.connector.close();
	}

	/**
	 * @param {AbstractSocketConnector} connector
	 */
	addConnectorListeners(connector) {
		connector.addListener(AbstractSocketConnector.EVENT_DATA, this.onData.bind(this));
		connector.addListener(AbstractSocketConnector.EVENT_ERROR, this.onError.bind(this));
	}

	/**
	 * When the connector receives data, we first ignore events that were sent by this client. For
	 * other events, we deserialize the event and apply it to the conversation.
	 *
	 * @param {object} data
	 */
	onData(data) {
		if (this.isEventSentByMe(data)) {
			return;
		}

		const event = Conversation.createEvent(data);
		this.conversation.applyEvent(event);
		this.emit('event', event);
	}

	/**
	 * When an error occurs on the connector, we emit it as an 'error' event
	 * @param {SocketError|*} error
	 */
	onError(error) {
		this.emit('error', error);
	}

	/**
	 * Returns true if the event data we received was sent by this client.
	 * @param {object} data
	 */
	isEventSentByMe(data) {
		const user = IoC.make('auth').getUser();

		if (UserEvent.is(data)) {
			return data.userId === user.id;
		}

		if (MessageEvent.is(data)) {
			return data.message.userId === user.id;
		}

		return false;
	}

	/**
	 * Sends a text message on the socket
	 * @param {string} content
	 */
	sendTextMessage(content) {
		const user = IoC.make('auth').getUser();
		const message = ConversationMessage.create(ConversationMessage.TYPE_TEXT, content, user);
		const event = MessageEvent.create(MessageEvent.TYPE_SEND, message);

		// Add the event to the conversation
		this.conversation.applyEvent(event);

		// Send the serialized event to the socket
		this.connector.send(event.serialize());
	}

	/**
	 * Sends a 'user:entered' event on the socket with the current user as the user that entered.
	 */
	sendEntered() {
		const user = IoC.make('auth').getUser();
		const event = UserEvent.create(UserEvent.TYPE_ENTERED, user);

		// Send the serialized event to the socket
		this.connector.send(event.serialize());
	}

	/**
	 * Sends a 'user:exited' event on the socket with the current user as the user that exited.
	 */
	sendExited() {
		const user = IoC.make('auth').getUser();
		const event = UserEvent.create(UserEvent.TYPE_EXITED, user);

		// Send the serialized event to the socket
		this.connector.send(event.serialize());
	}

	/**
	 * Sends a 'typing started' event on the socket
	 */
	sendStartTyping() {
		this.sendTyping(true);
	}

	/**
	 * Sends a 'typing stopped' event on the socket
	 */
	sendStopTyping() {
		this.sendTyping(false);
	}

	/**
	 * Sends the actual typing event on the socket connector.
	 * @protected
	 * @param {boolean} isTyping
	 */
	sendTyping(isTyping) {
		const user = IoC.make('auth').getUser();
		const eventCode = isTyping ? UserEvent.TYPING_STARTED : UserEvent.TYPING_STOPPED;
		const event = UserEvent.create(eventCode, user);

		// Add the event to the conversation
		this.conversation.applyEvent(event);

		// Send the serialized event to the socket
		this.connector.send(event.serialize());
	}
}

export default ConversationSocket;

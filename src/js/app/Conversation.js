/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import { observable } from 'mobx';
import moment from 'moment/moment';
import MessageEvent from './ConversationEvent/MessageEvent';
import UserEvent from './ConversationEvent/UserEvent';
import UpdateEvent from './ConversationEvent/UpdateEvent';
import ConversationSocket from './Server/ConversationSocket';

/**
 * @property {string} id
 * @property {string} title
 * @property {number} creationDate
 * @property {User[]} users
 * @property {boolean} isFavorite
 * @property {string} latestMessage
 */
class Conversation{
	/**
	 * Latest events of this conversation
	 * @type {ObservableArray<AbstractEvent>}
	 */
	@observable
	latestEvents = [];

	/**
	 * Stores the conversation socket. The same is always return every time we call `getSocket()`
	 * unless `forceNew` is true.
	 * @protected
	 * @type {ConversationSocket|null}
	 */
	socket = null;

	/**
	 * Update the attributes of this Conversation with the supplied data object. Also updates the
	 * users object it contains (note that the user list will be completely replaced, not updated).
	 * @param {object} data
	 */
	update(data) {
		const updateData = omit(data, ['users', 'latestEvents']);
		merge(this, updateData);

		if (data.users) {
			/** @type {UserRepository} */
			const repo = IoC.make('userRepository');
			this.users = repo.update(data.users);
		}

		if (data.latestEvents) {
			this.replaceEvents(data.latestEvents);
		}
	}

	/**
	 * Replaces the `latestEvents` array with the ones in the `eventsData`.
	 * @param {object[]} eventsData
	 */
	replaceEvents(eventsData) {
		this.latestEvents.clear();
		eventsData.forEach(e => {
			const event = Conversation.createEvent(e);
			this.applyEvent(event);
		});
	}

	/**
	 * Applies a new event to this conversation. Based on the event, different things will happen:
	 * - It can be added to the list of `latestEvents`
	 * - It can modify data
	 * - It can simply be ignored
	 *
	 * @param {AbstractEvent} event
	 */
	applyEvent(event) {
		switch (event.type) {
			case 'message:sent':
			case 'user:joined':
			case 'user:left':
			case 'user:entered':
			case 'user:exited':
				this.latestEvents.push(event);
				break;
			default:
				// We ignore it
		}
	}

	/**
	 * Fills all users of this conversations with the specified `attributes`. Returns a Promise that
	 * resolves with the users once they are all filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<User[]>}
	 */
	fillUsers(attributes) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.fill(this.users, attributes);
	}

	/**
	 * Creates and returns an event instance filled with the data. Can return a UserEvent, a
	 * MessageEvent or an UpdateEvent.
	 *
	 * @param {object} eventData
	 * @return {AbstractEvent|UserEvent|MessageEvent|UpdateEvent}
	 */
	static createEvent(eventData) {
		let event;

		if (eventData.type.indexOf('message:') === 0) {
			event = MessageEvent.deserialize(eventData);
		} else if (eventData.type.indexOf('user:') === 0) {
			event = UserEvent.deserialize(eventData);
		} else {
			event = UpdateEvent.deserialize(eventData);
		}

		event.date = moment(eventData.date);

		return event;
	}

	/**
	 * @return {ObservableArray<AbstractEvent>}
	 */
	getLatestEvents() {
		return this.latestEvents;
	}

	/**
	 * Returns a ConversationSocket for this connection. If `forceNew` is true, returns a new socket
	 * connection.
	 *
	 * @param {boolean} forceNew
	 * @return {ConversationSocket}
	 */
	getSocket(forceNew = false) {
		if (this.socket === null || forceNew) {
			const connector = IoC.make('conversationSocketConnector', { conversation: this });
			this.socket = new ConversationSocket(this, connector);
		}
		return this.socket;
	}
}

export default Conversation;

import moment from 'moment';
import AbstractEvent from './AbstractEvent';
import ConversationMessage from '../ConversationMessage';

/**
 * @property {ConversationMessage} message
 */
class MessageEvent extends AbstractEvent {
	static TYPE_SEND = 'message:sent';

	/**
	 * @param {string} type
	 * @param {ConversationMessage} message
	 * @return {MessageEvent}
	 */
	static create(type, message) {
		return new MessageEvent({
			ref: this.generateRef(),
			date: moment(),
			message,
			type,
		});
	}

	/**
	 * Returns true if the data is a serialized MessageEvent
	 * @param {object} data
	 * @return {boolean}
	 */
	static is(data) {
		return data.type.indexOf('message:') === 0;
	}

	/**
	 * Serializes this instance to an object that can be JSON encoded
	 * @return {object}
	 */
	serialize() {
		const serialized = AbstractEvent.prototype.serialize.call(this);
		serialized.message = this.message.serialize();
		return serialized;
	}

	/**
	 * From a serialized object returns an instance
	 * @param {object} eventData
	 * @return {MessageEvent}
	 */
	static deserialize(eventData) {
		const event = new MessageEvent(eventData);
		event.date = moment(eventData.date * 1000);
		event.message = ConversationMessage.deserialize(eventData.message);
		return event;
	}
}

export default MessageEvent;

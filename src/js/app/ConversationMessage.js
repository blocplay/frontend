import merge from 'lodash/merge';
import moment from 'moment';
import IoC from '@aedart/js-ioc/index';
import { generateRef } from './utils';

/**
 * @property {string} id
 * @property {string} ref
 * @property {Moment} creationDate
 * @property {User} user Author of the message
 * @property {'text'|'media'} type
 * @property {string} content
 */
class ConversationMessage {
	static TYPE_TEXT = 'text';

	/**
	 * @param {object} data Initial data
	 */
	constructor(data = {}) {
		merge(this, data)
	}

	/**
	 * @param {string} type
	 * @param {string} content
	 * @param {User} author
	 * @return {ConversationMessage}
	 */
	static create(type, content, author) {
		return new ConversationMessage({
			ref: generateRef(),
			creationDate: moment(),
			user: author,
			type,
			content,
		});
	}

	/**
	 * Returns a serialized object of this instance that can be JSON encoded
	 */
	serialize() {
		return {
			id: this.id,
			ref: this.ref,
			creationDate: this.creationDate.unix(),
			userId: this.user.id,
			type: this.type,
			content: this.content,
		};
	}

	/**
	 * From a serialized object creates an instance
	 * @param {object} data
	 * @return {ConversationMessage}
	 */
	static deserialize(data) {
		/** @type {UserRepository} */
		const userRepository = IoC.make('userRepository');
		const author = userRepository.retrieve(data.userId);
		return new ConversationMessage({
			...data,
			user: author,
			creationDate: moment(data.creationDate * 1000),
		});
	}
}

export default ConversationMessage;

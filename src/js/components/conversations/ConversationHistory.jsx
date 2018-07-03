import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import Message from './Message';
import AbstractEvent from '../../app/ConversationEvent/AbstractEvent';
import MessageEvent from '../../app/ConversationEvent/MessageEvent';
import User from '../../app/User';
import UserEventModel from '../../app/ConversationEvent/UserEvent';
import UserEvent from '../../containers/conversations/UserEvent';

@observer
class ConversationHistory extends Component {
	static propTypes = {
		events: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(AbstractEvent)).isRequired,
		currentUser: PropTypes.instanceOf(User).isRequired,
	};

	static defaultProps = {};

	renderEmpty() {
		if (this.props.events.length > 0) {
			return null;
		}

		return (
			<div className="conversation__prompt">Start your conversation.</div>
		);
	}

	renderEntries() {
		const entries = [];
		this.props.events.forEach((/** @type {AbstractEvent} */ event) => {
			const key = event.id || event.ref;

			// Message
			if (event instanceof MessageEvent) {
				entries.push((
					<div className="conversationHistory__entry" key={key}>
						<Message message={event.message} isCurrentUser={event.message.user === this.props.currentUser} />
					</div>
				));
			}

			// User event
			if (event instanceof UserEventModel) {
				entries.push((
					<div className="conversationHistory__entry" key={key}>
						<UserEvent event={event} />
					</div>
				));
			}
		});

		return entries;
	}

	render() {
		return (
			<div className="conversationHistory">
				{ this.renderEmpty() }
				{ this.renderEntries() }
			</div>
		);
	}
}

export default ConversationHistory;

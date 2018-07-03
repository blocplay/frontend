import React from 'react';
import PropTypes from 'prop-types';
import UserEventModel from '../../app/ConversationEvent/UserEvent';

const propTypes = {
	event: PropTypes.instanceOf(UserEventModel).isRequired,
	loadingUser: PropTypes.bool,
};

const defaultProps = {
	loadingUser: false,
};

function UserEvent({ loadingUser, event }) {
	const hasUser = !loadingUser;
	let message = '';

	switch (event.type) {
		case 'user:joined':
			message = `${hasUser ? `${event.user.displayName}` : 'A user'} joined the conversation`;
			break;
		case 'user:left':
			message = `${hasUser ? `${event.user.displayName}` : 'A user'} left the conversation`;
			break;
		case 'user:entered':
			message = `${event.user.displayName} entered the room`;
			break;
		case 'user:exited':
			message = `${event.user.displayName} left the room`;
			break;
		default:
			// Do nothing
	}

	return <div className="conversationEvent">{message}</div>;
}

UserEvent.propTypes = propTypes;
UserEvent.defaultProps = defaultProps;

export default UserEvent;

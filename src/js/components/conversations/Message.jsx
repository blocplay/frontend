import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../user/Avatar';
import ConversationMessage from '../../app/ConversationMessage';

const propTypes = {
	message: PropTypes.instanceOf(ConversationMessage).isRequired,
	isCurrentUser: PropTypes.bool,
};

const defaultProps = {
	isCurrentUser: false,
};

function Message(props) {
	const className = `conversationMessage conversationMessage--${props.isCurrentUser ? 'mine' : 'their'}`;

	return (
		<div className={className}>
			<div className="conversationMessage__avatar">
				<Avatar user={props.message.user} />
			</div>
			<div className="conversationMessage__content">
				<pre className="conversationMessage__text">
					{ props.message.content }
				</pre>
				<div className="conversationMessage__datetime">
					{ props.message.creationDate.format('LL - LT') }
				</div>
			</div>

		</div>
	);
}

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;

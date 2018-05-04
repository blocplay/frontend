import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';
import Avatar from '../user/Avatar';

const propTypes = {
	entry: PropTypes.instanceOf(MockObject).isRequired,
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
				<Avatar user={props.entry.user} />
			</div>
			<div className="conversationMessage__content">
				<div className="conversationMessage__text">
					{ props.entry.data.content }
				</div>
				<div className="conversationMessage__datetime">
					{ props.entry.datetime.format('LL - LT') }
				</div>
			</div>

		</div>
	);
}

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../../../mock/MockObject';
import ConversationHistory from '../../../conversations/ConversationHistory';
import MessageInput from '../../../conversations/MessageInput';
import ScrollableView from '../../../ScrollableView';

class Conversation extends Component {
	static propTypes = {
		conversation: PropTypes.instanceOf(MockObject).isRequired,
		currentUser: PropTypes.instanceOf(MockObject).isRequired,
		onMessage: PropTypes.func,
	};

	static defaultProps = {
		onMessage: null,
	};

	getRecipientsUsernames() {
		return this.props.conversation.users.map(user => user.username);
	}

	render() {
		return (
			<div className="conversation">
				<div className="conversation__recipients">
					<div className="conversation__recipients-box">To: {this.getRecipientsUsernames().join(', ')}</div>
				</div>
				<ScrollableView className="conversationHistory__wrapper">
					<ConversationHistory
						key={this.props.conversation.id}
						history={this.props.conversation.history}
						currentUser={this.props.currentUser}
					/>
				</ScrollableView>
				<div>
					<MessageInput onMessage={this.props.onMessage} />
				</div>
			</div>
		);
	}
}

export default Conversation;

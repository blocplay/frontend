import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Component from '../../../components/stream/modals/Comments';
import MockObject from '../../../mock/MockObject';
import currentUser from '../../../mock/currentUser';

class Comments extends ReactComponent {
	static propTypes = {
		stream: PropTypes.instanceOf(MockObject).isRequired,
		onClose: PropTypes.func,
	};
	static defaultProps = {
		onClose: null,
	};

	getConversation() {
		return this.props.stream.conversation;
	}

	handleOnCurrentUserMessage = (content) => {
		const datetime = moment();
		const conversation = this.getConversation();

		const message = new MockObject({
			id: `${conversation.id}_${datetime.valueOf()}`,
			datetime,
			user: currentUser,
			type: 'message',
			data: new MockObject({
				content,
			}),
		});

		conversation.history.entries.push(message);
	};

	render() {
		return (
			<Component
				stream={this.props.stream}
				onClose={this.props.onClose}
				currentUser={currentUser}
				onMessage={this.handleOnCurrentUserMessage}
			/>
		);
	}
}

export default Comments;

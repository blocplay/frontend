import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Component from '../../../../components/screens/routes/messages/Conversation';
import { getConversationById, pushMessage } from '../../../../mock/sampleConversations';
import currentUser from '../../../../mock/currentUser';
import UI from '../../../../app/UI';

@inject('ui')
class Conversation extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	conversation = null;

	componentWillMount() {
		this.retrieveConversationId();
	}

	componentWillReceiveProps(newProps) {
		this.retrieveConversationId(newProps);
	}

	/**
	 * Method that sets this.conversation to the conversation in the URL. If the URL contains an invalid conversation id, we redirect to the index of "Messages"
	 * @param {object} props
	 */
	retrieveConversationId(props = this.props) {
		const conversation = getConversationById(props.match.params.id);

		if (!conversation) {
			this.conversation = null;
			this.props.ui.router.goTo('/dashboard/messages/index');
		}

		this.conversation = conversation;
	}

	handleCurrentUserMessage = (content) => {
		pushMessage(content, this.conversation.history);
	};

	render() {
		// Support if we have an invalid conversation id
		if (!this.conversation) {
			return null;
		}

		return (
			<Component
				conversation={this.conversation}
				currentUser={currentUser}
				onMessage={this.handleCurrentUserMessage}
			/>
		);
	}
}

// Injected props
Conversation.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Conversation;

import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Component from '../../components/conversations/ConversationList';
import sampleConversations, { getConversationById } from '../../mock/sampleConversations';
import UI from '../../app/UI';

@inject('ui')
class ConversationList extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	getConversation() {
		const { id } = this.props.match.params;
		return getConversationById(id);
	}

	getLatestConversations() {
		return sampleConversations;
	}

	handleConversationClick = (conversation) => {
		this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
	};

	render() {
		return (
			<Component
				conversations={this.getLatestConversations()}
				onConversationClick={this.handleConversationClick}
				currentConversation={this.getConversation()}
			/>
		);
	}
}

// Injected props
ConversationList.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default ConversationList;

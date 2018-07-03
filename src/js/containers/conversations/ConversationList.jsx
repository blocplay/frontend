import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../components/conversations/ConversationList';
import UI from '../../app/UI';
import ConversationRepository from '../../app/Repositories/ConversationRepository';
import Config from '../../app/Config';

@inject('ui', 'conversationRepository', 'config')
@observer
class ConversationList extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * True if we are currently loading the list of categories
	 * @type {boolean}
	 */
	@observable
	loading = false;

	componentWillMount() {
		this.loadConversations();
	}

	loadConversations() {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		this.loading = true;
		const attributes = this.props.config.get('userAttributes.conversations.list');
		// For now, we force a reload (until we have the async update)
		repo.loadAll(attributes, true)
			.then(() => { this.loading = false });
	}

	getConversation() {
		const id = this.props.match.params.id;
		
		if (typeof id === 'string') {
			return this.props.conversationRepository.retrieve(id);
		}

		return null;
	}

	handleConversationClick = (conversation) => {
		this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
	};

	render() {
		return (
			<Component
				loading={this.loading}
				conversations={this.props.conversationRepository.getConversations()}
				onConversationClick={this.handleConversationClick}
				currentConversation={this.getConversation()}
			/>
		);
	}
}

// Injected props
ConversationList.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default ConversationList;

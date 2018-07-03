import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import ConversationModel from '../../app/Conversation';
import Component from '../../components/conversations/ConversationPreview';
import UI from '../../app/UI';
import ConversationRepository from '../../app/Repositories/ConversationRepository';

@inject('ui', 'conversationRepository')
class ConversationPreview extends ReactComponent {
	static propTypes = {
		conversation: PropTypes.instanceOf(ConversationModel).isRequired,
		active: PropTypes.bool,
		onClick: PropTypes.func,
	};
	static defaultProps = {
		active: false,
		onClick: null,
	};

	handleFavourite = () => {
		// noinspection UnnecessaryLocalVariableJS
		const newFavouriteState = !this.props.conversation.isFavourite;
		this.props.conversation.isFavourite = newFavouriteState;
	};

	handleDelete = () => {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		repo.delete(this.props.conversation);
	};

	handleToken = () => {
		const user = this.props.conversation.users[0];
		this.props.ui.showSendTokensModal(user);
	};

	render() {
		return (
			<Component
				conversation={this.props.conversation}
				onClick={this.props.onClick}
				active={this.props.active}
				onFavouriteClick={this.handleFavourite}
				onDelete={this.handleDelete}
				onTokenClick={this.handleToken}
			/>
		);
	}
}

// Injected props
ConversationPreview.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
};

export default ConversationPreview;

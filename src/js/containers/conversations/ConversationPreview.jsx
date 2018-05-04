import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import ConversationInstance from '../../mock/MockObject';
import Component from '../../components/conversations/ConversationPreview';
import sampleConversations from '../../mock/sampleConversations';
import UI from '../../app/UI';

@inject('ui')
class ConversationPreview extends ReactComponent {
	static propTypes = {
		conversation: PropTypes.instanceOf(ConversationInstance).isRequired,
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
		sampleConversations.remove(this.props.conversation);
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
};

export default ConversationPreview;

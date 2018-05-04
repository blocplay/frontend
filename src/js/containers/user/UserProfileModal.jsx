import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import UI from '../../app/UI';
import Component from '../../components/screens/routes/home/UserProfile';
import { getConversationWithOrCreate } from '../../mock/sampleConversations';
import MockObject from '../../mock/MockObject';

@inject('ui')
class UserProfileModal extends ReactComponent {
	static propTypes = {
		user: PropTypes.instanceOf(MockObject).isRequired,
		onBack: PropTypes.func,
	};
	static defaultProps = {
		onBack: null,
	};

	handleWatchStreamClick = () => {
		this.props.ui.router.goTo(`/dashboard/live/index/${this.props.user.stream.id}`);
	};

	handleSendMessageClick = () => {
		const conversation = getConversationWithOrCreate(this.props.user, false);
		this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
	};

	render() {
		return (
			<Component
				user={this.props.user}
				onBack={this.props.onBack}
				onSendMessageClick={this.handleSendMessageClick}
				onWatchStreamClick={this.handleWatchStreamClick}
			/>
		);
	}
}

// Injected props
UserProfileModal.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default UserProfileModal;

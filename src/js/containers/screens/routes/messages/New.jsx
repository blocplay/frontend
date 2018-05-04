import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Component from '../../../../components/screens/routes/messages/New';
import currentUser from '../../../../mock/currentUser';
import { getConversationWithOrCreate } from '../../../../mock/sampleConversations';
import UI from '../../../../app/UI';

@inject('ui')
class New extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	handleUserClick = (user) => {
		const conversation = getConversationWithOrCreate(user, false);
		this.props.ui.router.goTo(`/dashboard/messages/conversation/${conversation.id}`);
	};

	render() {
		return (
			<Component users={currentUser.friends} onUserClick={this.handleUserClick} />
		);
	}
}

// Injected props
New.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default New;

import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Component from '../../../components/screens/groups/Messages';
import UI from '../../../app/UI';
import ConversationList from '../../conversations/ConversationList';

@inject('ui')
class Messages extends ReactComponent {
	static propTypes = {
		children: PropTypes.element.isRequired,
		match: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	generateConversationList() {
		return (
			<Switch>
				<Route path="/dashboard/messages/conversation/:id" component={ConversationList} />
				<Route component={ConversationList} />
			</Switch>
		)
	}

	render() {
		return (
			<Component conversationList={this.generateConversationList()}>
				{ this.props.children }
			</Component>
		);
	}
}

// Injected props
Messages.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Messages;

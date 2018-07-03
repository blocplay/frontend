import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react/index';
import PropTypes from 'prop-types';
import AppBarComponent from '../../../../components/AppBar';
import Actions from '../../../../components/appBar/Actions';
import Back from '../../../../components/appBar/Back';
import UI from '../../../../app/UI';
import ConversationRepository from '../../../../app/Repositories/ConversationRepository';

@inject('ui', 'conversationRepository')
class AppBar extends Component {
	static propTypes = {
		onSearchClick: PropTypes.func,
	};
	static defaultProps = {
		onSearchClick: null,
	};

	// eslint-disable-next-line react/sort-comp
	handleBack = () => {
		this.props.ui.router.goTo('/dashboard/messages/index');
	};

	handleNewMessageClick = () => {
		this.props.ui.router.goTo('/dashboard/messages/new');
	};

	actions = (
		<Actions actions={[
			{ id: 'search', icon: 'search', callback: this.props.onSearchClick },
			{ id: 'new', icon: 'edit', callback: this.handleNewMessageClick },
		]} />
	);

	// Must be defined after handleBack since it uses it
	back = <Back onClick={this.handleBack} />;

	renderForConversation = ({ match }) => {
		/** @type {ConversationRepository} */
		const repo = this.props.conversationRepository;
		const conversation = repo.retrieve(match.params.id);

		if (!conversation) {
			return null;
		}

		const title = conversation.title || conversation.users.map(u => u.username).join(', ');
		return <AppBarComponent pre={this.back} title={title} post={this.actions} />;
	};

	renderForNew = () => {
		const title = 'New Message';
		return <AppBarComponent pre={this.back} title={title} post={this.actions} />;
	};

	renderDefault = () => {
		const title = 'Messages';
		return <AppBarComponent title={title} post={this.actions} />;
	};

	render() {
		return (
			<Switch>
				<Route path='/dashboard/messages/conversation/:id' render={this.renderForConversation} />
				<Route path='/dashboard/messages/new' render={this.renderForNew} />
				<Route render={this.renderDefault} />
			</Switch>
		);
	}
}

// Injected props
AppBar.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	conversationRepository: PropTypes.instanceOf(ConversationRepository).isRequired,
};

export default AppBar;

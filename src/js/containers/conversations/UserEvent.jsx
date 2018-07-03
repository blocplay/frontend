import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import UserEventModel from '../../app/ConversationEvent/UserEvent';
import UserEventComponent from '../../components/conversations/UserEvent';
import UserRepository from '../../app/Repositories/UserRepository';

@inject('userRepository')
@observer
class UserEvent extends Component {
	static propTypes = {
		event: PropTypes.instanceOf(UserEventModel).isRequired,
	};
	static defaultProps = {};

	@observable
	loadingUser = false;

	componentWillMount() {
		this.loadUser();
	}

	componentWillReceiveProps(newProps) {
		if (this.props.event !== newProps.event) {
			this.loadUser(newProps.event);
		}
	}

	/**
	 * @param {UserEvent} event
	 */
	loadUser(event = this.props.event) {
		if (!event.user) {
			/** @type {UserRepository} */
			const repo = this.props.userRepository;
			this.loadingUser = true;
			repo.load(event.userId, ['username', 'displayName'])
				.then(user => {
					event.user = user;
					this.loadingUser = false;
				});
		} else {
			this.loadingUser = false;
		}
	}

	render() {
		return <UserEventComponent loadingUser={this.loadingUser} event={this.props.event} />;
	}
}

// Injected props
UserEvent.wrappedComponent.propTypes = {
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
};

export default UserEvent;

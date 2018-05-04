import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import MockObject from '../../../../mock/MockObject';
import Tabs from '../../../navigation/Tabs';
import UserListItem from '../../../user/UserListItem';
import ScrollableView from '../../../ScrollableView';
import Icon from '../../../icons/Icon';
import FlashMessage from '../../../FlashMessage';

@observer
class Friends extends Component {
	static propTypes = {
		friends: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		flashMessage: PropTypes.string,
		onFlashMessageClick: PropTypes.func,
		onFriendClick: PropTypes.func,
	};

	static defaultProps = {
		friends: [],
		flashMessage: null,
		onFlashMessageClick: null,
		onFriendClick: null,
	};

	/**
	 * @type {'byStatus'|'byName'}
	 */
	@observable
	sort = 'byStatus';

	getOnlineFriends() {
		return this.props.friends.filter(user => user.online);
	}

	getOfflineFriends() {
		return this.props.friends.filter(user => !user.online);
	}

	getSortedUsers() {
		const sorted = [...this.props.friends];
		return sorted.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
	}

	handleTabClick = (id) => () => {
		if (id === 'status') {
			this.sort = 'byStatus';
		} else {
			this.sort = 'byName';
		}
	};

	handleFriendClick(user) {
		return () => {
			if (this.props.onFriendClick) {
				this.props.onFriendClick(user);
			}
		}
	}

	getTabs() {
		return [
			{
				id: 'status',
				label: 'Status',
				isActive: this.sort === 'byStatus',
				onClick: this.handleTabClick('status'),
			},
			{
				id: 'name',
				label: 'Name',
				isActive: this.sort === 'byName',
				onClick: this.handleTabClick('name'),
			},
		];
	}

	renderFriend(user) {
		const status = user.online ? (user.status || 'Online') : 'Offline';
		const post = user.online ? <div className="friendsList__status friendsList__status--online">●</div> : <div className="friendsList__status friendsList__status--offline">○</div>;

		return (
			<UserListItem
				key={user.id}
				className="homeFriends"
				user={user}
				status={status}
				post={post}
				onClick={this.handleFriendClick(user)}
			/>
		);
	}

	renderFriendsByStatus() {
		const onlineUsers = this.getOnlineFriends().map(u => this.renderFriend(u));
		const offlineUsers = this.getOfflineFriends().map(u => this.renderFriend(u));

		return (
			<ScrollableView key="byStatus">
				<div className="friendsList__list">
					<div className="streamList__title friendsList__title">
						<Icon icon="gamepad"/>
						<h2>Online</h2>
					</div>
					{onlineUsers}
				</div>
				<div className="friendsList__list">
					<div className="streamList__title friendsList__title offline">
						<Icon icon="bed"/>
						<h2>Offline</h2>
					</div>
					{offlineUsers}
				</div>
			</ScrollableView>
		);
	}

	renderFriendsByName() {
		const users = this.getSortedUsers().map(u => this.renderFriend(u));

		return (
			<Fragment key="byName">
				<div className="friendsList__search">
					<input type="search" placeholder="Search friends..." />
				</div>
				<ScrollableView>
					<div className="friendsList__list">
						{users}
					</div>
				</ScrollableView>
			</Fragment>
		);
	}

	renderFlashMessage() {
		if (!this.props.flashMessage) {
			return null;
		}

		return (
			<div className="friendsList__flash">
				<FlashMessage message={this.props.flashMessage} onClick={this.props.onFlashMessageClick} />
			</div>
		);
	}

	render() {
		return (
			<div className="flex-container">
				{this.renderFlashMessage()}
				<Tabs tabs={this.getTabs()}/>
				{this.sort === 'byStatus' ? this.renderFriendsByStatus() : this.renderFriendsByName()}
			</div>
		);
	}
}

export default Friends;

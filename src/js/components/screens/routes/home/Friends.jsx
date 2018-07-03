import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import get from 'lodash/get';
import Tabs from '../../../navigation/Tabs';
import UserListItem from '../../../user/UserListItem';
import ScrollableView from '../../../ScrollableView';
import Icon from '../../../icons/Icon';
import FlashMessage from '../../../FlashMessage';
import User from '../../../../app/User';
import Loading from '../../../Loading';

@observer
class Friends extends Component {
	static propTypes = {
		friends: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(User)),
		flashMessage: PropTypes.string,
		loadingFriends: PropTypes.bool,
		onFlashMessageClick: PropTypes.func,
		onFriendClick: PropTypes.func,
		onSearchClick: PropTypes.func,
	};

	static defaultProps = {
		friends: [],
		flashMessage: null,
		loadingFriends: false,
		onFlashMessageClick: null,
		onFriendClick: null,
		onSearchClick: null,
	};

	/**
	 * @type {'byStatus'|'byName'}
	 */
	@observable
	sort = 'byStatus';

	getOnlineFriends() {
		return this.props.friends.filter(user => user.isOnline());
	}

	getOfflineFriends() {
		return this.props.friends.filter(user => !user.isOnline());
	}

	getSortedUsers() {
		const sorted = [...this.props.friends];
		return sorted.sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()));
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
		const status = user.isOnline() ? get(user, 'status.displayText', 'Online') : 'Offline';
		const post = user.isOnline() ? <div className="friendsList__status friendsList__status--online">●</div> : <div className="friendsList__status friendsList__status--offline">○</div>;

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

		let onlineContent = null;
		let offlineContent = null;

		if (onlineUsers.length) {
			onlineContent = (
				<div className="friendsList__list">
					<div className="streamList__title friendsList__title">
						<Icon icon="gamepad"/>
						<h2>Online</h2>
					</div>
					{onlineUsers}
				</div>
			);
		}

		if (offlineUsers.length) {
			offlineContent = (
				<div className="friendsList__list">
					<div className="streamList__title friendsList__title offline">
						<Icon icon="bed"/>
						<h2>Offline</h2>
					</div>
					{offlineUsers}
				</div>
			);
		}

		if (!onlineContent && !offlineContent) {
			return <div className="friendsList__none">You haven&#39;t added any friends yet.</div>
		}

		return (
			<ScrollableView key="byStatus">
				{onlineContent}
				{offlineContent}
			</ScrollableView>
		);
	}

	renderFriendsByName() {
		const users = this.getSortedUsers().map(u => this.renderFriend(u));

		if (!users.length) {
			return <div className="friendsList__none">You haven&#39;t added any friends yet.</div>
		}

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

	renderHeader() {
		let flashMessage = null;

		if (this.props.flashMessage) {
			flashMessage = <FlashMessage
				message={this.props.flashMessage}
				onClick={this.props.onFlashMessageClick}
			/>;
		}

		return (
			<div className="friendsList__header">
				<div>
					<button
						className="btn btn-yellow btn-sm"
						onClick={this.props.onSearchClick}
					>
						Add new friends
					</button>
				</div>
				<div>
					{flashMessage}
				</div>
			</div>
		);
	}

	renderLoadingFriends() {
		return (
			<div className="friendsList__loading">
				<Loading />
			</div>
		);
	}

	render() {
		let content;

		if (this.props.loadingFriends) {
			content = this.renderLoadingFriends();
		} else {
			content = this.sort === 'byStatus' ? this.renderFriendsByStatus() : this.renderFriendsByName();
		}

		return (
			<div className="flex-container">
				{this.renderHeader()}
				<Tabs tabs={this.getTabs()}/>
				{content}
			</div>
		);
	}
}

export default Friends;

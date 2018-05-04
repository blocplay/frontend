import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import MockObject from '../../../../mock/MockObject';
import AppBar from '../../../AppBar';
import Back from '../../../appBar/Back';
import Sidebar from '../../../Sidebar';
import ProfilePreview from '../../../user/ProfilePreview';
import Icon from '../../../icons/Icon';
import Avatar from '../../../appBar/Avatar';
import LargeAvatar from '../../../user/Avatar';
import ScrollableView from '../../../ScrollableView';

@observer
class UserProfile extends Component {
	static propTypes = {
		user: PropTypes.instanceOf(MockObject).isRequired,
		onBack: PropTypes.func,
		onSendMessageClick: PropTypes.func,
		onWatchStreamClick: PropTypes.func,
	};
	static defaultProps = {
		onBack: null,
		onSendMessageClick: null,
		onWatchStreamClick: null,
	};

	@observable
	/**
	 * @type {'message'|'activity'|'friends'}
	 */
	view = '';

	componentWillMount() {
		this.view = 'activity';
	}

	handleSendMessageClick = () => {
		if (this.props.onSendMessageClick) {
			this.props.onSendMessageClick();
		}
	};

	handleTabClick(id) {
		if (id === 'message') {
			return this.handleSendMessageClick;
		}
		return () => {
			this.view = id;
		};
	}

	getSectionTabs() {
		return Object.entries({
			message: { title: 'Send message', icon: 'exclamation-circle' },
			activity: { title: 'See Activity', icon: 'info-circle' },
			friends: { title: 'See Friends', icon: 'users' },
		}).map(([id, data]) => ({
			id,
			title: data.title,
			icon: data.icon,
			isActive: this.view === id,
			callback: this.handleTabClick(id),
		}));
	}

	renderActivity() {
		const { user } = this.props;

		return (
			<ScrollableView>
				<div className="activities">
					<div className="activities__list">
						<div className="streamList__title">
							<Icon icon="info-circle" />
							<h2>Latest Activity</h2>
						</div>
						<div className="activities__card">
							<div className="activities__meta">
								<img className="stream__gameTag-thumbnail" src="./mockImages/games/fallout-4/cover.jpg" alt="Fallout 4" />
								<div className="activities__text">
									<div className="activities__card-title">Played Fallout 4</div>
									<p className="stream__gameTag-publisher">23 min ago</p>
								</div>
							</div>
							<img src="./mockImages/games/fallout-4/screenshot.jpg" className="activities__image" alt="Fallout 4"/>
						</div>
						<div className="activities__card">
							<div className="activities__meta">
								<div className="activities__text">
									<div className="activities__card-title">{user.username} is friends with {user.friends[0].username}</div>
									<div className="stream__gameTag-publisher">2 days ago</div>
								</div>
								<div className="activities__friends">
									<Avatar user={user} />
									<Avatar user={user.friends[0]} />
								</div>
							</div>
						</div>
						<div className="activities__card">
							<div className="activities__meta">
								<div className="activities__text">
									<div className="activities__card-title">{user.username} played with {user.friends[0].username}</div>
									<div className="stream__gameTag-publisher">1 week ago</div>
								</div>
								<div className="activities__friends">
									<Avatar user={user} />
									<Avatar user={user.friends[0]} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollableView>
		)
	}

	renderFriends() {
		const friends = this.props.user.friends.map(user => (
			<div className="streamModal__viewer" key={user.id}>
				<LargeAvatar user={user}/>
			</div>
		));

		return <ScrollableView>
			<div className="streamModal__viewers">
				<div className="streamList__title">
					<Icon icon="gamepad" />
					<h2 className="streamList__title-text">Friends</h2>
				</div>
				<div className="streamModal__viewers-grid">
					{friends}
				</div>
			</div>
		</ScrollableView>;
	}

	renderContent() {
		switch (this.view) {
			case 'friends':
				return this.renderFriends();
			default:
				return this.renderActivity();
		}
	}

	render() {
		return (
			<div className="flex-container">
				<AppBar pre={<Back onClick={this.props.onBack} />} />
				<div className="userProfile">
					<Sidebar className="userProfile__sidebar">
						<ProfilePreview
							user={this.props.user}
							sectionTabs={this.getSectionTabs()}
							external
							onWatchStreamClick={this.props.onWatchStreamClick}
						/>
					</Sidebar>
					<div className="flex-container">
						{this.renderContent()}
					</div>
				</div>
			</div>
		);
	}
}

export default UserProfile;

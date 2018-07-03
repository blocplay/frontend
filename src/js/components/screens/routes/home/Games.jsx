import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { observable } from 'mobx';
import UserGameList from '../../../game/UserGameList';
import ScrollableView from '../../../ScrollableView';
import UserGame from '../../../../app/UserGame';
import Loading from '../../../Loading';
import Tabs from '../../../navigation/Tabs';
import DownloadManager from '../../../../../brwc/DownloadManager'

@observer
class Games extends Component {
	static propTypes = {
		allUserGames: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(UserGame)),
		downloadedUserGames: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(UserGame)),
		loadingUserGames: PropTypes.bool,
		onUserGameClick: PropTypes.func,
		onDownloadClick: PropTypes.func,
		dlManager: PropTypes.instanceOf(DownloadManager),
	};

	static defaultProps = {
		allUserGames: [],
		downloadedUserGames: [],
		loadingUserGames: false,
		onUserGameClick: null,
		onDownloadClick: null,
		dlManager: null,
	};

	/**
	 * Currently shown tab
	 * @type {'downloaded'|'all'}
	 */
	@observable
	currentTab = 'downloaded';

	componentWillMount() {
		this.currentTab = 'downloaded';
	}

	handleTabClick(tab) {
		return () => {
			this.currentTab = tab;
		}
	}

	renderTabs() {
		const tabs = Object.entries({
			all: 'Purchased Games',
			downloaded: 'Downloaded Games',
		}).map(([id, label]) => ({
			id,
			label,
			isActive: this.currentTab === id,
			onClick: this.handleTabClick(id),
		}));

		return <Tabs tabs={tabs} />;
	}

	renderLoading() {
		if (!this.props.loadingUserGames) {
			return null;
		}

		return (
			<div className="userGames__loading">
				<Loading />
			</div>
		);
	}

	renderEmpty(userGames) {
		if (this.props.loadingUserGames || userGames.length > 0) {
			return null;
		}

		const message = (!this.props.allUserGames.length)
			? 'You haven\'t purchased any games yet'
			: 'You haven\'t downloaded any games yet';

		return <div className="userGames__empty">{message}</div>;
	}

	renderUserGames(userGames) {
		return (
			<UserGameList
				userGames={userGames}
				onUserGameClick={this.props.onUserGameClick}
				onDownloadClick={this.props.onDownloadClick}
				loading={this.props.loadingUserGames}
				dlManager={this.props.dlManager}
			/>
		);
	}

	render() {
		const userGames = this.currentTab === 'downloaded' ? this.props.downloadedUserGames : this.props.allUserGames;

		return (
			<ScrollableView>
				<div className="userGames">
					{this.renderTabs()}
					{this.renderLoading()}
					{this.renderEmpty(userGames)}
					{this.renderUserGames(userGames)}
				</div>
			</ScrollableView>
		);
	}
}

export default Games;

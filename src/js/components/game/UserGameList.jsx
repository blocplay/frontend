import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import UserGame from '../../app/UserGame';
import Icon from '../icons/Icon';
import ProgressBar from '../ProgressBar';
import DownloadManager from '../../../brwc/DownloadManager';

@observer
class UserGameList extends Component {
	static propTypes = {
		userGames: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(UserGame)),
		onUserGameClick: PropTypes.func,
		onDownloadClick: PropTypes.func,
		// onProgressChange: PropTypes.func,
		dlManager: PropTypes.instanceOf(DownloadManager),
	};

	static defaultProps = {
		userGames: [],
		onUserGameClick: null,
		onDownloadClick: null,
		// onProgressChange: null,
		dlManager: null,
	};

	timer = null;

	componentDidMount() {
		if(this.props.dlManager) {
			this.props.dlManager.registerEventCB(this.eventCallback);
		}
	}
	
	// eslint-disable-next-line no-unused-vars
	eventCallback = (cmdName, focusCtrl, baCommandData) => {
		// NOTE: handle arguments if need to catch events.(see eventCallback of DownloadManager.js)

		// Log.warn(`ProcessEvent : ${cmdName}, ${focusCtrl}, ${baCommandData}`);

		// eslint-disable-next-line react/no-unused-state
		this.setState({ value: 1 }); // update component
	};

	handleUserGameClick = userGame => () => {
		if (this.props.onUserGameClick) {
			this.props.onUserGameClick(userGame);
		}
	};

	handleDownloadClick = userGame => () => {
		if(this.props.onDownloadClick) {
			this.props.onDownloadClick(userGame);
		}
	};

	isDownloadInProgress = () => {
		if(this.props.dlManager) {
			return this.props.dlManager.downloadInProgress;
		}
		return false;
	};

	isResumeDownload = () => {
		if(this.props.dlManager) {
			return this.props.dlManager.resumeDownload;
		}
		return false;
	};

	isPendingQuit = () => {
		if(this.props.dlManager) {
			return this.props.dlManager.pendingQuit;
		}
		return false;
	};

	isSameGame = (game) => {
		if(this.props.dlManager && this.props.dlManager.downloadingGame) {
			return this.props.dlManager.downloadingGame.package.id === game.package.id;
		}
		return false;
	};

	renderGameDownloadIcon(game) {
		if(!this.isDownloadInProgress()) {
			return <Icon icon="cloud-download" />
		}

		if(this.isSameGame(game)) {
			return <Icon icon="stop" />
		}

		return null;
	}

	renderGameDownloadButton(userGame) {
		const game = userGame.game;
		if(this.isDownloadInProgress() && !this.isSameGame(game)) return null;

		return (
			<button className="userGame__downloadButton" onClick={this.handleDownloadClick(userGame)}>
				{this.renderGameDownloadIcon(game)}
			</button>
		);
	}

	renderProgressBar(game) {
		// NOTE: refactor this.
		if(this.isSameGame(game)) {
			if(this.isDownloadInProgress() && !this.isPendingQuit()) {
				if(this.isResumeDownload()) {
					return (
						<div className="userGame__downloadProgress">
							<ProgressBar value={this.props.dlManager.getPctDone()} text />
						</div>
					);
				}
				return (
					<div className="userGame__downloadText">Starting download..</div>
				);
			}
			return (
				<div className="userGame__downloadText">Stopping download..</div>
			);
		} 

		return <div className="userGame__downloadText" />;
	}

	// TODO: fix alignment of text, progress bar and download button.
	renderGames() {
		return this.props.userGames.map(/** @type {UserGame} */ userGame => {
			const game = userGame.game;
			let downloadComponent = null;

			if (!game.package.downloaded) {
				downloadComponent = (
					<div className="userGame__download">
						{this.renderProgressBar(game)}
						{this.renderGameDownloadButton(userGame)}
					</div>
				);
			}

			return (
				<div key={game.id} className="userGames__item userGame">
					<div className="userGame__poster" onClick={this.handleUserGameClick(userGame)}>
						<img src={game.images.cover.url} alt={game.name} />
					</div>
					{downloadComponent}
				</div>
			);
		});
	}

	render() {
		return <div className="userGames__list">{this.renderGames()}</div>;
	}
}

export default UserGameList;

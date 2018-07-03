import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../../components/screens/routes/home/Games';
import UI from '../../../../app/UI';
import PanelModal from '../../../../components/modals/PanelModal';
import UserGamePreviewModal from '../../../game/UserGamePreviewModal';
import Authentication from '../../../../app/Authentication';
import Config from '../../../../app/Config';

@inject('ui', 'auth', 'config')
@observer
class Games extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	/**
	 * Game currently visible in the modal.
	 * @type {MockObject}
	 */
	@observable
	displayedUserGame = null;

	@observable
	gameModalVisible = false;

	/**
	 * True when loading the user games
	 * @type {boolean}
	 */
	@observable
	loadingUserGames = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.loadingUserGames = false;
		this.didMount = false;
		this.user = this.props.auth.getUser();
		this.loadUserGames();
	}

	componentDidMount() {
		this.didMount = true;
	}

	loadUserGames() {
		this.loadingUserGames = true;
		const gameAttributes = this.props.config.get('gameAttributes.userGames');
		// For now, we force a reload (until we have the async update)
		this.user.loadUserGames(gameAttributes, true)
			.then(() => {
				this.loadingUserGames = false;
			});
	}

	openModal() {
		this.gameModalVisible = true;
	}

	closeModal() {
		this.gameModalVisible = false;
	}

	handleUserGameClick = (game) => {
		this.displayedUserGame = game;
		this.openModal();
	};

	handleCloseModal = () => {
		this.closeModal();
	};

	/**
	 * JDC: Test integration.
	 * For now we launch here, it will always run BRWC to check if additional processing is needed.
	 * it also runs a speedd audit in case of game corruption..
	 * 
	 * current behavior is it toggles between download and stop
	 */
	handleDownloadClick = (userGame) => {
		if(!this.props.ui.application.downloadManager.downloadInProgress) {
			this.props.ui.application.downloadManager.startDownload(userGame.game);
		}
		else {
			this.props.ui.application.downloadManager.stopDownload();
		}
		
	};

	handleModalDownloadClick = () => {
		// This is the same download button. Need to disable or change the button once download is running..
		this.handleDownloadClick(this.displayedUserGame);
		this.closeModal();
	};

	renderUserGameModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!this.displayedUserGame || !modalLocation) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.gameModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleCloseModal}
			>
				<UserGamePreviewModal
					userGame={this.displayedUserGame}
					onBack={this.handleCloseModal}
					onDownloadClick={this.handleModalDownloadClick}
				/>
			</PanelModal>
		);
	}

	getAllUserGames() {
		return this.user.userGames;
	}

	getDownloadedUserGames() {
		return this.getAllUserGames().filter(
			userGame => userGame.game.package.downloaded
		);
	}

	getDownloadManager() {
		return this.props.ui.application.downloadManager;
	}

	render() {
		return (
			<Fragment>
				<Component
					loadingUserGames={this.loadingUserGames}
					allUserGames={this.getAllUserGames()}
					downloadedUserGames={this.getDownloadedUserGames()}
					onUserGameClick={this.handleUserGameClick}
					onDownloadClick={this.handleDownloadClick}
					dlManager={this.getDownloadManager()}
				/>
				{this.renderUserGameModal()}
			</Fragment>
		);
	}
}

// Injected props
Games.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Games;

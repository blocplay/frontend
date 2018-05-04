import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../../components/screens/routes/home/Games';
import currentUser from '../../../../mock/currentUser';
import UI from '../../../../app/UI';
import PanelModal from '../../../../components/modals/PanelModal';
import GamePreviewModal from '../../../../components/game/GamePreviewModal';

@inject('ui')
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
	displayedGame = null;

	@observable
	gameModalVisible = false;

	componentWillMount() {
		this.didMount = false;
	}

	componentDidMount() {
		this.didMount = true;
	}

	openModal() {
		this.gameModalVisible = true;
	}

	closeModal() {
		this.gameModalVisible = false;
	}

	handleGameClick = (game) => {
		this.displayedGame = game;
		this.openModal();
	};

	handleCloseModal = () => {
		this.closeModal();
	};

	handleGameStoreLinkClick = () => {
		this.props.ui.router.goTo(`/dashboard/shop/index/${this.displayedGame.id}`);
	};

	renderGameModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!this.displayedGame || !modalLocation) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.gameModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleCloseModal}
			>
				<GamePreviewModal
					game={this.displayedGame}
					onBack={this.handleCloseModal}
					onStoreLinkClick={this.handleGameStoreLinkClick}
				/>
			</PanelModal>
		);
	}

	getGames() {
		return currentUser.games.map(userGame => userGame.game);
	}

	render() {
		return (
			<Fragment>
				<Component
					games={this.getGames()}
					onGameClick={this.handleGameClick}
				/>
				{this.renderGameModal()}
			</Fragment>
		);
	}
}

// Injected props
Games.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Games;

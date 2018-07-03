import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import omit from 'lodash/omit';
import GameModalComponent from '../../components/shop/GameModal';
import GameRepository from '../../app/Repositories/GameRepository';
import Config from '../../app/Config';
import UI from '../../app/UI';

@inject('gameRepository', 'config', 'ui')
@observer
class GameModal extends Component {
	static propTypes = {
		gameId: PropTypes.string.isRequired,
		onAddToCart: PropTypes.func,
	};
	static defaultProps = {
		onAddToCart: null,
	};

	@observable
	loading = false;

	@observable
	game = null;

	componentWillMount() {
		this.loading = false;
		this.loadGame();
	}

	componentWillReceiveProps(newProps) {
		if (this.props.gameId !== newProps.gameId) {
			this.loadGame(newProps.gameId);
		}
	}

	loadGame(gameId = this.props.gameId) {
		this.loading = true;

		/** @type {GameRepository} */
		const repo = this.props.gameRepository;
		const attributes = this.props.config.get('gameAttributes.store.details');
		repo.load(gameId, attributes)
			.then((game) => {
				this.loading = false;
				this.game = game;
			})
			.catch((e) => {
				this.props.ui.router.goTo(`/dashboard/shop/index`);
				return Promise.reject(e);
			});
	}

	handleAddToCart = () => {
		if (this.props.onAddToCart && this.game) {
			this.props.onAddToCart(this.game);
		}
	};

	render() {
		const props = {
			...omit(this.props, ['gameId']),
			loading: this.loading,
			game: this.game,
			onAddToCart: this.handleAddToCart,
		};
		return <GameModalComponent {...props} />;
	}
}

// Injected props
GameModal.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	gameRepository: PropTypes.instanceOf(GameRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default GameModal;

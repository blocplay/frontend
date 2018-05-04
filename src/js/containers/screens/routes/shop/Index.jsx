import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../../components/screens/routes/shop/Index';
import currentUser from '../../../../mock/currentUser';
import {
	cart,
	categories,
	createGameItem,
	createTokenItem,
	indexGames,
} from '../../../../mock/shop';
import FullModal from '../../../../components/modals/FullModal';
import UI from '../../../../app/UI';
import GameModal from '../../../../components/shop/GameModal';
import { getGameById } from '../../../../mock/sampleGames';
import PanelModal from '../../../../components/modals/PanelModal';
import Cart from '../../../cart/Cart';

@inject('ui')
@observer
class Index extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {
	};

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

	@observable
	cartOpened = false;

	@observable
	currentCategory = null;

	componentWillMount() {
		this.didMount = false;
		this.extractDisplayedGameFromPath();
	}

	componentDidMount() {
		this.didMount = true;
	}

	componentWillReceiveProps(newProps) {
		this.extractDisplayedGameFromPath(newProps);
	}

	extractDisplayedGameFromPath(props = this.props) {
		const { gameId } = props.match.params;
		const foundGame = getGameById(gameId);

		if (foundGame) {
			this.displayGame(foundGame);
		} else {
			this.hideDisplayedGame();
		}
	}

	displayGame(game) {
		this.displayedGame = game;
		this.gameModalVisible = true;
	}

	openCart() {
		this.cartOpened = true;
	}

	closeCart() {
		this.cartOpened = false;
	}

	isCartEmpty() {
		return cart.items.length === 0;
	}

	handleCategoryClick = (category) => {
		this.currentCategory = category;
	};

	hideDisplayedGame() {
		this.gameModalVisible = false;
	}

	handleTokensAdded = (amount) => {
		cart.items.push(createTokenItem(amount));
		this.openCart();
	};

	handleTokensAdd = () => {
		this.props.ui.showSendTokensModal(currentUser, this.handleTokensAdded);
	};

	handleGameClick = (game) => {
		this.props.ui.router.goTo(`/dashboard/shop/index/${game.id}`);
	};

	handleAddGameToCart = (game) => {
		cart.items.push(createGameItem(game));
		this.openCart();
	};

	handleGameModalBack = () => {
		this.props.ui.router.goBack();
	};

	handleFavouriteDisplayedGame = () => {
		const value = this.displayedGame.isCurrentUserFavourite;
		value.set(!value.get());
	};

	handleCartClick = () => {
		this.openCart();
	};

	handleCartClose = () => {
		this.closeCart();
	};

	handleBack = () => {
		this.currentCategory = null;
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
			<FullModal
				isOpen={this.gameModalVisible}
				parentSelector={() => modalLocation}
			>
				<GameModal
					game={this.displayedGame}
					onBack={this.handleGameModalBack}
					onFavourite={this.handleFavouriteDisplayedGame}
					onAddToCart={() => { this.handleAddGameToCart(this.displayedGame) }}
				/>
			</FullModal>
		);
	}

	renderCartModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-1');

		if (!modalLocation) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.cartOpened}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleCartClose}
			>
				<Cart
					onClose={this.handleCartClose}
					onTokensAdd={this.handleTokensAdd}
				/>
			</PanelModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					user={currentUser}
					currentCategory={this.currentCategory}
					onTokensAdd={this.handleTokensAdd}
					onCategoryClick={this.handleCategoryClick}
					featuredGames={indexGames.featured}
					latestGames={indexGames.latestGames}
					latestContent={indexGames.latestContent}
					isCartEmpty={this.isCartEmpty()}
					onGameClick={this.handleGameClick}
					onAddGameToCart={this.handleAddGameToCart}
					onCartClick={this.handleCartClick}
					categories={categories}
					onBack={this.handleBack}
				/>
				{ this.renderGameModal() }
				{ this.renderCartModal() }
			</Fragment>
		);
	}
}

// Injected props
Index.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Index;

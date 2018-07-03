import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Component from '../../../../components/screens/routes/shop/Index';
import FullModal from '../../../../components/modals/FullModal';
import UI from '../../../../app/UI';
import GameModal from '../../../shop/GameModal';
import PanelModal from '../../../../components/modals/PanelModal';
import Cart from '../../../cart/Cart';
import GameItem from '../../../../app/CartItem/GameItem';
import Authentication from '../../../../app/Authentication';
import Store from '../../../../app/EStore/Store';
import Config from '../../../../app/Config';

@inject('ui', 'auth', 'eStore', 'config')
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
	displayedGameId = null;

	@observable
	gameModalVisible = false;

	@observable
	cartOpened = false;

	/**
	 * @type {Category|null}
	 */
	@observable
	currentCategory = null;

	@observable
	loadingCategory = false;

	componentWillMount() {
		this.didMount = false;
		this.loadingCategory = false;
		this.extractDisplayedGameFromPath();
		this.loadFrontPage();
	}

	componentDidMount() {
		this.didMount = true;
	}

	componentWillReceiveProps(newProps) {
		this.extractDisplayedGameFromPath(newProps);
	}

	extractDisplayedGameFromPath(props = this.props) {
		const { gameId } = props.match.params;

		if (typeof gameId === 'string') {
			this.displayGame(gameId);
		} else {
			this.hideDisplayedGame();
		}
	}

	loadFrontPage() {
		this.loadingCategory = true;
		const gameAttributes = this.props.config.get('gameAttributes.store.category');
		this.props.eStore.loadFrontPage(gameAttributes, false)
			.then(category => {
				this.currentCategory = category;
				this.loadingCategory = false;
			});
	}

	displayGame(gameId) {
		this.displayedGameId = gameId;
		this.gameModalVisible = true;
	}

	openCart() {
		this.cartOpened = true;
	}

	closeCart() {
		this.cartOpened = false;
	}

	handleCategoryClick = (category) => {
		// Disabled for now
		// this.currentCategory = category;
	};

	hideDisplayedGame() {
		this.gameModalVisible = false;
	}

	handleGameClick = (game) => {
		this.props.ui.router.goTo(`/dashboard/shop/index/${game.id}`);
	};

	handleAddGameToCart = (game) => {
		const item = new GameItem();
		item.game = game;
		this.props.auth.getUser().getCart().addItem(item);
		this.handleCartItemAdded();
	};

	handleCartItemAdded = () => {
		this.openCart();
	};

	handleGameModalBack = () => {
		this.props.ui.router.goBack();
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

		if (!this.displayedGameId || !modalLocation) {
			return null;
		}

		return (
			<FullModal
				isOpen={this.gameModalVisible}
				parentSelector={() => modalLocation}
			>
				<GameModal
					gameId={this.displayedGameId}
					onBack={this.handleGameModalBack}
					onAddToCart={this.handleAddGameToCart}
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
				<Cart onClose={this.handleCartClose} />
			</PanelModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					loading={this.loadingCategory}
					isFrontPage // hardcoded for now
					currentCategory={this.currentCategory}
					onCategoryClick={this.handleCategoryClick}
					onGameClick={this.handleGameClick}
					onCartItemAdded={this.handleCartItemAdded}
					onAddGameToCart={this.handleAddGameToCart}
					onCartClick={this.handleCartClick}
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
	auth: PropTypes.instanceOf(Authentication).isRequired,
	eStore: PropTypes.instanceOf(Store).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Index;

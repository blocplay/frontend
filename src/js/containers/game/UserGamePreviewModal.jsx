import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../components/game/UserGamePreviewModal';
import UserGame from '../../app/UserGame';
import UI from '../../app/UI';
import Config from '../../app/Config';

@inject('ui', 'config')
@observer
class UserGamePreviewModal extends React.Component {
	static propTypes = {
		userGame: PropTypes.instanceOf(UserGame).isRequired,
	};
	static defaultProps = {
	};

	@observable
	loading = false;

	componentWillMount() {
		this.loading = false;
		this.fillGame();
	}

	componentWillReceiveProps(newProps) {
		if (this.props.userGame !== newProps.userGame) {
			this.fillGame(newProps.userGame);
		}
	}

	/**
	 * @param {UserGame} userGame
	 */
	fillGame(userGame = this.props.userGame) {
		this.loading = true;
		const attributes = this.props.config.get('gameAttributes.preview');
		userGame.game.fill(attributes)
			.then(() => {
				this.loading = false;
			});
	}

	handleGameStoreLinkClick = () => {
		const gameId = this.props.userGame.game.id;
		this.props.ui.router.goTo(`/dashboard/shop/index/${gameId}`);
	};

	render() {
		const props = {
			...this.props,
			loading: this.loading,
			onStoreLinkClick: this.handleGameStoreLinkClick,
		};
		return <Component {...props} />;
	}
}

// Injected props
UserGamePreviewModal.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default UserGamePreviewModal;

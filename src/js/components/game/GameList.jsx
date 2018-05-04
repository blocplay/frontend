import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';

class GameList extends Component {
	static propTypes = {
		games: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		onGameClick: PropTypes.func,
	};

	static defaultProps = {
		games: [],
		onGameClick: null,
	};

	handleGameClick = game => () => {
		if (this.props.onGameClick) {
			this.props.onGameClick(game);
		}
	};

	renderGames() {
		return this.props.games.map(game => (
			<div key={game.id} className="gameList__poster-wrapper" onClick={this.handleGameClick(game)}>
				<img className="gameList__poster" src={game.medias.cover} alt={game.name} />
			</div>
		));
	}

	render() {
		return <div className="gameList">{this.renderGames()}</div>;
	}
}

export default GameList;

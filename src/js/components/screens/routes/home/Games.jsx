import React from 'react';
import PropTypes from 'prop-types';
import GameList from '../../../game/GameList';
import MockObject from '../../../../mock/MockObject';
import ScrollableView from '../../../ScrollableView';

const propTypes = {
	games: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	onGameClick: PropTypes.func,
};

const defaultProps = {
	games: [],
	onGameClick: null,
};

function Games(props) {
	return (
		<ScrollableView>
			<GameList games={props.games} onGameClick={props.onGameClick} />
		</ScrollableView>
	);
}

Games.propTypes = propTypes;
Games.defaultProps = defaultProps;

export default Games;

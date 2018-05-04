import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import MockObject from '../../mock/MockObject';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import ScrollableView from '../ScrollableView';
import Icon from '../icons/Icon';

const propTypes = {
	game: PropTypes.instanceOf(MockObject).isRequired,
	onBack: PropTypes.func,
	onStoreLinkClick: PropTypes.func,
};

const defaultProps = {
	onBack: null,
	onStoreLinkClick: null,
};

function GamePreviewModal(props) {
	const { game } = props;
	return (
		<div className="flex-container">
			<AppBar pre={<Back onClick={props.onBack} />} title={game.name} />
			<ScrollableView>
				<div className="gamePreviewModal">
					<div className="gamePreviewModal__poster">
						<img className="gamePreviewModal__image" src={game.medias.cover} alt={game.name} />
					</div>
					<div className="gamePreviewModal__meta">
						<div className="gamePreviewModal__header">
							<div className="gamePreviewModal__title">{game.name}</div>
							<div className="shopItem__subtitle">{game.publisher}</div>
						</div>
						<div className="gamePreviewModal__details-item">
							<Icon icon="thumbs-up" />
							{numeral(game.nbLikes).format('0[.]0a')} Likes
						</div>
						<div className="gamePreviewModal__details-item">
							<Icon icon="users" />
							8 Friends,&nbsp;
							{numeral(game.nbCommunities).format('0[.]0a')} Communities
						</div>
						<div className="gamePreviewModal__details-item">
							<Icon icon="chart-line" />
							{numeral(game.nbStreaming).format('0[.]0a')} Streaming,&nbsp;
							{numeral(game.nbVideos).format('0[.]0a')} Video,&nbsp;
							{numeral(game.nbCaptures).format('0[.]0a')} Captures,&nbsp;
						</div>
						<div className="gamePreviewModal__view">
							<button className="btn btn-yellow w100" onClick={props.onStoreLinkClick}>
								View in Play Store
							</button>
						</div>
					</div>
				</div>
			</ScrollableView>
		</div>
	);
}

GamePreviewModal.propTypes = propTypes;
GamePreviewModal.defaultProps = defaultProps;

export default GamePreviewModal;

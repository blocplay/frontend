import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import ScrollableView from '../ScrollableView';
import Icon from '../icons/Icon';
import Loading from '../Loading';
import UserGame from '../../app/UserGame';

const propTypes = {
	userGame: PropTypes.instanceOf(UserGame).isRequired,
	loading: PropTypes.bool,
	onBack: PropTypes.func,
	onStoreLinkClick: PropTypes.func,
	onDownloadClick: PropTypes.func,
};

const defaultProps = {
	loading: false,
	onBack: null,
	onStoreLinkClick: null,
	onDownloadClick: null,
};

function UserGamePreviewModal(props) {
	const game = props.userGame.game;
	let content;
	let downloadButton;

	if (props.loading) {
		content = (
			<div className="gamePreviewModal__loading">
				<Loading/>
			</div>
		);
	} else {
		if (!props.userGame.game.package.downloaded) {
			downloadButton = (
				<button className="btn btn-yellow w100" onClick={props.onDownloadClick}>
					<Icon icon="cloud-download"/>
					<span>Download</span>
				</button>
			);
		}

		content = (
			<Fragment>
				<div className="gamePreviewModal__poster">
					<img className="gamePreviewModal__image" src={game.images.cover.url} alt={game.name} />
				</div>
				<div className="gamePreviewModal__meta">
					<div className="gamePreviewModal__header">
						<div className="gamePreviewModal__title">{game.name}</div>
						<div className="shopItem__subtitle">{game.publisher.name}</div>
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
						{downloadButton}
						<button className="btn btn-outline w100" onClick={props.onStoreLinkClick}>
							View in Play Store
						</button>
					</div>
				</div>
			</Fragment>
		);
	}
	return (
		<div className="flex-container">
			<AppBar pre={<Back onClick={props.onBack} />} title={game.name} />
			<ScrollableView>
				<div className="gamePreviewModal">
					{content}
				</div>
			</ScrollableView>
		</div>
	);
}

UserGamePreviewModal.propTypes = propTypes;
UserGamePreviewModal.defaultProps = defaultProps;

export default UserGamePreviewModal;

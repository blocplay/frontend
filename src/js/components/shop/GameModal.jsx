import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import numeral from 'numeral';
import { DefaultPlayer as Video } from 'react-html5video';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import Actions from '../appBar/Actions';
import Sidebar from '../Sidebar';
import ScrollableView from '../ScrollableView';
import Icon from '../icons/Icon';
import Game from '../../app/Game';
import Loading from '../Loading';
import { formatWei } from '../../app/utils';

const mediaTypeLabels = {
	video: 'Video',
};

@observer
class GameModal extends Component {
	static propTypes = {
		game: PropTypes.instanceOf(Game),
		loading: PropTypes.bool,
		onBack: PropTypes.func,
		onFavourite: PropTypes.func,
		onAddToCart: PropTypes.func,
	};
	static defaultProps = {
		game: null,
		loading: false,
		onBack: null,
		onFavourite: null,
		onAddToCart: null,
	};

	getAppBarPostActions() {
		const game = this.props.game;

		if (!game) {
			return [];
		}

		return [
			{
				id: 'favourite',
				icon: 'heart',
				// icon: game.isCurrentUserFavourite.get() ? 'heart-fill' : 'heart',
				callback: this.props.onFavourite,
			},
		];
	}

	/**
	 * @param {Game.rating} rating
	 */
	renderStars(rating) {
		const stars = [];
		const factor = 5 / rating.denominator;
		const nb = Math.ceil(rating.numerator * factor);

		for (let i = 0; i < nb; i += 1) {
			stars.push(<Icon icon="star-fill" key={`full_${i}`} />);
		}

		for (let i = nb; i < 5; i += 1) {
			stars.push(<Icon icon="star" key={`empty_${i}`} />);
		}

		return stars;
	}

	renderAttributes() {
		return (
			// TODO: remove temporary hardcoded PEGI icons
			<div className="shopGame__flags">
				<img className="shopGame__flag" src="./mockImages/pegi/pegi-1.png" alt="Pegi: 18+" />
				<img className="shopGame__flag" src="./mockImages/pegi/pegi-2.png" alt="Pegi: Violence" />
				<img className="shopGame__flag" src="./mockImages/pegi/pegi-3.png" alt="Pegi: Bad Language" />
			</div>
		);
	}

	renderPlatforms() {
		return (
			<div className="shopGame__platforms">
				<div className="shopGame__platform">
					<Icon icon="windows" />
					<p className="shopGame__platform-text">PC</p>
				</div>
			</div>
		);
	}

	renderMedias() {
		return this.props.game.medias.map(media => (
			<div key={media.id} className="shopGame__media">
				<div className="shopGame__poster">
					{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
					<Video className="shopGame__image" poster={media.previewUrl} controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']} preload="metadata">
						<source src={media.src} type="video/mp4"/>
					</Video>
				</div>
				<div className="shopItem__details">
					<div className="shopItem__details-text">
						<div>{media.title}</div>
						<div className="shopItem__subtitle">{mediaTypeLabels[media.type]}</div>
					</div>
				</div>
			</div>
		));
	}

	renderContent() {
		const { game } = this.props;

		if (!game) {
			return null;
		}

		return (
			<Fragment>
				<Sidebar className="shopGame__sidebar">
					<ScrollableView>
						<img className="shopGame__sidebar-image" src={game.images.cover.url} alt={game.name} />
						<div className="profilePreview__details">
							<div className="profilePreview__details-item">
								<Icon icon="tokenplay" />
								<p>{numeral(game.tokensEarned).format('0.0a')} Tokens Earned</p>
							</div>
							<div className="profilePreview__details-item">
								<Icon icon="building" />
								<p>Published by {game.publisher.name}</p>
							</div>
							<div className="profilePreview__details-item">
								<Icon icon="star" />
								<p>Rated by {numeral(game.rating.populationSize).format('0.0a')} Players</p>
								<div className="shopGame__rating">{this.renderStars(game.rating)}</div>
							</div>
							<div className="profilePreview__details-item shopGame__meta">
								{this.renderAttributes()}
								{this.renderPlatforms()}
							</div>
						</div>
						{/* eslint-disable-next-line react/no-danger */}
						<div className="shopGame__description" dangerouslySetInnerHTML={{ __html: game.description }} />
					</ScrollableView>
				</Sidebar>
				<div className="shopGame__main">
					<ScrollableView>
						<div className="shopGame__media-list">
							<div className="streamList__title">
								<Icon icon="gamepad" />
								<h2>Trailers &amp; Media</h2>
							</div>
							{this.renderMedias()}
						</div>
					</ScrollableView>
					<div className="btn-yellow shopGame__purchase" onClick={this.props.onAddToCart}>
						<button className="btn-yellow shopGame__purchase-button">
							Add to cart for<Icon icon="tokenplay" />
							<span className="shopGame__purchase-button-price">{formatWei(game.price)}</span>
						</button>
					</div>
				</div>
			</Fragment>
		);
	}

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return <div className="shopGame__loading"><Loading/></div>;
	}

	render() {
		const { game } = this.props;
		const gameName = game ? game.name : '';

		return (
			<div className="shopGame">
				<AppBar
					pre={<Back onClick={this.props.onBack} />}
					title={gameName}
					post={<Actions actions={this.getAppBarPostActions()} />}
				/>
				<div className="shopGame__container">
					{this.renderLoading()}
					{this.renderContent()}
				</div>
			</div>
		);
	}
}

export default GameModal;

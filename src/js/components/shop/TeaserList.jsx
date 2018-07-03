import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import Teaser from './Teaser';
import Icon from '../icons/Icon';
import Game from '../../app/Game';

const propTypes = {
	games: PropTypes.arrayOf(PropTypes.instanceOf(Game)),
	onlyImage: PropTypes.bool,
	onGameClick: PropTypes.func,
	onAddToCart: PropTypes.func,
	icon: PropTypes.string,
	title: PropTypes.string,
	display: PropTypes.oneOf(['grid', 'row']),
};

const defaultProps = {
	games: [],
	onlyImage: false,
	onGameClick: null,
	onAddToCart: null,
	icon: null,
	title: null,
	display: 'row',
};

// games, onlyImage, onGameClick, onAddToCart;
function TeaserList(props) {
	const swiperParams = {
		slidesPerView: 'auto',
		spaceBetween: 22,
		wrapperClass: 'streamList__row',
	};

	const teasers = props.games.map(game => {
		const handleGameClick = () => {
			if (props.onGameClick) {
				props.onGameClick(game);
			}
		};

		const handleAddToCart = () => {
			if (props.onAddToCart) {
				props.onAddToCart(game);
			}
		};

		return (
			<div key={game.id} className="streamList__item">
				<Teaser game={game} onlyImage={props.onlyImage} onClick={handleGameClick} onAddToCart={handleAddToCart} />
			</div>
		);
	});

	let content;

	if (props.display === 'row') {
		content = <Swiper {...swiperParams}>{teasers}</Swiper>;
	} else {
		content = (
			<div className="streamList__grid">
				<div className="streamList__gridContainer">
					{teasers}
				</div>
			</div>
		);
	}

	return (
		<div className="streamList">
			{props.title &&
				props.icon && (
					<div className="streamList__title">
						<Icon icon={props.icon} />
						<h2 className="streamList__title-text">{props.title}</h2>
					</div>
				)}
			{content}
		</div>
	);
}

TeaserList.propTypes = propTypes;
TeaserList.defaultProps = defaultProps;

export default TeaserList;

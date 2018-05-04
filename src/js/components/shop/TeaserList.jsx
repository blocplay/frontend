import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import MockObject from '../../mock/MockObject';
import Teaser from './Teaser';
import Icon from '../icons/Icon';

const propTypes = {
	games: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	onlyImage: PropTypes.bool,
	// eslint-disable-next-line
	onGameClick: PropTypes.func,
	// eslint-disable-next-line
	onAddToCart: PropTypes.func,
	icon: PropTypes.string,
	title: PropTypes.string,
};

const defaultProps = {
	games: [],
	onlyImage: false,
	onGameClick: null,
	onAddToCart: null,
	icon: null,
	title: null,
};

// games, onlyImage, onGameClick, onAddToCart;
function TeaserList(props) {
	const swiperParams = {
		slidesPerView: 'auto',
		spaceBetween: 22,
		wrapperClass: 'streamList__list',
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

	return (
		<div className="streamList">
			{props.title &&
				props.icon && (
					<div className="streamList__title">
						<Icon icon={props.icon} />
						<h2 className="streamList__title-text">{props.title}</h2>
					</div>
				)}
			<Swiper {...swiperParams}>{teasers}</Swiper>
		</div>
	);
}

TeaserList.propTypes = propTypes;
TeaserList.defaultProps = defaultProps;

export default TeaserList;

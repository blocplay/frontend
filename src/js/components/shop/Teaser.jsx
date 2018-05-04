import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';
import Icon from '../icons/Icon';

const propTypes = {
	game: PropTypes.instanceOf(MockObject).isRequired,
	onlyImage: PropTypes.bool,
	onClick: PropTypes.func,
	onAddToCart: PropTypes.func,
};

const defaultProps = {
	onlyImage: false,
	onClick: null,
	onAddToCart: null,
};

function Teaser(props) {
	const { game } = props;

	if (props.onlyImage) {
		return (
			<div className="shopItem">
				<div className="shopItem__poster" onClick={props.onClick}>
					<img className="shopItem__image" src={game.medias.store} alt={game.name} />
				</div>
			</div>
		);
	}

	return (
		<div className="shopItem">
			<div className="shopItem__poster shopItem__poster--fade" onClick={props.onClick}>
				<img className="shopItem__image" src={game.medias.store} alt={game.name} />
				<div className="shopItem__price">
					<Icon icon="tokenplay" />
					<span>{game.tokenPrice}</span>
				</div>
			</div>
			<div className="shopItem__details">
				<div className="shopItem__details-text" onClick={props.onClick}>
					<div className="shopItem__title">{game.name}</div>
					<div className="shopItem__subtitle">{game.platform}</div>
				</div>
				<button className="shopItem__atc" onClick={props.onAddToCart}>
					<Icon icon="cart-plus" />
				</button>
			</div>
		</div>
	);
}

Teaser.propTypes = propTypes;
Teaser.defaultProps = defaultProps;

export default Teaser;

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from '../../AppBar';
import Back from '../../appBar/Back';
import ScrollableView from '../../ScrollableView';

const propTypes = {
	gamesWerePurchased: PropTypes.bool,
	onGoToGamesClick: PropTypes.func,
	onBack: PropTypes.func,
};

const defaultProps = {
	gamesWerePurchased: true,
	onGoToGamesClick: null,
	onBack: null,
};

function Purchased(props) {
	let goToGamesContent = null;

	if (props.gamesWerePurchased) {
		goToGamesContent = (
			<Fragment>
				<p>You can download your purchased games in your games list.</p>
				<button className="btn btn-yellow" onClick={props.onGoToGamesClick}>Go to my games</button>
			</Fragment>
		);
	}

	return (
		<div className="flex-container">
			<AppBar title="Cart" pre={<Back onClick={props.onBack}/>}/>
			<ScrollableView>
				<div className="cart">
					<div className="cart__success">
						<h1>Thank you for your purchase!</h1>
						{goToGamesContent}
					</div>
				</div>
			</ScrollableView>
		</div>
	);
}

Purchased.propTypes = propTypes;
Purchased.defaultProps = defaultProps;

export default Purchased;

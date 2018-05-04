import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollableView from '../../../ScrollableView';
import MockObject from '../../../../mock/MockObject';
import ProgressBar from '../../../ProgressBar';
import Icon from '../../../icons/Icon';

class Trophies extends Component {
	static propTypes = {
		onGameClick: PropTypes.func,
		trophies: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	};
	static defaultProps = {
		onGameClick: null,
		trophies: [],
	};

	handleGameClick(game) {
		return () => {
			if (this.props.onGameClick) {
				this.props.onGameClick(game);
			}
		};
	}

	renderTrophy = trophy => (
		<div className="activities__card card__small" key={trophy.id} onClick={this.handleGameClick(trophy.game)}>
			<div className="activities__meta">
				<img className="stream__gameTag-thumbnail" src={trophy.game.medias.cover} alt={trophy.game.name} />
				<div className="activities__text">
					<div>{trophy.game.name}</div>
					<ProgressBar value={trophy.won} />
				</div>
			</div>
		</div>
	);

	render() {
		return (
			<ScrollableView>
				<div className="activities__list">
					<div className="streamList__title">
						<Icon icon="trophy" />
						<h2>Activity</h2>
					</div>
					<div className="trophies__graphic-wrapper">
						<img className="trophies__graphic" src="./mockImages/trophy-chart.png" alt="Activity" />
					</div>
					<div className="trophies__container">
						<div className="trophies__collection">
							<div className="trophies__current trophies__trophy">
								<Icon icon="trophy" />7
							</div>
							<div className="trophies__wall">
								<div className="trophies__gold trophies__trophy">
									<Icon icon="trophy" />91
								</div>
								<div className="trophies__silver trophies__trophy">
									<Icon icon="trophy" />199
								</div>
								<div className="trophies__bronze trophies__trophy">
									<Icon icon="trophy" />247
								</div>
							</div>
						</div>
						<ProgressBar value={0.34} text />
					</div>
					<div className="streamList__title">
						<Icon icon="trophy" />
						<h2>Latest Trophies</h2>
					</div>
					<div>{this.props.trophies.map(this.renderTrophy)}</div>
				</div>
			</ScrollableView>
		);
	}
}

export default Trophies;

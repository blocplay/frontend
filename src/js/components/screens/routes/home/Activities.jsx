import React from 'react';
import Avatar from '../../../appBar/Avatar';
import sampleUsers from '../../../../mock/sampleUsers';
import currentUser from '../../../../mock/currentUser';
import Icon from '../../../icons/Icon';
import ScrollableView from '../../../ScrollableView';

const propTypes = {};

const defaultProps = {};

function Activities() {
	return (
		<ScrollableView>
			<div className="activities">
				<div className="activities__list">
					<div className="streamList__title">
						<Icon icon="info-circle" />
						<h2>Latest Activity</h2>
					</div>
					<div className="activities__card">
						<div className="activities__meta">
							<img className="stream__gameTag-thumbnail" src="./mockImages/games/fallout-4/cover.jpg" alt="Fallout 4" />
							<div className="activities__text">
								<div className="activities__card-title">Played Fallout 4</div>
								<p className="stream__gameTag-publisher">23 min ago</p>
							</div>
						</div>
						<img src="./mockImages/games/fallout-4/screenshot.jpg" className="activities__image" alt="Fallout 4" />
					</div>
					<div className="activities__card">
						<div className="activities__meta">
							<div className="activities__text">
								<div className="activities__card-title">You are friends with {sampleUsers[0].username}</div>
								<div className="stream__gameTag-publisher">2 days ago</div>
							</div>
							<div className="activities__friends">
								<Avatar user={currentUser} />
								<Avatar user={sampleUsers[0]} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</ScrollableView>
	);
}

Activities.propTypes = propTypes;
Activities.defaultProps = defaultProps;

export default Activities;

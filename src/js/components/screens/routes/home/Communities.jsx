import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { observable } from 'mobx';
import MockObject from '../../../../mock/MockObject';
import Tabs from '../../../navigation/Tabs';
import ScrollableView from '../../../ScrollableView';
import CommunityPreview from '../../../community/CommunityPreview';

@observer
class Community extends Component {
	static propTypes = {
		currentUserSubscriptions: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(MockObject)),
		otherCommunities: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		onCommunityClick: PropTypes.func,
	};

	static defaultProps = {
		currentUserSubscriptions: [],
		otherCommunities: [],
		onCommunityClick: null,
	};

	/**
	 * @type {'userCommunities'|'discover'}
	 */
	@observable
	view = '';

	componentWillMount() {
		this.view = 'userCommunities';
	}

	getTabs() {
		return Object.entries({
			userCommunities: 'Your Communities',
			discover: 'Discover',
		}).map(([id, label])=> ({
			id,
			label,
			onClick: this.handleTabClick(id),
			isActive: this.view === id,
		}));
	}

	handleTabClick = (tabId) => () => {
		if (tabId === 'userCommunities') {
			this.view = 'userCommunities';
		} else {
			this.view = 'discover';
		}
	};

	handleCommunityClick = (community) => () => {
		if (this.props.onCommunityClick) {
			this.props.onCommunityClick(community);
		}
	};

	renderCommunity(community, role = null) {
		const tags = [
			community.language,
		];

		if (role) {
			tags.push(role);
		}

		return (
			<CommunityPreview
				key={community.id}
				community={community}
				tags={tags}
				onClick={this.handleCommunityClick(community)}
			/>
		);
	}

	renderCurrentUserCommunities() {
		return (
			<ScrollableView>
				<div className="friendsList__list">
					{this.props.currentUserSubscriptions.map(s => this.renderCommunity(s.community, s.role))}
				</div>
			</ScrollableView>
		);
	}

	renderDiscoverCommunities() {
		return (
			<Fragment>
				<div className="friendsList__search"><input type="search" placeholder="Search communities..." /></div>
				<ScrollableView>
					<div className="friendsList__list">
						{this.props.otherCommunities.map(c => this.renderCommunity(c))}
					</div>
				</ScrollableView>
			</Fragment>
		);
	}

	render() {
		return (
			<div className="flex-container">
				<Tabs tabs={this.getTabs()} />
				{
					this.view === 'userCommunities'
						? this.renderCurrentUserCommunities()
						: this.renderDiscoverCommunities()
				}
			</div>
		);
	}
}

export default Community;

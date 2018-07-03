import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { inject } from 'mobx-react';
import UI from '../../../app/UI';
import Authentication from '../../../app/Authentication';
import Component from '../../../components/screens/groups/Home';

const tabs = [
	{ id: 'games', path: '/dashboard/home/games', title: 'Games', icon:'gamepad' },
	{ id: 'activities', path: '/dashboard/home/activities', title: 'Activities', icon:'exclamation-circle' },
	{ id: 'friends', path: '/dashboard/home/friends', title: 'Friends', icon:'users' },
	{ id: 'community', path: '/dashboard/home/communities', title: 'Community', icon:'map-marker-alt' },
	{ id: 'events', path: '/dashboard/home/events', title: 'Events', icon:'calendar' },
	{ id: 'trophies', path: '/dashboard/home/trophies', title: 'Trophies', icon:'trophy' },
];

@inject('ui', 'auth')
class Home extends ReactComponent {
	static propTypes = {
		children: PropTypes.element.isRequired,
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.user = this.props.auth.getUser();
	}

	getSectionTabs() {
		return tabs.map(tab => ({
			...pick(tab, ['id', 'title', 'icon']),
			isActive: this.isTabActive(tab),
			callback: this.handleTabClick(tab),
		}));
	}

	handleTabClick(tab) {
		return () => {
			this.props.ui.router.goTo(tab.path);
		}
	}

	handleSettingsClick = () => {
		this.props.ui.showAppSettings();
	};

	isTabActive(tab) {
		return this.props.ui.router.matchesPath(tab.path);
	}

	render() {
		return (
			<Component
				sectionTabs={this.getSectionTabs()}
				currentUser={this.user}
				onSettingsClick={this.handleSettingsClick}
			>
				{ this.props.children }
			</Component>
		);
	}
}

// Injected props
Home.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
};

export default Home;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppTabs from '../../../containers/AppTabs';

class Dashboard extends Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		registerModalLocation: PropTypes.func,
		sendTokensLocationName: PropTypes.string.isRequired,
		settingsLocationName: PropTypes.string.isRequired,
	};

	static defaultProps = {
		registerModalLocation: null,
	};

	handleContainerRef = location => (node) => {
		if (this.props.registerModalLocation) {
			this.props.registerModalLocation(location, node);
		}
	};

	render() {
		return (
			<div className="screenGroupDashboard">
				<div className="screenGroupDashboard__content">
					{ this.props.children }
				</div>
				<div className="screenGroupDashboard__nav">
					<div className="navigationTabs">
						<AppTabs/>
					</div>
				</div>
				<div ref={this.handleContainerRef('dashboard-0')} className="screenGroupDashboard__modal0" />
				<div ref={this.handleContainerRef('dashboard-1')} className="screenGroupDashboard__modal1" />
				{/* Since multiple screens use the sendTokens modal, it is always here */}
				<div ref={this.handleContainerRef(this.props.sendTokensLocationName)} className="screenGroupDashboard__sendTokensModal" />
				<div ref={this.handleContainerRef(this.props.settingsLocationName)} className="screenGroupDashboard__appSettings" />
			</div>
		);
	}
}

export default Dashboard;

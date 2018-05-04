import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppTab from './AppTab';

class AppTabs extends Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			isActive: PropTypes.bool,
			callback: PropTypes.func,
		})),
	};
	static defaultProps = {
		tabs: [],
	};

	renderTabs() {
		return this.props.tabs.map(tab => (
			<div key={tab.id} className="appTabs__tab">
				<AppTab {...tab} />
			</div>
		));
	}

	render() {
		return (
			<div className="appTabs">
				{ this.renderTabs() }
			</div>
		);
	}
}

export default AppTabs;

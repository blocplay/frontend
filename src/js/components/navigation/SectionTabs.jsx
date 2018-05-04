import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionTab from './SectionTab';

class SectionTabs extends Component {
	static propTypes = {
		sectionTabs: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			icon: PropTypes.string,
			isActive: PropTypes.bool,
			callback: PropTypes.func,
		})),
	};
	static defaultProps = {
		sectionTabs: [],
	};

	renderTabs() {
		return this.props.sectionTabs.map((tab) => (
			<div key={tab.id} className="sectionTabs__tab">
				<SectionTab {...tab} />
			</div>
		));
	}

	render() {
		return (
			<div className="sectionTabs">
				{ this.renderTabs() }
			</div>
		);
	}
}

export default SectionTabs;

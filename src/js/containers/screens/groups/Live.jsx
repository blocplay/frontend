import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Component from '../../../components/screens/groups/Live';
import UI from '../../../app/UI';

@inject('ui')
@observer
class Live extends ReactComponent {
	static propTypes = {
		children: PropTypes.node,
	};
	static defaultProps = {
		children: null,
	};

	handleBack = () => {
		this.props.ui.router.goBack();
	};

	showBack() {
		return this.props.ui.router.matchesPath('/dashboard/live/stream');
	}

	render() {
		return (
			<Component
				showBack={this.showBack()}
				onBack={this.handleBack}
			>
				{ this.props.children }
			</Component>
		);
	}
}

// Injected props
Live.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Live;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'underscore';
import SwipeoutBase from 'rc-swipeout';

/**
 * Simple wrapper around <Swipeout> from rc-swipeout to set some base props.
 */
class Swipeout extends Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
	};

	static defaultProps = {};

	ref = null;

	close() {
		this.ref.close();
	}

	render() {
		const otherProps = omit(this.props, 'children');
		return (
			<SwipeoutBase
				ref={(n) => { this.ref = n; }}
				prefixCls="swipeout"
				{...otherProps}
			>
				{this.props.children}
			</SwipeoutBase>
		);
	}
}

export default Swipeout;

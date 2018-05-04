import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '../../AppBar';
import Back from '../../appBar/Back';

const propTypes = {
	children: PropTypes.node,
	isFullScreen: PropTypes.bool,
	showBack: PropTypes.bool,
	onBack: PropTypes.func,
};

const defaultProps = {
	children: null,
	isFullScreen: false,
	showBack: false,
	onBack: null,
};

function Live(props) {
	const fullScreenClass = props.isFullScreen ? 'screenGroupLive--fullScreen' : '';
	const appBarPre = props.showBack
		? <Back onClick={props.onBack} />
		: null;
	return (
		<div className={`screenGroupLive ${fullScreenClass}`}>
			<div className="screenGroupLive__header">
				<AppBar pre={appBarPre} />
			</div>
			<div className="screenGroupLive__content">
				{ props.children }
			</div>
		</div>
	);
}

Live.propTypes = propTypes;
Live.defaultProps = defaultProps;

export default Live;

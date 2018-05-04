import React from 'react';
import PropTypes from 'prop-types';
import iconList from './iconList';

const propTypes = {
	icon: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

const defaultProps = {
	onClick: null,
};

const Icon = props => {
	const iconData = iconList[props.icon];
	return (
		<div className={`icon icon-${props.icon}`} onClick={props.onClick}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${iconData[0]} ${iconData[1]}`}>
				<path d={`${iconData[2]}`} />
			</svg>
		</div>
	);
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;

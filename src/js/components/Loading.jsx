import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icons/Icon';

const propTypes = {
	size: PropTypes.oneOf(['small', 'medium']),
};

const defaultProps = {
	size: 'medium',
};

function Loading(props) {
	const classNames = ['loading'];

	if (props.size === 'small') {
		classNames.push('loading--small');
	}

	return (
		<div className={classNames.join(' ')}>
			<Icon icon="loading"/>
		</div>
	);
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;

import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icons/Icon';

const propTypes = {
	message: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

const defaultProps = {
	onClick: null,
};

function FlashMessage(props) {
	return (
		<div className="flashMessage" onClick={props.onClick}>
			{props.message}
			<Icon key="chevron" icon="chevron-right"/>
		</div>
	);
}

FlashMessage.propTypes = propTypes;
FlashMessage.defaultProps = defaultProps;

export default FlashMessage;

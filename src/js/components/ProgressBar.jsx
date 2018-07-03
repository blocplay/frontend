import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.number,
	text: PropTypes.bool,
};

const defaultProps = {
	value: 0,
	text: false,
};

function ProgressBar(props) {
	return (
		<div className={`progressBar__container${props.text ? ' progressBar__container--text' : ''}`}>
			<meter className="progressBar" value={props.value * 100} min="0" max="100" />
			{props.text && <div className="progressBar__text">{Math.round((props.value * 100) * 100) / 100}%</div>}
		</div>
	);
}

ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;

export default ProgressBar;

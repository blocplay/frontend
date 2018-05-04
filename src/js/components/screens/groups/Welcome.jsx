import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../../../../src/assets/images/logo.svg';

function Welcome({ children }) {
	return (
		<div className="screenGroupWelcome">
			<div className="screenGroupWelcome__header">
				<img alt="Tokenplay" src={logo} className="screenGroupWelcome__logo" />
			</div>
			<div className="screenGroupWelcome__content">{children}</div>
		</div>
	);
}

Welcome.propTypes = {
	children: PropTypes.element.isRequired,
};

export default Welcome;

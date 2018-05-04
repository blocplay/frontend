import React from 'react';
import PropTypes from 'prop-types';
import BaseAvatar from '../user/Avatar';
import MockObject from '../../mock/MockObject';

const propTypes = {
	user: PropTypes.instanceOf(MockObject).isRequired,
};

const defaultProps = {};

function Avatar(props) {
	return (
		<div className="appBar__avatar">
			<BaseAvatar user={props.user} />
		</div>
	);
}

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;

import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../mock/MockObject';

const propTypes = {
	// eslint-disable-next-line react/no-unused-prop-types
	user: PropTypes.instanceOf(MockObject).isRequired,
};

const defaultProps = {};

function User({ user }) {
	return <img className="avatar" src={user.avatar} alt={user.username} />;
}

User.propTypes = propTypes;
User.defaultProps = defaultProps;

export default User;

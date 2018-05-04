import React from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../../../mock/MockObject';
import UserListItem from '../../../user/UserListItem';
import ScrollableView from '../../../ScrollableView';
import Icon from '../../../icons/Icon';

const propTypes = {
	users: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	onUserClick: PropTypes.func,
};

const defaultProps = {
	users: [],
	onUserClick: null,
};

function New(props) {
	const handleUserClick = user => () => {
		if (props.onUserClick) {
			props.onUserClick(user);
		}
	};

	const users = props.users.map((user) => {
		const handleClick = handleUserClick(user);

		return (
			<div key={user.id}>
				<UserListItem
					className="invitations"
					user={user}
					onClick={handleClick}
					post={<Icon icon="plus-circle" onClick={handleClick} />}
				/>
			</div>
		)
	});

	return (
		<div className="flex-container">
			<div className="screenGroupMessages__search">
				<input placeholder="To:" />
			</div>
			<ScrollableView>{users}</ScrollableView>
		</div>
	);
}

New.propTypes = propTypes;
New.defaultProps = defaultProps;

export default New;

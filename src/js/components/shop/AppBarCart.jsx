import React from 'react';
import PropTypes from 'prop-types';
import Actions from '../appBar/Actions';

const propTypes = {
	onClick: PropTypes.func,
	isEmpty: PropTypes.bool,
};
const defaultProps = {
	onClick: null,
	isEmpty: false,
};

function AppBarCart(props) {
	const actions = [
		{
			id: 'cart',
			icon: 'shopping-cart',
			callback: props.onClick,
			className: props.isEmpty ? '' : 'appBarAction--withBadge',
		},
	];

	return <Actions actions={actions} />;
}

AppBarCart.propTypes = propTypes;
AppBarCart.defaultProps = defaultProps;

export default AppBarCart;

import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Loading from '../Loading';
import Icon from '../icons/Icon';
import { formatWei } from '../../app/utils';

const propTypes = {
	tokenBalance: PropTypes.instanceOf(BigNumber),
	loading: PropTypes.bool,
	onAdd: PropTypes.func,
};
const defaultProps = {
	tokenBalance: null,
	loading: false,
	onAdd: null,
};

function TokensBalance(props) {
	let balance;

	if (props.loading) {
		balance = <Loading size="small" />;
	} else {
		balance = <p>{formatWei(props.tokenBalance)} Tokens Available</p>;
	}

	return (
		<div className="shop__balance">
			<div className="shop__balance-current">
				<Icon icon="tokenplay"/>
				{balance}
			</div>
			<button className="btn btn-sm btn-yellow btn-bold" onClick={props.onAdd}>Add</button>
		</div>
	);
}

TokensBalance.propTypes = propTypes;
TokensBalance.defaultProps = defaultProps;

export default TokensBalance;

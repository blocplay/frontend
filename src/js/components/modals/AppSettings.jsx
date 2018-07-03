import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import omit from 'lodash/omit';
import Icon from '../icons/Icon';
import User from '../../app/User';
import { formatWei } from '../../app/utils';
import Loading from '../Loading';

const propTypes = {
	user: PropTypes.instanceOf(User),
	loading: PropTypes.bool,
	onAddTokensClick: PropTypes.func,
	onClose: PropTypes.func,
	onLogOut: PropTypes.func,
};

const defaultProps = {
	user: null,
	loading: false,
	onAddTokensClick: null,
	onClose: null,
	onLogOut: null,
};

function AppSettings({ user, loading, ...props }) {
	const modalProps = {
		...omit(props, ['onClose', 'user', 'onAddTokensClick', 'loading']),
		ariaHideApp: false,
		portalClassName: 'modal settingsModal',
		overlayClassName: 'modal__overlay settingsModal__overlay',
		className: 'modal__content settingsModal__content',
		closeTimeoutMS: 200,
	};

	let userBlock = null;
	let tokensBlock = null;
	let loadingBlock = null;

	if (loading) {
		loadingBlock = <Loading size="small"/>;
	}

	if (!loading && user) {
		userBlock = (
			<Fragment>
				<div>{user.displayName}</div>
				<div className="appSettings__user-alias">{user.username}</div>
			</Fragment>
		);

		tokensBlock = (
			<div className="appSettings__balance">
				<div className="shop__balance-current">
					<Icon icon="tokenplay" />
					<p>{formatWei(user.tokenBalance)} Tokens Available</p>
				</div>
				<div>
					<button className="btn btn-sm btn-yellow btn-bold" onClick={props.onAddTokensClick}>
						Add
					</button>
				</div>
			</div>
		);
	}

	return (
		<ReactModal {...modalProps}>
			<div className="appSettings">
				<div className="appSettings__user">
					<div className="appSettings__user-text">
						{loadingBlock}
						{userBlock}
					</div>
					<button onClick={props.onClose}>
						<Icon icon="times" />
					</button>
				</div>
				{tokensBlock}
				<div className="appSettings__item">
					General Settings<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Privacy Settings<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Account Information<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Notifications<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Connect Services<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Accessibility<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Terms & Conditions<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item">
					Info<Icon icon="chevron-right" />
				</div>
				<div className="appSettings__item" onClick={props.onLogOut}>
					Logout
				</div>
			</div>
		</ReactModal>
	);
}

AppSettings.propTypes = propTypes;
AppSettings.defaultProps = defaultProps;

export default AppSettings;

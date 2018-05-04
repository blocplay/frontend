import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import numeral from 'numeral';
import { omit } from 'underscore';
import MockObject from '../../mock/MockObject';
import Icon from '../icons/Icon';

const propTypes = {
	user: PropTypes.instanceOf(MockObject),
	onAddTokensClick: PropTypes.func,
	onClose: PropTypes.func,
};

const defaultProps = {
	user: null,
	onAddTokensClick: null,
	onClose: null,
};

function AppSettings({ user, ...props }) {
	const modalProps = {
		...omit(props, 'onClose', 'user', 'onAddTokensClick'),
		ariaHideApp: false,
		portalClassName: 'modal settingsModal',
		overlayClassName: 'modal__overlay settingsModal__overlay',
		className: 'modal__content settingsModal__content',
		closeTimeoutMS: 200,
	};

	let userBlock = null;
	let tokensBlock = null;

	if (user) {
		userBlock = (
			<div className="appSettings__user">
				<div className="appSettings__user-text">
					<div>{user.displayName}</div>
					<div className="appSettings__user-alias">{user.username}</div>
				</div>
				<button onClick={props.onClose}>
					<Icon icon="times" />
				</button>
			</div>
		);

		tokensBlock = (
			<div className="appSettings__balance">
				<div className="shop__balance-current">
					<Icon icon="tokenplay" />
					<p>{numeral(user.tokenBalance).format('0,0')} Tokens Available</p>
				</div>
				<div>
					<button className="btn btn-sm btn-yellow" onClick={props.onAddTokensClick}>
						Add
					</button>
				</div>
			</div>
		);
	}

	return (
		<ReactModal {...modalProps}>
			<div className="appSettings">
				{userBlock}
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
			</div>
		</ReactModal>
	);
}

AppSettings.propTypes = propTypes;
AppSettings.defaultProps = defaultProps;

export default AppSettings;

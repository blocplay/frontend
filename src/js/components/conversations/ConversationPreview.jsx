import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ConversationInstance from '../../mock/MockObject';
import Avatar from '../user/Avatar';
import MultiAvatars from '../user/MultiAvatars';
import Swipeout from '../Swipeout';
import Icon from '../icons/Icon';

const STATUS_MAX_LENGTH = 30;

@observer
class Conversation extends Component{
	static propTypes = {
		conversation: PropTypes.instanceOf(ConversationInstance).isRequired,
		active: PropTypes.bool,
		onClick: PropTypes.func,
		onFavouriteClick: PropTypes.func,
		onTokenClick: PropTypes.func,
		onDelete: PropTypes.func,
	};

	static defaultProps = {
		active: false,
		onClick: null,
		onFavouriteClick: null,
		onTokenClick: null,
		onDelete: null,
	};

	swipeoutRef = null;

	getTitle() {
		const { conversation } = this.props;

		if (this.isSingleUser()) {
			return conversation.users[0].username;
		}

		return conversation.title;
	}

	getStatus() {
		const { entries } = this.props.conversation.history;

		if (!entries.length) {
			return null;
		}

		const status = entries[entries.length - 1].data.content;

		if (status.length > STATUS_MAX_LENGTH) {
			return `${status.substring(0, STATUS_MAX_LENGTH)} ...`;
		}

		return status;
	}

	getSwipeoutProps() {
		return {
			right: [
				{
					text: <Icon icon="tokenplay"/>,
					onPress: this.handleTokenClick,
					className: 'conversationPreview__action-send',
				},
				{
					text: this.isFavourite() ? <Icon icon="heart-fill"/> : <Icon icon="heart"/>,
					onPress: this.props.onFavouriteClick,
					className: `conversationPreview__action-fav ${this.isFavourite() ? 'conversationPreview__action-fav--active' : ''}`,
				},
				{
					text: <Icon icon="trash-alt"/>,
					onPress: this.props.onDelete,
					className: 'conversationPreview__action-delete',
				},
			],
		};
	}

	/**
	 * Returns true if the conversation is with a single user.
	 * @return {boolean}
	 */
	isSingleUser() {
		const { users } = this.props.conversation;

		return users.length === 1;
	}

	isFavourite() {
		return this.props.conversation.isFavourite;
	}

	handleClick = () => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	handleTokenClick = () => {
		this.swipeoutRef.close();
		if (this.props.onTokenClick) {
			this.props.onTokenClick();
		}
	};

	renderIcon() {
		const { users } = this.props.conversation;

		if (this.isSingleUser()) {
			return <Avatar user={users[0]} />
		}

		return <MultiAvatars users={users} /> ;
	}

	renderFlags() {
		if (!this.isFavourite()) {
			return null;
		}

		return (<div className="conversationPreview__favourite">
			<Icon icon="heart-fill"/>
		</div>)
	}

	render() {
		return (
			<div className={`conversationPreview ${this.props.active ? 'conversationPreview--active' : ''}`}>
				<Swipeout ref={(n) => { this.swipeoutRef = n; }} {...this.getSwipeoutProps()}>
					<div className="conversationPreview__front" onClick={this.handleClick}>
						<div className="conversationPreview__icon">
							{this.renderIcon()}
						</div>
						<div className="conversationPreview__title">
							<div>{this.getTitle()}</div>
							<div className="conversationPreview__status">{this.getStatus()}</div>
						</div>
						<div className="conversationPreview__flags">
							{this.renderFlags()}
						</div>
					</div>
				</Swipeout>
			</div>
		);
	}
}

export default Conversation;

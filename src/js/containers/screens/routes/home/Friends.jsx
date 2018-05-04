import React, { Component as ReactComponent, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Component from '../../../../components/screens/routes/home/Friends';
import currentUser from '../../../../mock/currentUser';
import PanelModal from '../../../../components/modals/PanelModal';
import UI from '../../../../app/UI';
import InvitationsModal from '../../../../components/user/InvitationsModal';
import { getUserById } from '../../../../mock/sampleUsers';
import { getUserStream } from '../../../../mock/live';
import FullModal from '../../../../components/modals/FullModal';
import UserProfileModal from '../../../user/UserProfileModal';

@inject('ui')
@observer
class Friends extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	invitationsModalVisible = false;

	@observable
	friendModalVisible = false;

	@observable
	displayedUser = null;

	componentWillMount() {
		this.didMount = false;
		this.updateFriendModal();
	}

	componentWillReceiveProps(newProps) {
		this.updateFriendModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
	}

	getFlashMessage() {
		const invitations = this.getInvitations();

		if (!invitations.length) {
			return null;
		}

		return `You have ${invitations.length} pending friend requests`;
	}

	updateFriendModal(props = this.props) {
		const id = props.match.params.friend;
		const user = getUserById(id);

		if (!user) {
			this.closeFriendModal();
			return;
		}

		// We "fill" the stream to the mock user (only because of circular dep. in mocks)
		user.stream = getUserStream(user);

		this.displayedUser = user;
		this.openFriendModal();
	}

	getInvitations() {
		return currentUser.invitations;
	}

	closeInvitationsModal() {
		this.invitationsModalVisible = false;
	}

	openInvitationsModal() {
		this.invitationsModalVisible = true;
	}

	handleFlashMessageClick = () => {
		this.openInvitationsModal();
	};

	handleInvitationsModalClose = () => {
		this.closeInvitationsModal();
	};

	closeFriendModal() {
		this.friendModalVisible = false;
	}

	openFriendModal() {
		this.friendModalVisible = true;
	}

	handleFriendModalClose = () => {
		this.props.ui.router.goBack();
	};

	handleAcceptInvitation = (invitation) => {
		currentUser.invitations.remove(invitation);
	};

	handleRefuseInvitation = (invitation) => {
		currentUser.invitations.remove(invitation);
	};

	handleFriendClick = (friend) => {
		this.props.ui.router.goTo(`/dashboard/home/friends/${friend.id}`);
	};

	handleInvitationClick = (invitation) => {
		this.handleFriendClick(invitation.user);
	};

	renderInvitationsModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.invitationsModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleInvitationsModalClose}
			>
				<InvitationsModal
					onBack={this.handleInvitationsModalClose}
					invitations={this.getInvitations()}
					onAcceptInvitation={this.handleAcceptInvitation}
					onRefuseInvitation={this.handleRefuseInvitation}
					onInvitationClick={this.handleInvitationClick}
				/>
			</PanelModal>
		);
	}

	renderFriendModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-1');

		if (!modalLocation || !this.displayedUser) {
			return null;
		}

		return (
			<FullModal
				isOpen={this.friendModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleFriendModalClose}
			>
				<UserProfileModal
					user={this.displayedUser}
					onBack={this.handleFriendModalClose}
				/>
			</FullModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					friends={currentUser.friends}
					flashMessage={this.getFlashMessage()}
					onFlashMessageClick={this.handleFlashMessageClick}
					onFriendClick={this.handleFriendClick}
				/>
				{this.renderInvitationsModal()}
				{this.renderFriendModal()}
			</Fragment>
		);
	}
}

// Injected props
Friends.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Friends;

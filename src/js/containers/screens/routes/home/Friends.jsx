import React, { Component as ReactComponent, Fragment } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Component from '../../../../components/screens/routes/home/Friends';
import PanelModal from '../../../../components/modals/PanelModal';
import UI from '../../../../app/UI';
import InvitationsModal from '../../../../components/user/InvitationsModal';
import FullModal from '../../../../components/modals/FullModal';
import UserProfileModal from '../../../user/UserProfileModal';
import FriendRequestRepository from '../../../../app/Repositories/FriendRequestRepository';
import Authentication from '../../../../app/Authentication';
import SearchModal from '../../../user/SearchModal';
import Config from '../../../../app/Config';

@inject('ui', 'auth', 'friendRequestRepository', 'config')
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
	searchModalVisible = false;

	@observable
	displayedUser = null;

	@observable
	loadingFriends = false;

	/**
	 * User reference, see README.md
	 * @type {User}
	 */
	user;

	componentWillMount() {
		this.didMount = false;
		this.user = this.props.auth.getUser();
		this.loadRequests();
		this.loadFriends();
	}

	componentWillReceiveProps(newProps) {
		this.updateFriendModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
		this.updateFriendModal();
	}

	loadRequests() {
		/** @type {FriendRequestRepository} */
		const repo = this.props.friendRequestRepository;
		// Same attributes as the list, since they will be added there once accepted
		const attributes = this.props.config.get('userAttributes.friendsList');
		// For now, we force a reload (until we have the async update)
		repo.loadAll(attributes, true);
	}

	loadFriends() {
		this.loadingFriends = true;
		const attributes = this.props.config.get('userAttributes.friendsList');
		// For now, we force a reload (until we have the async update)
		this.user.loadFriends(attributes, true)
			.then(() => {
				this.loadingFriends = false;
			});
	}

	getFlashMessage() {
		const invitations = this.getInvitations();

		if (!invitations.length) {
			return null;
		}

		return `${invitations.length} pending friend request${invitations.length > 1 ? 's' : ''}`;
	}

	updateFriendModal(props = this.props) {
		const id = props.match.params.friend;

		if (typeof id !== 'string') {
			this.closeFriendModal();
			return;
		}

		this.displayedUserId = id;
		this.openFriendModal();
	}

	getInvitations() {
		/** @type {FriendRequestRepository} */
		const repo = this.props.friendRequestRepository;
		return repo.getFriendRequests();
	}

	closeInvitationsModal() {
		this.invitationsModalVisible = false;
	}

	closeSearchModal() {
		this.searchModalVisible = false;
	}

	openInvitationsModal() {
		this.invitationsModalVisible = true;
	}

	openSearchModal() {
		this.searchModalVisible = true;
	}

	handleFlashMessageClick = () => {
		this.openInvitationsModal();
	};

	handleSearchClick = () => {
		this.openSearchModal();
	};

	handleInvitationsModalClose = () => {
		this.closeInvitationsModal();
	};

	handleSearchModalClose = () => {
		this.closeSearchModal();
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
		this.props.friendRequestRepository.accept(invitation);
	};

	handleRefuseInvitation = (invitation) => {
		this.props.friendRequestRepository.reject(invitation);
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

	renderSearchModal() {
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
				isOpen={this.searchModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleSearchModalClose}
			>
				<SearchModal
					onBack={this.handleSearchModalClose}
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

		if (!modalLocation || !this.displayedUserId) {
			return null;
		}

		return (
			<FullModal
				isOpen={this.friendModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleFriendModalClose}
			>
				<UserProfileModal
					userId={this.displayedUserId}
					onBack={this.handleFriendModalClose}
				/>
			</FullModal>
		);
	}

	render() {
		return (
			<Fragment>
				<Component
					friends={this.user.getFriends()}
					loadingFriends={this.loadingFriends}
					flashMessage={this.getFlashMessage()}
					onFlashMessageClick={this.handleFlashMessageClick}
					onSearchClick={this.handleSearchClick}
					onFriendClick={this.handleFriendClick}
				/>
				{this.renderInvitationsModal()}
				{this.renderFriendModal()}
				{this.renderSearchModal()}
			</Fragment>
		);
	}
}

// Injected props
Friends.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	friendRequestRepository: PropTypes.instanceOf(FriendRequestRepository).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default Friends;

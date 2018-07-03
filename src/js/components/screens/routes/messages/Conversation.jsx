import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import last from 'lodash/last';
import initial from 'lodash/initial';
import ConversationHistory from '../../../conversations/ConversationHistory';
import MessageInput from '../../../conversations/MessageInput';
import ScrollableView from '../../../ScrollableView';
import Loading from '../../../Loading';
import User from '../../../../app/User';
import ConversationModel from '../../../../app/Conversation';

@observer
class Conversation extends Component {
	static propTypes = {
		conversation: PropTypes.instanceOf(ConversationModel),
		currentUser: PropTypes.instanceOf(User).isRequired,
		usersTyping: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(User)),
		loading: PropTypes.bool,
		typingStopTimeout: PropTypes.number,
		onMessage: PropTypes.func,
		onTypingStarted: PropTypes.func,
		onTypingStopped: PropTypes.func,
	};

	static defaultProps = {
		conversation: null,
		usersTyping: [],
		loading: false,
		typingStopTimeout: undefined,
		onMessage: null,
		onTypingStarted: null,
		onTypingStopped: null,
	};

	/**
	 * To be able to scroll to the end of the list when a new message is added, we keep a reference
	 * to an element completely at the bottom
	 * @type {Element}
	 */
	endOfListRef = null;

	autoScrollDisposer = null;

	/**
	 * Used for the autoscroll
	 * @type {number}
	 */
	latestEventsLength = 0;

	componentDidMount() {
		this.conversationsLoaded = false;
		this.startAutoScroll(this.props.conversation);
	}

	componentWillReceiveProps(newProps) {
		if (this.props.conversation !== newProps.conversation) {
			this.stopAutoScroll();
			this.startAutoScroll(newProps.conversation);
		}
	}

	componentWillUnmount() {
		this.stopAutoScroll();
	}

	stopAutoScroll() {
		this.latestEventsLength = 0;
		if (this.autoScrollDisposer) {
			this.autoScrollDisposer();
		}
	}

	startAutoScroll(conversation) {
		if (!conversation) {
			return;
		}

		this.autoScrollDisposer = autorun(() => {
			const lastLength = this.latestEventsLength;
			this.latestEventsLength = conversation.getLatestEvents().length;
			this.scrollToBottom(lastLength !== 0);
		});
	}

	scrollToBottom(smooth = false) {
		if (this.endOfListRef) {
			window.requestAnimationFrame(() => {
				this.endOfListRef.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
			})
		}
	};

	getParticipants() {
		if (!this.props.conversation) {
			return [];
		}

		return this.props.conversation.users.map(user => <span key={user.id} className="userListInput__user--active">{user.displayName}</span>);
	}

	renderUsersTyping() {
		const users = this.props.usersTyping;
		if (!users.length) {
			return <Fragment />;
		}

		let message = '';
		const names = users.map(user => user.displayName);
		const maxUsers = 3;

		if (users.length === 1) {
			message = `${names[0]} is typing`;
		} else if (users.length <= maxUsers) {
			message = `${initial(names).join(', ')} and ${last(names)} are typing`;
		} else {
			message = `${names.slice(0, 3).join(', ')} and others are typing`;
		}
		
		return <div className="conversationEvent__typing">
			<span>{ message }</span>
			<div className="typing">
				<div className="typing-dot" />
				<div className="typing-dot" />
				<div className="typing-dot" />
			</div>
		</div>;
	}

	renderConversation() {
		let historyContent = null;
		let inputContent = null;

		if (this.props.conversation) {
			historyContent = (
				<ConversationHistory
					key={this.props.conversation.id}
					events={this.props.conversation.getLatestEvents()}
					currentUser={this.props.currentUser}
				/>
			);

			inputContent = (
				<MessageInput
					onMessage={this.props.onMessage}
					onTypingStopped={this.props.onTypingStopped}
					onTypingStarted={this.props.onTypingStarted}
					typingStopTimeout={this.props.typingStopTimeout}
				/>
			);
		}

		return (
			<Fragment>
				<ScrollableView className="conversationHistory__wrapper">
					{historyContent}
					<div ref={(n) => { this.endOfListRef = n; }} />
				</ScrollableView>
				<div className="conversationEvent__typing-wrapper">
					{this.renderUsersTyping()}
				</div>
				<div>
					{inputContent}
				</div>
			</Fragment>
		);
	}

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return (
			<div className="conversation__loading">
				<Loading />
			</div>
		);
	}

	render() {
		return (
			<div className="conversation">
				<div className="conversation__recipients">
					<div className="conversation__recipients-box">To: {this.getParticipants()}</div>
				</div>
				{this.renderLoading()}
				{this.renderConversation()}
			</div>
		);
	}
}

export default Conversation;

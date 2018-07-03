import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import Conversation from '../../containers/conversations/ConversationPreview';
import ConversationModel from '../../app/Conversation';
import Loading from '../Loading';

@observer
class ConversationList extends Component {
	static propTypes = {
		conversations: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(ConversationModel)),
		currentConversation: PropTypes.instanceOf(ConversationModel),
		loading: PropTypes.bool,
		onConversationClick: PropTypes.func,
	};
	static defaultProps = {
		conversations: [],
		currentConversation: null,
		loading: false,
		onConversationClick: null,
	};

	handleConversationClick(conversation) {
		return () => {
			if (this.props.onConversationClick) {
				this.props.onConversationClick(conversation);
			}
		};
	}

	renderConversations() {
		return this.props.conversations.map((conversation) => (
			<div key={conversation.id} className="conversationList__item">
				<Conversation
					conversation={conversation}
					onClick={this.handleConversationClick(conversation)}
					active={conversation === this.props.currentConversation}
				/>
			</div>
		));
	}

	renderLoading() {
		return (
			<div className="conversationList__loading">
				<Loading />
			</div>
		);
	}

	renderEmpty() {
		return (
			<div className="conversationList__empty">You didn't start any conversation yet.</div>
		);
	}

	render() {
		let content;

		if (this.props.loading) {
			content = this.renderLoading();
		} else if (!this.props.conversations.length) {
			content = this.renderEmpty();
		} else {
			content = this.renderConversations();
		}

		return (
			<div className="conversationList">
				{ content }
			</div>
		);
	}
}

export default ConversationList;

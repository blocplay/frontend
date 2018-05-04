import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import MockObject from '../../mock/MockObject';
import Conversation from '../../containers/conversations/ConversationPreview';

@observer
class ConversationList extends Component {
	static propTypes = {
		conversations: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(MockObject)),
		currentConversation: PropTypes.instanceOf(MockObject),
		onConversationClick: PropTypes.func,
	};
	static defaultProps = {
		conversations: [],
		currentConversation: null,
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

	render() {
		return (
			<div className="conversationList">
				{ this.renderConversations() }
			</div>
		);
	}
}

export default ConversationList;

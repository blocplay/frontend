import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import MockObject from '../../mock/MockObject';
import History from '../../mock/ConversationHistory';
import Message from './Message';

@observer
class ConversationHistory extends Component {
	static propTypes = {
		history: PropTypes.instanceOf(History).isRequired,
		currentUser: PropTypes.instanceOf(MockObject).isRequired,
	};

	static defaultProps = {};

	/**
	 * To be able to scroll to the end of the list when a new message is added, we keep a reference
	 * to an element completely at the bottom
	 * @type {Element}
	 */
	endOfListRef = null;

	componentDidMount() {
		this.scrollToBottom(false);
	}

	componentDidUpdate() {
		this.scrollToBottom(true);
	}

	scrollToBottom(smooth = false) {
		this.endOfListRef.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
	};

	renderEmpty() {
		if (this.props.history.entries.length > 0) {
			return null;
		}

		return (
			<div className="conversation__prompt">Start your conversation.</div>
		);
	}

	renderEntries() {
		const entries = [];
		this.props.history.entries.forEach((entry) => {
			if (entry.type !== 'message') {
				// eslint-disable-next-line no-console
				console.warn('non message entry', entry);
				return;
			}

			entries.push((
				<div className="conversationHistory__entry" key={entry.id}>
					<Message entry={entry} isCurrentUser={entry.user === this.props.currentUser} />
				</div>
			));
		});

		return entries;
	}

	render() {
		return (
			<div className="conversationHistory">
				{ this.renderEmpty() }
				{ this.renderEntries() }
				<div ref={(n) => { this.endOfListRef = n; }} />
			</div>
		);
	}
}

export default ConversationHistory;

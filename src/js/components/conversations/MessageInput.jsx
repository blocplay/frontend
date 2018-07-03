import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

const EMOJIS = [
	'😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘',
	'😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣',
	'😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓',
	'😔', '😕', '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧',
	'😨', '😩', '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒',
	'🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿',
	'👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀',
	'😿', '😾',
];

@observer
class MessageInput extends Component {
	static propTypes = {
		typingStopTimeout: PropTypes.number,
		onMessage: PropTypes.func,
		onTypingStarted: PropTypes.func,
		onTypingStopped: PropTypes.func,
	};

	static defaultProps = {
		typingStopTimeout: 2000,
		onMessage: null,
		onTypingStarted: null,
		onTypingStopped: null,
	};

	/**
	 * Value currently in the input
	 * @type {string}
	 */
	@observable
	message = '';

	/**
	 * When true, the emojis selector is opened
	 * @type {boolean}
	 */
	@observable
	emojisSelectorOpened = false;

	/**
	 * Reference to the text input element
	 * @type {Element}
	 */
	inputRef = null;

	typingTimeout = null;

	componentWillUnmount() {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
	}

	clearField() {
		this.message = '';
	}

	handleTyping = () => {
		const alreadyStarted = !!this.typingTimeout;

		if (alreadyStarted) {
			clearTimeout(this.typingTimeout);
		}

		this.typingTimeout = setTimeout(this.handleTypingStopped, this.props.typingStopTimeout);

		if (!alreadyStarted && this.props.onTypingStarted) {
			this.props.onTypingStarted();
		}
	};

	handleTypingStopped = () => {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
		this.typingTimeout = null;
		if (this.props.onTypingStopped) {
			this.props.onTypingStopped();
		}
	};

	handleMessageChange = (event) => {
		this.message = event.target.value;

		// If the message is not empty, we consider the user is typing
		if (this.message.length) {
			this.handleTyping();
		} else {
			this.handleTypingStopped();
		}
	};

	/**
	 * @param {KeyboardEvent} event
	 */
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.handleSubmit();
		}
	};

	handleSubmit = () => {
		const value = this.message.trim();
		this.clearField();
		this.handleTypingStopped();

		if (value && this.props.onMessage) {
			this.props.onMessage(value);
		}
	};

	openEmojisSelector() {
		this.emojisSelectorOpened = true;
	}

	closeEmojisSelector() {
		this.emojisSelectorOpened = false;
	}

	handleEmojisClick = () => {
		if (this.emojisSelectorOpened) {
			this.closeEmojisSelector();
		} else {
			this.openEmojisSelector();
		}
	};

	handleEmojiClicked(emoji) {
		this.message += emoji;
		this.closeEmojisSelector();
		this.inputRef.focus();
		this.handleTyping();
	}

	renderEmojisSelector() {
		const emojiComponents = EMOJIS.map(emoji => (
			<span
				key={emoji}
				className="conversationCompose__emojiItem"
				onClick={() => { this.handleEmojiClicked(emoji) }}
			>{emoji}</span>
		));
		return (
			<div className="conversationCompose__emojisSelector">
				<div className="conversationCompose__emojis">
					{emojiComponents}
				</div>
			</div>
		);
	}

	render() {
		const emojisSelector = this.renderEmojisSelector();

		return (
			<div className="conversationCompose" >
				{this.emojisSelectorOpened ? emojisSelector : null}
				<Icon icon="smile" onClick={this.handleEmojisClick}/>
				<input
					ref={(n) => { this.inputRef = n; }}
					value={this.message}
					placeholder="Write a message..."
					onChange={this.handleMessageChange}
					onKeyPress={this.handleKeyPress}
				/>
				<Icon icon="paper-plane" onClick={this.handleSubmit}/>
			</div>
		);
	}
}

export default MessageInput;

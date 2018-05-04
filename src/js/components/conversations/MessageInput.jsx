import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

@observer
class MessageInput extends Component {
	static propTypes = {
		onMessage: PropTypes.func,
	};

	static defaultProps = {
		onMessage: null,
	};

	/**
	 * Value currently in the input
	 * @type {string}
	 */
	@observable
	message = '';

	/**
	 * Reference to the text input element
	 * @type {Element}
	 */
	inputRef = null;

	clearAndBlur() {
		this.message = '';
		this.inputRef.blur();
	}

	handleMessageChange = (event) => {
		this.message = event.target.value;
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
		this.clearAndBlur();

		if (value && this.props.onMessage) {
			this.props.onMessage(value);
		}
	};

	render() {
		return (
			<div className="conversationCompose" >
				<Icon icon="paperclip"/>
				<Icon icon="smile"/>
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

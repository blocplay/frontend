import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Search extends Component {
	static propTypes = {
		placeholder: PropTypes.string,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
	};

	static defaultProps = {
		placeholder: 'Search messages...',
		onFocus: null,
		onBlur: null,
	};

	inputRef = null;

	focus() {
		this.inputRef.focus();
	}

	render() {
		return (
			<div>
				<input
					ref={(n) => { this.inputRef = n; }}
					type="search"
					placeholder={this.props.placeholder}
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
				/>
			</div>
		);
	}
}

export default Search;

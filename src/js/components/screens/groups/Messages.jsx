import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import AppBar from '../../../containers/screens/routes/messages/AppBar';
import Search from '../../Search';
import Sidebar from '../../Sidebar';
import ScrollableView from '../../ScrollableView';

@observer
class Messages extends Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		conversationList: PropTypes.node.isRequired,
	};

	static defaultProps = {
	};

	@observable
	isSearching = false;

	/**
	 * Reference to the Search node
	 * @type {Search}
	 */
	searchRef = null;

	componentWillMount() {
		this.isSearching = false;
	}

	handleSearchFocus = () => {
		this.isSearching = true;
	};

	handleSearchBlur = () => {
		this.isSearching = false;
	};

	handleSearchButtonClick = () => {
		this.searchRef.focus();
	};

	renderList() {
		return (
			<ScrollableView className="screenGroupMessages__latestConversations">
				{this.props.conversationList}
			</ScrollableView>
		);
	}

	renderSearchResults() {
		return (
			<div className="screenGroupMessages__search-prompt">What are you searching for?</div>
		);
	}

	renderContent() {
		if (this.isSearching) {
			return this.renderSearchResults();
		}

		return this.renderList();
	}

	render() {
		return (
			<div className="screenGroupMessages">
				<AppBar onSearchClick={this.handleSearchButtonClick} />
				<div className="screenGroupMessages__content">
					<div className="screenGroupMessages__sidebar">
						<Sidebar>
							<div className="screenGroupMessages__search">
								<Search
									ref={(n) => { this.searchRef = n; }}
									onFocus={this.handleSearchFocus}
									onBlur={this.handleSearchBlur}
								/>
							</div>
							{this.renderContent()}
						</Sidebar>
					</div>
					<div className="screenGroupMessages__main">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Messages;

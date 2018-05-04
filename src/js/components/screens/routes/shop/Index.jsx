import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'underscore';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import AppBar from '../../../AppBar';
import MockObject from '../../../../mock/MockObject';
import ScrollableView from '../../../ScrollableView';
import TeaserList from '../../../shop/TeaserList';
import SectionTabs from '../../../navigation/SectionTabs';
import Actions from '../../../appBar/Actions';
import Icon from '../../../icons/Icon';
import Back from '../../../appBar/Back';
import Teaser from '../../../shop/Teaser';

@observer
class Index extends Component {
	static propTypes = {
		user: PropTypes.instanceOf(MockObject).isRequired,
		currentCategory: PropTypes.object,
		featuredGames: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		latestGames: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		latestContent: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		categories: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		isCartEmpty: PropTypes.bool,
		onTokensAdd: PropTypes.func,
		onGameClick: PropTypes.func,
		onAddGameToCart: PropTypes.func,
		onCartClick: PropTypes.func,
		onCategoryClick: PropTypes.func,
		onBack: PropTypes.func,
	};
	static defaultProps = {
		currentCategory: null,
		featuredGames: [],
		latestGames: [],
		latestContent: [],
		categories: [],
		isCartEmpty: true,
		onTokensAdd: null,
		onGameClick: null,
		onAddGameToCart: null,
		onCartClick: null,
		onCategoryClick: null,
		onBack: null,
	};

	/**
	 * Current visible "Categories" platform tab
	 * @type {null}
	 */
	@observable
	currentCategoryTab = null;

	/**
	 * Element at the top of the scrollable view, so when we change category, we scroll the view to
	 * the top with this element.
	 * @type {Element}
	 */
	scrollableViewTopNode = null;

	componentWillMount() {
		// eslint-disable-next-line prefer-destructuring
		this.currentCategoryTab = this.props.categories[0];
	}

	componentWillReceiveProps(newProps) {
		// Scroll to top when changing category
		if (newProps.currentCategory !== this.props.currentCategory) {
			this.scrollableViewTopNode.scrollIntoView();
		}
	}

	handleCategoryTabClick =(category) => () => {
		this.currentCategoryTab = category;
	};

	renderAppBarLogo() {
		return (
			<div className="shop__logo">
				<Icon icon="tokenplay"/>
				<p  className="shop__logo-text">PLAY Store</p>
			</div>
		);
	}

	getCategoryTabs() {
		return this.props.categories.map(category => ({
			...pick(category, 'id', 'title', 'icon'),
			callback: this.handleCategoryTabClick(category),
			isActive: this.currentCategoryTab === category,
		}));
	}

	handleCategoryClick(category) {
		return () => {
			if (this.props.onCategoryClick) {
				this.props.onCategoryClick(category);
			}
		};
	}

	handleGameClick(game) {
		return () => {
			if (this.props.onGameClick) {
				this.props.onGameClick(game);
			}
		};
	};

	handleAddToCart(game) {
		return () => {
			if (this.props.onAddGameToCart) {
				this.props.onAddGameToCart(game);
			}
		};
	};

	renderPlatformCategories() {
		return this.currentCategoryTab.categories.map(category => (
			<div className="shop__category-item" key={category.id} onClick={this.handleCategoryClick(category)}>
				<p>{category.title}</p>
				<Icon icon="chevron-right"/>
			</div>
		));
	}

	renderAppBarPre() {
		if (!this.props.currentCategory) {
			return null;
		}

		return <Back label="Back" onClick={this.props.onBack} />;
	}

	renderAppBarPost() {
		const actions = [
			{
				id: 'cart',
				icon: 'shopping-cart',
				callback: this.props.onCartClick,
				className: this.props.isCartEmpty ? '' : 'appBarAction--withBadge',
			},
		];

		return <Actions actions={actions} />;
	}

	renderSubCategories() {
		return (
			<Fragment>
				<div className="streamList__title ml16">
					<Icon icon="search"/>
					<h2>Categories</h2>
				</div>
				<SectionTabs sectionTabs={this.getCategoryTabs()} />
				<div className="shop__category-list">
					{ this.renderPlatformCategories() }
				</div>
			</Fragment>
		);
	}

	renderSubCategory() {
		const category = this.props.currentCategory;
		const games = category.games.map(game => (
			<div key={game.id} className="shopGame__subCategoryGame">
				<Teaser
					game={game}
					onClick={this.handleGameClick(game)}
					onAddToCart={this.handleAddToCart(game)}
				/>
			</div>
		));

		return (
			<div className="shopGame__subCategory">
				<div className="streamList__title">
					<Icon icon="gamepad" />
					<h2 className="streamList__title-text">{category.title}</h2>
				</div>
				<div className="shopGame__subCategoryGames">
					{games}
				</div>
			</div>
		)
	}

	renderRootCategory() {
		return (
			<Fragment>
				<TeaserList
					games={this.props.featuredGames}
					onlyImage
					onGameClick={this.props.onGameClick}
					onAddToCart={this.props.onAddGameToCart}
				/>
				<div className="streamList__container">
					<TeaserList
						games={this.props.latestGames}
						onGameClick={this.props.onGameClick}
						onAddToCart={this.props.onAddGameToCart}
						icon="video"
						title="Latest Games"
					/>
				</div>
				<div className="streamList__container">
					<TeaserList
						games={this.props.latestContent}
						onGameClick={this.props.onGameClick}
						onAddToCart={this.props.onAddGameToCart}
						icon="video"
						title="Latest Content"
					/>
				</div>
				{this.renderSubCategories()}
			</Fragment>
		);
	}

	renderContent() {
		if (this.props.currentCategory) {
			return this.renderSubCategory();
		}

		return this.renderRootCategory();
	}

	render() {
		return (
			<div className="shop__screen">
				<AppBar
					pre={this.renderAppBarPre()}
					title={this.renderAppBarLogo()}
					post={this.renderAppBarPost()}
				/>
				<div className="shop__search-wrapper">
					<input type="search" placeholder="Search communities..." />
				</div>
				<div className="shop__balance">
					<div className="shop__balance-current">
						<Icon icon="tokenplay"/>
						<p>{this.props.user.tokenBalance.toLocaleString('en-CA')} Tokens Available</p>
					</div>
					<button className="btn btn-sm btn-yellow" onClick={this.props.onTokensAdd}>Add</button>
				</div>
				<ScrollableView>
					<div ref={(n) => { this.scrollableViewTopNode = n; }} />
					{this.renderContent()}
				</ScrollableView>
			</div>
		);
	}
}

export default Index;

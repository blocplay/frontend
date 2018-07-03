import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import AppBar from '../../../AppBar';
import ScrollableView from '../../../ScrollableView';
import TeaserList from '../../../shop/TeaserList';
import SectionTabs from '../../../navigation/SectionTabs';
import Icon from '../../../icons/Icon';
import Back from '../../../appBar/Back';
import TokensBalance from '../../../../containers/shop/TokensBalance';
import AppBarCart from '../../../../containers/shop/AppBarCart';
import Category from '../../../../app/EStore/Category';
import Loading from '../../../Loading';

const platformTabs = {
	pc: {
		id: 'pc',
		icon: 'windows',
		title: 'PC',
	},
	ios: {
		id: 'ios',
		icon: 'apple',
		title: 'iOS',
	},
	android: {
		id: 'android',
		icon: 'android',
		title: 'Android',
	},
};

@observer
class Index extends Component {
	static propTypes = {
		currentCategory: PropTypes.instanceOf(Category),
		loading: PropTypes.bool,
		isFrontPage: PropTypes.bool,
		onGameClick: PropTypes.func,
		onAddGameToCart: PropTypes.func,
		onCartClick: PropTypes.func,
		onCategoryClick: PropTypes.func,
		onBack: PropTypes.func,
		onCartItemAdded: PropTypes.func,
	};
	static defaultProps = {
		currentCategory: null,
		loading: false,
		isFrontPage: true,
		onGameClick: null,
		onAddGameToCart: null,
		onCartClick: null,
		onCategoryClick: null,
		onBack: null,
		onCartItemAdded: null,
	};

	/**
	 * Current visible "Categories" platform tab.
	 * @type {object|null}
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
		this.resetSubCategoryTab(this.props.currentCategory);
	}

	componentWillReceiveProps(newProps) {
		// Scroll to top when changing category and reset the selected category tab
		if (newProps.currentCategory !== this.props.currentCategory) {
			this.scrollableViewTopNode.scrollIntoView();
			this.resetSubCategoryTab(newProps.currentCategory);
		}
	}

	/**
	 * @param {Category} category
	 */
	resetSubCategoryTab(category) {
		if (!category || category.platformCategories.length === 0) {
			this.currentCategoryTab = null;
		} else {
			this.currentCategoryTab = category.platformCategories[0];
		}
	}

	handleCategoryTabClick = (category) => () => {
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
		return this.props.currentCategory.platformCategories.map(platformCategory => ({
			...platformTabs[platformCategory.platform],
			callback: this.handleCategoryTabClick(platformCategory),
			isActive: this.currentCategoryTab.platform === platformCategory.platform,
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
		if (!this.currentCategoryTab) {
			return null;
		}

		return this.currentCategoryTab.categories.map(category => (
			<div className="shop__category-item" key={category.id} onClick={this.handleCategoryClick(category)}>
				<p>{category.name}</p>
				<Icon icon="chevron-right"/>
			</div>
		));
	}

	renderAppBarPre() {
		if (this.props.isFrontPage) {
			return null;
		}

		return <Back label="Back" onClick={this.props.onBack} />;
	}

	renderSubCategories() {
		const platformCategories = this.props.currentCategory.platformCategories;

		if (!Array.isArray(platformCategories) || !platformCategories.length) {
			return null;
		}

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

	renderSections() {
		return this.props.currentCategory.sections.map(/** @type {CategorySection} */ section => (
			<div className="streamList__container" key={section.id}>
				<TeaserList
					games={section.games}
					onGameClick={this.props.onGameClick}
					onAddToCart={this.props.onAddGameToCart}
					icon="video" // hardcoded for now
					title={section.title}
					display={section.display}
				/>
			</div>
		));
	}

	renderContent() {
		/** @type {Category} */
		const category = this.props.currentCategory;

		if (!category) {
			return null;
		}

		return (
			<Fragment>
				<TeaserList
					games={category.featuredGames}
					onlyImage
					onGameClick={this.props.onGameClick}
					onAddToCart={this.props.onAddGameToCart}
				/>
				{this.renderSections()}
				{this.renderSubCategories()}
			</Fragment>
		);
	}

	renderLoading() {
		if (!this.props.loading) {
			return null;
		}

		return <Loading />;
	}

	render() {
		return (
			<div className="shop__screen">
				<AppBar
					pre={this.renderAppBarPre()}
					title={this.renderAppBarLogo()}
					post={<AppBarCart onClick={this.props.onCartClick} />}
				/>
				<div className="shop__search-wrapper">
					<input type="search" placeholder="Search store..." />
				</div>
				<TokensBalance onCartItemAdded={this.props.onCartItemAdded} />
				<ScrollableView>
					<div ref={(n) => { this.scrollableViewTopNode = n; }} />
					{this.renderLoading()}
					{this.renderContent()}
				</ScrollableView>
			</div>
		);
	}
}

export default Index;

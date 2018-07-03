/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import CategorySection from './CategorySection';

/**
 * @property {string} id
 * @property {string} name
 * @property {Game[]} featuredGames
 * @property {CategorySection[]} sections
 * @property {{platform: string, categories: Category[]}[]} platformCategories
 */
class Category {
	featuredGames = [];
	sections = [];
	platformCategories = [];

	/**
	 * Updates the attributes of the current category with the data object. If cacheNewGames is true,
	 * the game objects it contains will be cached by the GameRepository.
	 *
	 * @param {object} data
	 * @param {bool} cacheNewGames
	 */
	update(data, cacheNewGames) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');

		Object.assign(this, data);

		if (data.featuredGames) {
			this.featuredGames = repo.update(data.featuredGames, cacheNewGames);
		}

		if (data.sections) {
			this.sections = data.sections.map(sectionData => {
				const section = new CategorySection();
				section.update(sectionData, cacheNewGames);
				return section;
			});
		}

		if (data.platformCategories) {
			this.platformCategories = data.platformCategories.map(platformCategoryData => ({
				...platformCategoryData,
				categories: platformCategoryData.categories.map(category => Category.create(category, cacheNewGames)),
			}));
		}
	}

	/**
	 * Creates a Category instance from the data. If cacheGames is true, the game objects will be
	 * cached by the GameRepository.
	 *
	 * @param {object} data
	 * @param {bool} cacheGames
	 * @return {Category}
	 */
	static create(data, cacheGames) {
		const category = new Category();
		category.update(data, cacheGames);
		return category;
	}
}

export default Category;

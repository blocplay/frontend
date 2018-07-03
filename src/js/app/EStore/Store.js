/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import Category from './Category';

class Store {
	/**
	 * Loads from the server the root category. Returns a Promise that resolves with the Category.
	 * Games have the requested game attributes. By default, loaded games will not be cached. Set
	 * cacheNewGames to true if you want to cache the new ones.
	 *
	 * @param {string[]} gameAttributes
	 * @param {bool} cacheNewGames
	 * @return {Promise<Category>}
	 */
	loadFrontPage(gameAttributes, cacheNewGames = false) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getStoreFrontPage(gameAttributes)
			.then((data) => Category.create(data, cacheNewGames));
	}
}

export default Store;

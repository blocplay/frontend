/** @type {IoC} */
import IoC from '@aedart/js-ioc/index';

/**
 * @property {{page: number, hasNext: boolean}} pagination
 * @property {User[]} users
 */
class UserSearchResult {
	/**
	 * @type {User[]}
	 */
	users = [];

	/**
	 * Updates this instance with the serialized `data` object. If `cacheNewUsers` is true, new
	 * users will be cached in the UserRepository.
	 *
	 * @param {object} data
	 * @param {boolean} cacheNewUsers
	 */
	update(data, cacheNewUsers = false) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		Object.assign(this, data);

		if (data.users) {
			this.users = repo.update(data.users, cacheNewUsers);
		}
	}
}

export default UserSearchResult;

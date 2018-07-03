/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import merge from 'lodash/merge';
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { hasAllProperties } from './utils';
import UserGame from './UserGame';
import Cart from './Cart';

/**
 * @property {string} id
 * @property {string} username
 * @property {object} displayName
 * @property {object} avatar
 * @property {string} avatar.url
 * @property {BigNumber} tokenBalance
 * @property {string} language
 * @property {string} motto
 * @property {string} ethereumAddress
 * @property {object} status
 * @property {string} status.code
 * @property {string} status.displayText
 */
class User {
	/**
	 * This user's friends.
	 * @type {ObservableArray<User>}
	 */
	@observable
	friends = [];

	/**
	 * This user's UserGame.
	 * @type {ObservableArray<UserGame>}
	 */
	@observable
	userGames = [];

	// TMP: E3DEMO
	/**
	 * Temporarily for demo only, to circumvent a problem where it could take 10 minutes before a game is added to the userGames list
	 * @type {Array}
	 */
	mockGames = [];
	// END TMP

	/**
	 * True if this user's friends were loaded, else false.
	 * @type {boolean}
	 */
	friendsLoaded = false;

	/**
	 * True if this user's "user games" were loaded, else false.
	 * @type {boolean}
	 */
	userGamesLoaded = false;

	/**
	 * The user's cart
	 * @type {Cart}
	 */
	cart;

	/**
	 * Update the attributes of this User with the supplied data object
	 * @param {Object} data
	 */
	update(data) {
		merge(this, data);
		// Convert the tokenBalance to a number
		if (data.tokenBalance) {
			this.tokenBalance = new BigNumber(data.tokenBalance);
		}
	}

	/**
	 * Fills this user with the specified attributes. If the user doesn't have all the attributes,
	 * the server will be queried for them. Returns a promise that resolves when the user has the
	 * attributes filled.
	 *
	 * @param {string[]} attributes
	 * @param {boolean} forceReload
	 * @return {Promise}
	 */
	fill(attributes, forceReload = false) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');
		return repo.fill([this], attributes, forceReload);
	}

	/**
	 * Returns true if this user has all the specified `attributes`.
	 * @param {string[]} attributes
	 * @return {boolean}
	 */
	hasAttributes(attributes) {
		return hasAllProperties(this, attributes);
	}

	/**
	 * Loads this user's friends from the server and stores them in the `this.friends` array.
	 * Returns a promise that resolves with the list (so resolves with `this.friends`). The user
	 * objects will be filled with the specified `attributes`. If the list of friends is already
	 * loaded, it will be returned unless `forceReload` is true.
	 *
	 * @param {string[]} attributes
	 * @param {boolean} forceReload
	 * @return {Promise<User[]>}
	 */
	loadFriends(attributes, forceReload = false) {
		/** @type {UserRepository} */
		const repo = IoC.make('userRepository');

		if (this.friendsLoaded && !forceReload) {
			return repo.fill(this.friends, attributes);
		}

		this.friendsLoaded = false;

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getFriends(attributes)
			.then(data => {
				this.friendsLoaded = true;
				this.friends.replace(repo.update(data));
				return this.friends;
			});
	}

	/**
	 * Loads this user's "user games" from the server and stores them in the `this.userGames` array.
	 * Returns a promise that resolves with the list (so resolves with `this.userGames`). The game
	 * objects will be filled with the specified `gameAttributes`. If the list of user games is already
	 * loaded, it will be returned unless `forceReload` is true.
	 *
	 * @param {string[]} gameAttributes
	 * @param {boolean} forceReload
	 * @return {Promise<UserGame[]>}
	 */
	loadUserGames(gameAttributes, forceReload = false) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');

		if (this.userGamesLoaded && !forceReload) {
			const games = this.userGames.map(ug => ug.game);
			return repo.fill(games, gameAttributes);
		}

		this.userGamesLoaded = false;
		this.userGames.clear();

		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.getAllUserGames(gameAttributes)
			.then(data => {
				this.userGamesLoaded = true;
				this.replaceUserGames(data);
				return this.userGames;
			});
	}

	/**
	 * Sends friend requests to users. Returns a promise that resolves when the friend requests are
	 * sent.
	 * @param {User[]} users
	 * @return {Promise}
	 */
	inviteUsers(users) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.inviteUsers(users);
	}


	/**
	 * Creates UserGame instances from the serialized objects array and replaces all elements in
	 * `this.userGames` with them.
	 *
	 * @param {object[]} data
	 */
	replaceUserGames(data) {
		// TMP: E3DEMO
		const realGameIds = [];
		// end TMP
		const newUserGames = data.map(userGameData => {
			const userGame = new UserGame();
			userGame.update(userGameData);
			// TMP: E3DEMO
			realGameIds.push(userGame.game.id);
			// end TMP
			return userGame;
		});
		// TMP: E3DEMO
		// Temporarily, we merge mockGames in the userGames
		this.mockGames.forEach((mockGame, index) => {
			if (realGameIds.indexOf(mockGame.id) === -1) {
				const userGame = new UserGame();
				userGame.id = `mockUserGame_${index}`;
				userGame.game = mockGame;
				newUserGames.push(userGame);
			}
		});
		// End TMP
		this.userGames.replace(newUserGames);
	}

	/**
	 * Adds a friend or a list of friends to the list of loaded friends. Does not call call the
	 * server. Returns true if `friends` is a single user and it was not already a friend. Else
	 * returns false.
	 *
	 * @param {User|User[]} friends
	 * @return {boolean}
	 */
	addFriends(friends) {
		if (Array.isArray(friends)) {
			friends.forEach(friend => { this.addFriends(friend) });
			return false;
		}

		if (this.friends.indexOf(friends) === -1) {
			this.friends.push(friends);
			return true;
		}

		return false;
	}

	/**
	 * Removes a friend or a list of friends from the list of loaded friends. Does not call the
	 * server.
	 * @param {User|User[]} friends
	 */
	removeFriends(friends) {
		if (Array.isArray(friends)) {
			friends.forEach(friend => { this.removeFriends(friend) });
		}

		this.friends.remove(friends);
	}

	/**
	 * Returns a reference to the observable friends list. This array can be used before the friends
	 * list is loaded (will be empty). It is observable and will be filled once we load the user's
	 * friends.
	 *
	 * @return {ObservableArray<User>}
	 */
	getFriends() {
		return this.friends;
	}

	/**
	 * @return {Cart}
	 */
	getCart() {
		if (!this.cart) {
			this.cart = new Cart();
		}

		return this.cart;
	}

	/**
	 * Returns true if this user is online
	 * @return {boolean}
	 */
	isOnline() {
		return get(this, 'status.code', 'offline') === 'online';
	}
}

export default User;

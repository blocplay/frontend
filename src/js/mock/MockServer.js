/* eslint-disable no-unused-vars,prefer-rest-params */
import pick from 'lodash/pick';
import remove from 'lodash/remove';
/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import differenceBy from 'lodash/differenceBy';
import AbstractServer from '../app/Server/AbstractServer';
import ServerError from '../app/Server/ServerError';

/**
 * Server class that returns hardcoded responses. The class accepts an object describing the
 * hardcoded data.
 */
class MockServer extends AbstractServer {
	data = {};
	/**
	 * Delay, in milliseconds, for each request to resolve
	 * @type {number}
	 */
	delay = 0;
	/**
	 * True if logging is enabled
	 * @type {boolean}
	 */
	loggingEnabled = true;

	/**
	 * True to simulate the user logged in, else false
	 * @type {boolean}
	 */
	loggedIn = false;

	constructor(data) {
		super();
		this.data = data;
	}

	login(username, password, userAttributes) {
		this.info('login', ...arguments);
		return this.resolve({
			token: 'token-here',
			user: this.getObjectAttributes(this.data.currentUser, userAttributes),
		});
	}

	logout() {
		this.info('logout', ...arguments);
		const res = this.resolve(null, false);
		res.then(() => { this.loggedIn = false });
		return res;
	}

	signup(email, password, dateOfBirth) {
		this.info('signup', ...arguments);
		const user = {...this.data.currentUser};
		user.id = `nu_${this.data.users.length}`;
		user.username = email;
		this.data.users.push(user);

		const res = this.resolve(null, false);
		res.then(() => { this.loggedIn = true });
		return res;
	}

	getAuthenticatedUser(attributes) {
		this.info('getAuthenticatedUser', ...arguments);
		const res = this.resolve(this.getObjectAttributes(this.data.currentUser, attributes), false);
		res.then(() => { this.loggedIn = true });
		return res;
	}

	getUsers(ids, attributes) {
		this.info('getUsers', ...arguments);
		const found = this.data.users
			.filter(user => ids.indexOf(user.id) !== -1);

		return this.resolve(this.getObjectsAttributes(found, attributes));
	}

	getAllConversations(userAttributes) {
		this.info('getAllConversations', ...arguments);

		// Build the list of conversations with user having only the requested attributes
		const conversations = this.data.conversations.map(conversation => {
			const users = conversation.users.map(user => this.getObjectAttributes(user, userAttributes));
			return {
				...conversation,
				users,
				latestEvents: [],
			};
		});

		return this.resolve(conversations);
	}

	getConversation(id, userAttributes) {
		this.info('getConversation', ...arguments);
		const found = this.data.conversations.find(c => c.id === id);

		if (found) {
			found.users = this.getObjectsAttributes(found.users, userAttributes);
			return this.resolve(found);
		}

		return this.reject(new ServerError(ServerError.NOT_FOUND));
	}

	deleteConversation(idOrConversation) {
		this.info('deleteConversation', ...arguments);
		// We do not remove it from this.data.conversations, because we don't need to do it for now,
		// but it could be implemented if needed.
		return this.resolve();
	}

	createConversation(users, title, userAttributes) {
		this.info('createConversation', ...arguments);

		// Find if a conversation already exists with the specified users
		let conversation = this.data.conversations.find(c => {
			if (c.users.length !== users.length) {
				return false;
			}

			return differenceBy(c.users, users, 'id').length === 0;
		});

		// Else, create a new one
		if (!conversation) {
			conversation = {
				id: `m_c_${this.data.conversations.length + 1}`,
				title: title || null,
				creationDate: Math.round((new Date()).getTime() / 1000),
				isFavorite: false,
				latestEvents: [],
				latestMessage: null,
			};

			this.data.conversations.unshift(conversation);
		}

		conversation.users = this.getObjectsAttributes(users, userAttributes);

		return this.resolve(conversation);
	}

	getFriends(attributes) {
		this.info('getFriends', ...arguments);
		const friends = this.data.friends.map(friend => this.getObjectAttributes(friend, attributes));
		return this.resolve(friends);
	}

	getFriendRequests(userAttributes) {
		this.info('getFriendRequests', ...arguments);
		const requests = this.data.friendRequests.map(request => ({
			...request,
			user: this.getObjectAttributes(request.user, userAttributes),
		}));
		return this.resolve(requests);
	}

	approveFriendRequests(requests) {
		this.info('approveFriendRequests', ...arguments);
		return this.doApproveRequests(requests);
	}

	rejectFriendRequests(requests) {
		this.info('rejectFriendRequests', ...arguments);
		return this.doApproveRequests(requests);
	}

	getAllUserGames(gameAttributes) {
		this.info('getAllUserGames', ...arguments);
		const userGames = this.data.userGames.map(data => ({
			...data,
			game: this.getObjectAttributes(data.game, gameAttributes),
		}));
		return this.resolve(userGames);
	}

	getGames(ids, attributes) {
		this.info('getGames', ...arguments);
		const found = this.data.games
			.filter(game => ids.indexOf(game.id) !== -1);

		return this.resolve(this.getObjectsAttributes(found, attributes));
	}

	getCart(gameAttributes) {
		this.info('getCart', ...arguments);
		const cart = {
			...this.data.cart,
			items: this.data.cart.items.map(cartItem => {
				if (cartItem.type !== 'game') {
					return cartItem;
				}

				return {
					...cartItem,
					game: this.getObjectAttributes(cartItem.game, gameAttributes),
				};
			}),
		};
		return this.resolve(cart);
	}

	addCartItem(item) {
		this.info('addCartItem', ...arguments);
		const newItem = item.serialize();
		newItem.id = `nci_${this.data.cart.items.length}`;
		this.data.cart.items.push(newItem);
		return this.resolve({ id: newItem.id });
	}

	removeCartItem(item) {
		this.info('removeCartItem', ...arguments);
		remove(this.data.cart.items, (data => data.id === item.id));
		return this.resolve(null);
	}

	buyCartItems(items, billing, paymentCard) {
		this.info('buyCartItems', ...arguments);
		this.data.cart.items = [];
		return this.resolve(null);
	}

	getStoreFrontPage(gameAttributes) {
		this.info('getStoreFrontPage', ...arguments);
		return this.resolve(this.data.storeRootCategory);
	}

	searchUsers(query, userAttributes, page = 1) {
		this.info('searchUsers', ...arguments);
		const users = query === 'none' ? [] : this.data.users.filter(user => user !== this.data.currentUser);
		return this.resolve({
			pagination: {
				page,
				hasNext: false,
			},
			users: this.getObjectsAttributes(users, userAttributes),
		});
	}

	inviteUsers(users) {
		this.info('inviteUsers', ...arguments);
		return this.resolve(null);
	}

	/**
	 * @param {FriendRequest[]} requests
	 */
	doApproveRequests(requests) {
		const ids = requests.map(r => r.id);
		this.data.friendRequests = this.data.friendRequests.filter(r => ids.indexOf(r.id) === -1);
		return this.resolve(null);
	}

	/**
	 * Returns only the requested attributes of an object. If `idAttribute` is set, the field will be added to the list of attributes
	 * @param {object} object
	 * @param {string[]} attributes
	 * @param {string} idAttribute
	 * @return {object}
	 */
	getObjectAttributes(object, attributes, idAttribute = 'id') {
		const pickAttributes = idAttribute ? [...attributes, idAttribute] : attributes;
		return pick(object, pickAttributes);
	}

	/**
	 * Like getObjectAttributes but for multiple objects.
	 * @param {object[]} objects
	 * @param {string[]} attributes
	 * @param {string} idAttribute
	 * @return {object[]}
	 */
	getObjectsAttributes(objects, attributes, idAttribute = 'id') {
		return objects.map(o => this.getObjectAttributes(o, attributes, idAttribute));
	}

	/**
	 * @param {*} data
	 * @param {boolean} authenticated If true and `this.loggedIn` is false, rejects with an authentication error.
	 * @return {Promise}
	 */
	resolve(data = null, authenticated = true) {
		if (authenticated && !this.loggedIn) {
			return this.rejectAuthentication();
		}

		if (this.delay === 0) {
			return Promise.resolve(data);
		}

		return new Promise(resolve => {
			setTimeout(() => { resolve(data) }, this.delay);
		});
	}

	/**
	 * Rejects with an authentication error (INVALID_TOKEN) and invalidates the authenticated
	 * session.
	 * @return {Promise}
	 */
	rejectAuthentication() {
		const auth = IoC.make('auth');
		return this.reject(new ServerError(ServerError.INVALID_TOKEN, 'You are not authenticated.'))
			.catch((e) => {
				if (e.is(ServerError.INVALID_TOKEN)) {
					auth.invalidate();
				}
				return Promise.reject(e);
			});
	}

	/**
	 * @param {*} data
	 * @return {Promise}
	 */
	reject(data = null) {
		if (this.delay === 0) {
			return Promise.reject(data);
		}

		return new Promise((resolve, reject) => {
			setTimeout(() => { reject(data) }, this.delay);
		});
	}

	info(type, ...data) {
		if (this.loggingEnabled) {
			// eslint-disable-next-line no-console
			console.debug(`Mock Server: ${type}`, ...data);
		}
	}
}

export default MockServer;

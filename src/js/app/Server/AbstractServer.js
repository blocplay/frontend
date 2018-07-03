/* eslint-disable no-unused-vars */

/**
 * Abstract server class.
 * @abstract
 */
class AbstractServer {
	/**
	 * Called by the application when it is loading. Allows this instance to load any locally saved
	 * data before the first requests (like loading a locally saved authentication token). Returns a
	 * promise that resolves once loaded.
	 *
	 * @return {Promise}
	 */
	load() {
		return Promise.resolve();
	}

	/**
	 * Tries to login a user to the server with the specified username and password. Returns a
	 * promise that resolves with an object containing the serialized user object in its `user`
	 * attribute (the user that logged in), else rejects with an error. `attributes` is a list of
	 * requested user attributes for the serialized user object.
	 *
	 * @param {string} username
	 * @param {string} password
	 * @param {string[]} userAttributes
	 * @return {Promise<object>}
	 */
	login(username, password, userAttributes) { }

	/**
	 * Logs out the currently connected user. Returns a promise that resolves once the user is
	 * logged out.
	 *
	 * @return {Promise}
	 */
	logout() { }

	/**
	 * Signs up (creates) and new user. Returns a promise that resolves once the user is created.
	 * The created user will not be returned. Log in to retrieve it.
	 *
	 * @param {string} email
	 * @param {string} password
	 * @param {string} dateOfBirth Of format YYYY-MM-DD
	 * @return {Promise<Object>}
	 */
	signup(email, password, dateOfBirth) { }

	/**
	 * Returns a promise resolving with the currently authenticated user filled with the specified
	 * user attributes
	 *
	 * @param {string[]} attributes
	 * @return {Promise<object>}
	 */
	getAuthenticatedUser(attributes) { }

	/**
	 * Returns a promise resolving with a list of user objects corresponding to the specified `ids`. The
	 * user objects will have the requested `attributes`.
	 *
	 * @param {string[]} ids
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getUsers(ids, attributes) { }

	/**
	 * Returns a promise resolving with a list of conversation objects representing all the user's
	 * conversation. Each conversation object has a list of user objects which have the attributes
	 * specified by `userAttributes`.
	 *
	 * @param {string[]} userAttributes
	 * @return {Promise<object[]>}
	 */
	getAllConversations(userAttributes) { }

	/**
	 * Returns a promise that resolves with the details of the conversation with the `id` (includes
	 * the `latestEvents`). The user objects will be filled with the requested attributes. Note that events (in `latestEvents`) that have users contain only the user id.
	 *
	 * @param {number} id
	 * @param {string[]} userAttributes
	 * @return {Promise<object>}
	 */
	getConversation(id, userAttributes) { }

	/**
	 * Deletes a conversation. Returns a Promise that resolves when successfully deleted
	 *
	 * @param {number|Conversation} idOrConversation The id or conversation instance to delete
	 * @return {Promise}
	 */
	deleteConversation(idOrConversation) { }

	/**
	 * Creates a new conversation with the specified users and title. Returns a Promise that
	 * resolves with the created conversation object. The `users` property of the object will be
	 * filled with the specified `userAttributes`
	 *
	 * @param {User[]} users
	 * @param {string} title Optional (set to false to ignore)
	 * @param {string[]} userAttributes
	 */
	createConversation(users, title, userAttributes) { }

	/**
	 * Returns a promise that resolves with a list of this user's friends. Each element is a user
	 * object with the requested `attributes`.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getFriends(attributes) { }

	/**
	 * Returns a promise that resolves with a list of this user's pending friend requests. Each user
	 * object has the requested `attributes`.
	 *
	 * @param {string[]} userAttributes
	 * @return {Promise<object[]>}
	 */
	getFriendRequests(userAttributes) { }

	/**
	 * Approves all the specified friend requests. Returns a promise that resolves once all requests
	 * are approved.
	 *
	 * @param {FriendRequest[]} requests
	 * @return {Promise}
	 */
	approveFriendRequests(requests) { }

	/**
	 * Rejects all the specified friend requests. Returns a promise that resolves once all requests
	 * are rejected.
	 *
	 * @param {FriendRequest[]} requests
	 * @return {Promise}
	 */
	rejectFriendRequests(requests) { }

	/**
	 * Returns a promise that resolves with all of this user's "user games" (objects containing a
	 * game object and user related data about the game). The game objects have the requested
	 * `gameAttributes`.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise<object[]>}
	 */
	getAllUserGames(gameAttributes) { }

	/**
	 * Returns a promise resolving with a list of game objects corresponding to the specified `ids`. The
	 * game objects will have the requested `attributes`.
	 *
	 * @param {string[]} ids
	 * @param {string[]} attributes
	 * @return {Promise<object[]>}
	 */
	getGames(ids, attributes) { }

	/**
	 * Returns a promise that resolves with the current user's cart data. Each game objects in the
	 * items are filled with the specified attributes.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise<object>}
	 */
	getCart(gameAttributes) { }

	/**
	 * Adds the specified item to the cart. Returns a promise that resolves with a partial cart item
	 * object (the created id).
	 *
	 * @param {AbstractCartItem} item
	 * @return {Promise<object>}
	 */
	addCartItem(item) { }

	/**
	 * Removes the specified item from the cart. Returns a promise that resolves when the item is
	 * removed.
	 *
	 * @param {AbstractCartItem} item
	 * @return {Promise}
	 */
	removeCartItem(item) { }

	/**
	 * Buys the specified items. Will remove the items from the cart. Returns a promise when
	 * successful.
	 *
	 * @param {AbstractCartItem[]} items
	 * @param {object} billing
	 * @param {object} paymentCard
	 * @return {Promise}
	 */
	buyCartItems(items, billing, paymentCard) { }

	/**
	 * Returns a promise that resolves with the root category object of the store. Game objects have
	 * the requested attributes.
	 *
	 * @param {string[]} gameAttributes
	 * @return {Promise<object>}
	 */
	getStoreFrontPage(gameAttributes) { }

	/**
	 * Searches the users with the `query`. Returns the paginated result set of page `page`.
	 * Returned users are filled with the `userAttributes`. Returns a promise that resolves with a
	 * search result object.
	 *
	 * @param {string} query
	 * @param {string[]} userAttributes
	 * @param {number} page
	 */
	searchUsers(query, userAttributes, page = 1) { }

	/**
	 * Sends a friend requests to the specified users.
	 * @param {User[]} users
	 */
	inviteUsers(users) { }
}

export default AbstractServer;


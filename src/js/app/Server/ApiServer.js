/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import get from 'lodash/get';
import Cookies from 'js-cookie';
import AbstractServer from './AbstractServer';
import ServerError from './ServerError';
import Conversation from '../Conversation';

/**
 * Server class that uses the API.
 */
class ApiServer extends AbstractServer {
	static COOKIE_NAME = 'auth';

	/**
	 * Authentication token received when logging in and that must be sent with all protected
	 * requests.
	 * @type {string|null}
	 */
	authToken = null;
	/**
	 * User name used for authentication
	 * @type {string|null}
	 */
	authUsername = null;

	/**
	 * @inheritDoc
	 */
	load() {
		const data = Cookies.get(ApiServer.COOKIE_NAME);

		if (data) {
			[this.authUsername, this.authToken] = data.split(':');
		}

		return Promise.resolve();
	}

	/**
	 * Saves in a cookie the current authentication info. Only if the server.api.saveAuthentication
	 * config is true.
	 */
	updateAuthenticationCookie() {
		const config = IoC.make('config');
		if (config.get('server.api.saveAuthentication', false)) {
			const data = `${this.authUsername}:${this.authToken}`;
			Cookies.set(ApiServer.COOKIE_NAME, data);
		}
	}

	/**
	 * Removes the cookie with the authentication info.
	 */
	clearAuthenticationCookie() {
		Cookies.remove(ApiServer.COOKIE_NAME);
	}

	/**
	 * @inheritDoc
	 */
	getAuthenticatedUser(attributes) {
		return this.request('/users.me', { attributes });
	}

	/**
	 * @inheritDoc
	 */
	login(username, password, userAttributes) {
		this.clearAuthData();
		const augmentedUserAttributes = this.augmentUserAttributesForLogin(userAttributes);

		return this.request('/auth.login', {
			userAttributes: augmentedUserAttributes,
			username,
			password,
		}, false)
			.then(result => {
				this.processLoginResult(result);
				return result;
			});
	}

	/**
	 * @inheritDoc
	 */
	logout() {
		const res = this.request('/auth.logout');
		this.clearAuthData(); // Must be after the request
		return res;
	}

	/**
	 * @inheritDoc
	 */
	signup(email, password, dateOfBirth) {
		this.clearAuthData();
		return this.request('/users.signup', { email, password, dateOfBirth }, false);
	}

	/**
	 * @inheritDoc
	 */
	getUsers(ids, attributes) {
		return this.request(`/users.get/${ids.join(',')}`, { attributes });
	}

	/**
	 * @inheritDoc
	 */
	getAllConversations(userAttributes) {
		return this.request('/conversations.getAll', { userAttributes });
	}

	/**
	 * @inheritDoc
	 */
	getConversation(id, userAttributes) {
		return this.request(`/conversations.get/${id}`, { userAttributes });
	}

	/**
	 * @inheritDoc
	 */
	deleteConversation(idOrConversation) {
		const id = idOrConversation instanceof Conversation ? idOrConversation.id : idOrConversation;
		return this.request(`/conversations.delete/${id}`);
	}

	/**
	 * @inheritDoc
	 */
	createConversation(users, rawTitle, userAttributes) {
		const title = typeof rawTitle === 'string' ? rawTitle : '';
		const userIds = users.map(user => user.id);
		return this.request('/conversations.create', { userIds, title, userAttributes });
	}

	/**
	 * @inheritDoc
	 */
	getFriends(attributes) {
		return this.request('/friends.getAll', { attributes });
	}

	/**
	 * @inheritDoc
	 */
	getFriendRequests(userAttributes) {
		return this.request('/friendRequests.getAll', { userAttributes });
	}

	/**
	 * @inheritDoc
	 */
	approveFriendRequests(requests) {
		const ids = requests.map(r => r.id);
		return this.request(`/friendRequests.approve/${ids.join(',')}`);
	}

	/**
	 * @inheritDoc
	 */
	rejectFriendRequests(requests) {
		const ids = requests.map(r => r.id);
		return this.request(`/friendRequests.reject/${ids.join(',')}`);
	}

	/**
	 * @inheritDoc
	 */
	getAllUserGames(gameAttributes) {
		return this.request('/userGames.getAll', { gameAttributes });
	}

	/**
	 * @inheritDoc
	 */
	getGames(ids, attributes) {
		return this.request(`/games.get/${ids.join(',')}`, { attributes });
	}

	/**
	 * @inheritDoc
	 */
	inviteUsers(users) {
		const ids = users.map(user => user.id);
		return this.request(`/friends.invite/${ids.join(',')}`);
	}

	/**
	 * @inheritDoc
	 */
	getCart(gameAttributes) {
		return this.request('/cart.get', { gameAttributes });
	}

	/**
	 * @inheritDoc
	 */
	addCartItem(item) {
		return this.request('/cart.add', item.serialize());
	}

	/**
	 * @inheritDoc
	 */
	removeCartItem(item) {
		return this.request(`/cart.remove/${item.id}`);
	}

	/**
	 * @inheritDoc
	 */
	buyCartItems(items, billing, paymentCard) {
		const params = {
			items: items.map(item => item.serialize()),
		};

		if (billing) {
			params.billing = billing;
		}

		if (paymentCard) {
			params.paymentCard = paymentCard;
		}

		return this.request('/cart.buy', params);
	}

	/**
	 * @inheritDoc
	 */
	getStoreFrontPage(gameAttributes) {
		return this.request('/store.getFrontPage', { gameAttributes });
	}

	/**
	 * @inheritDoc
	 */
	searchUsers(query, userAttributes, page = 1) {
		return this.request('/users.search', { query, userAttributes, page });
	}

	/**
	 * Makes the actual requests. Will then process the response. Returns a Promise that resolves
	 * with the response's `data` content, or rejects with a ServerError if any kind of error
	 * occurred. By default, the request will send the authentication token. Set `authenticated` to
	 * false for non-protected requests (like the login). Note that if doing an authenticated
	 * request and we do not have the required auth data (username and token), it will reject
	 * immediately, without sending the request to the server.
	 *
	 * @protected
	 * @param {string} path
	 * @param {*} body
	 * @param {boolean} authenticated
	 * @return {Promise<any>}
	 */
	request(path, body = null, authenticated = true) {
		/** @type {Config} */
		const config = IoC.make('config');

		// Reject immediately if we don't have the required authentication data for authenticated
		// requests.
		if (authenticated && !this.canRequestAuthenticated()) {
			const error = new ServerError(ServerError.NOT_AUTHENTICATED, `You must be authenticated to do this request (${path})`);
			this.logError(error);
			return Promise.reject(error);
		}

		const init = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		if (authenticated) {
			this.addAuthenticationHeader(init.headers);
		}

		if (body !== null) {
			init.body = JSON.stringify(body);
		}

		const fullPath = config.get('server.api.baseUrl') + path;

		return fetch(fullPath, init)
			.catch(e => {
				// Network error
				if (e instanceof TypeError) {
					return Promise.reject(new ServerError(ServerError.NETWORK_ERROR, e.message));
				}

				return Promise.reject(e);
			})
			.then(response => this.processResponse(response))
			.then(response => response.json())
			.catch(e => {
				// Invalid JSON
				if (e instanceof SyntaxError) {
					return Promise.reject(new ServerError(ServerError.INVALID_RESPONSE, e.message));
				}

				return Promise.reject(e);
			})
			.then(json => this.processResponseBody(json))
			.then(json => this.getResponseData(json))
			.catch(e => {
				this.logError(e);
				return Promise.reject(e);
			});
	}

	/**
	 * Adds 'username' to the user attributes because we will need to save it after the login. A copy is returned, original array not modified.
	 *
	 * @param {string[]} userAttributes
	 * @return {string[]}
	 */
	augmentUserAttributesForLogin(userAttributes) {
		return userAttributes.indexOf('username') === -1 ? [...userAttributes, 'username'] : [...userAttributes];
	}

	/**
	 * Clears any saved data used for authentication
	 */
	clearAuthData() {
		this.authToken = null;
		this.authUsername = null;
		this.clearAuthenticationCookie();
	}

	/**
	 * Retrieves information from a login response data for future authenticated requests
	 *
	 * @param {object} data
	 */
	processLoginResult(data) {
		this.authUsername = data.user.username;
		this.authToken = data.token;
		this.updateAuthenticationCookie();
	}

	/**
	 * Returns true if we have the required authentication info to do an authenticated request.
	 *
	 * @return {boolean}
	 */
	canRequestAuthenticated() {
		return typeof this.authUsername === 'string' && typeof this.authToken === 'string';
	}

	/**
	 * Adds the Authorization HTTP header built from the authUsername and authToken to the supplied
	 * headers object. Do not call this method if we don't have the authentication data (call
	 * `canRequestAuthenticated()` before)
	 * @param {object} headers
	 */
	addAuthenticationHeader(headers) {
		const key = this.getAuthenticationKey();
		headers.Authorization = `Basic ${key}`;
	}

	/**
	 * Analyses the response object returned by a fetch request. This API always returns a 200
	 * response, even when it wants to return an error. If it is not a 200, it is a server error.
	 * Returns a promise rejecting with an error in case of error, or returns the response object in
	 * case of success.
	 *
	 * @param {Response} response
	 * @return {Promise|Response}
	 */
	processResponse(response) {
		if (!response.ok) {
			const message = `HTTP error code: ${response.status}`;
			return Promise.reject(new ServerError(ServerError.SERVER_ERROR, message));
		}

		return response;
	}

	/**
	 * Analyses the response body to check if it is well formed. If not, throws with an error. If
	 * the response body is an error object, throws an error. If it is an authentication error, logs
	 * out the user. Else, resolves with the same json object.
	 *
	 * @protected
	 * @param {object} json
	 * @return {object}
	 */
	processResponseBody(json) {
		if (typeof json !== 'object' || json === null) {
			throw new ServerError(ServerError.INVALID_RESPONSE, 'Response is not an object');
		}

		const validResult = ['ok', 'error'];

		if (!json.result || validResult.indexOf(json.result) === -1) {
			throw new ServerError(ServerError.INVALID_RESPONSE, 'Missing `result` attribute');
		}

		if (json.result === 'error') {
			/** @type {Authentication} */
			const auth = IoC.make('auth');

			if (get(json, 'error.code') === ServerError.INVALID_TOKEN) {
				auth.invalidate();
			}

			// TMP: for now, the API returns specific authentication error. We check it here
			if (get(json, 'error.description') === 'access_token_not_found') {
				auth.invalidate();
				throw new ServerError(ServerError.INVALID_TOKEN);
			}

			// Also, the server doesn't return for now the error in an expected format. We use the `description` field for the `message`.
			if (json.error) {
				if (!json.error.message) {
					json.error.message = get(json, 'error.description');
				}
				if (!json.error.userMessage) {
					json.error.userMessage = get(json, 'error.description');
				}
			}
			// END TMP

			throw new ServerError(
				get(json, 'error.code', ServerError.UNKNOWN_ERROR),
				get(json, 'error.message'),
				get(json, 'error.userMessage')
			);
		}

		return json;
	}

	/**
	 * Returns the data value of the response, if set, else returns null.
	 *
	 * @protected
	 * @param {object} json
	 * @return {*}
	 */
	getResponseData(json) {
		return Object.prototype.hasOwnProperty.call(json, ['data']) ? json.data : null;
	}

	/**
	 * Logs an error to the console if the config allows it
	 * @param {Error} error
	 */
	logError(error) {
		/** @type {Config} */
		const config = IoC.make('config');

		if (config.get('server.api.logErrors', false)) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	/**
	 * Returns the authentication key to use for basic authentication (base64(username:token)
	 *
	 * @return {string}
	 */
	getAuthenticationKey() {
		return btoa(`${this.authUsername}:${this.authToken}`);
	}
}

export default ApiServer;

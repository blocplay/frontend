/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { observable } from 'mobx';

class Authentication {
	/**
	 * Currently authenticated user. `null` if not authenticated
	 * @type {User|null}
	 */
	user = null;

	/**
	 * Observable property that other classes can watch to know if a user is currently
	 * authenticated.
	 * @type {boolean}
	 */
	@observable
	authenticated = false;

	login(username, password, attributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		/** @type {UserRepository} */
		const userRepo = IoC.make('userRepository');

		this.invalidate();

		return server.login(username, password, attributes)
			.then(data => {
				this.setUser(userRepo.update(data.user));
				return this.user;
			});
	}

	/**
	 * Logs out the user on the server. Returns a promise that resolve or rejects based on the
	 * server response (but in any case, the user will be logged out in the app).
	 *
	 * @return {Promise<any>}
	 */
	logout() {
		this.invalidate();
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		return server.logout();
	}

	/**
	 * Set the user as the authenticated user. Set `authenticated` as true.
	 * @param {User} user
	 */
	setUser(user) {
		this.authenticated = true;
		this.user = user;
	}

	/**
	 * Reloads from the server the currently authenticated user with the specified user attributes.
	 *
	 * @param {string[]} attributes
	 * @return {Promise<User>}
	 */
	reload(attributes) {
		/** @type {AbstractServer} */
		const server = IoC.make('server');
		/** @type {UserRepository} */
		const userRepo = IoC.make('userRepository');

		this.invalidate();

		return server.getAuthenticatedUser(attributes)
			.then(userData => {
				this.setUser(userRepo.update(userData));
				return this.user;
			});
	}

	/**
	 * Invalidates the current connection. Does not logout on the server, logouts internally.
	 * Updates `this.authenticated`.
	 */
	invalidate() {
		this.user = null;
		this.authenticated = false;
	}

	/**
	 * Returns the currently authenticated user
	 * @return {User}
	 */
	getUser() {
		return this.user;
	}

	/**
	 * @return {boolean}
	 */
	isAuthenticated() {
		return this.authenticated;
	}
}

export default Authentication;

import IoC from '@aedart/js-ioc';
import { autorun, observable } from 'mobx';
import Router from './Router';

/**
 * Main class in charge of the UI. When starting, the UI will pass through different states:
 * - STATE_CREATED: the UI is created
 * - STATE_INITIALIZED: after `init()` was successfully called
 * - STATE_LOADING: The UI is currently waiting for all app data to load
 * - STATE_READY: all data was loaded and the main app UI is ready to be displayed
 */
class UI {
	/**
	 * Different state of the
	 */
	static STATE_CREATED = 'created';
	static STATE_INITIALIZED = 'initialized';
	static STATE_LOADING = 'loading';
	static STATE_READY = 'ready';

	/**
	 * @type {Application}
	 */
	application = null;
	/**
	 * Stores that components (containers) can access with @inject(prop)
	 * @type {{}}
	 */
	stores = {};
	/**
	 * @type {Router}
	 */
	router = null;
	/**
	 * Function (handler) that will be called when we want to show the send tokens modal (called by
	 * `showSendTokensModal()`).
	 * @type {sendTokensModalHandlerCb}
	 */
	sendTokensModalHandler = null;
	/**
	 * Function (handler) that will be called when we want to show the settings modal.
	 * @type {appSettingsModalHandlerCb}
	 */
	appSettingsHandler = null;
	/**
	 * Map containing locations where a modal can be attached. Key is the location name and value is
	 * the DOM element. It is an observable Map so modals can be added asynchronously (for cases
	 * when the modal location is set after the modal could have been declared).
	 * @type {Map<string, Element>}
	 */
	@observable
	modalLocations = new Map();
	/**
	 * Current state of the UI
	 * @type {null|string}
	 */
	@observable
	state = UI.STATE_CREATED;

	/**
	 * Internal property to keep the last logged in state of the user. Used to compare to when the
	 * authentication state changes.
	 * @type {boolean}
	 */
	loggedIn = false;

	/**
	 * @param {Application} application
	 */
	constructor(application) {
		this.application = application;
	}

	/**
	 * Init internal properties
	 */
	init() {
		this.router = new Router();

		this.initStores();
		this.router.init();
		this.state = UI.STATE_INITIALIZED;
	}

	/**
	 * Starts the UI
	 */
	start() {
		this.watchAuthentication();
	}

	/**
	 * When the user gets logged out (once the UI is in the 'ready' state), we redirect to the login
	 * screen.
	 */
	watchAuthentication() {
		/** @type {Authentication} */
		const auth = IoC.make('auth');
		autorun(() => {
			if (this.state !== UI.STATE_READY) {
				return;
			}

			if (this.loggedIn && !auth.isAuthenticated()) {
				this.router.goTo('/welcome/login');
			}

			this.loggedIn = auth.isAuthenticated();
		});
	}

	/**
	 * Initializes the store attributes that components will be able to access with @inject
	 */
	initStores() {
		this.stores = {
			ui: this,
			auth: IoC.make('auth'),
			config: IoC.make('config'),
			conversationRepository: IoC.make('conversationRepository'),
			userRepository: IoC.make('userRepository'),
			gameRepository: IoC.make('gameRepository'),
			friendRequestRepository: IoC.make('friendRequestRepository'),
			eStore: IoC.make('eStore'),
		};
	}

	/**
	 * @return {{}}
	 */
	getStores() {
		return this.stores;
	}

	/**
	 * @param {string} location
	 * @param {Element} element
	 */
	registerModalLocation(location, element) {
		this.modalLocations.set(location, element);
	}

	/**
	 * @param {string} location
	 * @return {Element}
	 */
	getModalLocation(location) {
		return this.modalLocations.get(location);
	}

	/**
	 * Since multiple screens use the "send token" modal, a specific method was created to show it
	 * (and reduce code duplication). You can also call the method with the current user. In that
	 * case, the modal component will receive a isCurrentUser=true property.
	 *
	 * The `callback` will receive the amount entered.
	 *
	 * Note that there must be a `MODAL_LOCATION_SEND_TOKENS` modal location defined.
	 *
	 * @param {MockObject} toUser
	 * @param {sendTokensModalCallback} callback
	 */
	showSendTokensModal(toUser, callback = () => {}) {
		this.sendTokensModalHandler(toUser, callback);
	}

	/**
	 * @param {sendTokensModalHandlerCb} handler
	 */
	registerSendTokensModalHandler(handler) {
		this.sendTokensModalHandler = handler;
	}

	showAppSettings() {
		this.appSettingsHandler(true);
	}

	hideAppSettings() {
		this.appSettingsHandler(false);
	}

	/**
	 * @param {appSettingsModalHandlerCb} handler
	 */
	registerAppSettingsHandler(handler) {
		this.appSettingsHandler = handler;
	}

	/**
	 * Calling this function will put the UI in "loading" mode (will set the `state` attribute to
	 * STATE_LOADING). The `loader` parameter is a Promise object representing the loading process.
	 * When it resolves, the `state` is set to STATE_READY.
	 * @param {Promise} loader
	 */
	loading(loader) {
		this.state = UI.STATE_LOADING;
		loader.then(() => { this.state = UI.STATE_READY; });
	}
}

/**
 * @callback sendTokensModalCallback
 * @param {number} amount
 */

/**
 * @callback sendTokensModalHandlerCb
 * @param {MockObject} toUser
 * @param {sendTokensModalCallback} callback
 */

/**
 * @callback appSettingsModalHandlerCb
 * @param {boolean} show
 */

export default UI;

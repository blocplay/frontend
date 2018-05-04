import { observable } from 'mobx';
import Router from './Router';

/**
 * Main class in charge of the UI. Do not mix the responsabilities of the UI class and the App
 * class. The former is responsible for everything related to the visual UI and interaction with the
 * user. The App class has absolutely no knowledge of the UI and is reponsible of data (fetching,
 * user, messaging, ...). The UI has a reference to the App to trigger data updates, but the App
 * does NOT have a reference to the UI.
 */
class UI {
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
	}

	initStores() {
		this.stores.ui = this;
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

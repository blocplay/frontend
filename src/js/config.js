import IoC from '@aedart/js-ioc/index';
import { Socket } from 'phoenix-socket';
import ApiServer from './app/Server/ApiServer';
import Authentication from './app/Authentication';
import UserRepository from './app/Repositories/UserRepository';
import AppLoader from './app/AppLoader';
import ConversationRepository from './app/Repositories/ConversationRepository';
import PhoenixConversationSocketConnector
	from './app/Server/SocketConnector/PhoenixConversationSocketConnector';
import FriendRequestRepository from './app/Repositories/FriendRequestRepository';
import GameRepository from './app/Repositories/GameRepository';
import Store from './app/EStore/Store';

const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * Configuration object shared by all environments. See documentation to redefine some config per environment.
 */
export default {
	server: {
		/**
		 * ApiServer configuration
		 */
		api: {
			// Api URL, without a '/' at the end
			baseUrl: 'https://hidden-fortress-27964.herokuapp.com/api/1.0.0',
			// If true, all server errors will be logged in the console
			logErrors: false,
			// If true, authentication info will be saved locally and reloaded at next startup
			// (allows to automatically relogin the user, else the user must re-authenticate at each
			// startup)
			saveAuthentication: true,
		},
	},

	phoenixSocket: {
		path: 'ws://hidden-fortress-27964.herokuapp.com/socket',
		logEnabled: false,
	},

	auth: {
		user: {
			/**
			 * Base set of attributes to load for the current user (the id will always be returned,
			 * so no need to specify it).
			 */
			baseAttributes: ['username', 'displayName', 'avatar'],
		},
	},

	userGames: {
		// UserGame with a purchase date no older that the following will be flagged as "New"
		newMaxAge: ONE_DAY * 5,
	},

	conversations: {
		// When the user starts typing, it sends a "[User] is typing" event to the other users. When
		// the user stops typing and doesn't send his/her message, the "[User] stopped typing" event
		// will be sent after the following delay (in milliseconds).
		typingStopTimeout: 5000,
	},

	// Centralized list of required game attributes
	gameAttributes: {
		// Home > Games list
		userGames: ['name', 'images.cover', 'package'],
		// When clicking on a game in the user's games list
		preview: ['name', 'images.cover', 'publisher', 'package'],
		cart: ['price', 'name', 'publisher', 'images'],
		store: {
			// Category page
			category: ['name', 'price', 'images', 'platforms'],
			// Game details page
			details: ['price', 'name', 'publisher', 'images', 'medias', 'platforms', 'price', 'rating', 'description', 'tokensEarned'],
		},
	},

	// Centralized list of required game attributes
	userAttributes: {
		// The "Search new friends" user list
		search: ['avatar', 'displayName'],
		conversations: {
			// The "New conversation" screen, listing the friends
			new: ['displayName', 'avatar'],
			// Conversations list
			list: ['displayName', 'avatar'],
		},
		friendsList: ['displayName', 'status', 'avatar'],
		// The user profile modal
		details: {
			user: ['displayName', 'username', 'status', 'avatar', 'tokenBalance', 'language', 'motto'],
			friends: ['avatar'],
		},
		// The app settings sidebar
		appSettings: ['displayName', 'username', 'tokenBalance'],
		profilePreview: {
			currentUser: ['username', 'avatar', 'displayName', 'tokenBalance', 'language', 'motto'],
			otherUser: ['username', 'avatar', 'displayName', 'tokenBalance', 'language', 'motto'],
		},
	},

	/**
	 * Services to register in the service container (IoC). Key is the service name, value is a
	 * service register function which will receive the IoC instance and the service name (same as
	 * key). The `name` attribute received by the function is exactly the key of the object, so you
	 * might wonder why `services` is not an array. It is because with an object, a specific service
	 * register function can be overwritten in `env.dev.js`
	 * @see serviceRegisterFunction below
	 * @type {Object.<string, serviceRegisterFunction>}
	 */
	services: {
		server: (ioc, name) => {
			ioc.singleton(name, () => new ApiServer());
		},
		userRepository: (ioc, name) => {
			ioc.singleton(name, () => new UserRepository());
		},
		gameRepository: (ioc, name) => {
			ioc.singleton(name, () => new GameRepository());
		},
		conversationRepository: (ioc, name) => {
			ioc.singleton(name, () => new ConversationRepository());
		},
		friendRequestRepository: (ioc, name) => {
			ioc.singleton(name, () => new FriendRequestRepository());
		},
		auth: (ioc, name) => {
			ioc.singleton(name, () => new Authentication());
		},
		appLoader: (ioc, name) => {
			ioc.singleton(name, () => new AppLoader());
		},
		conversationSocketConnector: (ioc, name) => {
			ioc.bind(name, (iocInstance, params) => new PhoenixConversationSocketConnector(params.conversation));
		},
		phoenixSocket: (ioc, name) => {
			ioc.singleton(name, (iocInstance) => {
				const config = iocInstance.make('config');
				/** @type {ApiServer} */
				const server = IoC.make('server');
				const logEnabled = config.get('phoenixSocket.logEnabled', false);
				const socket = new Socket(config.get('phoenixSocket.path'), {
					logger: logEnabled
						// eslint-disable-next-line no-console
						? (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
						: null,
					params: {
						token: server.getAuthenticationKey(),
					},
				});

				// If the user logs out and re-logins, the authentication key will have changed, so
				// it must be updated
				socket.onOpen(() => {
					socket.params = { token: server.getAuthenticationKey() }
				});

				return socket;
			});
		},
		eStore: (ioc, name) => {
			ioc.singleton(name, () => new Store());
		},
	},
};

/**
 * @callback serviceRegisterFunction
 * @param {IoC} ioc
 * @param {string} name
 * @see https://github.com/aedart/js-ioc
 */

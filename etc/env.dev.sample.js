import assign from 'lodash/assign';
import base from './env';
// import MockServer from '../src/js/mock/MockServer';
// import mockData from '../src/js/mock/mockData';
// import MockConversationSocketConnector from '../src/js/mock/MockConversationSocketConnector';

// const server = new MockServer(mockData);
// server.delay = 1000; // Delay of the mock server for each request
// server.loggingEnabled = false; // If true, will log the requests in the console

// Code sample: method you can call in the console to log out the user on the mock server
// So the next request will return an authentication error
// window.logoutOnServer = () => {
// 	server.loggedIn = false;
// };

// Code sample: method you can call in the console to immediately log out the user in the app
// window.logoutInApp = () => {
// 	IoC.make('auth').invalidate();
// };

/**
 * Configuration for development environment. Loads the default configuration and overwrites some
 * attributes.
 */
const env = assign({}, base, {
	/*
	config: {
		server: {
			api: {
				baseUrl: 'https://example.com', // Not used in the MockServer
			},
		},
		phoenixSocket: {
			logEnabled: true,
		},
		services: {
			server: (ioc, name) => {
				ioc.singleton(name, () => server);
			},
			conversationSocketConnector: (ioc, name) => {
				ioc.bind(name, (iocInstance, params) => {
					const connector = new MockConversationSocketConnector(params.conversation);
					connector.loggingEnabled = true; // If true, events sent by this client will be logged in the console
					return connector;
				});
			},
		},
	},
	*/
});

export default env;

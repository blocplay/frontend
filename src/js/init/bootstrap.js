import IoC from '@aedart/js-ioc';
import get from 'lodash/get';
import merge from 'lodash/merge';
import Config from '../app/Config';
// See the documentation for the following import
import ENV from '../../../etc/env';
import baseConfigInit from '../config';

function bootstrap() {
	// config object built from default config and ENV.config
	const configInit = merge({}, baseConfigInit, get(ENV, 'config', {}));
	const config = new Config(configInit);
	IoC.singleton('config', () => config);

	// Register all services in the `services` object of the config
	Object.entries(config.get('services', {})).forEach(([key, registerFn]) => {
		registerFn(IoC, key);
	});
}

export default bootstrap;

/**
 * @typedef {Object} IoC
 * @property {function} make
 * @property {function} bind
 * @property {function} singleton
 */

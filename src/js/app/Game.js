import merge from 'lodash/merge';
import BigNumber from 'bignumber.js';
import IoC from '@aedart/js-ioc/index';
import { hasAllProperties } from './utils';

/**
 * @property {{numerator: number, denominator: number, populationSize: number}} rating
 */
class Game {
	/**
	 * Update the attributes of this Game with the supplied data object
	 * @param {Object} data
	 */
	update(data) {
		merge(this, data);
		// The price is a BigNumber
		if (data.price) {
			this.price = new BigNumber(data.price);
		}
	}

	/**
	 * Fills this game with the specified attributes. If the game doesn't have all the attributes,
	 * the server will be queried for them. Returns a promise that resolves when the game has the
	 * attributes filled.
	 *
	 * @param {string[]} attributes
	 * @return {Promise}
	 */
	fill(attributes) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');
		return repo.fill([this], attributes);
	}

	/**
	 * Returns true if this game has all the specified `attributes`.
	 * @param {string[]} attributes
	 * @return {boolean}
	 */
	hasAttributes(attributes) {
		return hasAllProperties(this, attributes);
	}
}

export default Game;

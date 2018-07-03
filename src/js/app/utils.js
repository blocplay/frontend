import has from 'lodash/has';
import numeral from 'numeral';

let counter = 0;

/**
 * Returns true if the `object` has all the properties, else returns false. Each property can be a
 * path like `images.cover` in which case it will check if the object has a `images` object which
 * has a `cover` properties.
 *
 * @param {object} object
 * @param {string[]} properties
 * @return {boolean}
 */
export function hasAllProperties(object, properties) {
	for (let i = 0; i < properties.length; i += 1) {
		if (!has(object, properties[i])) {
			return false;
		}
	}

	return true;
}

/**
 * Returns a unique (for this app) reference number
 * @return {string}
 */
export function generateRef() {
	counter += 1;
	return `${(new Date()).getTime()}_${counter}`;
}

/**
 * Takes a BigNumber instance of Wei amount (1x10^-18 Ether) and formats it as an Ether price
 * @param {BigNumber} amount
 * @return {string}
 */
export function formatWei(amount) {
	const ether = amount.dividedBy(1e18);
	const number = numeral(ether.toString());
	return number.format('0.0[0000]');
}

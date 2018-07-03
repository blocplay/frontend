/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import AbstractCartItem from './AbstractCartItem';

/**
 * @property {'game'} type
 * @property {Game} game
 */
class GameItem extends AbstractCartItem {
	static TYPE = 'game';

	type = GameItem.TYPE;

	/**
	 * @inheritDoc
	 */
	update(data) {
		/** @type {GameRepository} */
		const repo = IoC.make('gameRepository');
		AbstractCartItem.prototype.update.call(this, data);
		this.game = repo.update(data.game);
	}

	/**
	 * @inheritDoc
	 */
	serialize() {
		const serialized = AbstractCartItem.prototype.serialize.call(this);
		serialized.game = {
			id: this.game.id,
			price: this.game.price.toString(),
		};
		return serialized;
	}

	/**
	 * @inheritDoc
	 */
	getPrice() {
		return this.game.price;
	}
}

export default GameItem;

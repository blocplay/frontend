import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import MockObject from '../../mock/MockObject';
import Item from './Item';

@observer
class Summary extends Component {
	static propTypes = {
		items: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(MockObject)),
		total: PropTypes.number,
		showRemove: PropTypes.bool,
		onRemove: PropTypes.func,
	};

	static defaultProps = {
		items: [],
		total: 0,
		showRemove: false,
		onRemove: null,
	};

	handleRemove = (item) => () => {
		if (this.props.onRemove) {
			this.props.onRemove(item);
		}
	};

	renderItems() {
		return this.props.items.map(item => (
			<Item
				key={item.id}
				item={item}
				showRemove={this.props.showRemove}
				onRemove={this.handleRemove(item)}
			/>
		));
	}

	render() {
		return (
			<div className="cart__summary">
				<div className="cart__items">{ this.renderItems() }</div>
				<div className="cart__total">
					<p>
						<span className="cart__total-text">
							Total
						</span>
						<span className="cart__total-number">
							{this.props.total}
						</span>
					</p>
				</div>
			</div>
		);
	}
}

export default Summary;

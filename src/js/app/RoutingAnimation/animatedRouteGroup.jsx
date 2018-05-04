import React, { Component } from 'react';
import { Route as ReactRouterRoute, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Transitioner from './Transitioner';
import Route from '../Routing/Route';

const propTypes = {
	location: PropTypes.object.isRequired,
};

/**
 * Function that renders the routes in Group and animates transitions between them. Use this
 * function in a react-router Route component like so:
 * `<Route component={animatedRouteGroup(new Group(...)} />`
 *
 * @param {Group} group
 * @return {Component}
 */
const animatedRouteGroup = (group) => {
	const childrenElements = group.getChildren().map((child) => {
		// child instanceof Route
		if (child instanceof Route) {
			return (
				<ReactRouterRoute
					key={child.getKey()}
					{...child.getRouterRouteProps()}
				/>
			);
		}

		// child instanceof Group
		const AnimatedRouteGroup = animatedRouteGroup(child);

		return (
			<ReactRouterRoute
				key={child.getKey()}
				path={child.getFullPath()}
				component={AnimatedRouteGroup}
			/>
		);
	});

	return class extends Component {
		static propTypes = propTypes;

		/**
		 * @type {Route}
		 */
		currentRoute = null;
		/**
		 * @type {Route}
		 */
		previousRoute = null;

		componentWillMount() {
			// Since we used a <Switch>, if this component is mounted, we can be sure the location
			// is for a Route in the `group`
			this.currentRoute = group.findMatchingChildren(this.props.location);
			this.setupAnimation(this.currentRoute, null);
		}

		componentWillReceiveProps(newProps) {
			if (newProps.location.pathname !== this.props.location.pathname) {
				// Since we used a <Switch>, if this component is updated, we can be sure the location
				// is for a Route in the `group`
				this.previousRoute = this.currentRoute;
				this.currentRoute = group.findMatchingChildren(newProps.location);
				this.setupAnimation(this.currentRoute, this.previousRoute);
			}
		}

		/**
		 * Will call animation.setup() with the entering and leaving route only if they are not the same and are both part of this group.
		 *
		 * @param {Route|Group} entering
		 * @param {Route|Group} leaving
		 */
		setupAnimation(entering, leaving) {
			// leaving might be null at the first load
			if (leaving) {
				// Do nothing if the entering and leaving are the same, or if they are not part of the current group
				if (entering === leaving || entering.group !== group || leaving.group !== group) {
					return;
				}
			}

			const animation = group.getAnimation();

			if (!animation) {
				return;
			}

			animation.setup({
				entering,
				leaving,
				group,
			});
		}

		render() {
			const GroupComponent = group.getComponent();
			const transitionerNode = (
				<Transitioner
					childKey={this.currentRoute.getKey()}
					animation={group.getAnimation()}
				>
					<Switch location={this.props.location}>
						{childrenElements}
					</Switch>
				</Transitioner>
			);

			if (GroupComponent !== null) {
				return <GroupComponent {...this.props}>{ transitionerNode }</GroupComponent>;
			}

			return transitionerNode;
		}
	};
};

export default animatedRouteGroup;

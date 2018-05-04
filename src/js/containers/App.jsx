import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { Route as ReactRouterRoute, Router, Redirect, Switch } from 'react-router-dom';
import animatedRouteGroup from '../app/RoutingAnimation/animatedRouteGroup';
import baseGroup from '../routes';
import UI from '../app/UI';

const propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

const defaultProps = {};

const RootRoute = animatedRouteGroup(baseGroup);

function App(props) {
	const { ui } = props;

	return (
		<Provider {...ui.getStores()}>
			<Router history={ui.router.getHistory()}>
				<div className="screens">
					<Switch>
						<Redirect from="/" to="/welcome/login" exact/>
						<ReactRouterRoute component={RootRoute}/>
					</Switch>
				</div>
			</Router>
		</Provider>
	);
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;

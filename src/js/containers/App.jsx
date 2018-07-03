import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, Provider } from 'mobx-react';
import { Redirect, Route as ReactRouterRoute, Router, Switch } from 'react-router-dom';
import animatedRouteGroup from '../app/RoutingAnimation/animatedRouteGroup';
import baseGroup from '../routes';
import UI from '../app/UI';
import AppLoading from '../components/screens/AppLoading';

const RootRoute = animatedRouteGroup(baseGroup);

@observer
class App extends Component {
	static propTypes = {
		ui: PropTypes.instanceOf(UI).isRequired,
	};

	static defaultProps = {};

	render() {
		/** @type {UI} */
		const ui = this.props.ui;

		// While the app is loading
		if (ui.state === UI.STATE_LOADING) {
			return <AppLoading />;
		}

		// When the app is in a 'ready' state
		if (ui.state === UI.STATE_READY) {
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

		// In other types of states, we return nothing
		return null;
	}
}

export default App;

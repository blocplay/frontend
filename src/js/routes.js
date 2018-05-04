import Route from './app/Routing/Route';
import Group from './app/Routing/Group';
import OrderBased from './app/RoutingAnimation/Animations/OrderBased';
// Groups components
import Welcome from './components/screens/groups/Welcome';
import Dashboard from './containers/screens/groups/Dashboard';
import Home from './containers/screens/groups/Home';
import Messages from './containers/screens/groups/Messages';
import Live from './containers/screens/groups/Live';
// Routes
import Login from './containers/screens/routes/welcome/Login';
import CreateAccount from './containers/screens/routes/welcome/CreateAccount';

import Games from './containers/screens/routes/home/Games';
import Activities from './components/screens/routes/home/Activities';
import Friends from './containers/screens/routes/home/Friends';
import Communities from './containers/screens/routes/home/Communities';
import Events from './containers/screens/routes/home/Events';
import Trophies from './containers/screens/routes/home/Trophies';
import UserProfile from './containers/user/UserProfileModal';

import MessagesIndex from './components/screens/routes/messages/Index';
import Conversation from './containers/screens/routes/messages/Conversation';
import NewConversation from './containers/screens/routes/messages/New';

import LiveIndex from './containers/screens/routes/live/Index';

import ShopIndex from './containers/screens/routes/shop/Index';

/**
 * Routes of the application. Routes are grouped in Group. A Group can also contain sub groups. A
 * Group has an Animation instance used to animate the transition between routes of the same group.
 * The Animation used is the one of the closest group enclosing the two routes.
 *
 * Example, you have the following structure:
 * group-root
 *   route-1
 *   group-a
 *     route-a1
 *     route-a2
 *   group-b
 *     route-b1
 *     route-b2
 *
 * - If you go from route-a1 to route-a2 (same group), the animation of group-a will be used
 * - If you go from route-a1 to route-b2 (different group), the animation of group-root will be used
 * - If you go from route-a2 to route-1, the animation of group-root will be used.
 *
 * A Group can also have a component. The inner routes will be passed as the `children` property to
 * the component. Use this feature to add a fixed header or footer to all the inner routes, for
 * example.
 *
 * The full path of a route is built from it `path` attribute appended to all its parent group
 * `base`. This is required to correctly determine the hierarchy to the route. So, the `path`
 * attribute of a route is NOT THE ABSOLUTE path to the route (like in React Router) but the
 * relative path to its parent group.
 *
 * Note that for some animations, order of routes is important because the animation is different if
 * we are going to a "higher" or "lower" route. Generally, a route defined after another is
 * considered to be "higher".
 */
export default (new Group())
	.setBase('/')
	.setAnimation(new OrderBased('loginGarageDoor', 2000))
	.setChildren([
		(new Group())
			.setBase('dashboard/')
			// no animation
			.setComponent(Dashboard)
			.setChildren([
				(new Group())
					.setBase('home/')
					.setComponent(Home)
					.setAnimation(new OrderBased('lateralPush', 1000))
					.setChildren([
						new Route({ path: 'games', component: Games }),
						new Route({ path: 'activities', component: Activities }),
						new Route({ path: 'friends/:friend?', component: Friends }),
						new Route({ path: 'communities/:community?', component: Communities }),
						new Route({ path: 'events/:event?', component: Events }),
						new Route({ path: 'trophies/:game?', component: Trophies }),
					]),
				new Route({ path: 'user/:user', component: UserProfile }),
				(new Group())
					.setBase('messages/')
					.setComponent(Messages)
					// no animation
					.setChildren([
						new Route({ path: 'index', component: MessagesIndex }),
						new Route({ path: 'conversation/:id', component: Conversation }),
						new Route({ path: 'new', component: NewConversation }),
					]),
				(new Group())
					.setBase('shop/')
					.setChildren([
						new Route({ path: 'index/:gameId?', component: ShopIndex }),
					]),
				(new Group())
					.setBase('live/')
					.setComponent(Live)
					.setChildren([
						new Route({ path: 'index/:stream?', component: LiveIndex }),
					]),
			]),
		(new Group())
			.setBase('welcome/')
			.setAnimation(new OrderBased('lateralPush', 1000))
			.setComponent(Welcome)
			.setChildren([
				new Route({ path: 'login', component: Login }),
				new Route({ path: 'createAccount', component: CreateAccount }),
			]),
	]);

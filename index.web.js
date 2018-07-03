/* eslint-disable react/jsx-filename-extension,import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
/** @type {IoC} */
import IoC from '@aedart/js-ioc';
import { AppContainer } from 'react-hot-loader';
import bootstrap from './src/js/init/bootstrap';
import AppComponent from './src/js/containers/App';
import Application from './src/js/app/Application';
import UI from './src/js/app/UI';
import DownloadManager from './src/brwc/DownloadManager';

bootstrap();

const application = new Application(new DownloadManager());
const ui = new UI(application);

ui.init();

// Start the loading process of the app (the UI will show a loading screen)
const appLoader = IoC.make('appLoader').load();

ui.start();

// Set the UI in a 'loading' state (it will automatically go in 'ready' state once the `appLoader` resolves).
ui.loading(appLoader);

const render = () => {
	ReactDOM.render(
		<AppContainer>
			<AppComponent ui={ui} />
		</AppContainer>,
		document.getElementById('app'),
	);
};

render();

// Webpack Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./src/js/containers/App', () => {
		render();
	});
}

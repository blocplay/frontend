/* eslint-disable react/jsx-filename-extension,import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppComponent from './src/js/containers/App';
import Application from './src/js/app/Application';
import UI from './src/js/app/UI';

const application = new Application();
const ui = new UI(application);

ui.init();

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

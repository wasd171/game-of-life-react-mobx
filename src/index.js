import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import TapPlugin from 'react-tap-event-plugin'
TapPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme();

import {useStrict} from 'mobx'
import {Provider} from 'mobx-react'
useStrict();
import Store from './store'
const store = new Store();


ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Provider store={store}>
			<App/>
		</Provider>
	</MuiThemeProvider>,
	document.getElementById('root')
);
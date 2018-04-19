import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Organization from './Organization';
import HomeContainer from "../Components/HomeContainer";
import Home from "../Components/Home";
import LandingPage from "../Components/LandingPage";
import API from "../utils/API";
import './app.scss';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => <div><LandingPage />
<MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider></div>
export default App;


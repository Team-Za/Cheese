import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Organization from './Organization';
import HomeContainer from "../Components/HomeContainer";
import Home from "../Components/Home";
import LandingPage from "../Components/LandingPage";
import API from "../utils/API";
import './app.scss';
import {Router} from 'react-router';
import routes from './routes.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => <BrowserRouter><div><LandingPage />
<MuiThemeProvider muiTheme={getMuiTheme()}>
    routes={routes}
  </MuiThemeProvider></div>
  </BrowserRouter>
export default App;


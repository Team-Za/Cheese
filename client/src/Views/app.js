import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Organization from './Organization';
import HomeContainer from "../Components/HomeContainer";
import Home from "../Components/Home";
import LandingPage from "../Components/LandingPage";
import API from "../utils/API";
import './app.scss';
import { browserHistory } from 'react-router';
import routes from './routes.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { red400 } from 'material-ui/styles/colors';



const muiTheme = getMuiTheme({
  palette: {
    textColor: '#000000',
  },
  appBar: {
    height: 50,
  },
});

const App = () => <div>
 <LandingPage />
  <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
    <Router history= {browserHistory} routes={routes}/>
  </MuiThemeProvider>
</div>

export default App;


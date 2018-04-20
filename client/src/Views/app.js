import React from 'react';
import LandingPage from "../Components/LandingPage";
import './app.scss';
import { browserHistory, Router } from 'react-router';
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

const App = () => <div><LandingPage />
 <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
     <Router history={browserHistory} routes={routes} />
   </MuiThemeProvider>
  </div>
export default App;


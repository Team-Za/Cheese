import React from 'react';
import LandingPage from "../Components/LandingPage";
import './app.scss';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';

const App = () => <div><LandingPage />
     <Router history={browserHistory} routes={routes} />
  </div>
export default App;


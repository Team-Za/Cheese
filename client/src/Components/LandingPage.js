import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import API from '../utils/API';
import '../Views/app.scss';
import Navbar from './Navbar';
import DowChart from './DowChart';
import Sp500 from './Sp500Data';
import Dashboard from './Dashboard';
import DashboardSample from './DashboardSample';
import Success from './Success';
import Market from './Market';
import MarketSample from './MarketSample';
import Portfolio from "./Portfolio";
import SignUpForm from './SignUpForm';
import Auth from '../modules/Auth';
import LoginPage from '../containers/LoginPage.jsx';
import SignUpPage from '../containers/SignUpPage.jsx';

class LandingPage extends React.Component {
  state = {
    result: [],
    search: ""
  };


  componentDidMount() {
    //this.searchSymbols("/ref-data/symbols");
  }
  searchSymbols = query => {
    API.allSymbols(query)
      .then(res => {this.setState({ result: res.data }) })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Router>
        <div className="container-fluid">
      {document.getElementById('popupContainer')}
          <Navbar />
          {Auth.isUserAuthenticated() ? (
          <Route exact path="/dashboard" component={Dashboard} />
           ):(
           <Route exact path="/dashboard" component={DashboardSample} />
          )}
          {Auth.isUserAuthenticated() ? (
            <Route exact path="/market" component={Market} />
          ) : (
            <Route exact path="/market" component={MarketSample} />
          )}
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/" render={() => (
            <Fragment>
              <DowChart />
            
            </Fragment>
          )
          } />
        </div>
      </Router>
    );
  }
}

export default LandingPage;
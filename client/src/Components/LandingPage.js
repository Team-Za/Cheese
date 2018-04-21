import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import API from '../utils/API';
import '../Views/app.scss';
import Navbar from './Navbar';
import DowChart from './DowChart';
import Sp500 from './Sp500Data';
import Dashboard from './Dashboard';
import Market from './Market';
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
    this.searchSymbols("/ref-data/symbols");
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
          <Navbar />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/market" component={Market} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/" render={() => (
            <Fragment>
              <DowChart />
              {!Auth.isUserAuthenticated() && 
                <LoginPage />
              }
            </Fragment>
          )
          } />
        </div>
      </Router>
    );
  }
}

export default LandingPage;
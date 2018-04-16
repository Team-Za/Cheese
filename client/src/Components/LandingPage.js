import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import API from '../utils/API';
import '../Views/app.scss';
import Navbar from './Navbar';
import DowChart from './DowChart';
import Sp500 from './Sp500Data';
import Dashboard from './Dashboard';
import Market from './Market';

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
      .then(res => { console.log(res.data); this.setState({ result: res.data }) })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Router>
        <div className="container">
          <Navbar />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/market" component={Market} />
          <DowChart />
        </div>
      </Router>
    );
  }
}

export default LandingPage;
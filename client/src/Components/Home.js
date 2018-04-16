import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import API from '../utils/API';
import '../Views/app.scss';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import Market from './Market';

class Portfolio extends React.Component {
  state = {
    currentPage: "LandingPage"
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  renderPage = () => {
    if (this.state.currentPage === "LandingPage") {
      return <LandingPage />;
    } else if (this.state.currentPage === "Dashboard") {
      return <Dashboard />;
    } else if (this.state.currentPage === "Market") {
      return <Market />;
    } else {
      return <LandingPage />;
    }
  };

  render() {
    return (
        <Router>
      <div>
        <Navbar
          currentPage={this.state.currentPage}
          handlePageChange={this.handlePageChange}
        />
        {this.renderPage()}
      </div>
      </Router>
    );
  }
}

export default Portfolio;

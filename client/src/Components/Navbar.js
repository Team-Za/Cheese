import React from "react";
import { Link, withRouter } from "react-router-dom";
import Auth from '../modules/Auth';
import LoginPage from '../containers/LoginPage.jsx';

const Navbar = ({ children, ...props }) => (
  <div className="row landing-nav">
    {Auth.isUserAuthenticated() ? (
      <div>
        <Link to="/">
          <div className="logo col-md-4">
            Stock Up
            </div>
        </Link>

        <div className="top-menu col-md-8">
          <Link to="/dashboard">
            <div className="top-menu-item" id="dashboard">
              <i className="fas fa-th-large"></i> Dashboard
            </div>
          </Link>

          <Link to="/market">
            <div className="top-menu-item" id="market">
              <i className="fas fa-chart-line"></i> Market
            </div>
          </Link>

          <Link to="/portfolio">
            <div className="top-menu-item" id="portfolio">
              <i className="fas fa-chart-line"></i> Portfolio
            </div>

          </Link>
            <div className="top-menu-item" id="dashboard" onClick={() => {
              Auth.deauthenticateUser();
              props.history.push('/');
            }}>
               Log out
            </div>
        </div>
      </div>
    ) : (
        <div>
          <Link to="/">
            <div className="logo col-md-4">
              Stock Up
                </div>
          </Link>

          <div className="top-menu col-md-8">
            <Link to="/dashboard">
              <div className="top-menu-item" id="dashboard">
                <i className="fas fa-th-large"></i> Dashboard
                </div>
            </Link>

            <Link to="/market">
              <div className="top-menu-item" id="market">
                <i className="fas fa-chart-line"></i> Market
                </div>
            </Link>

            <Link to="/portfolio">
              <div className="top-menu-item" id="portfolio">
                <i className="fas fa-chart-line"></i> Portfolio
                </div>
            </Link>
          </div>

        </div>
      )}

    {children}
  </div>
);

export default withRouter(Navbar);
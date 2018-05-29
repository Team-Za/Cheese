import React from "react";
import { Link, withRouter } from "react-router-dom";
import Auth from '../modules/Auth';
import LoginPage from '../containers/LoginPage.jsx';

const Navbar = ({ children, ...props }) => (
  <div className="row pages-nav">
    {Auth.isUserAuthenticated() ? (
      <div>
          <div className="col-md-4">
        <Link to="/">
          <div className="logo">
            Stock Up
            </div>
        </Link>
        </div>

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

            <div className="top-menu-item" id="dashboard" onClick={() => {
              Auth.deauthenticateUser();
              sessionStorage.removeItem("UserId");
              sessionStorage.removeItem("username")
              props.history.push('/');
            }}>
               Log out
            </div>
        </div>
      </div>
    ) : (
        <div>
            <div className="col-md-4">
          <Link to="/">
            <div className="logo">
              Stock Up
                </div>
          </Link>
          </div>

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

            <Link to="/">
              <div id="log-in">
              <i class="fas fa-bolt"></i> Log In / Sign Up 
                </div>
            </Link>
          </div>

        </div>
      )}

    {children}
  </div>
);

export default withRouter(Navbar);
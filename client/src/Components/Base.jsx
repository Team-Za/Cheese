import React  from 'react';
import { NavLink, Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';

var divStyle = {
  width: '100%'
}


const Base = ({ children }) => (
  <div style={divStyle}>
      {Auth.isUserAuthenticated() ? (
        <div className="top-bar-right">
          <Link to="/logout">Log out</Link>
        </div>
      ) : (
        <div className="form-bar">
          <Link className="log-in" activeClassName='active-tab' to="/login">
          Log in
          </Link>

          <Link className="sign-up" activeClassName='active-tab' to="/signup">
          Sign up
          </Link>
        </div>
      )}

    { /* child component will be rendered here */ }
    {children}

  </div>
);




export default Base;

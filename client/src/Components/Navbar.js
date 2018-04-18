import React from "react";
import { Link } from "react-router-dom";

const Navbar = props => (
  <div className="row landing-nav">
    <Link to="/">
      <div className="logo">
        Stock Up
          </div>
    </Link>

    <div className="top-menu">
      <Link to="/dashboard">
        <div className="top-menu-item" id="dashboard">
          <i class="fas fa-th-large"></i> Dashboard
          </div>
      </Link>

      <Link to="/market">
        <div className="top-menu-item" id="market">
          <i class="fas fa-chart-line"></i> Market
          </div>
      </Link>

      <Link to="/portfolio">
        <div className="top-menu-item" id="portfolio">
          <i class="fas fa-chart-line"></i> Portfolio
          </div>
      </Link>
    </div>
  </div>
);

export default Navbar;
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

class Footer extends React.Component {


    render() {
        return (
            <div>
                <div className="phantom"></div>
                <div className="footer-container row">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 footer-logo footer-component">
                                {/* <img className="logo-icon" src="../../public/white-logo-02.svg" /> */}
                                Stock Up
                            </div>
                            <div className="col-md-4 footer-component footer-title">
                                Explore
                            <div className="footer-links">
                                    <Link className="site-links" to="/dashboard">Dashboard</Link>
                                    <Link className="site-links" to="/market">Market</Link>
                                </div>
                            </div>
                            <div className="col-md-4 footer-component">
                                <a href="mailto:StockUp@example.com"><div className="contact"><i className="far fa-envelope envelope-icon"></i>Contact Us</div></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
export default Footer;
import React, { Fragment } from "react";
import API from "../utils/API";
import Sp500 from './Sp500Data';
import { browserHistory, Router } from 'react-router';
import Auth from '../modules/Auth';
import LoginPage from '../containers/LoginPage.jsx';
import SignUpPage from '../containers/SignUpPage.jsx';
import { NavLink, Link, IndexLink } from 'react-router-dom';
import PortfolioComparison from './PortfolioComparison';

class DowChart extends React.Component {
    state = {
        result: [],
        loading: true,
        formChange: "login",
        activeLogin: "active-tab",
        activeSignup: "",
        previousDow: ""
    };

    componentDidMount() {
        Promise.all ([this.getChartData("/stock/dia/chart/1d"), this.getPreviousDow("DIA")]).then(values => {
            console.log("CMON", values)
            console.log("The Value",values[0]);
            if (values[0] === "" || values[0] === "undefined" || values[0].length < 1) {
                console.log("Come here!")
                this.setState({
                    result: false,
                    previousDow: values[1],
                    loading: false
                })
            } else {
                this.setState({
                    result: values[0],
                    previousDow: values[1],
                    loading: false
                })
            }
        })
    }

    getChartData = query => {
        var data = API.getDow(query)
            .then(res => {
                console.log("Dow Data", res.data[res.data.length - 1]);
                return res.data;
            })
            .catch(err => console.log(err));
            return data;
    };

    checkDowPrice = price => {
        if (price === -1) {
            for (let i = (this.state.result.length - 1); i > -1; i--) {
                if (this.state.result[i].marketHigh !== -1) {
                    return this.state.result[i].marketHigh;
                }
            }
        } else if (price === "undefined") {
            return "No data available";
        } else {
            return price;
        }
    }

    changeForm = formName => {
        this.setState({
            formChange: formName
        })
    }

    changeActiveClasses = whichButton => {
        if (whichButton === "login") {
            this.setState({
                activeLogin: "active-tab",
                activeSignup: ""
            })
        } else {
            this.setState({
                activeLogin: "",
                activeSignup: "active-tab"
            })
        }
    }

    getPreviousDow = symbol => {
        var data = API.previousDay(symbol)
        .then(res => {
            console.log("YELLO", res.data.close);
            return res.data.close;
        })
        .catch(err => console.log(err));
        return data;
    }

    dowComparison = dowChange => {
        var newDow = this.checkDowPrice(this.state.result[this.state.result.length - 1].marketHigh);
        console.log("New",newDow);
        console.log("Old",dowChange)
        if(dowChange < newDow) {
            return <i className="fas fa-arrow-up bounce-up"></i>
        } else if(dowChange > newDow) {
            return <i className="fas fa-arrow-down bounce-down"></i>
        } else {
            <div></div>
        }
    }

    render() {
        console.log("hello", this.state.result[this.state.result.length - 1]);
        return (
            <div className="landing-page-body row">
                <div className="lp-data col-md-6">
                    {this.state.loading ?
                        <div className="dow col-md-12">
                            Dow loading...
                        </div> :
                        <Fragment>
                        {this.state.result === false ?
                            <div className="dow col-md-12">
                            Dow N/A
                            <span className="lp-symbol">(DJI)</span>
                        </div>
                        :
                        <div className="dow col-md-12">
                        Dow {this.checkDowPrice(this.state.result[this.state.result.length - 1].marketHigh)}{this.dowComparison(this.state.previousDow)}
                        <span className="lp-symbol">(DJI)</span>
                            </div>
                        }
                        </Fragment>
                        }

                    <Sp500 />
                </div>


                <div className="sign-up">
                    {!Auth.isUserAuthenticated() ?
                        <Fragment>
                            <div className="form-bar col-md-12">
                                <div className={`tab-login-btn ${this.state.activeLogin}`} onClick={() => { this.changeForm("login"); this.changeActiveClasses("login") }}>Log in</div>

                                <div className={`tab-signup-btn ${this.state.activeSignup}`} onClick={() => { this.changeForm("signup"); this.changeActiveClasses("signup") }}>Sign up</div>
                            </div>
                            {this.state.formChange === "login" ?
                                <LoginPage />

                                : this.state.formChange === "signup" ?
                                    <SignUpPage />
                                    : <div> No Form</div>
                            }
                        </Fragment>
                        : <div className="comparison-container col-md-12">
                            <PortfolioComparison />
                        </div>
                    }
                </div>
            </div>
        );
    }
};
export default DowChart;
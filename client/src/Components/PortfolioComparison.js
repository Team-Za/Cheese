import React, { Fragment } from "react";
import API from "../utils/API";
import Sp500 from './Sp500Data';
import { browserHistory, Router } from 'react-router';
import Auth from '../modules/Auth';
import LoginPage from '../containers/LoginPage.jsx';
import SignUpPage from '../containers/SignUpPage.jsx';
import { NavLink, Link, IndexLink } from 'react-router-dom';
import { portApi, stockApi, userApi } from "../utils/serverAPI";

class PortfolioComparison extends React.Component {
    state = {
        portfolioTotal: 0,
        currentTotal: 0,
        portfolioDifference: 0,
        portfolioChange: "",
        userId: sessionStorage.getItem("UserId"),
        userBalance: 0,
        loading: true,
        userName: sessionStorage.getItem('username'),
        dailyPort: ""
    };

    componentDidMount() {
        this.comparePortfolioToCurrent(this.state.userId);
    }

    comparePortfolioToCurrent = (userId) => {
        var stocksArray;
        var balance;
        portApi.getPortfolioAndStocksbyUserId(userId).then(res => {
            console.log("User Port Stuff", res);
            var stockObj = {
                stocksArray: res.Stocks,
                balance: res.balance
            }
            return stockObj;

        }).then(async userStocks => {
            console.log("Results", userStocks);
            var userTotalPortPrice = 0;
            var currentTotalPortPrice = 0;
            var totalPrices;
            for (let i = 0; i < userStocks.stocksArray.length; i++) {
                userTotalPortPrice += (userStocks.stocksArray[i].quantity * userStocks.stocksArray[i].price);

                await API.allSymbols("/stock/" + userStocks.stocksArray[i].symbol + "/quote").then(results => {
                    console.log("This is it!", results.data.latestPrice);
                    currentTotalPortPrice += (results.data.latestPrice * userStocks.stocksArray[i].quantity);
                })
                totalPrices = {
                    userTotalPortPrice,
                    currentTotalPortPrice
                }
            }
            return totalPrices;
            console.log("Comparison:", userTotalPortPrice + " vs " + currentTotalPortPrice);

        }).then(pricesToCompare => {
            console.log("Total", pricesToCompare);
            var difference;
            var change;
            var userPort;

            if(pricesToCompare !== undefined) {
                change = (pricesToCompare.currentTotalPortPrice - pricesToCompare.userTotalPortPrice);
                difference = ((change / pricesToCompare.userTotalPortPrice) * 100).toFixed(4);
                userPort = pricesToCompare.userTotalPortPrice.toFixed(2);
            }
            if(pricesToCompare === undefined) {
                this.setState({
                    loading: false
                })
            } else {
                if(Math.sign(change) === -1) {
                    this.setState({
                        portfolioTotal: userPort,
                        currentTotal: pricesToCompare.currentTotalPortPrice,
                        portfolioDifference: difference,
                        portfolioChange: "negative",
                        loading: false
                    })
                } else {
                    this.setState({
                        portfolioTotal: userPort,
                        currentTotal: pricesToCompare.currentTotalPortPrice,
                        portfolioDifference: difference,
                        portfolioChange: "positive",
                        loading: false
                    })
                }
            }
        })
    }

    render() {
        return (
            <div>
                {this.state.loading ?
                    <div>Loading...</div>
                    :
                    <Fragment>
                        <div className="welcome">Welcome {this.state.userName},</div>
                        <div className="daily-portfolio"> Purchased Portfolio:</div> <div className="daily-portfolio-amount">${this.state.portfolioTotal}</div>
                        <div className="daily-portfolio"> Current Portfolio:</div> <div className="daily-portfolio-amount">${this.state.currentTotal}
                        {this.state.portfolioChange === "positive" ?
                            <i className="fas fa-arrow-up bounce-up"></i>
                        : this.state.portfolioChange === "negative" ?
                        <i className="fas fa-arrow-down bounce-down"></i>
                        : <div></div>}
                        </div>
                        <div className="difference">({this.state.portfolioDifference}) %</div>
                    </Fragment>
                }
            </div>
        );
    }
};
export default PortfolioComparison;
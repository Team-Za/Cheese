import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import '../Views/app.scss';
import { portApi, stockApi, userApi } from "../utils/serverAPI";
// import Navbar from "./Navbar";
// import DowChart from './DowChart';
// import Sp500 from './Sp500Data';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

class Dashboard extends React.Component {
    state = {
        result: [],
        loading: true,
        data: [],
        activeStock: "",
        userPortfolioData: []
    };

    componentDidMount() {

        Promise.all([this.getUsersStocks("/stock/aapl/chart/1d"), this.searchPortfolios(1)]).then(values => {
            console.log(values);
            this.setState({
                data: values[0],
                userPortfolioData: values[1],
                loading: false
            });
          });
        // this.getUserData("/stock/aapl/chart/1d");
        // this.getUsersStocks("/stock/aapl/chart/1d");
        // this.searchPortfolios(1);
    }

    searchPortfolios = id => {
        var data = portApi.getPortfolioAndStocks(id)
            .then(res => { 
                console.log("User Portfolio Data", res); 
                return res.Stocks;
            })
            .catch(err => console.log(err));
        return data;
    };

    plotData = (stockName) => {
        API.chartData(stockName)
            .then(res => {
                this.setState({
                    data: this.getData(res.data),
                    loading: false,
                    activeStock: stockName
                }), console.log(this.state.result[0].minute)
            })
            .catch(err => console.log(err));
    }

    getUsersStocks = query => {
        var data = API.getUserData(query)
            .then(res => {
                return this.getData(res.data);
            })
            .catch(err => console.log(err));

            return data;
    }

    // getUsersStocks = query => {
    //     API.getUserData(query)
    //         .then(res => {
    //             this.setState({
    //                 result: res.data,
    //                 data: this.getData(res.data)
    //             }), console.log(this.state.result[0].minute)
    //         })
    //         .catch(err => console.log(err));
    // }

    getData = stockData => {
        const dataArray = [];
        for (let i = 0; i < stockData.length; i++) {
            dataArray.push({
                name: stockData[i].label,
                // High: stockData[i].marketHigh, 
                // Low: stockData[i].marketLow, 
                Price: stockData[i].average
            })
            i = i + 4;
        }

        return dataArray;
    }

    getUserData = query => {
        API.getUserData(query)
            .then(res => {
                console.log("chart", res.data); this.setState({
                    stocks: []
                }), console.log(this.state.result[0].minute)
            })
            .catch(err => console.log(err));
    };

    render() {
        return (
            <div className="container">
                <div className="col-md-5">
                    <div className="panel user-stocks">
                        <div className="panel-heading">
                            Your Stocks
                    </div>
                        {this.state.loading ?
                            <div className="loading">Loading...</div>
                            :
                            <div className="stock-panel">
                                {this.state.userPortfolioData.map(data => (
                                    <div className="stock-panel-child" value="spy" onClick={() => this.plotData("spy")}>
                                        <div className="stock-info">nada</div>
                                        <div className="stock-info">{data.name}</div>
                                        <div className="stock-info">{data.quantity}</div>
                                        <div className="stock-info">Extra</div>
                                    </div>
                                ))}

                                <div className="stock-panel-child">
                                    <div className="stock-info">Image</div>
                                    <div className="stock-info">Stock Name</div>
                                    <div className="stock-info">Current Price</div>
                                    <div className="stock-info">Extra</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {this.state.loading ?
                    <div className="loading">Loading...</div>
                    :
                    <div className="col-md-7 user-chart panel">
                        <div className="panel-heading">
                            {this.state.activeStock}
                        </div>
                        <LineChart width={600} height={300} data={this.state.data}
                            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                            <XAxis dataKey="name" stroke="#e7f1f1" />
                            <YAxis type="number" stroke="#e7f1f1" domain={['dataMin - 2', 'dataMax + 2']} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" isAnimationActive={false} dataKey="Price" stroke="#8884d8" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 5 }} />
                            {/* <Line type="monotone" dataKey="Low" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="Average" stroke="#fff" /> */}
                        </LineChart>
                    </div>
                }

            </div>
        );
    }
}

export default Dashboard;
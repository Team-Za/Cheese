import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import '../Views/app.scss';
// import Navbar from "./Navbar";
// import DowChart from './DowChart';
// import Sp500 from './Sp500Data';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

class Dashboard extends React.Component {
    state = {
        result: [],
        loading: true,
        data: [],
        activeStock: ""
    };

    componentDidMount() {
        this.getUserChartData("/stock/aapl/chart/1d");
        this.getUsersStocks("/stock/aapl/chart/1d");
    }

    plotData = (stockName) => {
        API.chartData(stockName)
            .then(res => {
                console.log("chart", res.data); this.setState({
                    data: this.getData(res.data),
                    loading: false,
                    activeStock: stockName
                }), console.log(this.state.result[0].minute)
            })
            .catch(err => console.log(err));
    }

    getUsersStocks = query => {
        API.getUserData(query)
            .then(res => {
                console.log("chart", res.data); this.setState({
                    result: res.data,
                    data: this.getData(res.data),
                    loading: false
                }), console.log(this.state.result[0].minute)
            })
            .catch(err => console.log(err));
    }

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

    getUserChartData = query => {
        API.getUserData(query)
            .then(res => {
                console.log("chart", res.data); this.setState({
                    stocks: [],
                    loading: false
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
                                <div className="stock-panel-child" value="spy" onClick={() => this.plotData("spy")}>
                                    <div className="stock-info">Apple</div>
                                    <div className="stock-info">Apple Inc.</div>
                                    <div className="stock-info">Current Price</div>
                                    <div className="stock-info">Extra</div>
                                </div>

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
                            <XAxis dataKey="name" stroke="#e7f1f1"/>
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
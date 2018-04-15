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
        loading: true
    };


    componentDidMount() {
        this.getUserChartData("/stock/aapl/chart/1d");
    }

    getUserChartData = query => {
        API.getUserData(query)
            .then(res => { console.log("chart", res.data); this.setState({ result: res.data, loading: false }), console.log(this.state.result[0].minute) })
            .catch(err => console.log(err));
    };

    render() {
            const data = [
                { name: this.state.result[0].minute, High: 4000, Low: 2400, Average: 1500, amt: 2400 },
                { name: 'Page B', High: 3000, Low: 1398, Average: 1500, amt: 2210 },
                { name: 'Page C', High: 2000, Low: 9800, Average: 1500, amt: 2290 },
                { name: 'Page D', High: 2780, Low: 3908, Average: 1500, amt: 2000 },
                { name: 'Page E', High: 1890, Low: 4800, Average: 1500, amt: 2181 },
                { name: 'Page G', High: 3490, Low: 4300, Average: 1500, amt: 2100 }
            ]
        return (
            <div className="container">
                <div className="col-md-5">
                    <div className="panel user-stocks">
                        <div className="panel-heading">
                            Your Stocks
                    </div>

                        <div className="stock-panel">
                            <div className="stock-panel-child">
                                <div className="stock-info">Image</div>
                                <div className="stock-info">Stock Name</div>
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
                    </div>
                </div>

                {this.state.loading ?
                    <div className="loading">Loading...</div>
                    :
                    <div className="col-md-6 col-md-offset-1 user-chart panel">
                        <div className="panel-heading">
                            AAPL
                </div>
                        <LineChart width={500} height={300} data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="High" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Low" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="Average" stroke="#fff" />
                        </LineChart>
                    </div>
                }

            </div>
        );
    }
}

export default Dashboard;
import React, { Fragment } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import '../Views/app.scss';
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import { ResponsiveContainer, Brush, BarChart, Bar, ReferenceLine, PieChart, Pie, Cell, Sector, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

class Dashboard extends React.Component {
    state = {
        result: [],
        loading: true,
        data: [],
        activeStock: "Apple (aapl)",
        activeStockSymbol: "aapl",
        userPortfolioData: [],
        userId: sessionStorage.getItem('id'),
        whichChart: "area",
        pieChartData: {
            totalPortfolioPrice: 0,
            eachStockPercentage: [],
        },
        eachStockPrice: [],
        testData: [{ name: 'Apple', symbol: 'AAPL', imageLink: "https://storage.googleapis.com/iex/api/logos/AAPL.png", price: 165.72, quantity: "30" }, { name: 'Netflix Inc.', symbol: 'NFLX', imageLink: "https://storage.googleapis.com/iex/api/logos/NFLX.png", price: 327.77, quantity: "20" },
        { name: 'Manchester United Ltd. Class A', symbol: 'MANU', imageLink: "https://storage.googleapis.com/iex/api/logos/MANU.png", price: 18.5, quantity: "50" }, { name: 'American Airlines Group Inc.', symbol: 'AAL', imageLink: "https://storage.googleapis.com/iex/api/logos/AAL.png", price: 46.78, quantity: "15" }],
        colors: ['#6e80bf', '#4cc2f0', '#f07089', '#f5918d', '#6bc398'],
        testPieChartData: [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
        {name: 'Group C', value: 300}, {name: 'Group D', value: 200}]
    };

    componentDidMount() {
        console.log("YOOO", this.searchPortfolios(this.state.userId))
        Promise.all([this.searchPortfolios(1), this.getUsersStocks("/stock/aapl/chart/1d")]).then(values => {
            console.log(values);
            
            this.setState({
                data: values[1],
                userPortfolioData: values[0],
                loading: false
            });
            // this.getPieChartData();
        });
    }

    searchPortfolios = id => {
        return new Promise((res, rej) => {
            var data = portApi.getPortfolioAndStocks(id)
                .then(res => {
                    console.log("User Portfolio Data", res);
                    return res.Stocks;
                })
                .catch(err => console.log(err));
            res(data);
        })
    };

    plotData = (stockSymbol, stockName) => {
        API.chartData(stockSymbol)
            .then(res => {
                this.setState({
                    data: this.getData(res.data),
                    activeStock: stockName + " " + "(" + stockSymbol + ")",
                    activeStockSymbol: stockSymbol
                })
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

    getData = stockData => {
        const dataArray = [];
        let latestNumber;
        for (let i = 0; i < stockData.length; i++) {
            if (stockData[i].marketAverage !== -1) {
                latestNumber = stockData[i].marketAverage;
            }

            if (stockData[i].marketAverage === -1) {
                dataArray.push({
                    name: stockData[i].label,
                    // High: stockData[i].marketHigh, 
                    // Low: stockData[i].marketLow, 
                    Price: latestNumber
                })
                i = i + 4;
            } else {
                dataArray.push({
                    name: stockData[i].label,
                    // High: stockData[i].marketHigh, 
                    // Low: stockData[i].marketLow, 
                    Price: stockData[i].marketAverage
                })
                i = i + 4;
            }
        }

        return dataArray;
    }

    switchChart = chartName => {
        this.setState({
            whichChart: chartName
        })
    }

    switchDate = date => {
        API.changeDate(this.state.activeStockSymbol, date)
            .then(res => {
                this.setState({
                    data: this.getDataByDate(res.data)
                })
            })
    }

    getDataByDate = stockData => {
        const dataArray = [];
        let latestNumber;
        for (let i = 0; i < stockData.length; i++) {
            if (stockData[i].high !== -1) {
                latestNumber = stockData[i].high;
            }

            if (stockData[i].high === -1) {
                dataArray.push({
                    name: stockData[i].label,
                    Price: latestNumber
                })
            } else {
                dataArray.push({
                    name: stockData[i].label,
                    Price: stockData[i].high
                })
            }
        }

        return dataArray;
    }


    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <div>
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            </div>
        );
    }


    // getPieChartData = () => {
    //         return new Promise((resolve, reject) => {
    //             let totalPortPrice = 0;
    //             let allStockPrices = [];
    //             for (let i = 0; i < this.state.userPortfolioData.length; i++) {
    //                 API.pieChartData(this.state.userPortfolioData[i].symbol)
    //                     .then(res => {
    //                         let stockPrice = Math.round((this.state.userPortfolioData[i].quantity) * res.data);
    //                         let stockName = this.state.userPortfolioData[i].name;
    //                         let stock = {
    //                             name: stockName,
    //                             value: stockPrice
    //                         }
    //                         allStockPrices.push(stock);
    //                         totalPortPrice += stockPrice;
    //                         console.log("Price Here:", this.state.userPortfolioData[i].quantity);
    //                         console.log("Result:", res.data)
    //                     })
    //             }
    //             var neededPieChartInfo = {
    //                 totalPortPrice,
    //                 allStockPrices
    //             }
    //             resolve(neededPieChartInfo);
    
    //         }).then(values => {
    //             console.log("PIE CHART", values)
    //             this.setState({
    //                 pieChartData: {
    //                     totalPortfolioPrice: values.totalPortPrice
    //                 },
    //                 eachStockPrice: values.allStockPrices,
    //                 testData: values.allStockPrices,
    //                 loading: false
    //             })
    
    //         })
    
    
    //     }


    render() {
        return (
            <div>
                {this.state.loading ?
                    <div className="col-md-6 loading panel">Loading...</div>
                    :
                    <div className="container-fluid">
                        <div className="col-md-6 user-chart panel">
                            <div className="switch-chart">
                                <a href="#/"><div className="chart-tabs" onClick={() => this.switchChart("area")}><i className="fas fa-chart-area"></i><br />Area Chart</div></a>
                                <div className="chart-tabs" onClick={() => this.switchChart("line")}><i className="fas fa-chart-line"></i><br />Line Chart</div>
                                <div className="chart-tabs" onClick={() => this.switchChart("bar")}><i className="fas fa-chart-bar"></i><br />Bar Chart</div>
                            </div>
                            {this.state.whichChart === "line" ?
                                <div>
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
                                        <Line type="monotone" isAnimationActive={true} dataKey="Price" stroke="#6e80bf" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 5 }} />
                                        {/* <Line type="monotone" dataKey="Low" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="Average" stroke="#fff" /> */}
                                    </LineChart>
                                   
                                </div>

                                : this.state.whichChart === "area" ?
                                    <div>
                                        <div className="panel-heading">
                                            {this.state.activeStock}
                                        </div>
                                        <AreaChart width={600} height={300} data={this.state.data}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="2 3" />
                                            <XAxis dataKey="name" stroke="#e7f1f1" />
                                            <YAxis stroke="#e7f1f1" domain={['dataMin - 2', 'dataMax + 2']} />
                                            <defs>
                                                <linearGradient id="test" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6e80bf" stopOpacity={1} />
                                                    <stop offset="95%" stopColor="#4cc2f0" stopOpacity={.5} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip />
                                            <Area type='monotone' dataKey='Price' stroke='#6e80bf' strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 5 }} fill="url(#test)" />
                                        </AreaChart>
                                    </div>
                                    : this.state.whichChart === "bar" ?
                                        <div>
                                        <div className="panel-heading">
                                            {this.state.activeStock}
                                        </div>
                                        <BarChart width={600} height={300} data={this.state.data}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                                            <ReferenceLine y={0} stroke='#000' />
                                            <Brush dataKey='name' height={30} stroke="#8884d8" />
                                            <defs>
                                                <linearGradient id="test" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6e80bf" stopOpacity={1} />
                                                    <stop offset="95%" stopColor="#4cc2f0" stopOpacity={.5} />
                                                </linearGradient>
                                            </defs>
                                            <Bar dataKey="Price" fill="#8884d8" />
                                        </BarChart>
                                        </div>
                                        : <div>test</div>
                            }
                            <div className="switch-date">
                                <div className="date-tabs" onClick={() => this.switchDate("1d")}>1 Day</div>
                                <div className="date-tabs" onClick={() => this.switchDate("1m")}>1 Month</div>
                                <div className="date-tabs" onClick={() => this.switchDate("3m")}>3 Months</div>
                                <div className="date-tabs" onClick={() => this.switchDate("6m")}>6 Months</div>
                                <div className="date-tabs" onClick={() => this.switchDate("1y")}>1 Year</div>
                                <div className="date-tabs" onClick={() => this.switchDate("2y")}>2 Years</div>
                                <div className="date-tabs" onClick={() => this.switchDate("5y")}>5 Years</div>
                            </div>

                        </div>

                        {/* Pie Chart Data */}
                        <div className="col-md-5 col-md-offset-1 bar-chart">
                        <div className="panel-heading">
                            Sample Pie Chart
                    </div>
                            <PieChart width={400} height={400} onMouseEnter={this.onPieEnter}>
                                <Pie

                                    data={this.state.testPieChartData}
                                    dataKey="value"
                                    cx={225}
                                    cy={200}
                                    labelLine={true}
                                    isAnimationActive={false}
                                    label={true}
                                    outerRadius={120}
                                    fill="#8884d8"
                                >
                                    {
                                        this.state.testPieChartData.map((entry, index) => <Cell fill={this.state.colors[index % this.state.colors.length]} />)
                                    }
                                </Pie>
                            </PieChart>
                        </div>
                    </div>
                }
                <div className="container-fluid">

                    <div className="col-md-12 panel user-stocks">
                        <div className="panel-heading">
                            Sample Stocks
                    </div>
                        {this.state.loading ?
                            <div className="loading">Loading...</div>
                            :
                            <div className="stock-panel">
                                <div className="stock-panel-child-headers">
                                    <div className="stock-info-header">Logo</div>
                                    <div className="stock-info-header">Company</div>
                                    <div className="stock-info-header">Price</div>
                                    <div className="stock-info-header">Quantity</div>
                                </div>
                               
                                    {/* <div className="stock-panel-child">
                                        <div className="stock-info"><img className="stock-image" src={data.imageLink} /></div>
                                        <div className="stock-info">{data.name}</div>
                                        <div className="stock-info">{data.price}</div>
                                        <div className="stock-info-quantity">{data.quantity}</div>
                                    </div> */}
                                
                            </div>
                        }
                    </div>

                </div>

            </div>
        );
    }
}

export default Dashboard;
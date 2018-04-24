import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import '../Views/app.scss';
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import { Brush, BarChart, Bar, ReferenceLine, PieChart, Pie, Cell, Sector, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

class Dashboard extends React.Component {
    state = {
        result: [],
        loading: true,
        data: [],
        activeStockData: [],
        activeStock: "Apple (aapl)",
        activeStockSymbol: "aapl",
        userPortfolioData: [],
        userId: sessionStorage.getItem('UserId') || 1,
        whichChart: "area",
        pieChartData: {
            totalPortfolioPrice: 0,
            eachStockPercentage: [],
        },
        eachStockPrice: [],
        testData: [{ name: 'Alcoa Corporation', value: 594 }, { name: 'Apple', value: 1778.4 },
        { name: 'Fidelity Value Factor', value: 328.1 }, { name: 'Fidelity Value Factor', value: 500 },
        { name: 'Fidelity Value Factor', value: 500 }, { name: 'Fidelity Value Factor', value: 500 }, { name: 'Fidelity Value Factor', value: 500 }],
        colors: ['#6e80bf', '#4cc2f0', '#f07089', '#f5918d', '#6bc398']
    };

    componentDidMount() {
        Promise.all([this.searchPortfolios(this.state.userId), this.getFirstUserStock(this.state.userId), this.getUsersStocks("/stock/aapl/chart/1d"), this.plotData()]).then(values => {
            if(values[1] === false) {
                this.setState({
                    data: values[2],
                    userPortfolioData: values[0],
                    // loading: false,
                    activeStock: "Sample Stock",
                    activeStockSymbol: "aapl",
                    // pieChartData: {
                    //     totalPortfolioPrice: values[].totalPortPrice
                    // },
                    // eachStockPrice: values.allStockPrices
                    // testData: values.allStockPrices
                });
                this.getPieChartData();
            } else {
                this.setState({
                    data: values[1],
                    userPortfolioData: values[0],
                    // loading: false,
                    activeStock: values[0][0].name,
                    activeStockSymbol: values[0][0].symbol,
                    // pieChartData: {
                    //     totalPortfolioPrice: values[].totalPortPrice
                    // },
                    // eachStockPrice: values.allStockPrices
                    // testData: values.allStockPrices
                });
                this.getPieChartData();
            
            }
        });

    }

    searchPortfolios = id => {
        return new Promise((res, rej) => {
            var data = portApi.getPortfolioAndStocksbyUserId(id)
                .then(res => {
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


    getFirstUserStock = id => {
        var stock = this.searchPortfolios(id).then(data => {
            if(data.length === 0) {
                return false;
            } else {
                return API.chartData(data[0].symbol)
                .then(res => {
                    return this.getData(res.data)
                })
                .catch(err => console.log(err));
            }
        })
        return stock;
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
                    Price: latestNumber
                })
                i = i + 4;
            } else {
                dataArray.push({
                    name: stockData[i].label,
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

    getPieChartData = () => {
        this.searchPortfolios(this.state.userId).then(data => {

            let totalPortPrice = 0;
            let allStockPrices = [];
            for (let i = 0; i < data.length; i++) {
                API.pieChartData(data[i].symbol)
                    .then(res => {
                        let stockPrice = Math.round((data[i].quantity) * res.data);
                        let stockName = data[i].name;
                        let stock = {
                            name: stockName,
                            value: stockPrice
                        }
                        allStockPrices.push(stock);
                        totalPortPrice += stockPrice;
                    })
            }

            return allStockPrices;
            var neededPieChartInfo = {
                totalPortPrice,
                allStockPrices
            }



        }).then((data) => {
            this.setState({
                eachStockPrice: data,
                loading: false
            })
        })
        this.forceUpdate();
    }

    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>

        );
    }

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
                                                <Brush dataKey='name' height={30} stroke="#6e80bf" />
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
                            {/* <div onClick={() => this.getPieChartData()}>Click Me</div> */}
                            <div className="panel-heading">
                            Overall Stock Percentage
                    </div>

                            <PieChart width={400} height={400} onMouseEnter={this.onPieEnter}>
                                <Pie

                                    data={this.state.eachStockPrice}
                                    dataKey="value"
                                    cx={200}
                                    cy={200}
                                    labelLine={true}
                                    label={true}
                                    outerRadius={120}
                                    fill="#8884d8"
                                >
                                    {
                                        this.state.eachStockPrice.map((entry, index) => <Cell fill={this.state.colors[index % this.state.colors.length]} />)
                                    }
                                </Pie>
                            </PieChart>
                        </div>
                    </div>
                }
                <div className="container-fluid">

                    <div className="col-md-12 panel user-stocks">
                        <div className="panel-heading">
                            Your Stocks
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
                                {this.state.userPortfolioData.map(data => (
                                    <div className="stock-panel-child" value={data.symbol} onClick={() => this.plotData(data.symbol, data.name)}>
                                        <div className="stock-info"><img className="stock-image" src={data.imageLink} /></div>
                                        <div className="stock-info">{data.name}</div>
                                        <div className="stock-info">{data.price}</div>
                                        <div className="stock-info-quantity">{data.quantity}</div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>

                </div>
            </div>
        );
    }
}

export default Dashboard;
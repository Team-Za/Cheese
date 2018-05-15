import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import API from "../utils/API";
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import {PieChart, Pie, Sector} from 'recharts';

class TwoLevelPieChart extends React.Component {
    state = {
        activeIndex: 0,
        data: [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
                  {name: 'Group C', value: 300}, {name: 'Group D', value: 200}],
        eachStockPrice: [],
        userId: sessionStorage.getItem('UserId') || 1,
        pieChartData: {
            totalPortfolioPrice: 0,
            eachStockPercentage: [],
        },
        loading: true
    }

    componentDidMount = () => {
        this.getUserData();
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


    getUserData = () => {
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



        }).then(async (data) => {
            console.log("Made it here")
            console.log(data)
            await this.setState({
                eachStockPrice: data,
                loading: false
            })
        })
    }

    getInitialState() {
        return {
            activeIndex: 0,
        };
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    }

    renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    render() {
        return (
            <div>
            {this.state.loading ?
            <div> Loading...</div>
            
            :
            <PieChart width={800} height={400}>
                <Pie
                    activeIndex={this.state.activeIndex}
                    activeShape={this.renderActiveShape}
                    data={this.state.eachStockPrice}
                    cx={300}
                    cy={200}
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    onMouseEnter={this.onPieEnter}
                />
            </PieChart>
            }
            </div>
            
        );
    }
}
export default TwoLevelPieChart;
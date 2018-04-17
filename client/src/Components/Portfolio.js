import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";
import Portview from "./Portview";

class Portfolio extends React.Component {
    state = {
        result: []
    };
    async componentDidMount() {
        await this.searchPortfolios(1);
    }
    //   searchSymbols = query => {
    //     API.allSymbols(query)
    //       .then(res => { console.log(res.data); this.setState({ result: res.data }) })
    //       .catch(err => console.log(err));
    //   };
    searchPortfolios = async id => {
        await portApi.getPortfolioAndStocksbyUserId(id)
            .then(res => { console.log(res,new Date()); this.setState({result:res})})
            .catch(err => console.log(err));
    };
    // setPortfolio = async id =>{
    //     let stocks = [];
    //     if(stocks = await this.searchPortfolios(id)){
    //         await this.setState({result:stocks});
    //     }
    // }
    render() {
        return (
            <div className="container">
                {console.log(this.state.result,new Date())}
                <Portview
                    userName={this.state.result.userName}
                    Stocks={this.state.result.Stocks}
                />
            </div>
        );
    }
}

export default Portfolio;
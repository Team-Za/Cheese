import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";

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
    searchPortfolios = id => {
        portApi.getPortfolioAndStocksbyUserId(id)
            .then(res => { console.log(res); this.setState({ result: res }) })
            .catch(err => console.log(err));
    };
    render() {
        return (
            <div className="container">
                {console.log(this.state.result)}
            </div>
        );
    }
}

export default Portfolio;
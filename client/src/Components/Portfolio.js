import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";
import Portview from "./Portview";

class Portfolio extends React.Component {
    state = {
        result: [],
        loading: true,
        stockName: "",
        quantity: 0,
        userId: 1,
        portId: -1
    };
    async componentDidMount() {
        await this.loadSymbols();
        await this.searchPortfolios(this.state.userId);
    }
    //   searchSymbols = query => {
    //     API.allSymbols(query)
    //       .then(res => { console.log(res.data); this.setState({ result: res.data }) })
    //       .catch(err => console.log(err));
    //   };
    searchPortfolios = async id => {
        const temp = await portApi.getPortfolioAndStocksbyUserId(id)
            .then(res => { console.log(res, new Date()); this.setState({ result: res, portId: res.id, loading: false }) })
            .catch(err => console.log(err));
        return temp;
    };
    async loadSymbols() {
        const temp = await API.allSymbols("/ref-data/symbols")
            .then(res => {
                console.log(res.data, "Symbols loaded", new Date()); res.data.map(stock => (
                    sessionStorage.setItem(stock.name, stock.symbol)))
            })
            .catch(err => console.log(err));
        return temp;

    };
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };
    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.stockName !== "" && (this.state.quantity > 0)) {
            let symbol = "";
            let imageLink = "";
            let price = -1;
            if (sessionStorage.getItem(this.state.stockName) === null) {
                alert("Stock name not found");
            }
            else {
                symbol = sessionStorage.getItem(this.state.stockName);
            }
            API.allSymbols(`/stock/${symbol}/quote`)
                .then(res => {
                    console.log(res.data, new Date());
                    price = res.data.latestPrice;
                    API.allSymbols(`/stock/${symbol}/logo`)
                        .then(res1 => {
                            console.log(res1.data, new Date());
                            imageLink = res1.data.url;
                            console.log(symbol, price, imageLink, new Date())
                        })
                        .then(res2 => {
                            const tempStock = {
                                name: this.state.stockName,
                                quantity: this.state.quantity,
                                symbol: symbol,
                                imageLink: imageLink,
                                price: price,
                                PortfolioId: this.state.portId
                            }
                            stockApi.create(tempStock)
                                .then(res3 => this.searchPortfolios(this.state.userId))
                                .catch(err => console.log(err, new Date(), tempStock));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));

        }
        else {
            alert("Please fill out required fields!");
        }
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
                {console.log(this.state.result, new Date())}
                <div className="portfolio">
                    {this.state.loading ? (<div>loading...</div>) :
                        (<Portview
                            userName={this.state.result.userName}
                            Stocks={this.state.result.Stocks}
                        />)}
                </div>
                <form>
                    Stock Name:
                    <input
                        value={this.state.stockName}
                        onChange={this.handleInputChange}
                        name="stockName"
                        placeholder="Name of stock (required)"
                    />
                    Quantity:
                    <input
                        value={this.state.quantity}
                        onChange={this.handleInputChange}
                        name="quantity"
                        placeholder="Quantity (required)"
                    />
                    <button onClick={this.handleFormSubmit}>
                        submit
                    </button>
                </form>
            </div>
        );
    }
}

export default Portfolio;
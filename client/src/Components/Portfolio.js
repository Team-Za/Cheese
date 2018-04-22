import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";
import Stock from "./Stock";
import { Promise } from 'core-js';
import Auth from '../modules/Auth';
//import NewConfirm from "./NewConfirm"
const formColor = {
    color: "white"
}
class Portfolio extends React.Component {
    state = {
        result: [],
        loading: true,
        stockName: "",
        quantity: 0,
        userId: 1,
        portId: -1,
        sidebarArgs: [],
        sidebarState: "add",
        companies: [],
        Stocks: [],
        noStocks: false,
        buyingFirst: false
        //prompting: false,
        //message: ""
    };
    componentDidMount = async () => {
        // this.setState({
        //     userId: sessionStorage.getItem("UserId") || 1
        // });
        console.log(this.state);
        await this.loadSymbols();
        await this.searchPortfolios(this.state.userId)
    };
    searchPortfolios = async id => {
        const temp = await portApi.getPortfolioAndStocksbyUserId(id)
            .then(res => {
                if (res == null) {
                    console.log("noStocks");
                    this.setState({ noStocks: true, loading: false });
                    // return (this.theNoStockOption(id)
                    //     .then(res3 => {
                    //         console.log(res3, new Date(), id);
                    //         this.setState({ noStocks: true, portId: res3.id, result: res3, loading: false });
                    //     })
                    //     .catch(err => console.log(err)))
                }
                else {
                    console.log(res, this.state.userId, new Date());
                    this.setState({ result: res, portId: res.id });
                }
            })
            .then(res2 => {
                if (!this.state.noStocks) {
                    console.log(res2, new Date());
                    this.formatStocks(this.state.result.Stocks);
                }
            })
            .catch(err => console.log(err));
        return temp;
    };
    loadSymbols = async () => {
        const temp = await API.allSymbols("/ref-data/symbols")
            .then(res => {
                console.log(res.data, "Symbols loaded", new Date()); res.data.map(stock => (
                    localStorage.setItem(stock.name, stock.symbol)))
            })
            .catch(err => console.log(err));
        return temp;
    };
    filterInput = () => {
        let comps = [];
        const prom1 = new Promise((resolve) => {
            for (let i = 0; i < localStorage.length; i++) {
                let tempCompName = localStorage.key(i);
                const filter = this.state.stockName.toUpperCase();
                if (tempCompName.toUpperCase().indexOf(filter) > -1) {
                    comps.push(tempCompName);
                }
            }
        }).then(this.setState({ companies: comps }))
    };
    handleInputChange = event => {
        const { name, value } = event.target;
        if (typeof value === "string" && value.length > 3) {
            this.filterInput();
            console.log(this.state.companies);
        }
        this.setState({
            [name]: value
        });
    };
    theNoStockOption = (id) => {
        return (portApi.getPortfoliobyUserId(id).catch(err => console.log(err)));
    }
    makeStock = stock => {
        return (stockApi.create(stock).catch(err => console.log(err)));
    };
    getPrice = symbol => {
        return (API.allSymbols(`/stock/${symbol}/quote`).catch(err => console.log(err)));
    };
    getLogo = symbol => {
        return (API.allSymbols(`/stock/${symbol}/logo`).catch(err => console.log(err)));
    };
    updatePortfolio = portfolio => {
        return (portApi.update(portfolio).catch(err => console.log(err)));
    };
    updateStock = stock => {
        return (stockApi.update(stock).catch(err => console.log(err)));
    };
    deleteStock = id => {
        return (stockApi.delete(id).catch(err => console.log(err)));
    };
    makeTempStock = (name, quantity, symbol, imageLink, price, id) => {
        if (id === undefined) {
            return {
                name: name,
                quantity: quantity,
                symbol: symbol,
                imageLink: imageLink,
                price: price,
                PortfolioId: this.state.portId
            }
        }
        else {
            return {
                id: id,
                name: name,
                quantity: quantity,
                symbol: symbol,
                imageLink: imageLink,
                price: price,
                PortfolioId: this.state.portId
            }
        }
    };
    makeTempPortfolio = balance => {
        return {
            id: this.state.portId,
            userName: this.state.result.userName,
            balance: balance,
            UserId: this.state.userId
        }
    };
    handleAdd = async (name, symbol, imageLink) => {
        const quoteData = await this.getPrice(symbol);
        console.log(quoteData.data, new Date());
        const price = quoteData.data.latestPrice;
        const userResp = prompt(`Current Balance: ${this.state.result.balance}\n
                Please enter an amount of ${name} stock you would like to purchase at $${price}`);
        const userQuant = parseInt(userResp, 10);
        if (userResp === null || isNaN(userResp) || userResp === undefined) {
            alert("Please enter a number");
        }
        else if (userQuant * price > this.state.result.balance) {
            alert(`The quantity of stock you purchased ${userQuant} has a total price of $${userQuant * price} which is greater than your Current Balance: ${this.state.result.balance}`)
        }
        else {
            const conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                    This will cost $${price} per share for a total of $${userQuant * price}\n
                    press OK to continue`);
            if (conf) {
                const temp = await this.makeTempStock(name, userQuant, symbol, imageLink, price);
                const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) - parseFloat(userQuant * price));
                console.log(tempPort);
                await Promise.all([this.updatePortfolio(tempPort), this.makeStock(temp)]);
                this.searchPortfolios(this.state.userId);
            }
            else {
                alert("Ok then...")
            }
        }
    };
    handleSell = async (id, name, quantity, symbol, imageLink, originalPrice) => {
        const quoteData = await this.getPrice(symbol);
        console.log(quoteData.data, new Date());
        const newPrice = quoteData.data.latestPrice;
        let userResp = prompt(`Current Balance: ${this.state.result.balance}\n
                Please enter an amount of ${name} stock you would like to sell at Current Price: $${newPrice}.\n
                Original Price: $${originalPrice}`);
        const userQuant = parseInt(userResp, 10);
        if (userResp === null || isNaN(userResp) || userResp === undefined) {
            alert("Please enter a number");
        }
        else if (userQuant > quantity) {
            alert("You don't have that much of this stock");
        }
        else {
            let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                    This will add $${newPrice} per share to your account for a total of $${userQuant * newPrice} 
                    and a net change of $${(userQuant * newPrice) - (userQuant * originalPrice)}.\n
                    Press OK to continue`);
            if (conf) {
                const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) + parseFloat(userQuant * newPrice));
                await this.updatePortfolio(tempPort);
                if (userQuant === quantity) {
                    console.log(tempPort);
                    await this.deleteStock(id);
                    this.searchPortfolios(this.state.userId)
                }
                else {
                    const tempStock = this.makeTempStock(name, (quantity - userQuant), symbol, imageLink, newPrice, id);
                    await this.updateStock(tempStock);
                    this.searchPortfolios(this.state.userId);
                }
            }
            else {
                alert("Ok then...")
            }
        }
    };
    handleDelete = async (id, name, quantity, price) => {
        console.log(id);
        let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
        Are you sure you want to delete batch of ${quantity} ${name} stock at $${price}?`);
        const tempPort = this.makeTempPortfolio(parseFloat(this.state.result.balance) + parseFloat(quantity * price));
        if (conf) {
            await Promise.all([this.deleteStock(id), this.updatePortfolio(tempPort)]);
            console.log(tempPort)
            this.searchPortfolios(this.state.userId);
        }
        else {
            alert("Ok, fine.");
        }
    };
    handleFormSubmit = async event => {
        event.preventDefault();
        this.setState({
            companies: []
        });
        if (this.state.stockName !== "" && (this.state.quantity > 0)) {
            let symbol = "";
            if (localStorage.getItem(this.state.stockName) === null) {
                alert("Stock name not found");
            }
            else {
                symbol = localStorage.getItem(this.state.stockName);
            }
            const quoteData = await this.getPrice(symbol);
            console.log(quoteData.data, new Date());
            const price = quoteData.data.latestPrice;
            if ((this.state.quantity * price) > this.state.result.balance) {
                alert("You cannot afford that much");
            }
            else {
                let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                        This will cost $${price} per share for a total of $${this.state.quantity * price}\n
                        press OK to continue`);
                if (conf) {
                    let imageQuery = await this.getLogo(symbol);
                    console.log(imageQuery)
                    const imageLink = imageQuery.data.url;
                    console.log(symbol, price, imageLink, new Date())
                    const tempStock = await this.makeTempStock(this.state.stockName, this.state.quantity, symbol, imageLink, price);
                    const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) - parseFloat(this.state.quantity * price));
                    console.log(tempPort)
                    await Promise.all([this.updatePortfolio(tempPort), this.makeStock(tempStock)]);
                    this.searchPortfolios(this.state.userId)
                }
            }
        }
        else {
            alert("Please fill out required fields!");
        }
    };
    formatStocks = stocks => {
        let choices = [];
        let indices = new Map([]);
        for (let i = 0; i < stocks.length; i++) {
            let stock = stocks[i];
            if (indices.has(stock.name)) {
                const index = indices.get(stock.name);
                //console.log(stock, index)
                choices[index].args.push({
                    id: stock.id,
                    quantity: stock.quantity,
                    price: stock.price
                });
            }
            else {
                let tempStock = {
                    name: stock.name,
                    args: [{
                        id: stock.id,
                        quantity: stock.quantity,
                        price: stock.price
                    }],
                    symbol: stock.symbol,
                    imageLink: stock.imageLink,
                    PortfolioId: stock.PortfolioId
                }
                choices.push(tempStock);
                // console.log(i)
                indices.set(stock.name, choices.length - 1);
            }
        }
        choices.sort((name1, name2) => {
            return name1.name.localeCompare(name2.name);
        });
        //console.log(choices, indices);
        this.setState({
            Stocks: choices,
            loading: false
        });
        return choices;
    };
    reget = (event) => {
        event.preventDefault();
        this.theNoStockOption(sessionStorage.getItem('UserId'))
            .then(res3 => {
                console.log(res3, new Date(), sessionStorage.getItem('UserId'));
                sessionStorage.setItem("here","here");
                this.setState({ noStocks: true, portId: res3.id, result: res3, loading: false, buyingFirst:false });
            })
            .catch(err => console.log(err))
    }
    render = () => {
        return (
            <div className="container">
                {this.state.loading ?
                    <div>loading...</div> :
                    <div>
                        <div className="portfolio">
                            <div>
                                {this.state.noStocks ?
                                    <div>
                                        You have no stocks. Why don't you buy some.
                                    </div> :
                                    <div>
                                        <h1>{this.state.result.userName}</h1>
                                        <h2>Current Balance: {this.state.result.balance}</h2>
                                        {this.state.Stocks.map(stock => (<Stock
                                            key={stock.name}
                                            name={stock.name}
                                            args={stock.args}
                                            symbol={stock.symbol}
                                            imageLink={stock.imageLink}
                                            handleDelete={this.handleDelete}
                                            handleAdd={this.handleAdd}
                                            stateQuant={this.state.quantity}
                                            handleSell={this.handleSell}
                                        />))}
                                    </div>
                                }
                            </div>
                        </div>
                        {/* <button onClick={()=>(console.log(this.getPrice("AAPL")))}>test</button> */}
                        {/* {!this.state.prompting ? ( */}
                        {this.state.buyingFirst ?
                            <div>
                                <form>
                                    <fieldset>
                                        <legend style={formColor}>Add new stocks here</legend>
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
                                    </fieldset>
                                </form>
                                <div>
                                    <ul>
                                        {this.state.companies.map(company => (
                                            <li onClick={() => this.setState({ stockName: company })}>{company}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div> :
                            <div>
                                <button onClick={this.reget}>test</button>
                            </div>
                        }
                        {/* ) : (
                    //     <form>
                    //         Quantity:
                    // <input
                    //             value={this.state.quantity}
                    //             onChange={this.handleInputChange}
                    //             name="quantity"
                    //             placeholder={this.state.quantity}
                    //         />
                    //         <button onClick={this.handleEditSubmit}>
                    //             submit
                    //     </button>
                    //     </form>
                    <div>
                        {this.state.message}
                        <button onClick={()=>(this.setState({prompting:false}))}>ok</button>
                    </div>
                       //<div/>
                    )
                } */}
                    </div>}
            </div>
        );
    };
}
export default Portfolio;
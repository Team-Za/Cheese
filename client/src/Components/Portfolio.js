import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";
//import Portview from "./Portview";
import Stock from "./Stock"

class Portfolio extends React.Component {
    state = {
        result: [],
        loading: true,
        stockName: "",
        quantity: 0,
        userId: 1,
        portId: -1,
        editing: false,
        currentStock: {},
        Stocks: []
    };
    async componentDidMount() {
        await this.loadSymbols();
        await this.searchPortfolios(this.state.userId)
    }
    //   searchSymbols = query => {
    //     API.allSymbols(query)
    //       .then(res => { console.log(res.data); this.setState({ result: res.data }) })
    //       .catch(err => console.log(err));
    //   };
    searchPortfolios = async id => {
        const temp = await portApi.getPortfolioAndStocksbyUserId(id)
            .then(res => { console.log(res, new Date()); this.setState({ result: res, portId: res.id }) })
            .then(res2 => {
                console.log(res2, new Date());
                this.formatStocks(this.state.result.Stocks);
            })
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
    handleAdd = async (name, symbol, imageLink, PortfolioId) => {
        API.allSymbols(`/stock/${symbol}/quote`)
            .then(res => {
                console.log(res.data, new Date());
                let price = res.data.latestPrice;
                let userResp = prompt(`Current Balance: ${this.state.result.balance}\n
                Please enter an amount of ${name} stock you would like to purchase at $${price}`);
                let userQuant = parseInt(userResp, 10);
                if (userResp === null || isNaN(userResp) || userResp === undefined) {
                    alert("Please enter a number");
                }
                else if (userQuant * price > this.state.result.balance) {
                    alert(``)
                }
                else {
                    let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                    This will cost $${price} per share for a total of $${userQuant * price}\n
                    press OK to continue`);
                    if (conf) {
                        const temp = {
                            name: name,
                            quantity: userQuant,
                            symbol: symbol,
                            imageLink: imageLink,
                            price: price,
                            PortfolioId: PortfolioId
                        }
                        stockApi.create(temp)
                            .then(res2 => {
                                const tempPort = {
                                    id: PortfolioId,
                                    userName: this.state.result.userName,
                                    balance: parseFloat(this.state.result.balance) - parseFloat(userQuant * price),
                                    UserId:this.state.userId
                                }
                                portApi.update(tempPort)
                                    .then(res3 => {
                                        console.log(res3,tempPort);
                                        this.searchPortfolios(this.state.userId);
                                    }).catch(err => console.log(err, new Date(),tempPort))
                            })
                            .catch(err => console.log(err, new Date(), temp));
                    }
                    else {
                        alert("Ok then...")
                    }
                }
            })
    }
    handleSell = async (id, name, quantity, symbol, imageLink, originalPrice, PortfolioId) => {
        API.allSymbols(`/stock/${symbol}/quote`)
            .then(res => {
                console.log(res.data, new Date());
                let newPrice = res.data.latestPrice;
                let userResp = prompt(`Current Balance: ${this.state.result.balance}\n
                Please enter an amount of ${name} stock you would like to sell at Current Price: $${newPrice}.\n
                Original Price: $${originalPrice}`);
                let userQuant = parseInt(userResp, 10);
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
                        const tempPort = {
                            id: this.state.portId,
                            userName: this.state.result.userName,
                            balance: parseFloat(this.state.result.balance) + parseFloat(userQuant * newPrice),
                            UserId:this.state.userId
                        }
                        portApi.update(tempPort)
                            .then(res2 => {
                                console.log(res2, tempPort);
                                if (userQuant === quantity) {
                                    stockApi.delete(id)
                                        .then(res => {
                                            console.log(tempPort);
                                            this.searchPortfolios(this.state.userId)
                                        })
                                        .catch(err => console.log(err))
                                }
                                else {
                                    const tempStock = {
                                        id: id,
                                        name: name,
                                        quantity: quantity - userQuant,
                                        symbol: symbol,
                                        imageLink: imageLink,
                                        price: newPrice,
                                        PortfolioId: PortfolioId
                                    }
                                    stockApi.update(tempStock)
                                        .then(res3 => {
                                            this.searchPortfolios(this.state.userId);
                                        })
                                        .catch(err => console.log(err, new Date(), tempStock));
                                }
                            })
                            .catch(err => console.log(err))
                    }
                    else {
                        alert("Ok then...")
                    }
                }
            })
    }
    handleEdit = async (id, name, quantity, symbol, imageLink, price, PortfolioId) => {
        const temp = {
            id: id,
            name: name,
            quantity: quantity,
            symbol: symbol,
            imageLink: imageLink,
            price: price,
            PortfolioId: PortfolioId
        }
        console.log(temp, "editing");
        await this.setState({
            currentStock: temp,
            quantity: quantity,
            stockName: name,
            editing: true
        });
        return console.log(this.state.currentStock, this.state);
    }
    handleEditSubmit = event => {
        //console.log(this.state.currentStock)
        event.preventDefault();
        let tempStock = this.state.currentStock;
        tempStock.quantity = this.state.quantity;
        stockApi.update(tempStock)
            .then(res => {
                console.log(res);
                this.setState({
                    editing: false,
                    currentStock: {},
                    stockName: "",
                    quantity: 0
                });
                this.searchPortfolios(this.state.userId);
            })
            .catch(err => console.log(err));
    }
    handleDelete = (id, name, quantity, price) => {
        //const stocks = this.state.stocks.filter(stock => stock.id !== id);
        console.log(id);
        //this.setState({ stocks });
        let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
        Are you sure you want to delete batch of ${quantity} ${name} stock at $${price}?`);
        const tempPort = {
            id: this.state.portId,
            userName: this.state.result.userName,
            balance: parseFloat(this.state.result.balance) + parseFloat(quantity * price),
            UserId:this.state.userId
        }
        if (conf) {
            stockApi.delete(id)
                .then(res => {
                    portApi.update(tempPort)
                        .then(res2 => {
                            console.log(res2,tempPort)
                            this.searchPortfolios(this.state.userId)
                        })
                        .catch(err=>console.log(err))
                })
                .catch(err => console.log(err, new Date()))
        }
        else {
            alert("Ok, fine.");
        }
    } 
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
                    if((this.state.quantity * price)>this.state.result.balance){
                        alert("You cannot afford that much");
                    }
                    else{
                        let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                        This will cost $${price} per share for a total of $${this.state.quantity * price}\n
                        press OK to continue`);
                        if (conf) {
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
                                        .then(res3 => {
                                            const tempPort = {
                                                id: this.state.portId,
                                                userName: this.state.result.userName,
                                                balance: parseFloat(this.state.result.balance) - parseFloat(this.state.quantity * price),
                                                UserId:this.state.userId
                                            }
                                            portApi.update(tempPort)
                                                .then(res4=>this.searchPortfolios(this.state.userId))
                                                .catch(err => console.log(err, new Date(), tempPort));
                                        })
                                        .catch(err => console.log(err, new Date(), tempStock));
                                })
                                .catch(err => console.log(err));
                        }
                    }
                })
                .catch(err => console.log(err));

        }
        else {
            alert("Please fill out required fields!");
        }
    };
    formatStocks = async stocks => {
        let choices = [];
        let indices = new Map([]);
        for (let i = 0; i < stocks.length; i++) {
            let stock = stocks[i];
            if (indices.has(stock.name)) {
                const index = indices.get(stock.name);
                await choices[index].args.push({
                    id: stock.id,
                    quantity: stock.quantity,
                    price: stock.price
                });
            }
            else {
                let tempStock = {
                    name: stock.name,
                    //quantity:[stock.quantity],
                    args: [{
                        id: stock.id,
                        quantity: stock.quantity,
                        price: stock.price
                    }],
                    symbol: stock.symbol,
                    imageLink: stock.imageLink,
                    //price:[stock.price],
                    PortfolioId: stock.PortfolioId
                }
                await choices.push(tempStock);
                await indices.set(stock.name, i);
            }
        }
        choices.sort((name1, name2) => {
            return name1.name.localeCompare(name2.name);
        });
        console.log(choices);
        await this.setState({
            Stocks: choices,
            loading: false
        });
        return choices;
    }
    //DO A CONDITIONAL RENDER OF THE EDIT FIELD
    // setPortfolio = async id =>{
    //     let stocks = [];
    //     if(stocks = await this.searchPortfolios(id)){
    //         await this.setState({result:stocks});
    //     }
    // }
    render() {
        return (
            <div className="container">
                {console.log(this.state.result, this.state.Stocks, new Date())}
                <div className="portfolio">
                    {this.state.loading ? (<div>loading...</div>) :
                        (<div>
                            <h1>{this.state.result.userName}</h1>
                            <h2>Current Balance: {this.state.result.balance}</h2>
                            {this.state.Stocks.map(stock => (<Stock
                                //userName={this.state.result.userName}
                                //Stocks={this.state.Stocks}
                                key={stock.name}
                                name={stock.name}
                                // quantity={stock.quantity}
                                args={stock.args}
                                symbol={stock.symbol}
                                imageLink={stock.imageLink}
                                // price={stock.price}
                                PortfolioId={stock.PortfolioId}
                                handleDelete={this.handleDelete}
                                handleEdit={this.handleEdit}
                                handleAdd={this.handleAdd}
                                handleEditSubmit={this.handleEditSubmit}
                                handleInputChange={this.handleInputChange}
                                stateQuant={this.state.quantity}
                                handleSell={this.handleSell}
                            />))}
                        </div>)}
                </div>
                {!this.state.editing ? (
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
                ) : (
                        <form>
                            Quantity:
                    <input
                                value={this.state.quantity}
                                onChange={this.handleInputChange}
                                name="quantity"
                                placeholder={this.state.quantity}
                            />
                            <button onClick={this.handleEditSubmit}>
                                submit
                        </button>
                        </form>
                        // <div/>
                    )
                }

            </div>
        );
    }
}

export default Portfolio;
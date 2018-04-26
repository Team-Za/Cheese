import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";
import Stock from "./Stock";
import { Promise } from 'core-js';
import Auth from '../modules/Auth';
import ToggleElement from "./ToggleElement";
import Sidebar from "./Sidebar";
import Conf from "./Conf";
const formColor = {
    color: "white"
}
class Portfolio extends React.Component {
    state = {
        result: [],
        loading: true,
        stockName: "",
        quantity: 0,
        userId: sessionStorage.getItem("UserId"),
        portId: -1,
        companies: [],
        Stocks: [],
        errorMessage: "",
        error: false,
        datapack: {},
        sum: 0,
        prompting: false,
        isShowingModal: false,
        mode: "submit"
    };
    componentDidMount = async () => {
        await this.loadSymbols();
        await this.searchPortfolios(this.state.userId)
    };
    searchPortfolios = async id => {
        console.log(id);
        const temp = await portApi.getPortfolioAndStocksbyUserId(id)
            .then(res => { console.log(res, new Date()); this.setState({ result: res, portId: res.id }) })
            .then(res2 => {
                console.log(res2, new Date());
                this.formatStocks(this.state.result.Stocks);
            })
            .catch(err => console.log(err, id));
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
    handleNumber = number => {
        return new Number(number).toFixed(2);
    }
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
    makeStock = stock => {
        return (stockApi.create(stock).catch(err => console.log(err)));
    };
    getStock = price => {
        return (stockApi.getByPrice(parseFloat(price), this.state.portId).catch(err => console.log(err)));
    }
    getPrice = symbol => {
        return (API.allSymbols(`/stock/${symbol}/quote`).catch(err => console.log(err)));
    };
    getLogo = symbol => {
        return (API.allSymbols(`/stock/${symbol}/logo`).catch(err => console.log(err)));
    };
    updatePortfolio = portfolio => {
        return (portApi.update(portfolio)
            .then(res => this.setState({ error: false }))
            .catch(err => { console.log(err); this.setState({ error: true }) }));
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
                price: parseFloat(price),
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
                price: parseFloat(price),
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
        const price = this.handleNumber(quoteData.data.latestPrice);
        const userResp = prompt(`Current Balance: ${this.state.result.balance}\n
                Please enter an amount of ${name} stock you would like to purchase at $${price}`);
        const userQuant = parseInt(userResp, 10);
        if (userQuant === null || isNaN(userQuant) || userQuant === undefined || userQuant === 0) {
            alert("Please enter a number");
        }
        else if (userQuant * price > this.state.result.balance) {
            alert(`The quantity of stock you purchased ${userQuant} has a total price of $${this.handleNumber(userQuant * price)} which is greater than your Current Balance: ${this.state.result.balance}`)
        }
        else {
            const conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                    This will cost $${price} per share for a total of $${this.handleNumber(userQuant * price)}\n
                    press OK to continue`);
            if (conf) {
                const existingStock = await this.getStock(price);
                console.log(existingStock, "exist");
                const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) - parseFloat(userQuant * price));
                console.log(tempPort);
                if (existingStock == null || existingStock == undefined) {
                    console.log("here")
                    const tempStock = await this.makeTempStock(name, userQuant, symbol, imageLink, price);
                    await Promise.all([this.updatePortfolio(tempPort), this.makeStock(tempStock)]);
                }
                else {
                    console.log("there")
                    const newQuant = parseInt(existingStock.quantity) + parseInt(userQuant);
                    const tempStock = await this.makeTempStock(name, newQuant, symbol, imageLink, price, existingStock.id);
                    await Promise.all([this.updatePortfolio(tempPort), this.updateStock(tempStock)]);
                }
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
        const newPrice = this.handleNumber(quoteData.data.latestPrice);
        let userResp = prompt(`Current Balance: ${this.state.result.balance}\n
                Please enter an amount of ${name} stock you would like to sell at Current Price: $${newPrice}.\n
                Original Price: $${originalPrice}`);
        const userQuant = parseInt(userResp, 10);
        if (userQuant === null || isNaN(userQuant) || userQuant === undefined || userQuant === 0) {
            alert("Please enter a number");
        }
        else if (userQuant > quantity) {
            alert("You don't have that much of this stock");
        }
        else {
            let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
                    This will add $${newPrice} per share to your account for a total of $${this.handleNumber(userQuant * newPrice)} 
                    and a net change of $${this.handleNumber((userQuant * newPrice) - (userQuant * originalPrice))}.\n
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
                    const tempStock = this.makeTempStock(name, (quantity - userQuant), symbol, imageLink, originalPrice, id);
                    await this.updateStock(tempStock);
                    this.searchPortfolios(this.state.userId);
                }
            }
            else {
                alert("Ok then...")
            }
        }
    };
    handleDelete = async (id, name, quantity, symbol, price) => {
        console.log(id);
        const quoteData = await this.getPrice(symbol);
        console.log(quoteData.data, new Date());
        const newPrice = this.handleNumber(quoteData.data.latestPrice);
        let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
        Are you sure you want to delete batch of ${quantity} ${name} stock at $${price}?
        Current Price $${newPrice}`);
        const tempPort = this.makeTempPortfolio(parseFloat(this.state.result.balance) + parseFloat(quantity * newPrice));
        if (conf) {
            await Promise.all([this.deleteStock(id), this.updatePortfolio(tempPort)]);
            console.log(tempPort)
            this.searchPortfolios(this.state.userId);
        }
        else {
            alert("Ok, fine.");
        }
    };
    // handleFormSubmit = async event => {
    //     event.preventDefault();
    //     this.setState({
    //         companies: []
    //     });
    //     if (this.state.stockName !== "" && (this.state.quantity > 0)) {
    //         let symbol = "";
    //         if (localStorage.getItem(this.state.stockName) === null) {
    //             alert("Stock name not found");
    //         }
    //         else {
    //             symbol = localStorage.getItem(this.state.stockName);
    //             const quoteData = await this.getPrice(symbol);
    //             console.log(quoteData.data, new Date());
    //             const price = this.handleNumber(quoteData.data.latestPrice);
    //             if ((this.state.quantity * price) > this.state.result.balance) {
    //                 alert("You cannot afford that much");
    //             }
    //             else {
    //                 let conf = window.confirm(`Current Balance: ${this.state.result.balance}\n
    //                     This will cost $${price} per share for a total of $${this.handleNumber(this.state.quantity * price)}\n
    //                     press OK to continue`);
    //                 if (conf) {
    //                     const existingStock = await this.getStock(price);
    //                     console.log(existingStock, "exist");
    //                     let imageQuery = await this.getLogo(symbol);
    //                     console.log(imageQuery, "img");
    //                     const imageLink = imageQuery.data.url;
    //                     console.log(symbol, price, imageLink, new Date());
    //                     const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) - parseFloat(this.state.quantity * price));
    //                     console.log(tempPort)
    //                     if (existingStock == null || existingStock == undefined) {
    //                         const tempStock = await this.makeTempStock(this.state.stockName, this.state.quantity, symbol, imageLink, price);
    //                         await Promise.all([this.updatePortfolio(tempPort), this.makeStock(tempStock)]);
    //                     }
    //                     else {
    //                         const newQuant = parseInt(existingStock.quantity) + parseInt(this.state.quantity);
    //                         const tempStock = await this.makeTempStock(this.state.stockName, newQuant, symbol, imageLink, price, existingStock.id);
    //                         await Promise.all([this.updatePortfolio(tempPort), this.updateStock(tempStock)]);
    //                     }
    //                     this.setState({
    //                         quantity: 0,
    //                         stockName: ""
    //                     })
    //                     this.searchPortfolios(this.state.userId)
    //                 }
    //                 else {
    //                     alert("Ok, then");
    //                 }
    //             }
    //         }
    //     }
    //     else {
    //         alert("Please fill out required fields!");
    //     }
    // };
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
                const quoteData = await this.getPrice(symbol);
                console.log(quoteData.data, new Date());
                const price = this.handleNumber(quoteData.data.latestPrice);
                if ((this.state.quantity * price) > this.state.result.balance) {
                    alert("You cannot afford that much");
                }
                else {
                    let tempPack = { price: price }
                    tempPack.message = (`Current Balance: ${this.state.result.balance}\n
                        This will cost $${price} per share for a total of $${this.handleNumber(this.state.quantity * price)}\n
                        press OK to continue`);
                    tempPack.symbol=symbol;
                    this.setState({
                        datapack: tempPack,
                        isShowingModal: true,
                        mode: "submit"
                    });
                }
            }
        }
        else {
            alert("Please fill out required fields!");
        }
    };
    handleFormSubmit2 = async (datapack, event) => {
        event.preventDefault();
        const existingStock = await this.getStock(datapack.price);
        console.log(existingStock, "exist");
        let imageQuery = await this.getLogo(datapack.symbol);
        console.log(imageQuery, "img");
        const imageLink = imageQuery.data.url;
        console.log(datapack.symbol, datapack.price, imageLink, new Date());
        const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) - parseFloat(this.state.quantity * datapack.price));
        console.log(tempPort)
        if (existingStock == null || existingStock == undefined) {
            const tempStock = await this.makeTempStock(this.state.stockName, this.state.quantity, datapack.symbol, imageLink, datapack.price);
            await Promise.all([this.updatePortfolio(tempPort), this.makeStock(tempStock)]);
        }
        else {
            const newQuant = parseInt(existingStock.quantity) + parseInt(this.state.quantity);
            const tempStock = await this.makeTempStock(this.state.stockName, newQuant, datapack.symbol, imageLink, datapack.price, existingStock.id);
            await Promise.all([this.updatePortfolio(tempPort), this.updateStock(tempStock)]);
        }
        this.setState({
            quantity: 0,
            stockName: "",
            isShowingModal: false
        })
        this.searchPortfolios(this.state.userId)
    }
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
    // getStockDifferences=async(stock)=>{
    //     let price = await this.getPrice(stock.symbol)
    //     return price.data.latestPrice;
    // }
    // getSum=async()=>{
    //     let sum = 0;
    //     for(let i=0;this.state.Stocks.length;i++){
    //         sum+= await this.getStockDifferences(this.state.Stocks[i]);
    //     }
    //     console.log(sum)
    //     this.setState({
    //         loading: false
    //     })
    //     return sum;
    // }
    editPortfolio = (quant, datapack, event) => {
        event.preventDefault();
        this.updatePortfolio(this.makeTempPortfolio(quant))
            .then(res => {
                if (!this.state.error) {
                    console.log('here')
                    this.searchPortfolios(this.state.userId);
                }
                else {
                    this.setState({ errorMessage: "Incorrect Inputs, digits only" });
                    console.log('there', this.state.error, this.state.errorMessage)
                }
            })
    };
    testHandleSell = async (quant, datapack, event) => {
        event.preventDefault();
        console.log(datapack);
        let tempPack = datapack;
        const quoteData = await this.getPrice(datapack.symbol);
        console.log(quoteData.data, new Date());
        const newPrice = this.handleNumber(quoteData.data.latestPrice);
        let userResp = quant;
        const userQuant = parseInt(userResp, 10);
        console.log(userQuant)
        if (userQuant === null || isNaN(userQuant) || userQuant === undefined || userQuant === 0) {
            alert("Please enter a number greater than 0");
        }
        else if (userQuant > datapack.quantity) {
            alert("You don't have that much of this stock");
        }
        else {
            tempPack.message = (`Current Balance: ${this.state.result.balance}\n
                    This will add $${newPrice} per share to your account for a total of $${this.handleNumber(userQuant * newPrice)} 
                    and a net change of $${this.handleNumber((userQuant * newPrice) - (userQuant * datapack.price))}.\n
                    Press OK to continue`);
            tempPack.userQuant = userQuant;
            tempPack.newPrice = newPrice;
            this.setState({
                datapack: tempPack,
                isShowingModal: true,
                mode: "sell"
            });
        }
    };
    testHandleSell2 = async (datapack, event) => {
        event.preventDefault();
        this.setState({
            prompting: false,
            isShowingModal: false
        });
        const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) + parseFloat(datapack.userQuant * datapack.newPrice));
        if (datapack.userQuant === datapack.quantity) {
            console.log(tempPort, "del");
            await this.deleteStock(datapack.id);
            await this.updatePortfolio(tempPort);
            this.searchPortfolios(this.state.userId) //technically these are never accessed because updatePortfolio changes state and therefore rerenders the page
        }
        else {
            const tempStock = this.makeTempStock(datapack.name, (datapack.quantity - datapack.userQuant), datapack.symbol, datapack.imageLink, datapack.price, datapack.id);
            await this.updateStock(tempStock);
            console.log(tempStock, "put")
            await this.updatePortfolio(tempPort);
            this.searchPortfolios(this.state.userId);
        }
    };
    testHandleAdd = async (quant, datapack, event) => {
        event.preventDefault();
        let tempPack = datapack;
        const quoteData = await this.getPrice(datapack.symbol);
        console.log(quoteData.data, new Date());
        const price = this.handleNumber(quoteData.data.latestPrice);
        const userResp = quant;
        const userQuant = parseInt(userResp, 10);
        console.log(userQuant)
        if (userQuant === null || isNaN(userQuant) || userQuant === undefined || userQuant === 0) {
            alert("Please enter a number greater than 0");
        }
        else if (userQuant * price > this.state.result.balance) {
            alert(`The quantity of stock you purchased ${userQuant} has a total price of $${this.handleNumber(userQuant * price)} which is greater than your Current Balance: ${this.state.result.balance}`)
        }
        else {
            tempPack.message = (`Current Balance: $${this.state.result.balance}\n
                    This will cost $${price} per share for a total of $${this.handleNumber(userQuant * price)}\n
                    press OK to continue`);
            tempPack.userQuant = userQuant;
            tempPack.price = price;
            this.setState({
                datapack: tempPack,
                isShowingModal: true,
                mode: "add"
            });
        }
    };
    testHandleAdd2 = async (datapack, event) => {
        event.preventDefault();
        this.setState({
            prompting: false,
            isShowingModal: false
        });
        const existingStock = await this.getStock(datapack.price);
        console.log(existingStock, "exist");
        const tempPort = await this.makeTempPortfolio(parseFloat(this.state.result.balance) - parseFloat(datapack.userQuant * datapack.price));
        console.log(tempPort);
        if (existingStock === null || existingStock === undefined) {
            console.log("here")
            const tempStock = await this.makeTempStock(datapack.name, datapack.userQuant, datapack.symbol, datapack.imageLink, datapack.price);
            await Promise.all([this.updatePortfolio(tempPort), this.makeStock(tempStock)]);
        }
        else {
            console.log("there")
            const newQuant = parseInt(existingStock.quantity) + parseInt(datapack.userQuant);
            const tempStock = await this.makeTempStock(datapack.name, newQuant, datapack.symbol, datapack.imageLink, datapack.price, existingStock.id);
            await Promise.all([this.updatePortfolio(tempPort), this.updateStock(tempStock)]);
        }
        this.searchPortfolios(this.state.userId);
    };
    testHandleEdit = async (quant, datapack, event) => {
        event.preventDefault();
        const tempStock = await this.makeTempStock(datapack.name, datapack.quantity, datapack.symbol, datapack.imageLink, quant, datapack.id);
        this.updateStock(tempStock)
            .then(() => {
                this.setState({ prompting: false });
                this.searchPortfolios(this.state.userId);
            })
    }
    makeDatapack = async (datapack) => {
        let tempPack = datapack;
        console.log(datapack);
        const quoteData = await this.getPrice(datapack.symbol);
        console.log(quoteData.data, new Date());
        const newPrice = this.handleNumber(quoteData.data.latestPrice);
        tempPack.newPrice = newPrice;
        this.setState({
            datapack: tempPack,
            prompting: true
        })
        console.log(tempPack);
    }
    cancelOut = event => {
        event.preventDefault();
        this.setState({ prompting: false });
    };
    handleClose = () => {
        this.setState({
            isShowingModal: false
        })
    }
    render = () => {
        return (
            <div>{!Auth.isUserAuthenticated() ?
                (<div>
                    <Link to="/">
                        <div>
                            Sign in to view your portfolio.
                        </div>
                    </Link>
                </div>) :
                <div className="container">
                    <Conf
                        isShowingModal={this.state.isShowingModal}
                        handleClose={this.handleClose}
                        datapack={this.state.datapack}
                        mode={this.state.mode}
                        handleAdd2={this.testHandleAdd2}
                        handleSell2={this.testHandleSell2}
                        handleFormSubmit2={this.handleFormSubmit2}
                    />
                    <div className="portfolio">
                        {this.state.loading ? (<div>loading...</div>) :
                            (<div>
                                <h1>{this.state.result.userName}</h1>
                                <h2>Current Balance: ${this.state.result.balance}</h2> <ToggleElement
                                    offMessage={"Edit Balance"}
                                    onMessage={"Cancel"}
                                    titleMessage={"Edit Balance"}
                                    inputType={"number"}
                                    name={"balancer"}
                                    placeholder={"Quantity (required)"}
                                    method={this.editPortfolio}
                                />
                                {!this.state.error ? (<div> </div>) : (<p>{this.state.errorMessage}</p>)}
                                {this.state.Stocks.length === 0 ? (
                                    <div>
                                        <h2>
                                            Looks like you don't have any stocks. Why don't you buy some?
                                    </h2>
                                    </div>) : (
                                        <div>
                                            {this.state.Stocks.map(stock => (<Stock
                                                key={stock.name}
                                                name={stock.name}
                                                args={stock.args}
                                                symbol={stock.symbol}
                                                imageLink={stock.imageLink}
                                                handleDelete={this.handleDelete}
                                                handleAdd={this.handleAdd}
                                                handleSell={this.handleSell}
                                                testHandleSell={this.testHandleSell}
                                                makeDatapack={this.makeDatapack}
                                            />))}
                                        </div>)}
                            </div>)}
                    </div>
                    {/* <button onClick={()=>(console.log(this.getPrice("AAPL")))}>test</button> */}
                    {/* {!this.state.prompting ? ( */}
                    {/* <h2>Current Value of stocks: {this.state.sum}</h2> */}
                    {this.state.prompting ? (
                        <Sidebar
                            cancelOut={this.cancelOut}
                            datapack={this.state.datapack}
                            testHandleSell={this.testHandleSell}
                            testHandleEdit={this.testHandleEdit}
                            testHandleAdd={this.testHandleAdd}

                        />) : (
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
                            </div>)}
                    {/* ) : (
                //     //     <form>
                //     //         Quantity:
                //     // <input
                //     //             value={this.state.quantity}
                //     //             onChange={this.handleInputChange}
                //     //             name="quantity"
                //     //             placeholder={this.state.quantity}
                //     //         />
                //     //         <button onClick={this.handleEditSubmit}>
                //     //             submit
                //     //     </button>
                //     //     </form>
                //     <div>
                //         {this.state.message}
                //         <button onClick={()=>(this.setState({prompting:false}))}>ok</button>
                //     </div>
                //     <button onClick = {this.editPortfolio}>Edit Balance</button>
                //        //<div/>
                //     )
                // } */}
                </div>
            }</div>
        );
    };
}
export default Portfolio;
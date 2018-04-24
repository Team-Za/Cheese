import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import { portApi, stockApi, userApi } from "../utils/serverAPI";
import '../Views/app.scss';
import Navbar from "./Navbar";
import Stock from "./Stock";
import { Promise } from 'core-js';
import Auth from '../modules/Auth';

const formColor = {
  color: "white"
}
class MarketSample extends React.Component {
  state = {
    result: [],
    loading: false,
    stockName: "",
    quantity: 0,
    userId: sessionStorage.getItem("UserId"),
    portId: -1,
    sidebarArgs: [],
    sidebarState: "add",
    companies: [],
    Stocks: [],
    testStocks: [
      { name: 'Apple', symbol: 'AAPL', imageLink: "https://storage.googleapis.com/iex/api/logos/AAPL.png", args: {quantity: 30, price: 165.72} }, 
      { name: 'Netflix Inc.', symbol: 'NFLX', imageLink: "https://storage.googleapis.com/iex/api/logos/NFLX.png", args: {quantity: 20, price: 327.77} },
      { name: 'Manchester United Ltd. Class A', symbol: 'MANU', imageLink: "https://storage.googleapis.com/iex/api/logos/MANU.png", args: {quantity: 50, price: 18.5} }, 
      { name: 'American Airlines Group Inc.', symbol: 'AAL', imageLink: "https://storage.googleapis.com/iex/api/logos/AAL.png", args: {price: 46.78, quantity: 15 }}]
    //prompting: false,
    //message: ""
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
          this.setState({
            quantity: 0,
            stockName: ""
          })
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
  setPortfolio() {
    userApi.getByUsername(sessionStorage.getItem("username"))
      .then(res2 => {
        const tempPort = {
          userName: res2.username,
          balance: 10000,
          UserId: res2.id
        }
        sessionStorage.setItem("UserId", res2.id);
        portApi.create(tempPort)
          .then(() => {
            console.log("Step 2 complete");
          })
      })
      .catch(err => console.log(err))
  };
  render = () => {
    return (
      <div className="container-fluid">
        <div className="portfolio col-md-5">
          {this.state.loading ? (<div>loading...</div>) :
            (<div>
              <div className="panel-header">Your Stocks</div>
              <div className="panel-header">Current Balance: ${this.state.result.balance}</div>
              {this.state.testStocks.length == 0 ? (
                <div>
                  <h2>
                    Looks like you don't have any stocks. Why don't you buy some?
                                </h2>
                </div>) : (
                  <div>
                    {this.state.testStocks.map(stock =>
                      <div className="stock col-md-12">
                        <div className="each-stock">
                          <div className="each-stock-info col-md-2"><img className="thumbnail" src={stock.imageLink} /></div>
                          <div className="each-stock-info col-md-3"> {stock.name}</div>
                          <div className="each-stock-info col-md-2"> {stock.symbol}</div>
                          <div className="stock-amount-holder">
                          
                              <div>

                                <div className="each-stock-info col-md-2"> {stock.args.quantity}</div>
                                <div className="each-stock-info col-md-3"> {stock.args.price}</div>
                                {/* <button onClick={() => this.props.handleDelete(element.id, this.props.name, element.quantity, element.price)} className="remove">
                                Sell All
                            </button> */}

                                <div className={`sell-btn ${this.state.activeClass}`}><i className="fas fa-minus-square minus-btn"></i></div>
                              </div>
                            
                          </div>
                        </div>
                        <div className={`add-btn ${this.state.activeClass}`}>
                          <i className="fas fa-plus-square plus-btn"></i>
                        </div>
                      </div>
                    )}
                  </div>)}
            </div>)}
        </div>
        {/* <button onClick={()=>(console.log(this.getPrice("AAPL")))}>test</button> */}
        {/* {!this.state.prompting ? ( */}
        <div className="row col-md-6 col-md-offset-1">
          <form>
            <fieldset>
              <legend style={formColor}>Add More Stocks</legend>
              <div className="panel-header">Stock Name:</div>
              <div className="field-line">
                <input
                  className="sign-up-inputs"
                  value={this.state.stockName}
                  onChange={this.handleInputChange}
                  name="stockName"
                  placeholder="Name of stock (required)"
                />
              </div>
              <div className="panel-header">Quantity:</div>
              <div className="field-line">
                <input
                  className="sign-up-inputs"
                  value={this.state.quantity}
                  onChange={this.handleInputChange}
                  name="quantity"
                  placeholder="Quantity (required)"
                />
              </div>
              <div className="submit-btn">
                <input className="sign-up-button" type="submit" onClick={this.handleFormSubmit} value="Add Stock" />
              </div>
            </fieldset>
          </form>
          <div>
            <ul>
              {this.state.companies.map(company => (
                <div className="company" onClick={() => this.setState({ stockName: company })}>{company}</div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
}
export default MarketSample;
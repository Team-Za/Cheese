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

class Market extends React.Component {
  state = {
    result: [],
    loading: true,
    stockName: "",
    quantity: 0,
    userId: sessionStorage.getItem("UserId"),
    portId: -1,
    sidebarArgs: [],
    sidebarState: "add",
    companies: [],
    Stocks: [],
    errorMessage: "",
    error: false,
    datapack: {},
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
  handleFormSubmit = async event => {
    event.preventDefault();
    this.setState({
      companies: []
    });
    if (this.state.stockName !== "" && (this.state.quantity > 0)) {
      let symbol = "";
      if (localStorage.getItem(this.state.stockName) === null) {
        this.setState({errorStock: "Stock name not found"});
        this.setState({errorAlert: ""});
      }
      else {
        symbol = localStorage.getItem(this.state.stockName);
        const quoteData = await this.getPrice(symbol);
        console.log(quoteData.data, new Date());
        const price = this.handleNumber(quoteData.data.latestPrice);
        if ((this.state.quantity * price) > this.state.result.balance) {
          this.setState({errorAlert: "You cannot afford that much"});
        }
        else {
          let tempPack = { price: price }
          tempPack.message = (<div>
              <div className="single-modal-message">Current Balance: <span className="modal-balance">${this.state.result.balance}</span></div>
                  <div className="single-modal-message">This will cost <span className="modal-price">${price}</span> per share for a total of <span className="modal-price">${this.handleNumber(this.state.quantity * price)}</span>.</div>
                  <div className="single-modal-message">Press OK to continue</div>
                  </div>);
          tempPack.symbol = symbol;
          this.setState({errorAlert: ""})
          this.setState({errorStock: ""})
          this.setState({
            datapack: tempPack,
            isShowingModal: true,
            mode: "submit"
          });
        }
      }
    }
    else {
      this.setState({errorAlert: "Please fill out required fields with proper input!"});
      this.setState({errorStock: ""});
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
        indices.set(stock.name, choices.length - 1);
      }
    }
    choices.sort((name1, name2) => {
      return name1.name.localeCompare(name2.name);
    });
    this.setState({
      Stocks: choices,
      loading: false
    });
    return choices;
  };
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
      this.setState({errorAlertSide: "Please enter a number greater than 0"});
    }
    else if (userQuant > datapack.quantity) {
      this.setState({errorAlertSide: "You don't have that much of this stock"});
    
    } else {
      tempPack.message = (<div>
      <div className="single-modal-message">Current Balance: <span className="modal-balance">${this.state.result.balance}</span></div>
      <div className="single-modal-message">This will add <span className="modal-new-price">${newPrice}</span> per share to your account for a total of <span className="modal-new-price">${this.handleNumber(userQuant * newPrice)} </span>
                and a net change of <span className="modal-new-price">${this.handleNumber((userQuant * newPrice) - (userQuant * datapack.price))}</span>.</div>
                <div className="single-modal-message">Press OK to continue</div></div>);
      tempPack.userQuant = userQuant;
      tempPack.newPrice = newPrice;
      this.setState({
        datapack: tempPack,
        isShowingModal: true,
        mode: "sell"
      });
      this.setState({errorAlertSide: ""});
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
      this.setState({errorAlertSide: "Please enter a number greater than 0"});
    }
    else if (userQuant * price > this.state.result.balance) {
      this.setState({errorAlertSide: `The quantity of stock you purchased ${userQuant} has a total price of $${this.handleNumber(userQuant * price)} which is greater than your Current Balance: ${this.state.result.balance}`})
    }
    else {
      tempPack.message = (<div>
        <div className="single-modal-message">Current Balance: <span className="modal-balance">${this.state.result.balance}</span></div>
        <div className="single-modal-message">This will cost <span className="modal-price">${price}</span> per share for a total of <span className="modal-total">${this.handleNumber(userQuant * price)}.</span></div>
        <div className="single-modal-message">Press OK to continue</div>
        </div>);
      tempPack.userQuant = userQuant;
      tempPack.price = price;
      this.setState({
        datapack: tempPack,
        isShowingModal: true,
        mode: "add"
      });
      this.setState({errorAlertSide: ""});
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
      <div className="container-fluid">
        <Conf
          isShowingModal={this.state.isShowingModal}
          handleClose={this.handleClose}
          datapack={this.state.datapack}
          mode={this.state.mode}
          handleAdd2={this.testHandleAdd2}
          handleSell2={this.testHandleSell2}
          handleFormSubmit2={this.handleFormSubmit2}
        />
        <div className="portfolio col-md-5">
          {this.state.loading ? (<div>Loading...</div>) :
            (<div>
              <div className="panel-header balance-container">Current Balance: <span className="current-balance">${this.state.result.balance}</span>
                <div className="edit-balance">
                  <ToggleElement
                    offMessage={"Edit"}
                    onMessage={"Cancel"}
                    titleMessage={"Edit"}
                    inputType={"number"}
                    name={"balancer"}
                    placeholder={"Quantity (required)"}
                    method={this.editPortfolio}
                  /></div>
              </div>
              <div className="panel-header">Your Stocks</div>
              {!this.state.error ? (<div> </div>) : (<p>{this.state.errorMessage}</p>)}
              {this.state.Stocks.length == 0 ? (
                <div>
                  <h5>
                    Looks like you don't have any stocks. Why don't you buy some?
                                </h5>
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
                      makeDatapack={this.makeDatapack}
                    />))}
                  </div>)}
            </div>)}
        </div>
        {this.state.prompting ? (
          <div className="row col-md-6 col-md-offset-1 add-stocks">
            <Sidebar
              datapack={this.state.datapack}
              testHandleSell={this.testHandleSell}
              testHandleAdd={this.testHandleAdd}
              testHandleEdit={this.testHandleEdit}
              cancelOut={this.cancelOut}
              errorAlertSide={this.state.errorAlertSide}
            />
          </div>) : (
            <div className="row col-md-6 col-md-offset-1 add-stocks">
              <form>
                <fieldset>
                  <div className="legend" >Add More Stocks</div>
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
                  <div><p className="error-message">{this.state.errorStock}</p></div>
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
                  <div><p className="error-message">{this.state.errorAlert}</p></div>
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
            </div>)}
      </div>
    );
  };
}
export default Market;
import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Organization from './Organization';
import API from "../utils/API";
import {portApi, userApi, stockApi} from "../utils/serverAPI"
import '../Views/app.scss';
import Symbols from "./Symbols"
import Navbar from "./Navbar"

class HomeContainer extends React.Component {
    state = {
      result: [],
      search: ""
    };
  
    
    componentDidMount() {
      // this.searchSymbols("https://api.iextrading.com/1.0/ref-data/symbols");
    }
  
    searchSymbols = query => {
      API.allSymbols(query)
        .then(res => {console.log(res.data); this.setState({ result: res.data })})
        .catch(err => console.log(err));
    };
  
    render() {
      return (
       <div className="container-fluid">
        <Navbar />
        {/* {this.state.result.map(stocks =>(
          <Symbols result={stocks.symbol} key={stocks.iexid}/>
        ))} */}
       </div>
      );
    }
  }
  
  export default HomeContainer;
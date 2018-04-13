import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Organization from './Organization';
import API from "../utils/API";
import '../Views/app.scss';
import Symbols from "./Symbols"
import Navbar from "./Navbar"

class Charts extends React.Component {
    state = {
      result: [],
      search: ""
    };
  
    
    componentDidMount() {
      this.searchSymbols("https://api.iextrading.com/1.0/ref-data/symbols");
    }
  
    searchSymbols = query => {
      API.allSymbols(query)
        .then(res => {console.log(res.data); this.setState({ result: res.data })})
        .catch(err => console.log(err));
    };
  
    render() {
      return (
       <div className="charts">
        
       </div>
      );
    }
  }
  
  export default HomeContainer;
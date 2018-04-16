import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import API from "../utils/API";
import '../Views/app.scss';
import Navbar from "./Navbar";
import DowChart from './DowChart';
import Sp500 from './Sp500Data';

class Dashboard extends React.Component {
  state = {
    result: []
  };


  componentDidMount() {
    this.searchSymbols("/ref-data/symbols");
  }

  searchSymbols = query => {
    API.allSymbols(query)
      .then(res => { console.log(res.data); this.setState({ result: res.data }) })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="container">
        <Navbar />
      </div>
    );
  }
}

export default Dashboard;
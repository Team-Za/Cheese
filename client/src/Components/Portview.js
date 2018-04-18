import React from "react";
import { Link } from "react-router-dom";
import Stock from "./Stock"
const Portview = props => (
  <div className="port">
    <h1>{props.userName}</h1>
    <div>
      {props.Stocks.map(stock=>(<Stock
          id={stock.id}
          key={stock.id}
          name={stock.name}
          imageLink={stock.imageLink} 
          quantity={stock.quantity}
          symbol={stock.symbol}
          price={stock.price}
      />))}
    </div>
  </div>
);

export default Portview;
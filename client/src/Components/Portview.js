import React from "react";
import { Link } from "react-router-dom";
import Stock from "./Stock"
const Portview = props => (
  <div className="port">
    <h1>{props.userName}</h1>
    <div>
      {props.Stocks.map(stock=>(<Stock
          key={stock.name}
          name={stock.name}
          // quantity={stock.quantity}
          args={stock.args}
          symbol={stock.symbol}
          imageLink={stock.imageLink} 
          // price={stock.price}
          PortfolioId={stock.PortfolioId}
          handleDelete={props.handleDelete}
          handleEdit={props.handleEdit}
          handleAdd={props.handleAdd}
          handleEditSubmit={props.handleEditSubmit}
          handleInputChange={props.handleInputChange}
          stateQuant={props.stateQuant}
      />))}
    </div>
  </div>
);

export default Portview;
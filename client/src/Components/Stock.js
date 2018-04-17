import React from "react";
import { Link } from "react-router-dom";
const Stock = props => (
    <div className="stock">
        <div>
            Stock: {props.name}
            Symbol: {props.symbol}
            Image: {props.imageLink}
            Quantity: {props.quantity}
            Price: {props.price}
        </div>
    </div>
);
export default Stock;
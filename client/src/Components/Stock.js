import React from "react";
import { Link } from "react-router-dom";

class Stock extends React.Component {
    // componentDidMount() {
    //     //this.show = false;
    //     //this.quantity = 0;
    // }
    render = () => {
        return (
            <div className="stock">
                <div>
                    Stock: {this.props.name} Symbol: {this.props.symbol} Image: <img src={this.props.imageLink} />
                    {this.props.args.map(element => (
                        <div key={element.id}>
                            Quantity:{element.quantity} Price:{element.price}
                            <button onClick={() => this.props.handleDelete(element.id, this.props.name, element.quantity, this.props.symbol, element.price)} className="remove">
                                Sell All
                            </button>
                            <button onClick={() => this.props.handleSell(element.id, this.props.name, element.quantity, this.props.symbol, this.props.imageLink, element.price)} className="add">
                                Sell
                            </button>
                        </div>))}
                </div>
                <button onClick={() => this.props.handleAdd(this.props.name, this.props.symbol, this.props.imageLink)} className="add">
                    add more
                </button>
            </div>
        )
    }
}
export default Stock;
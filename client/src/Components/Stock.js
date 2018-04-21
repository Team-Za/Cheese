import React from "react";
import { Link } from "react-router-dom";

class Stock extends React.Component {
    // componentDidMount() {
    //     //this.show = false;
    //     //this.quantity = 0;
    // }
    render() {
        return (
            <div className="stock">
                <div>
                    Stock: {this.props.name}
                    Symbol: {this.props.symbol}
                    Image: <img src={this.props.imageLink} />
                    {this.props.args.map(element => (
                        <div key={element.id}>
                            Quantity:{element.quantity}
                            Price:{element.price}
                            {/* <button onClick={() => {
                                // if (!this.show) {
                                    // this.show = true;
                                    // this.quantity = element.quantity;
                                    this.props.handleEdit(element.id, this.props.name, element.quantity, this.props.symbol, this.props.imageLink, element.price, this.props.PortfolioId);
                                // }
                                // else{
                                //     this.show=false;
                                // }
                            }} className="edit">
                                edit
                            </button> */}
                            <button onClick={() => this.props.handleDelete(element.id, this.props.name, element.quantity, element.price)} className="remove">
                                Sell All
                            </button>
                            <button onClick={() => this.props.handleSell(element.id, this.props.name, element.quantity, this.props.symbol, this.props.imageLink, element.price, this.props.PortfolioId)} className="add">
                                Sell
                            </button>
                            {/* {!this.show ? (<div />) : (
                                <form>
                                    Quantity:
                                    <input
                                        key={element.id}
                                        value={this.quantity}
                                        onChange={this.props.handleInputChange}
                                        {...console.log(`quantity${element.id}`)}
                                        name={`quantity${element.id}`}
                                        placeholder={element.quantity}
                                    />
                                    <button onClick={() => {
                                        this.props.handleEditSubmit();
                                        this.show = false;
                                    }}>
                                        submit
                                    </button>
                                </form>
                            )} */}
                        </div>))}
                </div>
                <button onClick={() => this.props.handleAdd(this.props.name, this.props.symbol, this.props.imageLink, this.props.PortfolioId)} className="add">
                    add more
                </button>
            </div>
        )
    }
}
export default Stock;
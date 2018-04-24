import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ToggleElement from "./ToggleElement";
const buttonColor = {
    color: "black"
}
class Stock extends React.Component {
    state = {
        activeClass: "hide"
      };

       // componentDidMount() {
    //     //this.show = false;
    //     //this.quantity = 0;
    // }

    changeClass = className => {
        this.setState({
            activeClass: className
        })
    }

    render = () => {
        return (
            <div className="stock col-md-12" onMouseOver={() => this.changeClass("show")} onMouseOut={() => this.changeClass("hide")}>
                <div className="each-stock">
                    <div className="each-stock-info col-md-2"><img className="thumbnail" src={this.props.imageLink} /></div>
                    <div className="each-stock-info col-md-3"> {this.props.name}</div>
                    <div className="each-stock-info col-md-2"> {this.props.symbol}</div>
                    <div className="stock-amount-holder">
                    {this.props.args.map(element => (
                        <div key={element.id}>
                            <div className="each-stock-info col-md-2"> {element.quantity}</div>
                            <div className="each-stock-info col-md-3"> {element.price}</div>  <button style = {buttonColor} onClick={()=> this.props.makeDatapack({id:element.id, name:this.props.name, quantity:element.quantity, symbol:this.props.symbol, imageLink:this.props.imageLink, price:element.price})}>edit</button>                        
                            {/* <div className={`sell-btn ${this.state.activeClass}`} onClick={() => this.props.handleSell(element.id, this.props.name, element.quantity, this.props.symbol, this.props.imageLink, element.price)}><i className="fas fa-minus-square minus-btn"></i></div> */}
                            {/* <ToggleElement
                                offMessage={"Sell"}
                                onMessage={"Cancel"}
                                titleMessage={"Input the amount you want to sell"}
                                inputType={"number"}
                                name={`sellField${element.id}`}
                                placeholder={"Quantity (required)"}
                                method={this.props.testHandleSell}
                                datapack={[{id:element.id, name:this.props.name, quantity:element.quantity, symbol:this.props.symbol, imageLink:this.props.imageLink, price:element.price}]}
                            /> */}
                            {/* <button onClick={() => this.props.handleDelete(element.id, this.props.name, element.quantity, element.price)} className="remove">
                                Sell All
                            </button> */}
                            </div> 
                        ))}
                        </div>
                </div>
                {/* <div className={`add-btn ${this.state.activeClass}`} onClick={() => this.props.handleAdd(this.props.name, this.props.symbol, this.props.imageLink)}>
                <i className="fas fa-plus-square plus-btn"></i>
                </div> */}
            </div>
        )
    }
}
export default Stock;
import React from 'react';
const buttonColor = {
    color: "black"
}
const titleColor = {
    color: "white"
}
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: false,
            quantity: 0,
            errorMessage: "",
            barstate:"Buy",
            buyBtn: "active-btn-buy",
            sellBtn: ""
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }
    handleInputChange = event => {
        const { name, value } = event.target;
        const checker1 = value.length;
        const checker2 = parseFloat(value);
        console.log("sidebaring it", value, name, checker1, checker2, isNaN(checker2));
        if (isNaN(checker2)) {
            console.log("Incorrect input type")
            this.setState({
                errorMessage: "Incorrect input type"
            });
            console.log(this.state.errorMessage)
        }
        else if (checker1 > 8) {
            console.log("Max of 8 digits")
            this.setState({
                errorMessage: "Max of 8 digits"
            });
        }
        else {
            console.log("execute", value, name, checker1, checker2)
            this.setState({
                quantity: value,
                errorMessage: ""
            });
        }
    };
    handleClick = () => {
        this.setState(prevState => (console.log(this.state.isToggleOn), {
            isToggleOn: !prevState.isToggleOn
        }));
    }

    changeActiveClass = whichButton => {
        if(whichButton === "sell") {
            this.setState({
                buyBtn: "",
                sellBtn: "active-btn-sell"
            })
        } else {
            this.setState({
                buyBtn: "active-btn-buy",
                sellBtn: ""
            })
        }
    }

    render = () => {
        return (
            <div>
                <div>
                <div className="top-btns">
                <button className="cancel-btn" onClick={(e) => {
                    console.log(this.props);
                    this.props.cancelOut(e);
                }}>
                    Cancel
                </button>

                <button  className={`sell-btn ${this.state.sellBtn}`} onClick={() => {
                    this.changeActiveClass("sell");
                    this.setState({barstate:"Sell"})
                }}>
                    Sell
                </button>
                <button className={`buy-btn ${this.state.buyBtn}`} onClick={() => {
                    this.changeActiveClass("buy");
                    this.setState({barstate:"Buy"})
                }}>
                    Buy
                </button>
                </div>
                {/* {this.state.isToggleOn ? ( */}
                    <form>
                        <fieldset>
                            <h3>{this.state.errorMessage}</h3>
                            <legend><h3 style={titleColor}>{this.props.datapack.name}</h3></legend>
                            <div className="sidebar-field-line">
                            <input
                            className="sidebar-inputs"
                                style={buttonColor}
                                // value={this.state.quantity}
                                onChange={this.handleInputChange}
                                name={`input${this.props.datapack.name}`}
                                placeholder={"Amount"}
                                maxLength={8}
                            />
                            </div>
                            <h4>Price purchased: {this.props.datapack.price}</h4>
                            <h4>Current price: {this.props.datapack.newPrice}</h4>
                            <p>Current Mode: {this.state.barstate}</p>
                            <button style={buttonColor} onClick={(e) => {
                                if(this.state.barstate==="Buy"){
                                    console.log("adding");
                                    this.props.testHandleAdd(this.state.quantity, this.props.datapack, e);
                                }
                                else{
                                    console.log("selling");
                                    this.props.testHandleSell(this.state.quantity, this.props.datapack, e);
                                }
                            }}>
                                submit
                            </button>
                        </fieldset>
                    </form>
                {/* ):(<div/>)} */}
                </div>
            </div>
        );
    }
}
export default Sidebar

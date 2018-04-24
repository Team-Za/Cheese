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
            barstate:"Buy"
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
    render = () => {
        return (
            <div>
                <div>
                <button onClick={() => {
                    this.setState({barstate:"Sell"})
                }}>
                    Sell
                </button>
                <button onClick={() => {
                    this.setState({barstate:"Buy"})
                }}>
                    Buy
                </button>
                {/* {this.state.isToggleOn ? ( */}
                    <form>
                        <fieldset>
                            <h3>{this.state.errorMessage}</h3>
                            <legend><h3 style={titleColor}>{this.props.datapack.name}</h3></legend>
                            <input
                                style={buttonColor}
                                value={this.state.quantity}
                                onChange={this.handleInputChange}
                                name={`input${this.props.datapack.name}`}
                                placeholder={"Amount"}
                                maxLength={8}
                            />
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

import React from 'react';
const buttonColor = {
    color: "black"
}
const titleColor ={
    color:"white"
}
class ToggleElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: false,
            quantity: 0,
            errorMessage: ""
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }
    handleInputChange = event => {
        const { name, value } = event.target;
        const checker1 = value.length;
        const checker2 = parseFloat(value);
        console.log("doing it", value, name, event, typeof value, this.props.inputType, checker1, checker2, (this.props.inputType === "number"), isNaN(checker2), (this.props.inputType === "number"), (checker1 > 20));
        if ((this.props.inputType === "number") && (isNaN(checker2))) {
            console.log("Incorrect input type")
            this.setState({
                errorMessage: "Incorrect input type"
            });
            console.log(this.state.errorMessage)
        }
        else if ((this.props.inputType === "number") && (checker1 > 8)) {
            console.log("Max of 8 digits")
            this.setState({
                errorMessage: "Max of 8 digits"
            });
        }
        else {
            console.log("execute", value, name, event, typeof value, this.props.inputType, checker1, checker2)
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
                <div className="submit-btn">
                <button className="edit-button" onClick={this.handleClick}>
                    {this.state.isToggleOn ?
                        `${this.props.onMessage}`
                        :
                        `${this.props.offMessage}`}
                        </button>
                </div>
                {this.state.isToggleOn ? (
                    <div>
                        {console.log("show")}
                        <form>
                            <fieldset>
                                <h3>{this.state.errorMessage}</h3>
                                <input
                                    style={buttonColor}
                                    onChange={this.handleInputChange}
                                    name={`input${this.props.name}`}
                                    placeholder="Amount"
                                    maxLength={8}
                                />
                                <button style={buttonColor} onClick={(e) => { this.props.method(this.state.quantity, this.props.datapack, e); this.handleClick(); }}>
                                    submit
                                </button>
                            </fieldset>
                        </form>
                    </div>) :
                    <div>
                        {console.log("hide")}
                    </div>}
            </div>
        );
    }
}
export default ToggleElement

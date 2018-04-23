import React from 'react';

class ToggleElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isToggleOn: false,
            quantity:0 
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => (console.log(this.state.isToggleOn), {
            isToggleOn: !prevState.isToggleOn
        }));
    }
    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ?
                    <div>
                        `${this.props.onMessage}` <form>
                            <input/>
                        </form>
                    </div>
                    :
                    `${this.props.offMessage}`}
            </button>
        );
    }
}
export default ToggleElement

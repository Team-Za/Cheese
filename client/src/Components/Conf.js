import React, { PropTypes } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

class Conf extends React.Component {
    constructor(props){
        super(props);
    }
    chooseMethod = () => {
        if(this.props.mode==="add") {
                return <button onClick={(e) => {
                    console.log(this.props)
                    this.props.handleAdd2(this.props.datapack, e);
                }}>Ok</button>
        }
        else if(this.props.mode==="sell"){
            return <button onClick={(e) => {
                console.log(this.props)
                this.props.handleSell2(this.props.datapack, e);
            }}>Ok</button>
        }
        else{
            return <button onClick={(e) => {
                console.log(this.props)
                this.props.handleFormSubmit2(this.props.datapack, e);
            }}>Ok</button>
        }
    }
    render = () => {
        return <div>
            {
                this.props.isShowingModal &&
                <ModalContainer onClose={this.props.handleClose}>
                    <ModalDialog onClose={this.props.handleClose}>
                        <h1>Confirm</h1>
                        <p>{this.props.datapack.message}</p>
                        {console.log(this.props.method)}
                        <button onClick={this.props.handleClose}>Cancel</button> {this.chooseMethod()}
                    </ModalDialog>
                </ModalContainer>
            }
        </div>;
    }
}
export default Conf
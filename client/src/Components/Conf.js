import React, { PropTypes } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

class Conf extends React.Component {
    constructor(props){
        super(props);
    }
    chooseMethod = () => {
        if(this.props.mode==="add") {
                return <div className="modal-confirm-btn-container">
                <button className="modal-confirm-btn" onClick={(e) => {
                    console.log(this.props)
                    this.props.handleAdd2(this.props.datapack, e);
                }}>Ok</button></div>
        }
        else if(this.props.mode==="sell"){
            return <div className="modal-confirm-btn-container">
            <button className="modal-confirm-btn" onClick={(e) => {
                console.log(this.props)
                this.props.handleSell2(this.props.datapack, e);
            }}>Ok</button></div>
        }
        else{
            return <div className="modal-confirm-btn-container">
            <button className="modal-confirm-btn" onClick={(e) => {
                console.log(this.props)
                this.props.handleFormSubmit2(this.props.datapack, e);
            }}>Ok</button></div>
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
                        <div className="modal-btns-container">
                        <div className="modal-cancel-btn-container">
                        <button className="modal-cancel-btn" onClick={this.props.handleClose}>Cancel</button></div> {this.chooseMethod()}
                        </div>
                    </ModalDialog>
                </ModalContainer>
            }
        </div>;
    }
}
export default Conf
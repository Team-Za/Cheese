import React from 'react';
import NewModal from './NewModal'
class Confirm extends React.Component {

  state = {
    displayName: 'Confirm',
  }

  getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    };
  }

  abort() {
    return this.promise.reject();
  }

  confirm() {
    return this.promise.resolve();
  }

  componentDidMount() {
    this.promise = new Promise();
    return React.findDOMNode(this.refs.confirm).focus();
  }

  render() {
    var modalBody;
    if (this.props.description) {
      modalBody = (
        <div className='modal-body'>
          {this.props.description}
        </div>
      );
    }

    return (
      <NewModal>
        <div className='modal-header'>
          <h4 className='modal-title'>
            {this.props.message}
          </h4>
        </div>
        {modalBody}
        <div className='modal-footer'>
          <div className='text-right'>
            <button
              role='abort'
              type='button'
              className='btn btn-default'
              onClick={this.abort}
            >
              {this.props.abortLabel}
            </button>
            {' '}
            <button
              role='confirm'
              type='button'
              className='btn btn-primary'
              ref='confirm'
              onClick={this.confirm}
            >
              {this.props.confirmLabel}
            </button>
          </div>
        </div>
      </NewModal>
    );
  }
};
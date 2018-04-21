import React, { Fragment } from 'react';

class Success extends React.Component {
  state = {
    result: [],
    search: ""
  };

  searchSymbols = query => {
    API.allSymbols(query)
      .then(res => {this.setState({ result: res.data }) })
      .catch(err => console.log(err));
  };

  render() {
    return (
        <div className="container">
      <div className="success">
        Signup Successful!
      </div>
      </div>
    );
  }
}

export default LandingPage;
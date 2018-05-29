import React, { Fragment } from 'react';

class Success extends React.Component {
    state = {
        result: [],
        search: ""
    };

    render() {
        return (
            <div className="container">
            <div className="row logo">Stock Up</div>
                <div className="row success">
                    Signup Successful!
                </div>
                <div className="return-btn">Return to login</div>

            </div>
        );
    }
}

export default Success;
import React from "react";
import API from "../utils/API";

class Sp500 extends React.Component {
    state = {
        sp500: [],
        loading: true
    };

    componentDidMount() {
        this.getSpData("/stock/spy/chart/1d");
    }

    getSpData = query => {
        API.getSp(query)
            .then(res => {console.log("S&P 500 Data",res.data.data); this.setState({ sp500: res.data, loading: false }) })
            .catch(err => console.log(err));
    };

    render() {
        console.log("hello",this.state.sp500.data);
        return (
            <div className="sp500 col-md-12">
            {this.state.loading ?
                
                <span>
                    SP 500 loading...
                </span>:
                <span>
                    S&amp;P 500  {this.state.sp500[this.state.sp500.length - 1].marketAverage}<i class="fas fa-arrow-up bounce-up"></i><br/>
                    <span className="lp-symbol">(SPY)</span>
                </span>}
            </div>
        );
    }
};
export default Sp500;
import React from "react";
import API from "../utils/API";
import Sp500 from './Sp500Data';

class DowChart extends React.Component {
    state = {
        result: [],
        loading: true
    };

    componentDidMount() {
        this.getChartData("/stock/dia/chart/1d");
    }

    getChartData = query => {
        API.getDow(query)
            .then(res => { console.log("Dow Data", res.data[res.data.length - 1]); this.setState({ result: res.data, loading: false }) })
            .catch(err => console.log(err));
    };

    render() {
        console.log("hello", this.state.result[this.state.result.length - 1]);
        return (
            <div className="landing-page-body row">
                <div className="lp-data col-md-6">
                    {this.state.loading ?
                        <div className="dow col-md-12">
                            Dow loading...
                        </div> :
                        <div className="dow col-md-12">
                            Dow {this.state.result[this.state.result.length - 1].marketHigh} <i class="fas fa-arrow-down bounce-down"></i><br/>
                            <span className="lp-symbol">(DJI)</span>
                        </div>}

                    <Sp500 />
                </div>

                <div className="sign-up">
                    Sign up form here
                </div>
            </div>
        );
    }
};
export default DowChart;
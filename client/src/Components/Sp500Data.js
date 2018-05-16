import React, { Fragment } from "react";
import API from "../utils/API";

class Sp500 extends React.Component {
    state = {
        sp500: [],
        previousSp: "",
        loading: true
    };

    componentDidMount() {
        this.getSpData("/stock/spy/chart/1d");
        Promise.all([this.getSpData("/stock/spy/chart/1d"), this.getPreviousSp("SPY")]).then(values => {
            console.log("YEEE", values)
            if (values[0] === "" || values[0] === "undefined" || values[0].length < 1) {
                console.log("It's here brehhh!")
                this.setState({
                    sp500: false,
                    previousSp: values[1],
                    loading: false
                })
            } else {
                this.setState({
                    sp500: values[0],
                    previousSp: values[1],
                    loading: false
                })
            }
        })
    }

    getSpData = query => {
        var data = API.getSp(query)
            .then(res => {
                console.log("S&P 500 Data", res.data.data);
                return res.data
            }).catch(err => console.log(err));
        return data;
    };

    checkSpPrice = price => {
        if (price === -1) {
            for (let i = (this.state.sp500.length - 1); i > -1; i--) {
                if (this.state.sp500[i].marketHigh !== -1) {
                    return this.state.sp500[i].marketHigh;
                }
            }
        } else if (price === "undefined") {
            return "No data available";
        } else {
            return price;
        }
    }

    getPreviousSp = symbol => {
        var data = API.previousDay(symbol)
            .then(res => {
                console.log("Previous SP500", res.data.close);
                return res.data.close;
            })
            .catch(err => console.log(err));
        return data;
    }

    spComparison = spChange => {
        var newSp = this.checkSpPrice(this.state.sp500[this.state.sp500.length - 1].marketHigh);
        console.log("New SP", newSp);
        console.log("Old SP", spChange)
        if (spChange < newSp) {
            return <i className="fas fa-arrow-up bounce-up"></i>
        } else if (spChange > newSp) {
            return <i className="fas fa-arrow-down bounce-down"></i>
        } else {
            <div></div>
        }
    }

    render() {
        console.log("hello", this.state.sp500.data);
        return (
            <div className="sp500 col-md-12">
                {this.state.loading ?

                    <span>
                        SP 500 loading...
                </span> :
                    <Fragment>
                    {this.state.sp500 === false ?
                        <span>
                        S&amp;P 500 N/A
                    <span className="lp-symbol">(SPY)</span>
                    </span>
                    :
                    <span>
                    S&amp;P 500  {this.checkSpPrice(this.state.sp500[this.state.sp500.length - 1].average)}{this.spComparison(this.state.previousSp)}
                <span className="lp-symbol">(SPY)</span>
                </span> 
                            }
                            </Fragment>
                    }
            </div>
        );
}
};
export default Sp500;
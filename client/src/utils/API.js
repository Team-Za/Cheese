import axios from "axios";
const BASEURL = "https://api.iextrading.com/1.0";
const testEndPoint = "/ref-data/symbols"

export default {
  allSymbols: function(query) {
    return axios.get(query);
  }
};
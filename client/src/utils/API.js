import axios from "axios";
const BASEURL = "https://api.iextrading.com/1.0";
const dow = "/stock/dia/chart/dynamic"
const testEndPoint = "/ref-data/symbols"

export default {
  allSymbols: function(query) {
    return axios.get(BASEURL + query);
  },

  getDow: function(query) {
    return axios.get(BASEURL + query);
  },

  getSp: function(query) {
    return axios.get(BASEURL + query);
  },

  getUserData: function(query) {
    return axios.get(BASEURL + query);
  }
};
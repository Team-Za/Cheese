import axios from "axios";
const orgApi = {
    getAll: () => axios.get('/api/organization').then(results => results.data),
    getById: id => axios.get(`/api/organization/${id}`).then(results => results.data),
    create: org => axios.post('/api/organization', org).then(results => results.data),
    update: org => axios.put(`/api/organization/${org.id}`, org),
    delete: id => axios.delete(`/api/organization/${id}`)
};
const portApi = {
    getAll: () => axios.get('/api/portfolio').then(results => results.data),
    getById: id => axios.get(`/api/portfolio/${id}`).then(results => results.data),
    getPortfolioAndStocks: id => axios.get(`/api/portfolio/port/${id}`).then(results => results.data),
    create: org => axios.post('/api/portfolio', org).then(results => results.data),
    update: org => axios.put(`/api/portfolio/${org.id}`, org),
    delete: id => axios.delete(`/api/portfolio/${id}`)
};
const stockApi = {
    getAll: () => axios.get('/api/stock').then(results => results.data),
    getById: id => axios.get(`/api/stock/${id}`).then(results => results.data),
    create: org => axios.post('/api/stock', org).then(results => results.data),
    update: org => axios.put(`/api/stock/${org.id}`, org),
    delete: id => axios.delete(`/api/stock/${id}`)
};
export {
    orgApi,
    portApi,
    stockApi 
};
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
    getPortfoliobyUserId: UserId => axios.get(`/api/portfolio/noStock/${UserId}`).then(results => results.data),
    getPortfolioAndStocksbyUserId: UserId => axios.get(`/api/portfolio/user/${UserId}`).then(results => results.data),
    create: port => axios.post('/api/portfolio', port).then(results => results.data),
    update: port => axios.put(`/api/portfolio/${port.id}`, port),
    delete: id => axios.delete(`/api/portfolio/${id}`)
}; 
const stockApi = {
    getAll: () => axios.get('/api/stock').then(results => results.data),
    getById: id => axios.get(`/api/stock/${id}`).then(results => results.data),
    getByPrice: (price, PortfolioId) => axios.get(`/api/stock/${price}/${PortfolioId}`).then(results => results.data),
    create: stock => axios.post('/api/stock', stock).then(results => results.data),
    update: stock => axios.put(`/api/stock/${stock.id}`, stock),
    delete: id => axios.delete(`/api/stock/${id}`)
};
const userApi = {
    getAll: () => axios.get('/api/user').then(results => results.data),
    getById: id => axios.get(`/api/user/${id}`).then(results => results.data),
    getByUsername: username => axios.get(`/api/user/users/${username}`).then(results => results.data),
    create: user => axios.post('/api/user', user).then(results => results.data),
    update: user => axios.put(`/api/user/${user.id}`, user),
    delete: id => axios.delete(`/api/user/${id}`)
};
export {
    orgApi,
    portApi,
    stockApi,
    userApi 
};
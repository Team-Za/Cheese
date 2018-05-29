const db = require("../models");

// Defining methods for the portfolioController
const controller = {
  findAll: (req, res) => {
    db.Stock.findAll({
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: (req, res) => {
    db.Stock.findOne({
      where: {
        id: req.params.id,
      }
    })
      .then(dbModel => {
        if (dbModel) {
          res.json(dbModel);
        } else {
          res.status(404).json({
            message: 'Id not found.'
          });
        }
      })
      .catch(err => res.status(422).json(err));
  }, 
  findByPrice: (req, res) => {
    db.Stock.findOne({
      where: {
        price: req.params.price,
        PortfolioId:req.params.PortfolioId
      }
    })
      .then(dbModel => {
        if (dbModel) {
          console.log(req.params,"success");
          res.json(dbModel);
        } else {
          console.log(req.params,"fail");
          res.status(404).json({
            message: 'Price not found.'
          });
        }
      })
      .catch(err => {console.log(req.params,"megafail");res.status(422).json(err)});
  },   
  create: (req, res) => {
    db.Stock.create({
      name: req.body.name,
      quantity: req.body.quantity,
      symbol: req.body.symbol,
      imageLink: req.body.imageLink,
      price: req.body.price,
      PortfolioId: req.body.PortfolioId
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: (req, res) => {
    db.Stock.update({
      id:req.body.id,
      name: req.body.name,
      quantity: req.body.quantity,
      symbol: req.body.symbol,
      imageLink: req.body.imageLink,
      price: req.body.price,
      PortfolioId: req.body.PortfolioId
    }, {
        where: {
          id: req.params.id,
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: (req, res) => {
    db.Stock.destroy( {
        where: {
          id: req.params.id
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

export { controller as default };

const db = require("../models");

// Defining methods for the portfolioController
const controller = {
  findAll: (req, res) => {
    db.Portfolio.findAll({
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: (req, res) => {
    db.Portfolio.findOne({
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
  getPortfolioAndStocks: (req, res) => {
    db.Portfolio.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: db.Stock,
        //where: { PortfolioId: "Portfolio.id" }
      }]
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getPortfolioAndStocksbyUserId: (req, res) => {
    db.Portfolio.findOne({
      where: {
        UserId: req.params.UserId,
      },
      include: [{
        model: db.Stock,
        //where: { PortfolioId: "Portfolio.id" }
      }]
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: (req, res) => {
    db.Portfolio.create({
      userName: req.body.userName,
      balance:req.body.balance,
      UserId: req.body.UserId
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: (req, res) => {
    db.Portfolio.update({
      userName: req.body.userName,
      balance:req.body.balance,
      UserId: req.body.UserId
    }, {
        where: {
          id: req.params.id,
        }
      })
      .then(dbModel => {
        console.log("update",dbModel);
        res.json(dbModel)})
      .catch(err => res.status(422).json(err));
  },
  remove: (req, res) => {
    db.Portfolio.destroy({
    }, {
        where: {
          id: req.params.id
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

export { controller as default };

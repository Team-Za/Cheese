const db = require("../models");

// Defining methods for the portfolioController
const controller = {
    findAll: (req, res) => {
        db.User.findAll({
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: (req, res) => {
        db.User.findOne({
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
    findByUsername: (req, res) => {
        db.User.findOne({
            where: {
                username: req.params.username,
            }
        })
            .then(dbModel => {
                if (dbModel) {
                    res.json(dbModel);
                } else {
                    res.status(404).json({
                        message: 'User not found.'
                    });
                }
            })
            .catch(err => res.status(422).json(err));
    },
    create: (req, res) => {
        db.User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    update: (req, res) => {
        db.User.update({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }, {
                where: {
                    id: req.params.id,
                }
            })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    remove: (req, res) => {
        db.User.destroy({
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

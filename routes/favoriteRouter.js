const express = require('express');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const Favorites = require('../models/favorites');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(express.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    if(req.body && req.body.length > 0) {
        Favorites.findOne({user: req.user._id})
        .then((favorite) => {
            if(!favorite) {
                Favorites.create({
                    user: req.user._id,
                    dishes: new Array()
                })
                .then((favorite) => {
                    req.body.forEach((dishId) => {
                        favorite.dishes.push(dishId._id);
                    });
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite)
                        });
                    }, (err) => next(err));
                }, (err) => next(err))
                .catch((err) => next(err));
            } else {
                var oldDishes = favorite.dishes.map((dishId) => { return dishId.toString(); });
                req.body.forEach((dishId) => {
                    if(oldDishes.indexOf(dishId._id.toString()) == -1) {
                        favorite.dishes.push(dishId._id);
                    }
                });
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite)
                    });
                }, (err) => next(err));
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
        res.statusCode = 500;
        let err = new Error('Please input dish id list');
        return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"exists": false, "favorite": favorite});
        } else {
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"exists": false, "favorite": favorite});
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"exists": true, "favorite": favorite});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(!favorite) {
            Favorites.create({
                user: req.user._id,
                dishes: new Array()
            })
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite)
                    });
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            var oldDishes = favorite.dishes.map((dishId) => { return dishId.toString(); });
            if(oldDishes.indexOf(req.params.dishId.toString()) == -1) {
                favorite.dishes.push(req.params.dishId);
            }
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite)
                });
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /favorites');
});

module.exports = favoriteRouter;
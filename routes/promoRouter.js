const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

const Promotions = require('../models/promotions');

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promos);
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Promotions.create(req.body)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.end('PUT not supported on /promotions')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch(err => next(err));
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
        .then((promo) => {
            if (promo != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            } else {
                var error = new Error('Promo not found with id: ' + req.params.promoId);
                error.statusCode = 404;
                next(error);
            }
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.end('POST not supported on /promotions/:promoId')
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch(err => next(err));
    });

module.exports = promoRouter;
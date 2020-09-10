const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Leaders.create(req.body)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.end('PUT not supported on /leaders')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Leaders.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch(err => next(err));
    });

    leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
        .then((leader) => {
            if (leader != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            } else {
                var error = new Error('Leader not found with id: ' + req.params.leaderId);
                error.statusCode = 404;
                next(error);
            }
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.end('POST not supported on /leaders/:leaderId')
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch(err => next(err));
    });

module.exports = leaderRouter;
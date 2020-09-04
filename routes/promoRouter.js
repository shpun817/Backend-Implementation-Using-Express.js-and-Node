const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
	Promotions.find({})
	.then((promos) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promos);
	}, (err) => next(err))
	.catch((err) => next(err))
})
<<<<<<< HEAD
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
=======
.post(authenticate.verifyUser, (req, res, next) => {
>>>>>>> parent of 918dded... Assignment 3
	Promotions.create(req.body)
	.then((promo) => {
		console.log('Promotion Created ', promo);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promo);
	}, (err) => next(err))
	.catch((err) => next(err))
})
<<<<<<< HEAD
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
=======
.put(authenticate.verifyUser, (req, res, next) => {
>>>>>>> parent of 918dded... Assignment 3
	// Doesn't make sense
	res.statusCode = 403;
	res.end('PUT operation not supported on /promotions');
})
<<<<<<< HEAD
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
=======
.delete(authenticate.verifyUser, (req, res, next) => {
>>>>>>> parent of 918dded... Assignment 3
	Promotions.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Promotions.findById(req.params.promoId)
	.then((promo) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promo);
	}, (err) => next(err))
	.catch((err) => next(err))
})
<<<<<<< HEAD
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
=======
.post(authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyUser, (req, res, next) => {
>>>>>>> parent of 918dded... Assignment 3
  	Promotions.findByIdAndUpdate(req.params.promoId, {
		$set: req.body
	}, {
		new: true
	})
	.then((promo) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promo);
	}, (err) => next(err))
	.catch((err) => next(err))
})
<<<<<<< HEAD
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
=======
.delete(authenticate.verifyUser, (req, res, next) => {
>>>>>>> parent of 918dded... Assignment 3
	Promotions.findByIdAndRemove(req.params.promoId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err))
});

module.exports = promoRouter;
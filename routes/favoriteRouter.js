const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.all(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	return next();
})
.get((req, res, next) => {
	Favorites.find({user: req.user._id})
	.populate('user dishes')
	.then((favorites) => {
		if (favorites != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(favorites);
		} else {
			err = new Error('User ' + req.user._id + ' has no favorite records');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err))
})
.post((req, res, next) => {
	const dishes = req.body;
	Favorites.findOne({user: req.user._id})
	.then((favorites) => {
		if (favorites == null) {
			Favorites.create({user: req.user._id})
			.then((newFavorites) => {
				favorites = newFavorites;
			}, (err) => next(err))
			.catch((err) => next(err))
		}
		for (var i = 0; i < dishes.length; ++i) {
			var skip = false;
			for (var j = 0; j < favorites.dishes.length; ++j) {
				if (String(favorites.dishes[j]._id) === String(dishes[i]._id)) {
					skip = true;
					break;
				}
			}
			if (skip) {
				continue;
			}
			favorites.dishes.push(dishes[i]._id);
		}
		favorites.save()
		.then((favorites) => {
			Favorites.findById(favorites._id)
			.populate('user dishes')
			.then((favorites) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorites);
			});
		}, (err) => next(err));
	}, (err) => next(err))
	.catch((err) => next(err));
})
.delete((req, res, next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorites) => {
		if (favorites == null) {
			err = new Error('User ' + req.user._id + ' has no favorite records');
			err.status = 404;
			return next(err);
		}
		favorites.dishes = [];
		favorites.save()
		.then((favorites) => {
			Favorites.findById(favorites._id)
			.populate('user dishes')
			.then((favorites) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorites);
			});
		}, (err) => next(err));
	}, (err) => next(err))
	.catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.all(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	return next();
})
.post((req, res, next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorites) => {
		if (favorites == null) {
			Favorites.create({user: req.user._id})
			.then((newFavorites) => {
				favorites = newFavorites;
			}, (err) => next(err))
			.catch((err) => next(err))
		}
		var alreadyExists = false;
		for (var i = 0; i < favorites.dishes.length; ++i) {
			if (String(favorites.dishes[i]) === String(req.params.dishId)) {
				alreadyExists = true;
				break;
			}
		}
		if (alreadyExists) {
			var err = new Error('Dish ' + req.params.dishId + ' already exists in User '
				+ req.user._id + ' \'s favorites.');
			err.status = 403;
			return next(err);
		}
		favorites.dishes.push({_id: req.params.dishId});
		favorites.save()
		.then((favorites) => {
			Favorites.findById(favorites._id)
			.then((fav) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(fav);
			}, (err) => next(err));
		}, (err) => next(err));
	})
	.catch((err) => next(err));
})
.delete((req, res, next) => {
	Favorites.findOne({user: req.user._id})
	.then((fav) => {
		if (fav == null) {
			var err = new Error('User ' + req.user._id + ' does not have favorites stored.');
			err.status = 404;
			return next(err);
		}
		const indexToRemove = fav.dishes.indexOf(String(req.params.dishId));
		if (indexToRemove === -1) {
			var err = new Error('Dish ' + req.params.dishId + ' not found in User ' + req.user._id + ' \'s favorites.');
			err.status = 404;
			return next(err);
		}
		if (indexToRemove > -1) {
			fav.dishes.splice(indexToRemove, 1);
		}
		fav.save()
		.then((favorites) => {
			Favorites.findById(favorites._id)
			.then((fav) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(fav);
			}, (err) => next(err));
		}, (err) => next(err));
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = favoriteRouter;
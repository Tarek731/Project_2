// node packages
var express = require('express');
//var passport = require('passport');
var request = require('request');
// setup router
var router = express.Router();

var models = require('../models');

router.route('/watchlist/:movieId?')
	.get(isLoggedIn, function(req, res) {
		models.watchlist.findAll({ where: { userId: req.user.id }}).then(function(list) {
			res.json(list);
		});
	})
	.post(isLoggedIn, function(req, res) {
		models.watchlist.create(req.body).then(function(list) {
			res.json(list);
		});
	})
	.delete(isLoggedIn, function(req, res) {
		models.watchlist.destroy({ where: { id: req.params.movieId }}).then(function(list) {
			res.json(list);
		});
	});

router.get('/userData', isLoggedIn, function(req, res) {
	res.json(req.user);
});

router.get('/movieSearch/:movie', function(req, res) {
	var queryMovie = req.params.movie;
		var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';
	request(queryURL, function(err, response, body) {
		var hbsObj = {
			title: "Movies - User",
			data: body
		};
		console.log(hbsObj);
		res.render('user', hbsObj)
	});
});

module.exports = router;

// function to test if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
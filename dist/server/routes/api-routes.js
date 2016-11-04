'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _jwtConfig = require('../jwt-config');

var _jwtConfig2 = _interopRequireDefault(_jwtConfig);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _yelp = require('yelp');

var _yelp2 = _interopRequireDefault(_yelp);

var _bars = require('../models/bars');

var _bars2 = _interopRequireDefault(_bars);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var MongoClient = _mongodb2.default.MongoClient;
var url = process.env.MONGO_HOST;

var app = module.exports = _express2.default.Router();

var yelp = new _yelp2.default({
	consumer_key: process.env.YELP_CONSUMER_KEY,
	consumer_secret: process.env.YELP_CONSUMER_SECRET,
	token: process.env.YELP_TOKEN,
	token_secret: process.env.YELP_TOKEN_SECRET
});

app.post('/api/yelp', function (req, res) {
	var query = req.body.query;

	yelp.search({ location: query, category_filter: 'bars' }).then(function (data) {
		var payload = {};
		MongoClient.connect(url, function (err, db) {
			_assert2.default.equal(null, err);
			db.collection('bars').find().toArray(function (err, response) {

				if (!err) {

					var _payload = {
						data: data.businesses,
						attendance: response
					};
					res.status(201).send(_payload);
				}
				db.close();
			});
		});
	}).catch(function (err) {
		console.error(err);
		res.status(404).send('There was a problem with the search');
	});
});

app.post('/api/attend', function (req, res) {
	var _req$body = req.body,
	    token = _req$body.token,
	    user_id = _req$body.user_id,
	    bar_id = _req$body.bar_id;

	console.log(user_id, bar_id);
	_jsonwebtoken2.default.verify(token, _jwtConfig2.default, function (err, decoded) {
		if (!err) {

			_bars2.default.findOne({ id: bar_id }, function (err, bar) {

				var d = new Date();
				var today = d.getDay().toString() + d.getMonth().toString() + d.getYear().toString();

				// handle error
				if (err) {
					return done(err);
				}
				// if the bar exists already
				else if (bar) {
						// check if a user has already signed up
						var checkList = function checkList(list) {
							for (var i = 0; i < list.length; i++) {
								if (list[i] === user_id) {
									return false;
								}
							}
							return true;
						};
						// add the new attendees to the list


						// if the date added is old, update it and clear the attendees list
						if (bar.date !== today) {
							bar.date = today;
							bar.attendees = [];
						}if (checkList(bar.attendees)) {
							bar.attendees.push(user_id);
							bar.save(function (err) {
								if (err) throw err;
							});
							res.end();
						} else {
							res.status(401).send("You can't attend the same bar twice!");
						}
					}
					// if there is no bar at all create it and add user
					else if (!bar) {
							bar = new _bars2.default({
								id: bar_id,
								attendees: [user_id],
								date: today
							});
							bar.save(function (err) {
								if (err) console.log(err);
							});
							res.end();
						}
			});
		} else {
			res.status(401).send('You must sign in to record your attendence!');
		}
	});
});
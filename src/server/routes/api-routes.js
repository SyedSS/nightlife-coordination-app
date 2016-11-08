import express from 'express'
import assert from 'assert'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import secret from '../jwt-config'
import dotenv from 'dotenv'
dotenv.config({silent: true});

import Yelp from 'yelp'

import Bar from '../models/bars'

import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGO_HOST;

const app = module.exports = express.Router();

const yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

app.post('/api/yelp', (req, res) => {
	const { query } = req.body;
		yelp.search({ location: query, category_filter: 'bars' })
		.then(function (data) {
		  let payload = {}
			  MongoClient.connect(url, (err, db) => {
			  	assert.equal(null, err);
			  	db.collection('bars').find().toArray( (err, response) => {

			  		if (!err) {

							const payload = {
								data: data.businesses,
								attendance: response
							}
							res.status(201).send(payload);

			  		}
			  		db.close();
			  	});
			  });
		}).catch(function (err) {
		  console.error(err);
		  res.status(404).send('This location could not be found, sorry!');
		});
});

app.post('/api/attend', (req, res) => {
	const { token, user_id, bar_id } = req.body;
	console.log(user_id, bar_id);
	jwt.verify(token, secret, (err, decoded) => {
		if (!err) {

	    Bar.findOne({ id: bar_id }, function(err, bar) {

	    	let d = new Date();
	    	const today = d.getDay().toString() + d.getMonth().toString() + d.getYear().toString();

	      // handle error
	      if (err) { return done(err) }
				// if the bar exists already
	      else if (bar) {
					// if the date added is old, update it and clear the attendees list
	      	if (bar.date !== today) {
	      		bar.date = today;
	      		bar.attendees = [];
	      	}
					// check if a user has already signed up
	      	function checkList(list) {
		      	for (let i = 0; i < list.length; i++) {
		      		if (list[i] === user_id) {
		      			return i;
		      		}
		      	}
		      	return 'User absent';
	      	}
					// add the new attendees to the list
	      	if (checkList(bar.attendees) === 'User absent') {
	      		bar.attendees.push(user_id)
		      	bar.save(function(err) {
		      		if (err) throw err;
		      	});
	      		res.end();
      		} else { 

      			bar.attendees.splice(checkList(bar.attendees), 1);
		      	bar.save(function(err) {
		      		if (err) throw err;
		      	});
      			res.end()
      		}
	      }
				// if there is no bar at all create it and add user
	      else if (!bar) {
	        bar = new Bar({
	            id: bar_id,
	            attendees: [user_id],
	            date: today
	        });
	        bar.save(function(err) {
	          if (err) console.log(err);
	        });
        	res.end();

	      }
	    });
		}
		else {
			res.status(401).send('You must sign in to record your attendence!');
		}
	});
});
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		id: String,
		displayName: String,
		username: String,
		password: String,
		twitterId: String,
		githubId: String
});

module.exports = mongoose.model('User', User);
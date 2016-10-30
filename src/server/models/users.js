'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		githubId: String,
		displayName: String,
		username: String,
		provider: String
});

module.exports = mongoose.model('User', User);
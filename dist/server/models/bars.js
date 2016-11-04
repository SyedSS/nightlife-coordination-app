'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
	id: String,
	attendees: Array,
	date: String
});

module.exports = mongoose.model('Bar', Bar);
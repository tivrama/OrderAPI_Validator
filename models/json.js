// models/palindrome.js

var mongoose = require('mongoose');

module.exports = mongoose.model('OrderAPI', {
  retailer : {type : String, default: ''},
  json : {type : String, default: ''}
});
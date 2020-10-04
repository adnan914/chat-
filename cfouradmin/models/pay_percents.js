var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schema = mongoose.Schema({
	direct_pay: Number,
	mentor_pay: Number,
	by_mentor_pay: Number,
	by_affiliate_pay: Number
});
var Model = mongoose.model('pay_percents', Schema);
module.exports = Model
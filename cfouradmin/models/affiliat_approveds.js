var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var UserApproveds = mongoose.Schema({
	    name: String,
	    question_anser: Array,
	    status: Number,
	    user_id: Number,
	    message: String,
	    date: String
	});
var OrderModel = mongoose.model('affiliat_approve_lists', UserApproveds);
module.exports = OrderModel
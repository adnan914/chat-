var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schemas = mongoose.Schema({
	course_id: String,
	user_id: Number,
	mentor_id: Number,
	course_amount: Number,
	course_name: String,
	batche_id: Number,
	current_date: String
});
var Model = mongoose.model('carts', Schemas);
module.exports = Model
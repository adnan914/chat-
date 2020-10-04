var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schemas = mongoose.Schema({
	user_id: Number,
	course_id: String,
	current_date: String
});
var Model = mongoose.model('wishlists', Schemas);
module.exports = Model
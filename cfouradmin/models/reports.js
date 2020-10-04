var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schemas = mongoose.Schema({
	course_id: String,
	user_id: Number,
	user_role: String,
	name: String,
	subject: String,
	proof: String,
	description: String,
	status: Number,
	current_date: String
});
var Model = mongoose.model('reports', Schemas);
module.exports = Model
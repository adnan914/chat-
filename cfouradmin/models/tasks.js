var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
	course_id: String,
	assignment: String,
	date: String,
	question: String,
	user_id: Number
});
var OrderModel = mongoose.model('tasks', OrderSchema);
module.exports = OrderModel
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var QuestionSchema = mongoose.Schema({
		_id: Number,
		question: Array
	});
var OrderModel = mongoose.model('admin_questions', QuestionSchema);
module.exports = OrderModel
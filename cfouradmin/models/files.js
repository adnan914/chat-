var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
		user_id: Number,
		course_id: String,
		file_name: String,
		current_date: String,
		link: String
	});
var OrderModel = mongoose.model('files', OrderSchema);
module.exports = OrderModel
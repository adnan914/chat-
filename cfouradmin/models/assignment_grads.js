var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
	course_id: String,
	user_id: Number,
	assignment: Array
});
var OrderModel = mongoose.model('assignment_grads', OrderSchema);
module.exports = OrderModel
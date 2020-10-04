var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
	affiliate_id: Number,
	user_id: Number,
	payment_status: Number,
	course_id: String,
	payment_amount: Number,
	current_date: String
});
var OrderModel = mongoose.model('references', OrderSchema);
module.exports = OrderModel
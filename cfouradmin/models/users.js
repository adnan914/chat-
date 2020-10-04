var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
		user_id: { type: Number, required: true, unique: true },
		name: String,
		email: String,
		username: String,
		user_roll: String
	});
var OrderModel = mongoose.model('users', OrderSchema);
module.exports = OrderModel
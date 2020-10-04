var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/qureshi_database');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
	item: String,
	qty: Number,
	price: Number,
	total: Number
});
var OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel
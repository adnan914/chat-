var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schema = mongoose.Schema({
		name: String,
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		address: String,
		current_date: String
	});
var Model = mongoose.model('admin_registers', Schema);
module.exports = Model
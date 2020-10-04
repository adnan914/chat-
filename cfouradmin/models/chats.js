var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schemas = mongoose.Schema({
		message:  String,
		sender_name: String,
		sender_id: Number,
		course_id: String,
		batche_id: Number,
		type: String
	},
	{timestamps: true}
);
var Model = mongoose.model('chats', Schemas);
module.exports = Model
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schema = mongoose.Schema({
	    certificate: String
	});
var Model = mongoose.model('certificates', Schema);
module.exports = Model
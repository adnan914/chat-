var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schema = mongoose.Schema({
	mentor_reg: Number,
	affiliate_reg: Number,
	seate_limit: Number,
	course_ammount_limit: Number
});
var Model = mongoose.model('regfees', Schema);
module.exports = Model
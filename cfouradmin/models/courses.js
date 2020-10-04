var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var OrderSchema = mongoose.Schema({
	mentor_name: String,
	course_name: String,
	course_description: String,
	brief_description: String,
	domain_tag: Array,
	batche_time: Array,
	duration: String,
	fee: Number,
	pre_requisites: String,
	curriculum: Array,
	user_id: Number,
	status: Number,
	shift_status: Number,
	image_url: String,
	rating: { type: Number, default: '' },
	feedback: { type: Array, default: [] },
	current_date: String
});
var OrderModel = mongoose.model('courses', OrderSchema);
module.exports = OrderModel
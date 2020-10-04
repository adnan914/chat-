var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c4projects');
var conn = mongoose.connection;
var Schema = mongoose.Schema({
	course_id: String,
	user_id: Number,
	mentor_id: Number,
	mentor_part: Object,
	admin_part: Number,
	affiliate_part: Object,
	affiliate_id: Number,
	pay_status: Number,
	transection_id: Number,
	curriculum_index: Array,
	assignment: Array,
	submit_course: { type: Array, default: 0 },
	course_amount: Number,
	current_date: String,
	rating: { type: Number, default: '' },
	feedback: { type: String, default: '' },
	student_name: String,
	course_name: String,
	certificate_url: String,
	batche_id: Number,
	start_date: String,
	end_date: String
});
var Model = mongoose.model('purchased_programs', Schema);
module.exports = Model
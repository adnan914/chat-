var express = require('express');
const path = require('path'); 
const md5 = require('md5');
const fs = require('fs');
const mime = require('mime');
var app = require('../app');
var http = require('http');
var pdf = require('html-pdf');
var options = {format: 'A4'};
// Models
var Courses = require('../models/courses');
var Tasks = require('../models/tasks');
var Assigment = require('../models/assignment_grads');
var Users = require('../models/users');
var UserApproved = require('../models/user_approveds');
var PurchasedPrograms = require('../models/purchased_programs');
var Question = require('../models/admin_questions');
var QuestionAffiliat = require('../models/admin_affiliat_questions');
var AffiliatApprove = require('../models/affiliat_approveds');
var Files = require('../models/files');
var AdminRegisters = require('../models/admin_registers');
var References = require('../models/references');
var Carts = require('../models/carts');
var Wishlists = require('../models/wishlists');
var Percents = require('../models/pay_percents');
var Reports = require('../models/reports');
var Regfees = require('../models/regfees');
var Chat = require('../models/chats');
var Certificates = require('../models/certificates');


var router = express.Router();
/* GET home page. */


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');

  return response;
}


// Certificates
router.post('/certificates_update', function(req, res, next) {
	var certificate = Certificates.findByIdAndUpdate(req.body.id ,{
		certificate: req.body.certificate
	})
	certificate.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.get('/certificates', function(req, res, next) {
	var certificate = Certificates.find({})
	certificate.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
// Certificates End

// PDF
router.post('/genrate_pdf',(req,res,next)=>{
	var certificate = Certificates.find({})
	certificate.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			
	
	res.render('demopdf',{mentee_name: req.body.mentee_name, course_name: req.body.course_name, date: req.body.date, contain: doc[0].certificate}, function(err, html){
		var fileName =  Date.now();
		pdf.create(html, options).toFile('./public/uploadspdf/' + fileName + '.pdf', function(err, doc) {
			if (err) {
				return console.log(err);
			} else {
				var datafile = fs.readFileSync('./public/uploadspdf/' + fileName + '.pdf');
				res.header('content-type', 'application/pdf');
				//res.send({status: 'Success!!!'});
				var certificate_url = PurchasedPrograms.findByIdAndUpdate(req.body.purchas_id, {
					certificate_url: `${fileName}.pdf`
				})
				certificate_url.exec(function(err, doc){
					if (err) {
						res.send({status: 'Failed'})
					}else {
						res.send({status: 'Success!!!'})
					}
				})
			}
		})
	})

		}
	})
	
});
// PDF END



// Chat
router.post('/get_chats_by_batche_id', function(req, res, next) {
	var chat = Chat.find({"batche_id": req.body.batche_id})
	chat.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
// Chat End



// Reports
router.post('/reports', function(req, res, next) {
	try{
		var today = new Date()
		var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
		if (req.body.base64 === '') {
			var fileName = 'No'
		} else {
			var imgB64Data = req.body.base64;
			var decodedImg = decodeBase64Image(imgB64Data);
			var imageBuffer = decodedImg.data;
			var type = decodedImg.type;
			var fileName =  Date.now() + '.' + 'png';
			fs.writeFileSync("./public/upload/" + fileName, imageBuffer, 'utf8');
		}
	    var report = new Reports({
			course_id: req.body.course_id,
			user_id: req.body.user_id,
			user_role: req.body.user_role,
			name: req.body.name,
			subject: req.body.subject,
			proof: fileName,
			description: req.body.description,
			status: 0,
			current_date: date
		})
		report.save(function(err, doc){
			if (err) {
				res.send(err)
			}else {
				res.send({status: 'Success!!!'})
			}
		})
	}
	catch(err){
	    console.error(err)
	}
});
router.get('/get_reports', function(req, res, next) {
	var get_reports = Reports.find()
	get_reports.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.get('/update_reports_status_multiple', function(req, res, next) {
	var get_status = Reports.updateMany({}, {
		status: 1
	})
	get_status.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// Reports End

// Admin
router.get('/insert_admin', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

	var insert_admin = new AdminRegisters({
		name: 'Admin',
		email: 'admin@gmail.com',
		password: md5('admin@123'),
		address: 'Location of dummy, address of dummy, location map, directions to dummy Bangalore,Akshya Nagar 1st Block 1st Cross.',
		current_date: date
	})
	insert_admin.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/admin_login',(req,res,next)=>{
	let singleUser = AdminRegisters.find({'email':req.body.email,'password':md5(req.body.password)});
	singleUser.exec((err, doc)=>{
		if (err){
			res.send({ 'status': 'failed' });
		}else {
			res.send(doc);
		}
	})	
});
// Admin

// Regfees
router.get('/regfees', function(req, res, next) {
	var regfees = Regfees.find()
	regfees.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/regfees_update', function(req, res, next) {
	var regfees_update = Regfees.findByIdAndUpdate(req.body.id, {
		mentor_reg: req.body.mentor,
		affiliate_reg: req.body.affilite,
		seate_limit: req.body.batch,
		course_ammount_limit: req.body.mentee
	})
	regfees_update.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// Regfees End

// pay_percent
router.get('/pay_percent', function(req, res, next) {
	var percent = Percents.find()
	percent.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/pay_percent_update', function(req, res, next) {
	var percent_update = Percents.findByIdAndUpdate(req.body.id, {
		direct_pay: req.body.direct_pay,
		by_mentor_pay: req.body.by_mentor_pay,
		mentor_pay: req.body.mentor_pay,
		by_affiliatepay: req.body.by_affiliatepay
	})
	percent_update.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// pay_percent End

// references
router.post('/references', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

	var references = new References({
		affiliate_id: req.body.affiliate_id,
		user_id: req.body.user_id,
		payment_status: req.body.payment_status,
		course_id: req.body.course_id,
		payment_amount: req.body.payment_amount,
		current_date: date
	})
	references.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.get('/get_all_references', function(req, res, next) {
	var referenc = References.find({})
	referenc.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});

// references End

// Wishlists
router.post('/wishlists', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

	var wishlists = new Wishlists({
		user_id: req.body.user_id,
		course_id: req.body.course_id,
		current_date: date
	})
	wishlists.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/get_wishlists_by_user_course_id', function(req, res, next) {
	var wishlists = Wishlists.find({'user_id': req.body.user_id,'course_id': req.body.course_id})
	wishlists.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_wishlist_by_user_id', function(req, res, next) {
	var wishlists = Wishlists.find({'user_id': req.body.user_id})
	wishlists.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/remove_wishlist_by_id', function(req, res, next) {
	var wishlists = Wishlists.findByIdAndRemove(req.body.id)
	wishlists.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// Wishlists End

// cart
router.post('/cart', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

	var cart = new Carts({
		user_id: req.body.user_id,
		course_id: req.body.course_id,
		mentor_id: req.body.mentor_id,
		course_amount: req.body.course_amount,
		course_name: req.body.course_name,
		batche_id: req.body.batche_id,
		current_date: date
	})
	cart.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.get('/get_all_cart', function(req, res, next) {
	var cartss = Carts.find({})
	cartss.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.get('/get_all_cart', function(req, res, next) {
	var cartss = Carts.find({})
	cartss.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_cart_by_user_id_course_id', function(req, res, next) {
	var carts = Carts.find({'user_id': req.body.user_id, 'course_id': req.body.course_id})
	carts.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_cart_by_user_id', function(req, res, next) {
	var carts = Carts.find({'user_id': req.body.user_id})
	carts.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/delete_cart_record', function(req, res, next) {
	var carts = Carts.remove( { _id : { $in: req.body.doc } } );
	carts.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// cart End


// Files 
router.post('/insert_notes', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
			
	var insert_notes = new Files({
		user_id: req.body.user_id,
		course_id: req.body.course_id,
		file_name: req.body.file_name,
		current_date: date,
		link: req.body.link
	})
	insert_notes.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/update_notes_id', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
			
	var file_notes = Files.findByIdAndUpdate(req.body.id, {
		file_name: req.body.file_name,
		current_date: date,
		link: req.body.link
	})
	file_notes.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/get_files_by_user_id_course_id', function(req, res, next) {		
	var findby = Files.find({'course_id': req.body.course_id})
	findby.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
// Files 



// Task 
router.post('/get_all_assigment', function(req, res, next) {
	var assigme = Assigment.find({'course_id': req.body.course_id})
	assigme.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_tasks_by_course_id', function(req, res, next) {
	var task = Tasks.find({'course_id': req.body.course_id})
	task.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_tasks_by_id', function(req, res, next) {
	var task = Tasks.find({'_id': req.body.id})
	task.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/tasks_update_by_id', function(req, res, next) {
	var tasks = Tasks.findByIdAndUpdate(req.body.id, {
		assignment: req.body.assignment,
		date: req.body.date,
		question: req.body.question
	})
	tasks.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/tasks_insert', function(req, res, next) {
	var task = new Tasks({
		course_id: req.body.course_id,
		assignment: req.body.assignment,
		date: req.body.date,
		question: req.body.question,
		user_id: req.body.user_id
	})
	task.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// Task End

// PurchasedPrograms
router.post('/purchased_programs_update_review', function(req, res, next) {
	var rating = PurchasedPrograms.findOneAndUpdate({"user_id" : req.body.user_id, 'course_id': req.body.course_id}, { 
		rating: req.body.rating,
		feedback: req.body.feedback
	})
	rating.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_multiple_update', function(req, res, next) {
	var updatemulti = PurchasedPrograms.update(
	   { _id: { $in: req.body.doc } },
	   { $set: { 'mentor_part.status' : 1 } },
	   {multi: true}
	)
	updatemulti.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_multiple_update_affiliate', function(req, res, next) {
	var updatemulti = PurchasedPrograms.update(
	   { _id: { $in: req.body.doc } },
	   { $set: { 'affiliate_part.status' : 1 } },
	   {multi: true}
	)
	updatemulti.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_assignment_link_update', function(req, res, next) {
	var assignment_link = PurchasedPrograms.updateOne({"user_id" : req.body.user_id, 'assignment.assignment_id': req.body.assignment_id}, { 
		$set: { "assignment.$.link" : req.body.link }
	})
	assignment_link.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_assignment_grad_remark_update', function(req, res, next) {
	var assignment_link = PurchasedPrograms.updateOne({"user_id" : req.body.user_id, 'assignment.assignment_id': req.body.assignment_id}, { 
		$set: { "assignment.$.grad" : req.body.grad, "assignment.$.remark" : req.body.remark }
	})
	assignment_link.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});

router.post('/purchased_programs_submit_course_update', function(req, res, next) {
	var submit_course_update = PurchasedPrograms.updateOne({"_id" : req.body.id}, { 
		$set: { "submit_course.$[].grade" : req.body.grade, "submit_course.$[].remark" : req.body.remark }
	})
	submit_course_update.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_submit_course_link_update', function(req, res, next) {
	var submit_course_update = PurchasedPrograms.updateOne({"user_id" : req.body.user_id, "course_id": req.body.course_id}, { 
		$set: { "submit_course.$[].link" : req.body.link }
	})
	submit_course_update.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_assignment_update', function(req, res, next) {
	var programs_cu = PurchasedPrograms.findOneAndUpdate({"user_id" : req.body.user_id, 'course_id': req.body.course_id}, { 
		$push: { assignment: req.body.assignment } 
	})
	programs_cu.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_submit_update', function(req, res, next) {
	var submit_course = PurchasedPrograms.findOneAndUpdate({"user_id" : req.body.user_id, 'course_id': req.body.course_id}, { 
		"submit_course": req.body.submit_course
	})
	submit_course.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_curriculum_update', function(req, res, next) {
	var programs_cu = PurchasedPrograms.findOneAndUpdate({"user_id" : req.body.users_id, 'course_id': req.body.course_id}, { 
		$push: { curriculum_index: req.body.curriculum_index } 
	})
	programs_cu.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/get_purchased_programs_by_course_id', function(req, res, next) {
	var programs = PurchasedPrograms.find({'course_id': req.body.course_id})
	programs.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_purchased_programs_by_mentor_id', function(req, res, next) {
	var programs = PurchasedPrograms.find({'mentor_id': req.body.mentor_id})
	programs.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_all_purchased_programs', function(req, res, next) {
	var programs = PurchasedPrograms.find({})
	programs.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_purchased_programs_by_course_user_id', function(req, res, next) {
	var programs = PurchasedPrograms.find({'user_id': req.body.users_id, 'course_id': req.body.course_id})
	programs.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_purchased_programs', function(req, res, next) {
	var programs = PurchasedPrograms.find({'user_id': req.body.users_id})
	programs.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/purchased_programs', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

	var programmm = new PurchasedPrograms({
		course_id: req.body.course_id,
		user_id: req.body.user_id,
		mentor_id: req.body.mentor_id,
		mentor_part: req.body.mentor_part,
		admin_part: req.body.admin_part,
		affiliate_part: req.body.affiliate_part,
		affiliate_id: req.body.affiliate_id,
		pay_status: req.body.pay_status,
		transection_id: req.body.transection_id,
		curriculum_index: req.body.curriculum_index,
		assignment: [],
		course_amount: req.body.course_amount,
		current_date: date,
		student_name: req.body.student_name,
		course_name: req.body.course_name,
		batche_id: req.body.batche_id,
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
	programmm.save(function(err, doc){
		if (err) {
			res.send({status: err})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/purchased_programs_multiple', function(req, res, next) {
	var today = new Date()
	var date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

	PurchasedPrograms.insertMany(req.body.doc, function(err, doc) {
        if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
    })
});
router.get('/get_all_purchased_programs', function(req, res, next) {
	var getCourses = PurchasedPrograms.find()
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
// PurchasedPrograms End

// Courses mentor
router.post('/courses_pull_batche_by_id', function(req, res, next) {
	var pull = Courses.updateOne({"_id" : req.body.course_id}, {
		$pull: { 'batche_time': { id: req.body.batch_id } } 
	})

	pull.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/courses_update_ocumulate', function(req, res, next) {
	var ocumulate = Courses.updateOne({"_id" : req.body.course_id, 'batche_time.id': req.body.batche_id}, { 
		$set: { "batche_time.$.ocumulate" : req.body.ocumulate }
	})
	ocumulate.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/course_rating_feedback_update', function(req, res, next) {
	var rating_feedback = Courses.findOneAndUpdate({'_id': req.body.id}, { 
		rating: req.body.rating,
		$push: { feedback: req.body.feedback } 
	})
	rating_feedback.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.get('/get_all_courses', function(req, res, next) {
	var getCourses = Courses.find()
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_course_by_user_id', function(req, res, next) {
	var getCourses = Courses.find({'user_id': req.body.user_id})
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_course_by_id', function(req, res, next) {
	var getCourses = Courses.find({'_id': req.body.id})
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/update_course_by_id', function(req, res, next) {
	var getCourses = Courses.findByIdAndUpdate(req.body.id,{
		mentor_name: req.body.mentor_name,
		course_name: req.body.course_name,
		course_description: req.body.course_description,
		brief_description: req.body.brief_description,
		domain_tag: req.body.domain_tag,
		duration: req.body.duration,
		fee: req.body.fee,
		pre_requisites: req.body.pre_requisites,
		curriculum: req.body.curriculum,
		user_id: req.body.user_id,
		status: req.body.status,
		shift_status: req.body.shift_status
	})
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/update_course_status', function(req, res, next) {
	var getCourses = Courses.findByIdAndUpdate(req.body.id,{
		status: req.body.status
	})
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/update_course_batches', function(req, res, next) {
	var tt = [{id: req.body.program_id,start_date: req.body.start_date,end_date: req.body.end_date,batch_status: 0,seate_limit:req.body.seate_limit,ocumulate: 0}]

	var getCourses = Courses.findByIdAndUpdate(req.body.id,{
		//shift_status: req.body.shift_status,
		// start_date: req.body.start_date,
		// end_date: req.body.end_date,
		$push: { batche_time: tt } 
		//batche_time: req.body.batche_time
	})
	getCourses.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/update_course_batche_status', function(req, res, next) {
	var batche_status = Courses.updateOne({"_id" : req.body.id, 'batche_time': {
            "$elemMatch": {
                'id': req.body.batch_id
            }
        }
    }, { 
		$set: { "batche_time.$.batch_status" : req.body.batch_status }
	})
	batche_status.exec(function(err, doc){
		if (err) {
			res.send(err)
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});

router.post('/courses', function(req, res, next){
	//console.log(req.body.image_url)
	try{
		var imgB64Data = req.body.image_url;
		var decodedImg = decodeBase64Image(imgB64Data);
		var imageBuffer = decodedImg.data;
		var type = decodedImg.type;
		//var extension = mime.extension(type);
		var fileName =  Date.now() + '.' + 'png';
	    fs.writeFileSync("./public/upload/" + fileName, imageBuffer, 'utf8');
	    var newCourse = new Courses({
			mentor_name: req.body.mentor_name,
			course_name: req.body.course_name,
			course_description: req.body.course_description,
			brief_description: req.body.brief_description,
			domain_tag: req.body.domain_tag,
			start_date: '',
			end_date: '',
			batche_time: [],
			duration: req.body.duration,
			fee: req.body.fee,
			pre_requisites: req.body.pre_requisites,
			curriculum: req.body.curriculum,
			user_id:req.body.user_id,
			status:req.body.status,
			shift_status: req.body.shift_status,
			image_url: fileName,
			current_date: req.body.current_date
		})
		newCourse.save(function(err, doc){
			if (err) {
				res.send({status: 'Failed'})
			}else {
				res.send({status: 'Success!!!'})
			}	
		})
	}
	catch(err){
	    console.error(err)
	}
})
// Courses by mentor End

// For Affiliat
router.get('/admin_affiliat_questions', function(req, res, next) {
	var question = QuestionAffiliat.find({})
	question.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.post('/admin_affiliat_questions_update', function(req, res, next) {
	var question = QuestionAffiliat.findByIdAndUpdate(req.body.id, {
		question: req.body.question
	})
	question.exec(function(err, doc){
		if (err) {
			res.send(err)
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.get('/get_affiliat_approved', function(req, res, next) {
	var question = AffiliatApprove.find({})
	question.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.post('/get_aff_approved_data', function(req, res, next) {
	var get_aff_approved = AffiliatApprove.find({'user_id': req.body.user_id})
	get_aff_approved.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.post('/affiliat_approved', function(req, res, next) {
	var userapproved = new AffiliatApprove({
	    name: req.body.name,
	    question_anser: req.body.question_anser,
	    status: req.body.status,
	    user_id: req.body.user_id,
	    message: req.body.message,
	    date: req.body.date
	})
	userapproved.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/affiliat_approved_status', function(req, res, next) {
	var status = AffiliatApprove.findByIdAndUpdate(req.body.id, {
		status: req.body.status
	})
	status.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/delete_affiliat', function(req, res, next) {
	var Useraff = AffiliatApprove.findOneAndDelete({"user_id" : req.body.user_id})
	Useraff.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
// For Affiliat End


// Users
router.get('/get_student', function(req, res, next) {
	var stu = Users.find({})
	stu.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send(doc)
		}
	})
});
router.post('/get_user_by_user_id', function(req, res, next) {
	var getuser = Users.find({'user_id': req.body.user_id})
	getuser.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.post('/get_user_by_user_roll', function(req, res, next) {
	var getuser = Users.find({'user_roll': req.body.user_roll})
	getuser.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
// Users End


router.post('/update_to_mentor', function(req, res, next) {
	var Userroll = Users.findOneAndUpdate({"user_id" : req.body.user_id}, {
		"user_roll" : req.body.user_roll
	})
	Userroll.exec(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});



router.post('/admin_approved', function(req, res, next) {
	var status = UserApproved.findByIdAndUpdate(req.body.id, {
		status: req.body.status
	})
	status.exec(function(err, doc){
		if (err) {
			res.send(err)
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});

router.post('/user_approved', function(req, res, next) {
	var userapproved = new UserApproved({
	    name: req.body.name,
	    question_anser: req.body.question_anser,
	    status: req.body.status,
	    user_id: req.body.user_id,
	    message: req.body.message,
	    date: req.body.date
	})
	userapproved.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
		
	})
});
router.get('/get_user_approved_all', function(req, res, next) {
	var get_user_approved_all = UserApproved.find({})
	get_user_approved_all.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.post('/get_user_approved', function(req, res, next) {
	var get_user_approved = UserApproved.find({'user_id': req.body.user_id})
	get_user_approved.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	console.log(doc)
	})
});
router.post('/getusers', function(req, res, next) {
	var getuser = Users.find({'email': req.body.email})
	getuser.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.get('/get_admin_questions', function(req, res, next) {
	var question = Question.find({})
	question.exec(function(err, doc){
		if (err) throw err;
		res.send(doc);
	})
});
router.post('/admin_questions', function(req, res, next) {
	var question = Question.findByIdAndUpdate(req.body.id, {
		question: req.body.question
	})
	question.exec(function(err, doc){
		if (err) {
			res.send(err)
		}else {
			res.send({status: 'Success!!!'})
		}
	})
});
router.post('/users', function(req, res, next) {
	var newusers = new Users({
		user_id: req.body.user_id,
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		user_roll: req.body.user_roll
	})
	newusers.save(function(err, doc){
		if (err) {
			res.send({status: 'Failed'})
		}else {
			res.send({status: 'Success!!!'})
		}
		
	})
});


module.exports = router;

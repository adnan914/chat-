import React, { Component } from 'react';
import { Container, Row, Col,  Tabs, Tab, Table, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { gerCourseByUserId, getTaskByCourseId, getPurchasedProgramsByMentorId, regFees } from '../../store/action/action';
import config from '../../Config/Config';

const today = new Date()
const month = `0${(today.getMonth() + 1)}`
const day = `0${(today.getDate())}`

const date = `${today.getFullYear()}-${month.slice(-2)}-${day.slice(-2)}`;

class Mentorform extends Component {
	constructor(props){
		super(props);
		this.state = {
			id: '',
			show: false,
			program_id: '',
			showBatchs: false,
			courseid: '',
			batches: 0,
			batcheTime: [],
			sDate: "",
			endD: '',
			batchesList: [],
			actualRating: [],
			payment: [],
			pamentModel: false,
			course_id: '',
			genrateLink: false
		}
		this.shiftToCourse = this.shiftToCourse.bind(this);
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.completeBatch = this.completeBatch.bind(this);
	}
	genrateLink = (e) => this.setState({genrateLink: true, course_id: e});
	genrateLinkClose = () => this.setState({genrateLink: false, course_id: ''});

	async componentDidMount(){
		await this.props.regFees()
		await this.props.gerCourseByUserId()
		await this.props.getPurchasedProgramsByMentorId(localStorage.getItem('user_id'))
		this.increment();
	}
	timer(){
		if (this.props.state_course_by_user_id === undefined || this.props.state_get_purchased_programs_by_mentor_id === undefined) {	
		} else {
			let course = this.props.state_course_by_user_id
			let purchas = this.props.state_get_purchased_programs_by_mentor_id
			let totalrating = 0;
			let payment = []
			for(let i=0; course.length > i; i++){
				if (course[i].rating !== null) {
					totalrating += course[i].rating
				}
				let count = 0;
				for(let j=0; purchas.length > j; j++){
					if (course[i]._id === purchas[j].course_id) {
						count += 1
					}
				}
				payment.push({course_name: course[i].course_name, student_count: count, course_id: course[i]._id, course_amount: course[i].fee})
			}
			let actualRating = (totalrating/course.length).toFixed(0)
			let ratArray = []
			for(let i=0; actualRating > i; i++){
				ratArray.push('')
			}
			this.setState({
				actualRating: ratArray,
				payment: payment
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	handleShow(batches, course_id){
		this.setState({
			show: true,
			batchesList: batches,
			course_id: course_id
		})
	}
	handleClose(){
		this.setState({
			show: false,
			course_id: ''
		})
	}
	showBatchs = (id, program_id) => this.setState({showBatchs:true,id: id,program_id: program_id});
	hideBatchs = () => this.setState({showBatchs:false,id: '',program_id: ''});
	pamentModel = (id) => this.setState({pamentModel: true, course_id: id});
	paymentClose = () => this.setState({pamentModel: false, course_id: ''});

	// changeHandler = (e) => {
	// 	this.setState({batches: e.target.value})
	// 	var actualLimi = 100/e.target.value
	// 	let batchCount = []
	// 	for(let i=0; e.target.value > i; i++){
	// 		batchCount.push({batch_id: i+1,start_time: '', end_time: '', seate_limit: (actualLimi).toFixed(0)})
	// 	}
	// 	this.setState({
	// 		batcheTime: batchCount
	// 	})
	// }
	// startTime = (e) => {
	// 	let t = e.target.value
	// 	let [h,m] = t.split(":");
	// 	let vv = (h%12+12*(h%12===0))+":"+m
 //  		let ampm = (h >= 12 ? ' PM' : ' AM')
 //  		let time = (vv + ampm)

 //  		console.log(time, e.target.name)
 //  		let currentState = this.state.batcheTime
 //        currentState[parseInt(e.target.name)].start_time = time;
 //        this.setState({
 //            batcheTime: currentState
 //        })
	// }
	// endTime = (e) => {
	// 	let t = e.target.value
	// 	let [h,m] = t.split(":");
	// 	let vv = (h%12+12*(h%12===0))+":"+m
 //  		let ampm = (h >= 12 ? ' PM' : ' AM')
 //  		let time = (vv + ampm)

 //  		console.log(time, e.target.name)
	// 	let currentState = this.state.batcheTime
	// 	currentState[parseInt(e.target.name)].end_time = time;
	// 	this.setState({
	// 		batcheTime: currentState
	// 	})
	// }
	// seatLimit = (e) => {
	// 	var actualLimi = 100
	// 	if (e.target.value <= actualLimi) {
	// 		let currentState = this.state.batcheTime
	// 		currentState[parseInt(e.target.name)].seate_limit = e.target.value;
	// 		this.setState({
	// 			batcheTime: currentState
	// 		})
	// 	} else {
	// 		alert(`Maximum seate limit in one batche ${(actualLimi).toFixed(0)}`)
	// 	}
		
	// }
	shiftToCourse(e) {
		e.preventDefault();
		let pro_id = this.state.program_id + 1
		let seate_limit = this.props.state_get_reg_fees[0].seate_limit
		fetch(`${config.base_url}/update_course_batches`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': this.state.id,
				'program_id': pro_id,
				//'shift_status': 0,
				'start_date': this.state.sDate,
				'end_date': this.state.endD,
				'seate_limit': seate_limit
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
					alert('Shift Successfully!!!')
					window.location.reload();
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	completeBatch(id){
		fetch(`${config.base_url}/courses_pull_batche_by_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'course_id': this.state.course_id,
				'batch_id': id
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
					alert(obj.status)
					window.location.reload();
			}else {
				alert(obj.status)
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		const { sDate } = this.state;
		const purchas_course = this.props.state_get_purchased_programs_by_mentor_id
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<div className="curii">
								<div className="profile">
									<div className="proImg">
										<img src="https://eshendetesia.com/images/user-profile.png" alt="Profile" />
									</div>
									<div className="proDetail">
										<h3>{localStorage.getItem('name')}</h3>
										<p>{/*Full Stack Developer*/}</p>
										<div className="proDe">
											<ul>
												<li>
													<h4>No. of Programs</h4>
													<span>{this.props.state_course_by_user_id === undefined ? null : this.props.state_course_by_user_id.length }</span>
												</li>
												<li>
													<h4>Total Experience</h4>
													<span>2 Year</span>
												</li>
												<li>
													<h4>Total Students</h4>
													<span>{this.props.state_get_purchased_programs_by_mentor_id === undefined ? null : this.props.state_get_purchased_programs_by_mentor_id.length }</span>
												</li>
												<li>
													<h4>Reviews &amp; Rating</h4>
													<div className="starRating">
													{this.state.actualRating.length === 0 ? 0 : this.state.actualRating.map((rat, i) => (
														<i className="fa fa-star" key={i}></i>
													))}
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="proTabs">
									<Tabs defaultActiveKey="curriculum" id="uncontrolled-tab-example">
										<Tab eventKey="curriculum" title="Curriculum">
											<div className="curiTable table-responsive">
												<div className="text-right"><Link className="mainBtn" to="/createcurriculum">Create Curriculum</Link></div>
												<Table striped bordered hover size="sm">
													<thead>
														<tr>
															<th>Curriculum</th>
															<th>Duration</th>
															<th>Status</th>
															<th>Edit</th>
															<th>Shift to course</th>
														</tr>
													</thead>
													<tbody>
													{this.props.state_course_by_user_id === undefined || this.props.state_course_by_user_id.length === 0 ? 
														<tr>
															<td colSpan="6">
																No Records
															</td>
														</tr>
													: 
														this.props.state_course_by_user_id.map((courses, i) => (
														<tr key={i}>
															<td>{courses.course_name}</td>
															<td>{courses.duration}</td>
															<td>{courses.status === 0 ? 'Waiting for approval' : courses.status === 1 ? 'Approved' : courses.status === 2 ? 'Rejected' : courses.status === 3 ? 'Compelete' : null}</td>
															<td><Link to={`/createcurriculumedit/${courses._id}`} className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td>
															{courses.status === 0 || courses.status === 2 ? '--' : 
																courses.shift_status === 1 || courses.shift_status === 2 ? 'Course Shifted to Programs' : 
																<button className="btn btn-danger" onClick={() => this.showBatchs(courses._id, courses.batche_time.length)}><i className="fa fa-sign-out"></i></button>
															}
															</td>
														</tr>

														))
													}
													</tbody>
												</Table>
											</div>
										</Tab>
										<Tab eventKey="programs" title="Programs">
											<div className="curiTable table-responsive">
												<Table striped bordered hover size="sm">
													<thead>
														<tr>
															<th>Curriculum</th>
															<th>Duration</th>
															<th>Batches</th>
															<th>Action</th>
															<th>Share Program</th>
														</tr>
													</thead>
													{this.props.state_course_by_user_id === undefined || this.props.state_course_by_user_id.length === 0 ? 
													<tbody>	
														<tr>
															<td colSpan="5">
																No Records
															</td>
														</tr>
													</tbody>
														:
													<tbody>
														{this.props.state_course_by_user_id.map((courses, i) => (
															courses.status === 0 ? null : 
															<tr key={i}>
																<td>{courses.course_name}</td>
																<td>{courses.duration}</td>
																<td><Link to="#" className="subBtn" onClick={() => this.handleShow(courses.batche_time, courses._id)}>View Batches</Link></td>
																<td><Link to={`/mentortask/${courses._id}`} className="subBtn">View Course</Link></td>
																<td><button className="subBtn" onClick={() => this.genrateLink(courses._id)}>Genrate Link</button></td>
															</tr>
														))}
													</tbody>
													}
												</Table>
											</div>
										</Tab>
										<Tab eventKey="payment" title="Payments">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Course Name</th>
														<th>No. of Student</th>
														<th>Course Ammount</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
												{this.state.payment.map((pay, i) => (
													<tr key={i}>
														<th>{pay.course_name}</th>
														<th>{pay.student_count}</th>
														<th>{pay.course_amount}</th>
														<th><button className="subBtn" onClick={() => this.pamentModel(pay.course_id)}>View</button></th>
													</tr>
												))}
												</tbody>
											</Table>
										</Tab>
										<Tab eventKey="feedback" title="Feedback">
											<div className="feedBack">
												<Row>
													<Col md={12}>
														{purchas_course === undefined ? null : 
															purchas_course.map((feedback, i) => (
															feedback.feedback === '' ? null :
															<div className="feedContent" key={i}>
																<h5>{feedback.student_name}</h5>
																<p>{feedback.feedback}</p>
															</div>
															))
														}
													</Col>
												</Row>
											</div>
										</Tab>
									</Tabs>
								</div>
								
								<Modal show={this.state.show} onHide={this.handleClose}>
									<Modal.Header closeButton>
										<Modal.Title>Batches</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<div className="text-center">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>S.No.</th>
														<th>Start Time</th>
														<th>End Time</th>
														<th>Status</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
												{this.state.batchesList.map((batchess, i) => (
													<tr key={i}>
														<td>{i+1}</td>
														<td>{batchess.start_date}</td>
														<td>{batchess.end_date}</td>
														<td className={batchess.batch_status === 0 ? 'yellow' : batchess.batch_status === 1 ? 'greenColor' : batchess.batch_status === 2 ? 'text-danger' : null }>{batchess.batch_status === 0 ? 'Pending' : batchess.batch_status === 1 ? 'Approved' : batchess.batch_status === 2 ? 'Denied' : null }</td>
														<td>
															<DropdownButton alignRight title="" id="dropdown-menu-align-right">
																<Dropdown.Item onClick={() => this.completeBatch(batchess.id)}>Compelete This Batche</Dropdown.Item>
															</DropdownButton>
														</td>
													</tr>
												))}
												</tbody>
											</Table>
										</div>
									</Modal.Body>
								</Modal>

								<Modal show={this.state.showBatchs} onHide={this.hideBatchs}>
									<Modal.Header closeButton>
										<Modal.Title>Create Batches</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<div className="qList">
											<form onSubmit={this.shiftToCourse}>
												<div className="row">
													<div className="col-md-6">
														<div className="form-group">
															<label htmlFor="sDate">Start Date</label>
															<input type="date" min={date} onChange={e => this.setState({ sDate: e.target.value })} className="form-control" required />
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group">
															<label htmlFor="sDate">End Date:</label>
															<input type="date" min={sDate} onChange={e => this.setState({ endD: e.target.value })} className="form-control" required />
														</div>
													</div>
												</div>
												<div className="form-group">
													<label>Seate Limit: <b>{this.props.state_get_reg_fees === undefined ? null : this.props.state_get_reg_fees[0].seate_limit}</b></label>
												</div>
												{/*
												<div className="form-group">
													<label>Select Batches per day</label>
													<select className="form-control" onChange={this.changeHandler} name="batches" required>
														<option value="">---Please Select---</option>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
													</select>
												</div>
												<div className="text-center">
													<Table bordered hover size="sm">
														<thead>
															<tr>
																<th>Batches</th>
																<th>Start Time</th>
																<th>End Time</th>
																<th>Seate Limit</th>
															</tr>
														</thead>
														<tbody>
															{this.state.batches === 0 ? <tr><td colSpan="4">Please Select Batches Counte</td></tr> : this.state.batcheTime.map((batch, i) => (
															<tr key={i}>
																<td>{i+1}</td>
																<td><input type="time" name={i} className="form-control" onChange={this.startTime} required /></td>
																<td><input type="time" name={i} className="form-control" onChange={this.endTime} required /></td>
																<td>{batch.seate_limit}</td>
															</tr>
															))}
														</tbody>
													</Table>
												</div>
												*/}
												<div>
													<button className="mainBtn" type="submit">Submit</button>
												</div>
											</form>
										</div>
									</Modal.Body>
								</Modal>



								<Modal show={this.state.pamentModel} onHide={this.paymentClose}>
									<Modal.Header closeButton>
										<Modal.Title>Payment</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<div className="text-center">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Student Name</th>
														<th>Via</th>
														<th>Amount</th>
														<th>Status</th>
													</tr>
												</thead>
												<tbody>
												{purchas_course === undefined || this.state.course_id === '' ? null : 
												 
												 purchas_course.map((purchas, i) => (
												 	this.state.course_id === purchas.course_id ?
													<tr key={i}>
														<td>{purchas.student_name}</td>
														<td>{purchas.affiliate_part.ammount !== 0 ? 'Affiliate' : purchas.admin_part < purchas.mentor_part.ammount ? 'Mentor' : 'C4' }</td>
														<td>{purchas.mentor_part.ammount}</td>
														<td className={purchas.mentor_part.status === 0 ? 'yellow' : 'greenColor'}>{purchas.mentor_part.status === 0 ? 'Pending' : 'Compelete'}</td>
													</tr>: null
												))}
												</tbody>
											</Table>
										</div>
									</Modal.Body>
								</Modal>
								
								<Modal show={this.state.genrateLink} onHide={this.genrateLinkClose}>
									<Modal.Header closeButton>
										<Modal.Title>Genrate Link</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<div className="text-center">
											<input type="text" defaultValue={`${window.location.origin}/${this.state.course_id}/${localStorage.getItem('user_id')}`} className="form-control" />
										</div>
									</Modal.Body>
								</Modal>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_course_by_user_id: state.state_course_by_user_id,
		state_task_by_course_id: state.state_task_by_course_id,
		state_get_purchased_programs_by_mentor_id: state.state_get_purchased_programs_by_mentor_id,
		state_get_reg_fees: state.state_get_reg_fees
	}
}
export default connect(mapStateToProps, {gerCourseByUserId, getTaskByCourseId, getPurchasedProgramsByMentorId, regFees}) (Mentorform);
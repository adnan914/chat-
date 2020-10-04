import React, { Component } from 'react';
import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { Programside } from '../../Include';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { gerCourseById, getTaskByCourseId } from '../../store/action/action';
import config from '../../Config/Config';

// Final Project Submit
class Projectsubmit extends Component {
	//gerCourseById
	constructor(props){
		super(props);
		this.state = {
			course_counter: '',
			purchas_counter: '',
			assigment_counter: '',
			link: '',
			submit_course: [0],
			editModal: false
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.submit = this.submit.bind(this);
		this.linkEdit = this.linkEdit.bind(this);
	}
	handleShow = () => this.setState({show: true});
	handleClose = () => this.setState({show: false,link: ''});

	editModal = () => this.setState({editModal: true});
	editModalClose = () => this.setState({editModal: false,link: ''});

	async componentDidMount(){
		await this.props.gerCourseById(this.props.match.params.courseid);
		await this.props.getTaskByCourseId(this.props.match.params.courseid);
		await fetch(`${config.base_url}/get_purchased_programs_by_course_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				users_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.courseid
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			this.setState({
				purchas_counter: obj[0].curriculum_index.length,
				assigment_counter: obj[0].assignment.length,
				submit_course: obj[0].submit_course
			})
		})
		.catch((error) => {
			console.log(error);
		});
		this.increment();
	}
	timer(){
		if (this.props.state_course_by_id === undefined || this.props.state_course_by_id.length === 0) {	
		} else {
			let curOut = this.props.state_course_by_id[0].curriculum.length
			var count = 0;
			for(let i=0; curOut > i; i++){
				count = this.props.state_course_by_id[0].curriculum[i].length + count
			}
			this.setState({
				course_counter: count
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submit(e){
		e.preventDefault()
		let today = new Date()
		let date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

		fetch(`${config.base_url}/purchased_programs_submit_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.courseid,
				submit_course: [{
					current_date: date,
					link: this.state.link,
					grade: '--',
					remark: '--'
				}]
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				alert('Uploaded Successfully!!!')
				window.location.reload();
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	linkEdit(){
		fetch(`${config.base_url}/purchased_programs_submit_course_link_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.courseid,
				link: this.state.link
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				alert('Uploaded Successfully!!!')
				window.location.reload();
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 10, offset: 1 }}>
							<div className="courseProgram">
								<Programside courseid={this.props.match.params.courseid} />
								<div className="courseTabDetail">
									<div className="curii">
										<div className="text-right">
											<Link to={`/projectleaderboard/${this.props.match.params.courseid}`} className="mainBtn">Leader Board</Link>
										</div>
										<Table striped bordered hover size="sm">
											<thead>
												<tr>
													<th>Program Name</th>
													<th>Upload Assignment</th>
													<th>Submitted Date</th>
													<th>Grade</th>
													<th>Remarks</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>{this.props.state_course_by_id  === undefined ? '--' : this.props.state_course_by_id[0].course_name}</td>
													<td>
														{this.props.state_task_by_course_id === undefined ? 'Please Submit All Task and Curriculum' :
														(this.state.course_counter === this.state.purchas_counter) && (this.props.state_task_by_course_id.length === this.state.assigment_counter) ?
														this.state.submit_course[0] === 0 ? <button className="subBtn" onClick={this.handleShow}>Submit Task</button> : 
															<div className='curiTable sumLink'>
																<a href={this.state.submit_course[0].link} target="_blank" rel="noopener noreferrer">Completed</a>
																<button className="btn btn-primary" onClick={() => this.editModal()}><i className="fa fa-edit"></i></button>
															</div> 
														: 'Please Submit All Task and Curriculum'
														}
													</td>
													<td>
														{this.state.submit_course[0] === 0 ? '--' : this.state.submit_course[0].current_date.slice(0,10) }
													</td>
													<td>{this.state.submit_course[0] === 0 ? '--' : this.state.submit_course[0].grade}</td>
													<td>{this.state.submit_course[0] === 0 ? '--' : this.state.submit_course[0].remark}</td>
												</tr>
											</tbody>
										</Table>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Submit Final Project</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<form onSubmit={this.submit}>
								<div className="form-group">
									<input type="text" name="link" placeholder="Link" value={this.state.link} onChange={(e) => this.setState({link: e.target.value})} className="form-control" required />
								</div>
								<Button variant="primary" type="submit">
									Submit
								</Button>
							</form>
						</div>
					</Modal.Body>
				</Modal>
				<Modal show={this.state.editModal} onHide={this.editModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Link</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<form onSubmit={this.linkEdit}>
								<div className="form-group">
									<input type="text" name="link" placeholder="Link" value={this.state.link} onChange={(e) => this.setState({link: e.target.value})} className="form-control" required />
								</div>
								<Button variant="primary" type="submit">
									Submit
								</Button>
							</form>
						</div>
					</Modal.Body>
				</Modal>
			</section>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		state_course_by_id: state.state_course_by_id,
		state_task_by_course_id: state.state_task_by_course_id
	}
}
export default connect(mapStateToProps, {gerCourseById, getTaskByCourseId}) (Projectsubmit);
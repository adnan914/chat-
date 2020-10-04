import React, { Component } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Programside } from '../../Include';
import {connect} from 'react-redux';
import { getTaskByCourseId } from '../../store/action/action';
import config from '../../Config/Config';


class Task extends Component {
	constructor(props){
		super(props);
		this.state = {
			show: false,
			taskk: [],
			assignment_id: '',
			link: '',
			showEdit: false,
			assignment_name: ''
		}
		this.submitForm = this.submitForm.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
	}
	handleClose = () => this.setState({show:false, assignment_id: '', link: '', assignment_name: ''});
	handleShow = (id, assignment_name) => this.setState({show:true, assignment_id: id, assignment_name: assignment_name});
	changeHandler = (e) => this.setState({link: e.target.value});
	editClose = () => this.setState({showEdit:false, assignment_id: '',link: ''});
	editModal = (id) => this.setState({showEdit:true,assignment_id: id});

	

	async componentDidMount(){
		await this.props.getTaskByCourseId(this.props.match.params.courseid)
		fetch(`${config.base_url}/get_purchased_programs_by_course_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'course_id': this.props.match.params.courseid,
				'users_id': localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			this.setState({
				taskk: obj
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	submitForm(e) {
		e.preventDefault();
		fetch(`${config.base_url}/purchased_programs_assignment_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.courseid,
				assignment: [{
					assignment_name: this.state.assignment_name,
					assignment_id: this.state.assignment_id,
					grad: '',
					remark: '',
					link: this.state.link
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
	submitEdit(e) {
		e.preventDefault();
		fetch(`${config.base_url}/purchased_programs_assignment_link_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id'),
				assignment_id: this.state.assignment_id,
				link: this.state.link
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			if (obj.status === 'Success!!!') {
				alert('Updated Successfully!!!')
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
											<Link to={`/taskleaderboard/${this.props.match.params.courseid}`} className="mainBtn">Leader Board</Link>
										</div>
										<div className="text-center">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Assignment</th>
														<th>Date</th>
														<th>Question</th>
														<th>Upload</th>
														<th>Grade</th>
														<th>Remarks</th>
													</tr>
												</thead>
												<tbody>
													{this.props.state_task_by_course_id === undefined || this.props.state_task_by_course_id.length === 0 || this.state.taskk.length === 0 ? 
														<tr>
															<td colSpan="6">No Task Uploaded</td>
														</tr>
													: 
													this.props.state_task_by_course_id.map((task, i) => (
														<tr key={i}>
															<td>{task.assignment}</td>
															<td>{task.date}</td>
															<td><a href={task.question} target="_blank" rel="noopener noreferrer" className="subBtn">Download</a></td>
															<td>
																{this.state.taskk[0].assignment.some(assigmentss => assigmentss.assignment_id === task._id) ?
																	this.state.taskk[0].assignment.map((assiments, a) => (
																		assiments.assignment_id === task._id ? 
																		<div className='curiTable sumLink' key={a}>
																			<a href={assiments.link} target="_blank" rel="noopener noreferrer">Completed</a>
																			<button className="btn btn-primary" onClick={() => this.editModal(task._id, assiments._id)}><i className="fa fa-edit"></i></button>
																		</div> 
																		: 
																		null
																	))
																:
																	<button className="subBtn" onClick={() => this.handleShow(task._id, task.assignment)}>Submit Task</button>
																}
															</td>
															<td>
																{this.state.taskk[0].assignment.some(assigmentss => assigmentss.assignment_id === task._id && assigmentss.grad !== '' ) ?
																	this.state.taskk[0].assignment.map((assiments, a) => (
																		assiments.assignment_id === task._id ? <span key={a}>{assiments.grad}</span> : null
																	))
																:
																	'--'
																}
															</td>
															<td>
																{this.state.taskk[0].assignment.some(assigmentss => assigmentss.assignment_id === task._id && assigmentss.remark !== '' ) ?
																	this.state.taskk[0].assignment.map((assiments, a) => (
																		assiments.assignment_id === task._id ? <span key={a}>{assiments.remark}</span> : null
																	))
																:
																	'--'
																}
															</td>
														</tr>
													))}
												</tbody>
											</Table>
										</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
				<Modal show={this.state.show}>
					<Form onSubmit={this.submitForm}>
						<Modal.Header>
							<Modal.Title>Submit Your Task</Modal.Title>
						</Modal.Header>
						<div className="sumitField">
							<Form.Group>
								<label>Link</label>
								<Form.Control className="form-control" custom required value={this.state.link} onChange={this.changeHandler} />
							</Form.Group>
						</div>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.handleClose}>
							Close
							</Button>
							<button className="mainBtn" type="submit">
								Submit
							</button>
						</Modal.Footer>
					</Form>
				</Modal>

				<Modal show={this.state.showEdit}>
					<Form onSubmit={this.submitEdit}>
						<Modal.Header>
							<Modal.Title>Your Link</Modal.Title>
						</Modal.Header>
						<div className="sumitField">
							<Form.Group>
								<label>Link</label>
								<Form.Control className="form-control" custom required value={this.state.link} onChange={this.changeHandler} />
							</Form.Group>
						</div>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.editClose}>
							Close
							</Button>
							<button className="mainBtn" type="submit">
								Submit
							</button>
						</Modal.Footer>
					</Form>
				</Modal>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_task_by_course_id: state.state_task_by_course_id,
	}
}
export default connect(mapStateToProps, {getTaskByCourseId}) (Task);
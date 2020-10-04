import React, { Component } from 'react';
import { Container, Row, Col, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { getTaskByCourseId } from '../../store/action/action';
import MentorSide from '../../MentorSide';
import config from '../../Config/Config';

class MentorTask extends Component {
	constructor(props){
		super(props);
		this.state = {
			showTask: false,
			name: '',
			date: '',
			link: ''
		}
		this.task = this.task.bind(this);
	}
	changeHandler = (e) => this.setState({ [e.target.name]: e.target.value });
	showTask = (e) => this.setState({showTask:true});
	hideTask = (e) => this.setState({showTask:false});
	async componentDidMount(){
		await this.props.getTaskByCourseId(this.props.match.params.courseid)
	}
	task(e){
		e.preventDefault();
		fetch(`${config.base_url}/tasks_insert`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: this.props.match.params.courseid,
				assignment: this.state.name,
				date: this.state.date,
				question: this.state.link,
				user_id: localStorage.getItem('user_id')
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
								<MentorSide link={this.props.match.params.courseid} />
								<div className="courseTabDetail">
									<div className="curii">
										<div className="text-right">
											<button className="mainBtn" onClick={this.showTask}>Add Task</button>
										</div>
										<div className="text-center">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Assignment</th>
														<th>Date</th>
														<th>Question</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													{this.props.state_task_by_course_id === undefined || this.props.state_task_by_course_id.length === 0 ? 
														<tr colSpan="4">
															<td colSpan="4">No Task Uploaded</td>
														</tr>
													: 
													this.props.state_task_by_course_id.map((task, i) => (
														<tr key={i}>
															<td>{task.assignment}</td>
															<td>{task.date}</td>
															<td><a href={task.question} target="_blank" rel="noopener noreferrer" className="subBtn">Download</a></td>
															<td className="curiTable">
																<Link className="btn btn-primary" to={`/edittask/${task._id}/${this.props.match.params.courseid}`}><i className="fa fa-edit"></i></Link>
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
				<Modal show={this.state.showTask} onHide={this.hideTask}>
					<Modal.Header closeButton>
						<Modal.Title>Task</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<form onSubmit={this.task}>
								<div className="form-group">
									<label>Assignment Name</label>
									<input type="text" name="name" value={this.state.name} onChange={this.changeHandler} className="form-control" required />
								</div>
								<div className="form-group">
									<label>Date</label>
									<input type="date" name="date" value={this.state.date} onChange={this.changeHandler} className="form-control" required />
								</div>
								<div className="form-group">
									<label>Assignment Link</label>
									<input type="text" name="link" value={this.state.link} onChange={this.changeHandler} className="form-control" required />
								</div>
								<div>
									<button className="mainBtn" type="submit">Submit</button>
								</div>
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
		state_task_by_course_id: state.state_task_by_course_id
	}
}
export default connect(mapStateToProps, {getTaskByCourseId}) (MentorTask);
import React, { Component } from 'react';
import { Container, Row, Col, Table, Modal } from 'react-bootstrap';
import {connect} from 'react-redux';
import { getAllStudent } from '../../store/action/action';
import MentorSide from '../../MentorSide';
import config from '../../Config/Config';

class MentorProject extends Component {
	constructor(props){
		super(props);
		this.state = {
			showTask: false,
			grade: '',
			remark: '',
			link: '',
			purchas_course: [],
			id: ''
		}
		this.gradRemark = this.gradRemark.bind(this);
	}
	changeHandler = (e) => this.setState({ [e.target.name]: e.target.value });
	showTask = (e) => this.setState({showTask:true,id: e});
	hide = () => this.setState({showTask:false,id: ''});

	async componentDidMount(){
		await this.props.getAllStudent()
		await fetch(`${config.base_url}/get_purchased_programs_by_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: this.props.match.params.courseid
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			this.setState({
				purchas_course: obj
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	gradRemark(e){
		e.preventDefault();
		fetch(`${config.base_url}/purchased_programs_submit_course_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: this.state.id,
				grade: this.state.grade,
				remark: this.state.remark
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
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
										<h5>Submit List</h5>
										<div className="text-center">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Student Name</th>
														<th>Date</th>
														<th>Link</th>
														<th>Grade</th>
														<th>Remark</th>
														<th>Status</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													{this.state.purchas_course.length === 0 ? null : this.state.purchas_course.map((course, i) => (
													<tr key={i}>
														<td>
															{this.props.state_get_all_student === undefined ? '--' : 
																this.props.state_get_all_student.map((stud, k) => (
																	course.user_id === stud.user_id ? stud.name : null
																))
															}
														</td>
														<td>{course.submit_course[0] === 0 ? '--' : course.submit_course[0].current_date.slice(0, 10)}</td>
														<td>{course.submit_course[0] === 0 ? '--' : <a href={course.submit_course[0].link} target="_blank" rel="noopener noreferrer" className="subBtn">Download</a>}</td>
														<td>{course.submit_course[0] === 0 ? '--' : course.submit_course[0].grade}</td>
														<td>{course.submit_course[0] === 0 ? '--' : course.submit_course[0].remark}</td>
														<td>{course.submit_course[0] === 0 ? 'Pending' : 'Completed'}</td>
														<td className="curiTable">
															{course.submit_course[0] === 0 ? '--' : <button className="btn btn-primary" onClick={() => this.showTask(course._id)}><i className="fa fa-edit"></i></button> }
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
				<Modal show={this.state.showTask} onHide={this.hide}>
					<Modal.Header closeButton>
						<Modal.Title>Grade</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<form onSubmit={this.gradRemark}>
								<div className="form-group">
									<label>Grade</label>
									<select name="grade" className="form-control" required onChange={this.changeHandler}>
										<option value="">--Please Select--</option>
										<option value="A">A</option>
										<option value="B">B</option>
										<option value="C">C</option>
										<option value="D">D</option>
										<option value="F">F</option>
									</select>
								</div>
								<div className="form-group">
									<label>Remark</label>
									<input type="text" name="remark" value={this.state.remark} onChange={this.changeHandler} className="form-control" required />
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
		state_get_all_student: state.state_get_all_student
	}
}
export default connect(mapStateToProps, {getAllStudent}) (MentorProject);
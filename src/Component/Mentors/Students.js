import React, { Component } from 'react';
import { Container, Row, Col, Table, Card, Accordion, Button, Modal, Alert } from 'react-bootstrap';
import MentorSide from '../../MentorSide';
import {connect} from 'react-redux';
import { getAllStudent } from '../../store/action/action';
import config from '../../Config/Config';


class Students extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			date: '',
			link: '',
			courseid: '',
			purchas: [],
			gradRemak: false,
			grad: '',
			remark: '',
			assignment_id: '',
			user_id: ''
		}
		this.submitGrad = this.submitGrad.bind(this);
	}
	gradRemak = (user_id, assignment_id) => this.setState({gradRemak: true,user_id: user_id, assignment_id: assignment_id});
	hideGradRemak = () => this.setState({gradRemak: false,user_id: '', assignment_id: ''});
	changeHandler = (e) => this.setState({[e.target.name]: e.target.value})
	async componentDidMount(){
		await this.props.getAllStudent()
		fetch(`${config.base_url}/get_purchased_programs_by_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'course_id': this.props.match.params.courseid
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			this.setState({
				purchas: obj
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}

	submitGrad(e){
		e.preventDefault();
		fetch(`${config.base_url}/purchased_programs_assignment_grad_remark_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: this.state.user_id,
				assignment_id: this.state.assignment_id,
				grad: this.state.grad,
				remark: this.state.remark
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				alert('Successfully!!!')
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
										<h5>List of Students</h5>
										<Accordion defaultActiveKey="0">
											{this.state.purchas.length === 0 ? <Alert variant='primary'>No Students</Alert> : 
												this.state.purchas.map((purch, i) => (
													this.props.state_get_all_student === undefined || this.props.state_get_all_student.length === 0 ? null : 
														this.props.state_get_all_student.map((st, ky) => (

														st.user_id === parseInt(purch.user_id) ? 
														<Card key={ky}>
															<Card.Header>
																<Accordion.Toggle as={Button} variant="link" eventKey={i+1}>
																	{st.name}
																</Accordion.Toggle>
															</Card.Header>
															<Accordion.Collapse eventKey={i+1}>
																<div>
																	<Table striped bordered hover size="sm">
																		<thead>
																			<tr>
																				<th>Assigment Name</th>
																				<th>Link</th>
																				<th>Grad</th>
																				<th>Remark</th>
																				<th>Action</th>
																			</tr>
																		</thead>
																		<tbody>
																		{purch.assignment.length === 0 ? <tr><td colSpan='5'>There are no task submit</td></tr> : 
																			purch.assignment.map((assimment, idx) => (
																			<tr key={idx}>
																				<td>{assimment.assignment_name === '' ? '--' : assimment.assignment_name}</td>
																				<td>{assimment.link === '' ? '--' : <a href={assimment.link} className='subBtn' rel="noopener noreferrer" target="_blank">View</a>}</td>
																				<td>{assimment.grad === '' ? '--' : assimment.grad}</td>
																				<td>{assimment.remark === '' ? '--' : assimment.remark}</td>
																				<td><button className='subBtn' onClick={() => this.gradRemak(purch.user_id, assimment.assignment_id)}>Edit</button></td>
																			</tr>
																		))}
																		</tbody>
																	</Table>
																</div>
															</Accordion.Collapse>
														</Card>
														: null
														))
												))}
										</Accordion>
									</div>
								</div>
								<Modal show={this.state.gradRemak} onHide={this.hideGradRemak}>
									<Modal.Header closeButton>
										<Modal.Title>Assigment Grade</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<div className="qList">
											<form onSubmit={this.submitGrad}>
												<div className="form-group">
													<label>Grade</label>
													<select name="grad" className="form-control" required onChange={this.changeHandler}>
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
		state_get_all_student: state.state_get_all_student
	}
}
export default connect(mapStateToProps, {getAllStudent}) (Students);
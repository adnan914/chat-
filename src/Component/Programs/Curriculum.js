import React, { Component } from 'react';
import { Container, Row, Col, Table, Card, Accordion, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Programside } from '../../Include';
import { connect } from 'react-redux';
import { gerCourseById } from '../../store/action/action';
import config from '../../Config/Config';

class Curriculum extends Component {
	constructor(props){
		super(props);
		this.state = {
			show: false,
			index: '',
			curiulumstatus: []
		}
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.completed = this.completed.bind(this);
	}
	handleShow(i, ky){
		this.setState({
			show: true,
			index: {i, ky}
		})
	}
	handleClose(){
		this.setState({
			show: false,
			index: '',
		})
	}
	completed(){
		fetch(`${config.base_url}/purchased_programs_curriculum_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'users_id': localStorage.getItem('user_id'),
				'course_id': this.props.match.params.id,
				'curriculum_index': this.state.index
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				window.location.reload();
				return false;
			} else {

			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	async componentDidMount(){
		await this.props.gerCourseById(this.props.match.params.id)
		await fetch(`${config.base_url}/get_purchased_programs_by_course_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'course_id': this.props.match.params.id,
				'users_id': localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			this.setState({
				curiulumstatus: obj[0].curriculum_index
			})
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
								<Programside courseid={this.props.match.params.id} />
								<div className="courseTabDetail">
									<div className="curii">
										<Accordion defaultActiveKey="0">
											<div className="text-right">
												<Link to={`/currileaderboard/${this.props.match.params.id}`} className="mainBtn">Leader Board</Link>
											</div>
											{this.props.state_course_by_id === undefined ? 
												<div className="loader">
													<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
												</div>
											:
											this.props.state_course_by_id[0].curriculum.map((course, i) => (
											<Card key={i}>
												<Card.Header>
													<Accordion.Toggle as={Button} variant="link" eventKey={i+1}>
														Week-{i+1}
													</Accordion.Toggle>
												</Card.Header>
												<Accordion.Collapse eventKey={i+1}>
													<div>
														<Table striped bordered hover size="sm">
															<thead>
																<tr>
																	<th>Topic</th>
																	<th>Day(s)</th>
																	<th>Link</th>
																	<th>Status</th>
																</tr>
															</thead>
															<tbody>
																{course.map((courses, ky) => (
																<tr key={ky}>
																	<td>{courses.topik}</td>
																	<td>Day {ky+1}</td>
																	<td><a href={courses.link} rel="noopener noreferrer" target="_blank">Click Here</a></td>
																	<td>
																		{this.state.curiulumstatus.map((dat, n) => (
																			dat.i === i && dat.ky === ky ? <span className='checked' key={n}><i className="fa fa-check-square-o"></i></span> : null
																		))}																	
																		<span className="cehckkk" onClick={() => this.handleShow(i, ky)}></span>
																	</td>
																</tr>
																))}
															</tbody>
														</Table>
													</div>
												</Accordion.Collapse>
											</Card>
											))}
										</Accordion>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Status</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<p>Do you have completed this topic ?</p>
						</div>
					</Modal.Body>
					<Modal.Footer className="qFoot">
						<Button variant="primary" onClick={this.completed}>
							Yes
						</Button>
						<Button variant="primary" onClick={this.handleClose}>
							No
						</Button>
					</Modal.Footer>
				</Modal>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_course_by_id: state.state_course_by_id,
	}
}
export default connect(mapStateToProps, {gerCourseById}) (Curriculum);
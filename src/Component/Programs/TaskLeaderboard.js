import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Programside } from '../../Include';
import { connect } from 'react-redux';
import { getPurchasedProgramsByCourseId, getTaskByCourseId } from '../../store/action/action';

class TaskLeaderboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			batch_id: '',
			tast_length: 0
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}
	async componentDidMount(){
		await this.props.getPurchasedProgramsByCourseId(this.props.match.params.courseid)
		await this.props.getTaskByCourseId(this.props.match.params.courseid);
		this.increment();
	}
	timer(){
		if (this.props.state_get_purchased_programs_by_course_id === undefined || this.props.state_task_by_course_id === undefined) {
		} else {
			let purchas = this.props.state_get_purchased_programs_by_course_id
			let tast_length = this.props.state_task_by_course_id.length
			let batch_id;

			for(let i=0; purchas.length > i; i++){
				if (parseInt(localStorage.getItem('user_id')) === purchas[i].user_id) {
					batch_id = purchas[i].batche_id
				}
			}
			this.setState({
				batch_id: batch_id,
				tast_length: tast_length
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	render(){
		const program = this.props.state_get_purchased_programs_by_course_id
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 10, offset: 1 }}>
							<div className="courseProgram">
								<Programside courseid={this.props.match.params.courseid} />
								<div className="courseTabDetail">
									<div className="curii">
										<Table striped bordered hover size="sm">
											<thead>
												<tr>
													<th>Student Name</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{program === undefined || this.state.tast_length === 0 ? <tr><th colSpan={2}>Waiting...</th></tr> :
													program.map((progra, i) => (
														progra.batche_id === this.state.batch_id ? 
														<tr key={i}>
															<td>{progra.student_name}</td>
															<td><span className={this.state.tast_length === progra.assignment.length ? 'greenColor' : 'yellow'}>{this.state.tast_length === progra.assignment.length ? 'Completed' : 'Pending'}</span></td>
														</tr>: null
													))
												}
											</tbody>
										</Table>
									</div>
								</div>
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
		state_task_by_course_id: state.state_task_by_course_id,
		state_get_purchased_programs_by_course_id: state.state_get_purchased_programs_by_course_id
	}
}
export default connect(mapStateToProps, {getPurchasedProgramsByCourseId, getTaskByCourseId}) (TaskLeaderboard);
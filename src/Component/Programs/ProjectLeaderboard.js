import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Programside } from '../../Include';
import { connect } from 'react-redux';
import { getPurchasedProgramsByCourseId } from '../../store/action/action';

class ProjectLeaderboard extends Component {
	async componentDidMount(){
		await this.props.getPurchasedProgramsByCourseId(this.props.match.params.courseid)
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
													<th>Program Name</th>
													<th>Submitted Date</th>
													<th>Student Name</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{program === undefined ? null : 
													program.map((progarms, i) => (
													<tr key={i}>
														<td>{progarms.course_name}</td>
														<td>{progarms.submit_course[0] === 0 ? '--' : progarms.submit_course[0].current_date.slice(0, 10)}</td>
														<td>{progarms.student_name}</td>
														<td><span className={progarms.submit_course[0] === 0 ? 'yellow' : 'greenColor'}>{progarms.submit_course[0] === 0 ? 'Not Submit' : progarms.submit_course[0].grade}</span></td>
													</tr>
												))}
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
		state_get_purchased_programs_by_course_id: state.state_get_purchased_programs_by_course_id
	}
}
export default connect(mapStateToProps, {getPurchasedProgramsByCourseId}) (ProjectLeaderboard);
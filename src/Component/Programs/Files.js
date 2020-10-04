import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Programside } from '../../Include';
import {connect} from 'react-redux';
import { getFilesCourseId } from '../../store/action/action';
// Mentors Notes

class Files extends Component {
	async componentDidMount(){
		await this.props.getFilesCourseId(this.props.match.params.courseid)
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
										<h5>Notes</h5>
										<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Files</th>
														<th>Date</th>
														<th>Link</th>
													</tr>
												</thead>
												<tbody>
												{this.props.state_get_file_by_user_id_course_id === undefined || this.props.state_get_file_by_user_id_course_id.length === 0 ? 
													<tr>
														<td colSpan="3">There are no Notes</td>
													</tr>
													:
												this.props.state_get_file_by_user_id_course_id.map((files, i) => (
													<tr key={i}>
														<td>{files.file_name}</td>
														<td>{files.current_date.slice(0, 10)}</td>
														<td><a href={files.link} target="_blank" rel="noopener noreferrer" className="subBtn">Download</a></td>
													</tr>
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
		state_get_file_by_user_id_course_id: state.state_get_file_by_user_id_course_id
	}
}
export default connect(mapStateToProps, {getFilesCourseId}) (Files);
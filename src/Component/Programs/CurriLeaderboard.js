import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Programside } from '../../Include';
import { connect } from 'react-redux';
import { getPurchasedProgramsByCourseId, gerCourseById } from '../../store/action/action';

class CurriLeaderboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			batch_id: '',
			course_counter: ''
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}
	async componentDidMount(){
		await this.props.getPurchasedProgramsByCourseId(this.props.match.params.courseid)
		await this.props.gerCourseById(this.props.match.params.courseid);
		this.increment();
	}
	timer(){
		if (this.props.state_get_purchased_programs_by_course_id === undefined || this.props.state_course_by_id === undefined) {
		} else {
			let purchas = this.props.state_get_purchased_programs_by_course_id
			let batch_id;
			for(let i=0; purchas.length > i; i++){
				if (parseInt(localStorage.getItem('user_id')) === purchas[i].user_id) {
					batch_id = purchas[i].batche_id
				}
			}

			let curOut = this.props.state_course_by_id[0].curriculum.length
			var count = 0;
			for(let i=0; curOut > i; i++){
				count = this.props.state_course_by_id[0].curriculum[i].length + count
			}

			this.setState({
				batch_id: batch_id,
				course_counter: count
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
												{program === undefined || this.state.batch_id === "" ? <tr><th colSpan={2}>Waiting...</th></tr> :
													program.map((progra, i) => (
														progra.batche_id === this.state.batch_id ? 
														<tr key={i}>
															<td>{progra.student_name}</td>
															<td><span className={this.state.course_counter === progra.curriculum_index.length ? 'greenColor' : 'yellow'}>{this.state.course_counter === progra.curriculum_index.length ? 'Completed' : 'Pending'}</span></td>
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
		state_course_by_id: state.state_course_by_id,
		state_get_purchased_programs_by_course_id: state.state_get_purchased_programs_by_course_id
	}
}
export default connect(mapStateToProps, {getPurchasedProgramsByCourseId, gerCourseById}) (CurriLeaderboard);
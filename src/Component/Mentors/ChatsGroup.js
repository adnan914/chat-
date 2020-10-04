import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MentorSide from '../../MentorSide';
import { connect } from 'react-redux';
import { gerCourseById } from '../../store/action/action';

class ChatsGroup extends Component {
	constructor(props){
		super(props);

		this.state = {
			course: []
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}

	async componentDidMount(){
		await this.props.gerCourseById(this.props.match.params.courseid)
		this.increment()
	}
	timer(){
		if (this.props.state_course_by_id === undefined) {
		} else {
			this.setState({
				course: this.props.state_course_by_id[0]
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
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
										<div className="chatGroup">
											{this.state.course.length === 0 ? 'No Batches Group' : 
											this.state.course.batche_time.map((batch, i) => (
											<Link to={`/mentorchats/${this.props.match.params.courseid}/${batch.id}`} key={i}>
												<img src="https://196034-584727-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2018/10/Front-End-developer-profile-picture.jpg" alt="Img" />
												<div className="chatCont">
													<h3>Batch {i+1}</h3>
													<p>{batch.ocumulate} Students</p>
												</div>
											</Link>
											))
											}
										</div>
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
		state_course_by_id: state.state_course_by_id
	}
}
export default connect(mapStateToProps, {gerCourseById}) (ChatsGroup);
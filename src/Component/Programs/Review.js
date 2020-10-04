import React, { Component } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Programside } from '../../Include';
import { connect } from 'react-redux';
import { getPurchasedProgramsByCourseId } from '../../store/action/action';
import config from '../../Config/Config';

class Review extends Component {
	constructor(props){
		super(props);
		this.state = {
			feedback: '',
			rating: '',
			totalrating: '',
			totaluser: '',
			textdanger: ''
		}
		this.submit = this.submit.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.courseRating = this.courseRating.bind(this);
	}
	handler = (e) => this.setState({[e.target.name]: e.target.value, textdanger: ''});
	async componentDidMount(){
		await this.props.getPurchasedProgramsByCourseId(this.props.match.params.courseid)
		this.increment()
	}
	timer(){
		if (this.props.state_get_purchased_programs_by_course_id === undefined ) {	
		} else {
			let proLength = this.props.state_get_purchased_programs_by_course_id
			let program = 0;
			for (let i=0; proLength.length > i; i++) {
				if (proLength[i].rating === null) {

				} else {
					program += proLength[i].rating
				}
			}
			this.setState({
				totalrating: program,
				totaluser: proLength.length
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submit(e){
		e.preventDefault();
		if (this.state.rating <= 5) {
			fetch(`${config.base_url}/purchased_programs_update_review`,{
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					'user_id': localStorage.getItem('user_id'),
					'course_id': this.props.match.params.courseid,
					'rating': this.state.rating,
					'feedback': this.state.feedback
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
				let obj=JSON.parse(responseText);
				if (obj.status === 'Success!!!') {
					this.courseRating()
				} else {

				}
			})
			.catch((error) => {
				console.log(error);
			});
		} else {
			this.setState({
				textdanger: 'text-danger'
			})
			this.nameInput.focus();
		}
	}
	courseRating(){
		let couse_rating = (this.state.totalrating + parseInt(this.state.rating))/this.state.totaluser
		fetch(`${config.base_url}/course_rating_feedback_update/`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': this.props.match.params.courseid,
				'rating': couse_rating,
				'feedback': [{
					comment: this.state.feedback,
					name: localStorage.getItem('name')
				}],
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				alert('Request Sent!!!');
				this.props.history.push(`/certificatesub/${this.props.match.params.courseid}`)
			} else {

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
										<h3>Review</h3>
										<Form onSubmit={this.submit}>
											<Form.Group>
												<Form.Label>Course Review <span>Min. 300 characters</span></Form.Label>
												<InputGroup>
													<InputGroup.Prepend>
													  <InputGroup.Text id="inputGroupPrepend"><i className="fa fa-commenting-o"></i></InputGroup.Text>
													</InputGroup.Prepend>
													<Form.Control as="textarea" rows="3" maxLength= "300" onChange={this.handler} value={this.state.feedback} name="feedback" required />
												</InputGroup>
											</Form.Group>
											<Form.Group>
												<Form.Label className={this.state.textdanger}>Rating (Out of 5)</Form.Label>
												<InputGroup>
													<InputGroup.Prepend>
													  <InputGroup.Text id="inputGroupPrepend"><i className="fa fa-smile-o"></i></InputGroup.Text>
													</InputGroup.Prepend>
													<Form.Control type="number" name="rating" value={this.state.rating} onChange={this.handler} required ref={(input) => { this.nameInput = input; }} />
												</InputGroup>
											</Form.Group>
											<button className="mainBtn" type="submit">Submit</button>
										</Form>
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
		state_get_purchased_programs_by_course_id: state.state_get_purchased_programs_by_course_id,
	}
}
export default connect(mapStateToProps, {getPurchasedProgramsByCourseId}) (Review);
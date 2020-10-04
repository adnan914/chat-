import React, { Component } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { gerCourseById, getPercent } from '../../store/action/action';
import config from '../../Config/Config';


class CoursePayment extends Component {
	constructor(props){
		super(props);
		this.state = {
			cur: [],
			batche_id: '',
			ocumulate: '',
			start_date: '',
			end_date: ''
		}
		this.submit = this.submit.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.updateOcumulate = this.updateOcumulate.bind(this);
	}
	async componentDidMount(){
		await this.props.gerCourseById(this.props.match.params.courseid)
		await this.props.getPercent()
		this.increment();
	}
	timer(){
		if (this.props.state_course_by_id === undefined) {	
		} else {
			let batche_time = this.props.state_course_by_id[0].batche_time
			let id;
			let ocumulate;
			for(let i=0; batche_time.length > i; i++){
				id = batche_time[i].id
				ocumulate = batche_time[i].ocumulate + 1
				if(batche_time[i].seate_limit !== batche_time[i].ocumulate) {
					break;
				}
			}
			this.setState({
				batche_id: id,
				ocumulate: ocumulate,
				start_date: batche_time[0].start_date,
				end_date: batche_time[0].end_date
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submit(){
		let menter_part = (this.props.state_course_by_id[0].fee/100)*this.props.state_get_percent[0].direct_pay
		let admin_part = this.props.state_course_by_id[0].fee - menter_part
		fetch(`${config.base_url}/purchased_programs`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: this.props.match.params.courseid,
				user_id: localStorage.getItem('user_id'),
				mentor_id: this.props.state_course_by_id[0].user_id,
				transection_id: Date.now(),
				course_amount: this.props.state_course_by_id[0].fee,
				mentor_part: {ammount:menter_part,status: 0},
				admin_part: admin_part,
				affiliate_part: {ammount:0,status: 0},
				affiliate_id: 0,
				curriculum_index: this.state.cur,
				course_name: this.props.state_course_by_id[0].course_name,
				student_name: localStorage.getItem('name'),
				batche_id: this.state.batche_id,
				start_date: this.state.start_date,
				end_date: this.state.end_date
			})
		})
		.then((res) => res.text())
		.then((responseText) => {
			console.log('responseText', responseText)
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				this.updateOcumulate()
			} else {
				alert('Failed to purchase Program')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	updateOcumulate(){
		fetch(`${config.base_url}/courses_update_ocumulate`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: this.props.match.params.courseid,
				batche_id: this.state.batche_id,
				ocumulate: this.state.ocumulate
			})
		})
		.then((res) => res.text())
		.then((responseText) => {
			console.log('responseText', responseText)
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				alert('Purchased Program Successfully!!!')
				this.props.history.push('/programs')

			} else {
				alert('Failed to purchase Program')
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
						<Col md={{ span: 6, offset: 3 }}>
							<div className="curii">
								<h3>Enroll Course</h3>
								<Form>
									<Form.Group>
										<Form.Label>asd</Form.Label>
										<InputGroup>
											<InputGroup.Prepend>
											  <InputGroup.Text id="inputGroupPrepend"><i className="fa fa-user-o"></i></InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control type="text" name='asa' defaultValue="" required />
										</InputGroup>
									</Form.Group>
									<button className="mainBtn" type='button' onClick={this.submit}>Proceed to payment</button>
								</Form>
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
		state_get_percent: state.state_get_percent
	}
}
export default connect(mapStateToProps, {gerCourseById, getPercent}) (CoursePayment);
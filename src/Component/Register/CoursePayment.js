import React, { Component } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { gerCourseById, getUserByUserId, getPercent } from '../../store/action/action';
import config from '../../Config/Config';

class CoursePaymentMentee extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			cur: [],
			batche_id: '',
			ocumulate: ''
		}
		this.submit = this.submit.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.updateOcumulate = this.updateOcumulate.bind(this);
		//this.references = this.references.bind(this);
	}
	changeHandler = (e) => this.setState({[e.target.name]: e.target.value})

	async componentDidMount(){
		await this.props.gerCourseById(this.props.match.params.courseid)
		await this.props.getUserByUserId(this.props.match.params.affiliat_id)
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
				ocumulate: ocumulate
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submit(e){
		let pay_affiliat;
		let pay_admin;
		let pay_mentor;
		let affiliate_id;
		if (this.props.state_get_user_user_id[0].user_roll === "Affiliate") {
			pay_affiliat = (this.props.state_course_by_id[0].fee/100)*this.props.state_get_percent[0].by_affiliate_pay
			pay_mentor = (this.props.state_course_by_id[0].fee/100)*this.props.state_get_percent[0].mentor_pay
			pay_admin = this.props.state_course_by_id[0].fee - (pay_affiliat + pay_mentor)
			affiliate_id = parseInt(this.props.match.params.affiliat_id)
		}

		if (this.props.state_get_user_user_id[0].user_roll === "Mentor") {
			pay_affiliat = 0
			pay_mentor = (this.props.state_course_by_id[0].fee/100)*this.props.state_get_percent[0].by_mentor_pay
			pay_admin = this.props.state_course_by_id[0].fee - pay_mentor
			affiliate_id = 0
		}

		e.preventDefault()
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
				mentor_part: {ammount : pay_mentor,status : 0},
				admin_part: pay_admin,
				affiliate_part: {ammount : pay_affiliat,status : 0},
				affiliate_id: affiliate_id,
				curriculum_index: this.state.cur,
				course_name: this.props.state_course_by_id[0].course_name,
				student_name: localStorage.getItem('name'),
				batche_id: this.state.batche_id
			})
		})
		.then((res) => res.text())
		.then((responseText) => {
			console.log('responseText', responseText)
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				// alert(obj.status)
				// this.props.history.push('/programs')
				//this.references()
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
// references
	// references() {
	// 	fetch(`${config.base_url}/references`,{
	// 		method: 'POST',
	// 		headers: new Headers({
	// 			'Content-Type': 'application/json'
	// 		}),
	// 		body: JSON.stringify({
	// 			affiliate_id: this.props.match.params.affiliat_id,
	// 			user_id: localStorage.getItem('user_id'),
	// 			payment_status: 0,
	// 			course_id: this.props.match.params.courseid,
	// 			payment_amount: this.props.state_course_by_id[0].fee
	// 		})
	// 	})
	// 	.then((res) => res.text())
	// 	.then((responseText) => {
	// 		console.log('responseText', responseText)
	// 		let obj=JSON.parse(responseText);
	// 		if (obj.status === "Success!!!") {
	// 			alert('Purchased Program Successfully!!!')
	// 			this.props.history.push('/programs')
	// 		} else {
	// 			alert('Failed to purchase Program')
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 	});
	// }

	render(){
		console.log(this.props.state_get_percent)
		return(
			<section className="course">
			{this.props.state_course_by_id === undefined || this.props.state_course_by_id.length === 0 ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			: null }
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<div className="curii">
								<h5>Course Payment</h5>
								<Form onSubmit={this.submit}>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Name</Form.Label>
										<Col sm={9}>
											<Form.Control type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group>
										<button type="submit" className="mainBtn">Submit</button>
									</Form.Group>
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
		state_get_user_user_id: state.state_get_user_user_id,
		state_get_percent: state.state_get_percent
	}
}
export default connect(mapStateToProps, {gerCourseById, getUserByUserId, getPercent}) (CoursePaymentMentee);
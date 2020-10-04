import React, { Component } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import {connect} from 'react-redux';
import { gerCourseById, regFees } from '../../store/action/action';
import config from '../../Config/Config';

class CreateCurriculumEdit extends Component {
	constructor(props){
		super(props);
		this.state = {
			curriculum: [[{"topik" : "","link" : ""}]],
			coursename: '',
			coursedesription: '',
			briefdescription: '',
			tag: ['','','','',''],
			duration: '',
			fee: '',
			requisites:'',
			show: false,
			display: 'none',
			textdanger: ''
		}
		this.removeField = this.removeField.bind(this);
		this.removeWeek = this.removeWeek.bind(this);
		this.topc = this.topc.bind(this);
		this.addWeek = this.addWeek.bind(this);
		this.addField = this.addField.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
		this.domainTag = this.domainTag.bind(this);
		this.submit = this.submit.bind(this);
		this.setShow = this.setShow.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}
	setShow(){
		this.setState({
			show: false
		})
	}
	async componentDidMount(){
		await this.props.regFees()
		await this.props.gerCourseById(this.props.match.params.id)
		this.increment();
	}
	timer(){
		if (this.props.state_course_by_id === undefined || this.props.state_course_by_id.length === 0) {	
		} else {
			this.setState({
				curriculum: this.props.state_course_by_id[0].curriculum,
				coursename: this.props.state_course_by_id[0].course_name,
				coursedesription: this.props.state_course_by_id[0].course_description,
				briefdescription: this.props.state_course_by_id[0].brief_description,
				tag: this.props.state_course_by_id[0].domain_tag,
				duration: this.props.state_course_by_id[0].duration,
				fee: this.props.state_course_by_id[0].fee,
				requisites: this.props.state_course_by_id[0].pre_requisites,
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submit(e){
		e.preventDefault();
		if (this.props.state_get_reg_fees[0].course_ammount_limit >= this.state.fee) {
			this.setState({
				display: 'flex'
			})
			fetch(`${config.base_url}/update_course_by_id`,{
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					'mentor_name': localStorage.getItem('name'),
					'user_id': localStorage.getItem('user_id'),
					'id': this.props.match.params.id,
					'course_name': this.state.coursename,
					'course_description': this.state.coursedesription,
					'brief_description': this.state.briefdescription,
					'domain_tag': this.state.tag,
					'duration': this.state.duration,
					'fee': this.state.fee,
					'pre_requisites': this.state.requisites,
					'seat_limit': this.state.seatlimit,
					'status': 0,
					'shift_status': 0,
					'curriculum': this.state.curriculum
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
				let obj=JSON.parse(responseText);
				if (obj.status === 'Success!!!') {
					this.props.history.push('/mentorprofile')
				} else {
					this.setState({
						show: true
					})
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
	domainTag(e){
		let currentTag = this.state.tag
		currentTag[e.target.name] = e.target.value
		this.setState({
			tag: currentTag
		})
	}
	changeHandler(e){
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	addField(e){
		let currentState = this.state.curriculum
		currentState[e].push({"topik" : "","link" : ""})
		this.setState({
			curriculum: currentState
		})
	}
	topc(e){
		console.log(e.target.name)
		console.log(e.currentTarget.classList[0])
		
		let currentState = this.state.curriculum
        currentState[e.currentTarget.classList[0]][e.target.name][e.currentTarget.classList[1]] = e.target.value;
        this.setState({
            curriculum: currentState
        })
	}
	addWeek() {
		let currentState = this.state.curriculum
		currentState.push([{"topik" : "","link" : ""}])
		this.setState({
			curriculum: currentState
		})
	}
	removeField(i, ky) {
		let currentState = this.state.curriculum
		currentState[i].splice(ky, 1)
		this.setState({
			curriculum: currentState
		})
	}
	removeWeek(i) {
		let currentState = this.state.curriculum
		currentState.splice(i, 1)
		this.setState({
			curriculum: currentState
		})
	}

	render(){
		return(
			<section className="course">
				<div className="loader" style={{'display':this.state.display}}>
					<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
				</div>
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<div className="curii createCurriculum">
								{ this.state.show ?
									<Alert variant="danger" onClose={this.setShow} dismissible>
										<Alert.Heading>Oh snap! You got an error!</Alert.Heading>
										<p>Your course are not uploaded try again</p>
									</Alert>
								: null }
								<h3 className="text-center mb30">Create Curriculum</h3>
								<Form onSubmit={this.submit}>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Course Name</Form.Label>
										<Col sm={9}>
											<Form.Control type="text" placeholder="Course Name" name="coursename" value={this.state.coursename} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Course Description</Form.Label>
										<Col sm={9}>
											<Form.Control as="textarea" rows="3" placeholder="Course Description" name="coursedesription" value={this.state.coursedesription} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Brief Description</Form.Label>
										<Col sm={9}>
											<Form.Control as="textarea" rows="3" placeholder="Brief Description" name="briefdescription" value={this.state.briefdescription} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Domain</Form.Label>
										<Col sm={9}>
											<Row className="rowChange">
												<Col sm={2}>
													<Form.Control type="text" placeholder="Tag" name="0" onChange={this.domainTag} value={this.state.tag[0]} />
												</Col>
												<Col sm={2}>
													<Form.Control type="text" placeholder="Tag" name="1" onChange={this.domainTag} value={this.state.tag[1]} />
												</Col>
												<Col sm={2}>
													<Form.Control type="text" placeholder="Tag" name="2" onChange={this.domainTag} value={this.state.tag[2]} />
												</Col>
												<Col sm={2}>
													<Form.Control type="text" placeholder="Tag" name="3" onChange={this.domainTag} value={this.state.tag[3]} />
												</Col>
												<Col sm={2}>
													<Form.Control type="text" placeholder="Tag" name="4" onChange={this.domainTag} value={this.state.tag[4]} />
												</Col>
											</Row>
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Duration</Form.Label>
										<Col sm={9}>
											<Form.Control type="text" placeholder="Duration" name="duration" value={this.state.duration} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Fee</Form.Label>
										<Col sm={9}>
											<Form.Control type="number" placeholder="Fee" name='fee' value={this.state.fee} onChange={this.changeHandler} required ref={(input) => { this.nameInput = input; }} />
											<p className={this.state.textdanger}>Fee Limit of Course Rs.{this.props.state_get_reg_fees === undefined ? null : this.props.state_get_reg_fees[0].course_ammount_limit }</p>
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Pre-requisites</Form.Label>
										<Col sm={9}>
											<Form.Control type="text" placeholder="Pre-requisites" name="requisites" value={this.state.requisites} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Curriculum</Form.Label>
										<Col sm={9}>
											<div className="curriii">
												{ this.state.curriculum.map((curriculums, i) => (
												<div className="weekWise" key={i}>
													<h4>Week {i+1} <span className="removeWeek" onClick={() => this.removeWeek(i)}><i className="fa fa-minus"></i></span></h4>
													<div className="addRefer">
													{curriculums.map((dat, ky) => (
														<div key={ky}>
															<Row>
																<Col ms={6}>
																	<label>Topic</label>
																	<input type="text" placeholder="Topic" name={ky} className={`${i} topik form-control`} value={dat.topik} onChange={this.topc} required />
																</Col>
																<Col ms={6}>
																	<label>Link</label>
																	<input type="text" placeholder="Link" name={ky} className={`${i} link form-control`} value={dat.link} onChange={this.topc} required />
																</Col>
																<div className="addField pos minus" onClick={() => this.removeField(i, ky)}>
																	<i className="fa fa-minus"></i>
																</div>
															</Row>
														</div>
														))}
														<div className="addField pos addd" onClick={() => this.addField(i)}>
															<i className="fa fa-plus"></i>
														</div>
													</div>
												</div>
												))}
												<div className="addWeek">
													<span className="addField" onClick={this.addWeek}>Add Week</span>
												</div>
											</div>
										</Col>
									</Form.Group>
									<button className="mainBtn" type='submit'>Submit</button>
								</Form>
								{/* this.state.fieldData.map((fieldDatas, i) => (
									<ul key={i}>
										{fieldDatas.map((dat, ky) => (
										<li key={ky}>{dat}</li>
										))}
									</ul>
								))*/}
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
		state_get_reg_fees: state.state_get_reg_fees
	}
}
export default connect(mapStateToProps, {gerCourseById, regFees}) (CreateCurriculumEdit);

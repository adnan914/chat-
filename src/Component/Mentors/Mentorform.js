import React, { Component } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import config from '../../Config/Config';

class Mentorprofile extends Component {
	constructor(props){
		super(props);
		this.state = {
			question: [],
			anser: []
		}
		this.submit = this.submit.bind(this);
		this.anserhandler = this.anserhandler.bind(this);
		this.deleteAffiliat = this.deleteAffiliat.bind(this);
	}
	anserhandler(e){
		let ques = this.state.question[e.target.name].topic
		let currentState = this.state.anser
        currentState[e.target.name]['q'] = ques;
        currentState[e.target.name]['a'] = e.target.value;
        this.setState({
            anser: currentState
        })
	}
	async componentDidMount(){
		try{
			fetch(`${config.base_url}/get_admin_questions`)
			.then((res) => res.text())
			.then((res) => {
				let obj = JSON.parse(res)
				let qa = []
				for (let i=0; obj[0].question.length > i; i++) {
					qa.push({q:obj[0].question[i].topic, a: ''})
				}
				this.setState({
					question: obj[0].question,
					anser: qa
				})
			})
			.catch((err) => {
				console.log(err)
			})
		}catch(err){
			console.log(err)
		}
	}
	submit(e){
		e.preventDefault();
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		let yyyy = today.getFullYear();
		today = dd + '/' + mm + '/' + yyyy;
		fetch(`${config.base_url}/user_approved`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'name': localStorage.getItem('name'),
				'question_anser': this.state.anser,
				'status': 0,
				'user_id': localStorage.getItem('user_id'),
				'message': `${localStorage.getItem('name')} Sent you Mentor Request`,
				'date': today
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				this.deleteAffiliat()
			}else {
				alert('Failed to submit!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	deleteAffiliat() {
		fetch(`${config.base_url}/delete_affiliat`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': localStorage.getItem('user_id'),
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				this.props.history.push("/approved");
			}else {
				alert('Failed to submit!!!')
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
								<h3>Form</h3>
								<Form onSubmit={this.submit}>
									{ this.state.question.map((questions, i) => (
									<Form.Group key={i}>
										<Form.Label>{questions.topic}</Form.Label>
										<InputGroup>
											<InputGroup.Prepend>
											  <InputGroup.Text id="inputGroupPrepend"><i className="fa fa-user-o"></i></InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control type="text" name={i} defaultValue="" onChange={this.anserhandler} required />
											<Form.Control.Feedback type="invalid" tooltip>
											  asdasd
											</Form.Control.Feedback>
										</InputGroup>
									</Form.Group>
									))}
									<button className="mainBtn" type='submit'>Proceed to payment</button>
								</Form>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
export default Mentorprofile;
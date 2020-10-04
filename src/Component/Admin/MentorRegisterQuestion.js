import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import config from '../../Config/Config';

class MentorRegisterQuestion extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			question: [{"topic" : ""}],
			questionID: [],
			loader: false,
			alert: false,
			loggedIn
		}
		this.topc = this.topc.bind(this);
		this.addField = this.addField.bind(this);
		this.removeWeek = this.removeWeek.bind(this);
		this.submit = this.submit.bind(this);
	}
	componentDidMount(){
		fetch(`${config.base_url}/get_admin_questions`)
		.then((res) => res.text())
		.then((res) => {
			let obj = JSON.parse(res)
			this.setState({
				question: obj[0].question,
				questionID: obj[0]._id
			})
		})
		.catch((err) => {
			console.log(err)
		})
	}
	topc(e){
		let currentState = this.state.question
        currentState[e.target.name]['topic'] = e.target.value;
        this.setState({
            question: currentState
        })
	}
	addField(){
		let currentState = this.state.question
		currentState.push({"topic" : ""})
		this.setState({
			question: currentState
		})
	}
	removeWeek(i) {
		let currentState = this.state.question
		currentState.splice(i, 1)
		this.setState({
			question: currentState
		})
	}
	submit(e){
		e.preventDefault();
		this.setState({
			loader: true
		})
		fetch(`${config.base_url}/admin_questions`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': this.state.questionID,
				'question': this.state.question
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			this.setState({
				loader: false,
				alert: true
			})
		})
		.catch((error) => {
			console.log(error);
			this.setState({
				loader: false
			})
		});
	}
	render(){
		if(!this.state.loggedIn){
			return <Redirect to="/admin" />
		}
		return(
			<section className="admin">
			{this.state.loader ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			 : null }

				<AdminSideBar />
				<div className="adminArticle">
					<AdminHeader />
					<div className="adminHead">
						<h3>Mentor Register Question</h3>
						<Row>
							<Col md={8}>
							{this.state.alert ?  
								<div>
									<br/>
									<Alert variant={'success'}>
										Form Submited Successfully!!!
									</Alert>
								</div>
							 : null}
							<Form onSubmit={this.submit}>
								<div className="weekWise">
									<div className="addRefer questionForm">
										{this.state.question.map((questions, i) => (
										<Row key={i}>
											<Col sm={12}>
												<label>Topic {i+1}</label>
												<input type="text" placeholder="Topic" name={i} className="form-control" value={questions.topic} onChange={this.topc} required />
											</Col>
											<div className="addField pos minus" onClick={() => this.removeWeek(i)}>
												<i className="fa fa-minus"></i>
											</div>
										</Row>
										))}
										<div className="addField pos addd" onClick={this.addField}>
											<i className="fa fa-plus"></i>
										</div>
									</div>
									<button className="mainBtn" type="submit">Submit</button>
								</div>
							</Form>
							</Col>
						</Row>
					</div>
				</div>
			</section>
		);
	}
}
export default MentorRegisterQuestion;
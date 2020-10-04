import React, { Component } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import config from '../../Config/Config';

class Register extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			email: '',
			username: '',
			password: '',
			userData: []
		}
		this.submit = this.submit.bind(this);
		this.getUserc4projects = this.getUserc4projects.bind(this);
		this.addUserOnMongo = this.addUserOnMongo.bind(this);
	}
	changeHandler = (e) => this.setState({[e.target.name]: e.target.value})

	submit(e){
		e.preventDefault();
		// const auth = {
		//     Username: 'c4projects',
		//     Password: '~FR9hwnO,',
		//   };
		// fetch(`http://e-shopping.ga/c4projects/wp-json/wp/v2/users`,{
		// 	method: 'POST',
		// 	headers: new Headers({
		// 		'Content-Type': 'application/json',
		// 		'auth': { username: 'c4projects', password: '~FR9hwnO,' }
		// 	}),
		// 	body: JSON.stringify({
		// 		name: this.state.name,
		// 		email: this.state.email,
		// 		username: this.state.username,
		// 		password: this.state.password
		// 	})
		// })
		// .then((response) => response.text())
		// .then((responseText) => {
		// 	let obj=JSON.parse(responseText);
		// 	console.log(responseText)
			
		// })
		// .catch((error) => {
		// 	console.log(error);
		// });
		this.getUserc4projects()
		// http://e-shopping.ga/c4projects/wp-json/app/login/
	}
	getUserc4projects() {
		fetch(`http://e-shopping.ga/c4projects/wp-json/app/login/11`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj = JSON.parse(responseText)
			//console.log(obj.data.data)
			// this.setState({
			// 	userData: obj.data.data
			// })
			this.addUserOnMongo(obj.data.data)
		})
		.catch((error) => {
			console.log(error);
		});
	}
	addUserOnMongo(e){
		console.log(e)
		fetch(`${config.base_url}/users`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': e.ID,
				'name': e.display_name,
				'email': e.user_email,
				'username': e.user_nicename,
				'user_roll': 'Mentee'
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj = JSON.parse(responseText)
			if (obj.status === 'Success!!!') {
				this.getUsers(e.user_email)
			} else {
				//window.location.assign("https://www.w3schools.com")
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	getUsers(e){
		fetch(`${config.base_url}/getusers`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'email': e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj = JSON.parse(responseText)
			if (obj.length === 0) {
				// if user not found in mongoDB
				alert('Failed')
			} else {
				// if user found in mongoDB
				localStorage.setItem('name', obj[0].name);
				localStorage.setItem('email', obj[0].email);
				localStorage.setItem('user_id', obj[0].user_id);
				localStorage.setItem('username', obj[0].username);
				localStorage.setItem('user_roll', obj[0].user_roll);
				this.props.history.push(`/coursepaymentmentee/${this.props.match.params.courseid}/${this.props.match.params.affiliat_id}`)
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		// console.log(this.props.match.params.courseid, this.props.match.params.affiliat_id)
		console.log()
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<div className="curii">
								<Form onSubmit={this.submit}>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Name</Form.Label>
										<Col sm={9}>
											<Form.Control type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Email</Form.Label>
										<Col sm={9}>
											<Form.Control type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Username</Form.Label>
										<Col sm={9}>
											<Form.Control type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.changeHandler} required />
										</Col>
									</Form.Group>
									<Form.Group as={Row}>
										<Form.Label column sm={3}>Password</Form.Label>
										<Col sm={9}>
											<Form.Control type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.changeHandler} required autoComplete="off" />
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

export default Register;
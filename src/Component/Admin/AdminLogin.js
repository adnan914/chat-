import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import config from '../../Config/Config';

class AdminLogin extends Component {
	constructor(props){
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		super(props);
		this.state = {
			email: '',
			password: '',
			loggedIn
		}
		this.submit = this.submit.bind(this);
	}

	handleChange = (e) => this.setState({[e.target.name]: e.target.value})
	submit(e){
		e.preventDefault()
		fetch(`${config.base_url}/admin_login`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			if (obj.length === 0) {
				alert('Please fill correct email or password')
			} else {
				localStorage.setItem('admin_name', obj[0].name);
				localStorage.setItem('admin_email', obj[0].email);
				this.setState({
					loggedIn: true
				})
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		if(this.state.loggedIn){
			return <Redirect to="/admin/dashboard" />
		}
		return(
			<section className="adminLoginSec">
				<div className="adminLogin">
					<p><img src="http://e-shopping.ga/c4projects/wp-content/uploads/2020/07/cropped-new-c4project-logo-1.png" alt="Logo" /></p>
					<Form onSubmit={this.submit}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" name="email" placeholder="Enter email" required onChange={this.handleChange} />
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" name="password" placeholder="Password" required onChange={this.handleChange} autoComplete="off"/>
						</Form.Group>
						<Button variant="primary" type="submit">
							Submit
						</Button>
					</Form>
				</div>
			</section>
		);
	}
}
export default AdminLogin;

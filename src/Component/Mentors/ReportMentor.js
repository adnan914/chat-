import React, { Component } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import MentorSide from '../../MentorSide';
import config from '../../Config/Config';

class ReportMentor extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			subject: '',
			description: '',
			base64: '',
			imag_name: 'Attachment'
		}
		this.submit = this.submit.bind(this);
	}
	changeHandler = (e) => this.setState({[e.target.name]: e.target.value})
	handleImageChange = (e) => {
		let files = e.target.files;
		this.setState({
			imag_name: files[0].name
		})
		console.log(files[0].name)
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload=(e)=>{
			this.setState({
				base64: e.target.result
			})
		}	
	}

	submit(e){
		e.preventDefault();
		fetch(`${config.base_url}/reports`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: this.props.match.params.courseid,
				user_id: localStorage.getItem('user_id'),
				user_role: localStorage.getItem('user_roll'),
				name: this.state.name,
				subject: this.state.subject,
				base64: this.state.base64,
				description:this.state.description
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			if (obj.status === 'Success!!!') {
				window.location.reload()
				alert('Report sent Successfully!!!')
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
								<MentorSide link={this.props.match.params.courseid} />
								<div className="courseTabDetail">
									<div className="curii">
										<h3>Report</h3>
										<Form onSubmit={this.submit}>
											<Form.Group>
												<Form.Label>Name</Form.Label>
												<InputGroup>
													<InputGroup.Prepend>
													  <InputGroup.Text><i className="fa fa-user"></i></InputGroup.Text>
													</InputGroup.Prepend>
													<Form.Control type="text" name="name" value={this.state.name} required onChange={this.changeHandler} />
												</InputGroup>
											</Form.Group>
											<Form.Group>
												<Form.Label>Subject</Form.Label>
												<InputGroup>
													<InputGroup.Prepend>
													  <InputGroup.Text><i className="fa fa-ship"></i></InputGroup.Text>
													</InputGroup.Prepend>
													<Form.Control type="text" name="subject" value={this.state.subject} required onChange={this.changeHandler} />
												</InputGroup>
											</Form.Group>
											<Form.Group>
												<Form.Label>Proof</Form.Label>
												<InputGroup>
													<InputGroup.Prepend>
													  <InputGroup.Text><i className="fa fa-picture-o"></i></InputGroup.Text>
													</InputGroup.Prepend>
													 <Form.File id="custom-file-translate-scss" label={this.state.imag_name} custom name="proof" onChange={this.handleImageChange} accept="image/*"/>
												</InputGroup>
											</Form.Group>
											<Form.Group>
												<Form.Label>Description</Form.Label>
												<InputGroup>
													<InputGroup.Prepend>
													  <InputGroup.Text id="inputGroupPrepend"><i className="fa fa-commenting-o"></i></InputGroup.Text>
													</InputGroup.Prepend>
													<Form.Control as="textarea" rows="3" value={this.state.description} name="description" onChange={this.changeHandler} />
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
export default ReportMentor;
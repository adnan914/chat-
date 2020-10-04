import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import config from '../../Config/Config';

class EditTask extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			date: '',
			link: ''
		}
		this.task = this.task.bind(this);
	}
	changeHandler = (e) => this.setState({[e.target.name]: e.target.value})
	componentDidMount(){
		fetch(`${config.base_url}/get_tasks_by_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: this.props.match.params.id 
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			this.setState({
				name: obj[0].assignment,
				date: obj[0].date,
				link: obj[0].question
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	task(e){
		e.preventDefault();
		fetch(`${config.base_url}/tasks_update_by_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: this.props.match.params.id,
				assignment: this.state.name,
				date: this.state.date,
				question: this.state.link
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			if (obj.status === 'Success!!!') {
				alert('Updated Successfully!!!')
				this.props.history.push(`/mentortask/${this.props.match.params.courseid}`)
			}else {
				alert('Failed!!!')
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
							<h3 className="mainHead mb30">Edit Task</h3>
							<div className="nocord">
								<form onSubmit={this.task}>
									<div className="form-group">
										<label>Assignment Name</label>
										<input type="text" name="name" value={this.state.name} onChange={this.changeHandler} className="form-control" required />
									</div>
									<div className="form-group">
										<label>Date</label>
										<input type="date" name="date" value={this.state.date} onChange={this.changeHandler} className="form-control" required />
									</div>
									<div className="form-group">
										<label>Assignment Link</label>
										<input type="text" name="link" value={this.state.link} onChange={this.changeHandler} className="form-control" required />
									</div>
									<div>
										<button className="mainBtn" type="submit">Submit</button>
									</div>
								</form>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
export default EditTask;
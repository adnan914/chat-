import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getAllPurchasedPrograms } from '../../store/action/action';
import config from '../../Config/Config';

class GenrateCertificate extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			mentee_name: '',
			course_name: '',
			date: '',
			purchas_id: '',
			show: false,
			loggedIn
		}
		this.genrateCertificate = this.genrateCertificate.bind(this);
	}
	async componentDidMount(){
		await this.props.getAllPurchasedPrograms()
	}
	showModel = (mentee_name, course_name, date, id) => this.setState({show: true,mentee_name: mentee_name, course_name: course_name, date: date, purchas_id: id});
	hideHandler = () => this.setState({show: false});
	genrateCertificate(e) {
		fetch(`${config.base_url}/genrate_pdf`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'mentee_name': this.state.mentee_name,
				'course_name': this.state.course_name,
				'date': this.state.date,
				'purchas_id': this.state.purchas_id
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
					alert('Uploaded Successfully!!!')
					window.location.reload();
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		console.log(this.props.state_get_all_purchased_programs)
		if(!this.state.loggedIn){
			return <Redirect to="/admin" />
		}
		return(
			<section className="admin">
				<AdminSideBar />
				<div className="adminArticle">
					<AdminHeader />
					<div className="adminHead">
						<h3>Genrate Certificate</h3>
						<div className="userList">
							<Row>
								<Col md={8}>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Student Name</th>
												<th>Course Name</th>
												<th>Date</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{this.props.state_get_all_purchased_programs === undefined ? null : 
												this.props.state_get_all_purchased_programs.length === 0 ? <tr><td colsPan="4">No Request</td></tr> : 
													this.props.state_get_all_purchased_programs.map((program, i) => (
														program.submit_course[0] === 0 ? null :
														<tr key={i}>
															<td>{program.student_name}</td>
															<td>{program.course_name}</td>
															<td>{program.submit_course[0].current_date.slice(0,10)}</td>
															<td>{program.certificate_url === undefined ? <button className="mainBtn" onClick={() => this.showModel(program.student_name, program.course_name, program.submit_course[0].current_date.slice(0,10), program._id)}>Genrate Certificate</button> : <a href={`${config.base_url}/uploadspdf/${program.certificate_url}`} rel="noopener noreferrer" target='_blank' className='subBtn'>View Certificate</a> }</td>
														</tr>
											))}
										</tbody>
									</Table>
								</Col>
							</Row>
						</div>
					</div>
				</div>
				<Modal show={this.state.show} onHide={this.hideHandler}>
					<Modal.Header closeButton>
						<Modal.Title>Genrate Certificate</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="certiii">
							<Button variant="primary" onClick={this.genrateCertificate}>
								Yes
							</Button>
							<Button variant="primary" onClick={this.hideHandler}>
								No
							</Button>
						</div>
					</Modal.Body>
				</Modal>
			</section>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		state_get_all_purchased_programs: state.state_get_all_purchased_programs
	}
}
export default connect(mapStateToProps, {getAllPurchasedPrograms}) (GenrateCertificate);
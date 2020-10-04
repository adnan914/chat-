import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Table, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getAllCourses } from '../../store/action/action';
import config from '../../Config/Config';

class CourseBatches extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			show: false,
			id: '',
			batches: [],
			loggedIn
		}
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.approve = this.approve.bind(this);
	}
	handleShow(id, batches){
		this.setState({
			show: true,
			id: id,
			batches: batches
		})
	}
	handleClose(){
		this.setState({
			show: false
		})
	}
	async componentDidMount(){
		await this.props.getAllCourses()
	}
	approve(e, batch_id){
		fetch(`${config.base_url}/update_course_batche_status`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': this.state.id,
				'batch_id': batch_id,
				'batch_status': e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			if (obj.status === 'Success!!!') {
				if (e === 1) {
					alert('Approved')
					window.location.reload();
					return false;
				} else {
					alert('Denied')
					window.location.reload();
					return false;
				}
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		if(!this.state.loggedIn){
			return <Redirect to="/admin" />
		}
		return(
			<section className="admin">
				<AdminSideBar />
				<div className="adminArticle">
					<AdminHeader />
					<div className="adminHead">
						<h3>Switched Program</h3>
						<div className="userList">
							<Row>
								<Col md={12}>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Mentor Name</th>
												<th>Course Name</th>
												<th>Duration</th>
												<th>Fee</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
										{ this.props.state_get_all_courses === undefined || this.props.state_get_all_courses.length === 0 ? 
											<tr>
												<td colSpan='8'>No Records</td>
											</tr>
										: 
										this.props.state_get_all_courses.map((courses, i) => (
											courses.status === 1 ?
											<tr key={i}>
												<td>{courses.mentor_name}</td>
												<td>{courses.course_name}</td>
												<td>{courses.duration}</td>
												<td>{courses.fee}</td>
												<td><button className="mainBtn" onClick={() => this.handleShow(courses._id, courses.batche_time)}>View Batches</button></td>
											</tr>
											: null
											))
										}
										</tbody>
									</Table>
								</Col>
							</Row>
						</div>
					</div>
				</div>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Batches</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="text-center">
							<Table striped bordered hover size="sm">
								<thead>
									<tr>
										<th>S.No.</th>
										<th>Start Time</th>
										<th>End Time</th>
										<th>Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
								{this.state.batches.map((batchess, i) => (
									<tr key={i}>
										<td>{i+1}</td>
										<td>{batchess.start_date}</td>
										<td>{batchess.end_date}</td>
										<td>{batchess.batch_status === 0 ? 'Pending' : batchess.batch_status === 1 ? 'Approved' : batchess.batch_status === 2 ? 'Denied' : null }</td>
										<td>
											{batchess.batch_status === 0 ? 
											<DropdownButton alignRight title="" id="dropdown-menu-align-right">
											{batchess.batch_status === 0 ?
												<div> 
													<Dropdown.Item onClick={() => this.approve(1, batchess.id)}>Approve</Dropdown.Item>
												</div>
											 : null }
											</DropdownButton>
											: 'Approved'}
										</td>
									</tr>
								))}
								</tbody>
							</Table>
						</div>
					</Modal.Body>
				</Modal>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_all_courses: state.state_get_all_courses
	}
}
export default connect(mapStateToProps, {getAllCourses}) (CourseBatches);

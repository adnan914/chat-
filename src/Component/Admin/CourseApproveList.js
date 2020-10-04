import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Table, Modal, Button } from 'react-bootstrap';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getAllCourses } from '../../store/action/action';
import config from '../../Config/Config';


class CourseApproveList extends Component {
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
			curriculum: [],
			id: '',
			user_id: '',
			status: '',
			loggedIn
		}
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.approve = this.approve.bind(this);
	}
	handleShow(curriculum, id, status, user_id){
		this.setState({
			show: true,
			curriculum: curriculum,
			id: id,
			status: status,
			user_id: user_id
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
	approve(e){
		fetch(`${config.base_url}/update_course_status`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': this.state.id,
				'status': e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				if (e !== 0 && e !== 2) {
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
						<h3>Course List</h3>
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
												<th>Date</th>
												<th>Status</th>
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
											<tr key={i}>
												<td>{courses.mentor_name}</td>
												<td>{courses.course_name}</td>
												<td>{courses.duration}</td>
												<td>{courses.fee}</td>
												<td>{courses.current_date}</td>
												<td>{courses.status === 0 ? 'Pending' : courses.status === 1 ? 'Approved' : courses.status === 2 ? 'Disapproved' : null}</td>
												<td><button className="mainBtn" onClick={() => this.handleShow(courses.curriculum, courses._id, courses.status, courses.user_id)}>View Curriculum</button></td>
											</tr>
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
						<Modal.Title>Curriculum</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="curriList">
								{this.state.curriculum.map((curriculums, i) => (
								<div className="wekChange" key={i}>
									<h3>Week {i+1}</h3>
									<ul>
									{curriculums.map((curriculumss, ky) => (
										<li key={ky}>
											<a href={curriculumss.link} target="_blank" rel="noopener noreferrer">{curriculumss.topik}</a>
										</li>
									))}
									</ul>
								</div>
								))}
						</div>
					</Modal.Body>
					<Modal.Footer className="qFoot">
						{this.state.status === 0 ? 
						<div className="modal-footer">
							<Button variant="primary" onClick={() => this.approve(1)}>
								Approve
							</Button>
							<Button variant="secondary" onClick={() => this.approve(2)}>
								Deny
							</Button>
						</div>
						 : this.state.status === 1 ? 
						 <Button variant="secondary" onClick={() => this.approve(2)}>
							Deny
						</Button>
						: this.state.status === 2 ? 
						<Button variant="primary" onClick={() => this.approve(1)}>
							Approve Again
						</Button>
						:
						null
						 }
						
					</Modal.Footer>
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
export default connect(mapStateToProps, {getAllCourses}) (CourseApproveList);

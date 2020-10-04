import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getApprovedAllData } from '../../store/action/action';
import config from '../../Config/Config';

class UserApproveList extends Component {
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
			quesanser: [],
			id: '',
			user_id: '',
			loggedIn
		}
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.approve = this.approve.bind(this);
		this.changeToMentor = this.changeToMentor.bind(this);
	}
	handleShow(e, id,status, user_id){
		this.setState({
			show: true,
			quesanser: e,
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
		await this.props.getApprovedAllData()
	}
	approve(e){
		fetch(`${config.base_url}/admin_approved`,{
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
					this.changeToMentor('Mentor')
				} else {
					this.changeToMentor('Mentee')
				}
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	changeToMentor(e) {
		fetch(`${config.base_url}/update_to_mentor`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': this.state.user_id,
				'user_roll': e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				window.location.reload();
				return false;
			}else {
				alert('Failed to Mentor!!!')
				this.approve(0)
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
						<h3>Mentor Approved List</h3>
						<div className="userList">
							<Row>
								<Col md={8}>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Name</th>
												<th>Date</th>
												<th>Status</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
										{ this.props.state_user_approveds_all === undefined || this.props.state_user_approveds_all.length === 0 ? null : 
											
											this.props.state_user_approveds_all.map((userrequest, i) => (
											<tr key={i}>
												<td>{userrequest.name}</td>
												<td>{userrequest.date}</td>
												<td>{userrequest.status === 0 ? 'Pending' : userrequest.status === 1 ? 'Approved' : userrequest.status === 2 ? 'Disapproved' : null}</td>
												<td><button className="mainBtn" onClick={() => this.handleShow(userrequest.question_anser, userrequest._id, userrequest.status, userrequest.user_id)}>View Question</button></td>
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
						<Modal.Title>Question List</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<ul>
								{this.state.quesanser.map((quesansers, i) => (
									<li key={i}>
										<h4>Q) {i+1} {quesansers.q}</h4>
										<p><b>Ans.</b> {quesansers.a}</p>
									</li>
								))}
							</ul>
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
		state_user_approveds_all: state.state_user_approveds_all
	}
}
export default connect(mapStateToProps, {getApprovedAllData}) (UserApproveList);

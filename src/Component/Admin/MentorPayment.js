import React, { Component } from 'react';
import { Row, Col, Table, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getUserByUserRoll, getAllPurchasedPrograms } from '../../store/action/action';
import config from '../../Config/Config';

class MentorPayment extends Component {
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
			mentor_id: '',
			array: [],
			program: [],
			loggedIn
		}
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.submit = this.submit.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}
	checkHanler = (e) => {
		let index = parseInt(e.target.name) + 1
		let length = this.state.array.length
		let currentState = this.state.array
		if (length < index) {
			currentState.push(e.target.value)
		} else {
			currentState.splice(parseInt(e.target.name), 1)
		}
		this.setState({
			array: currentState
		})
	}
	handleShow(e){
		this.setState({
			show: true,
			mentor_id: e
		})
		this.increment()
	}
	handleClose(){
		this.setState({
			show: false,
			mentor_id: ''
		})
	}
	async componentDidMount(){
		await this.props.getUserByUserRoll('Mentor')
		await this.props.getAllPurchasedPrograms()
	}
	timer(){
		if (this.props.state_get_all_purchased_programs === undefined ) {	
		} else {
			let proLength = this.props.state_get_all_purchased_programs
			let program = []
			for (let i=0; proLength.length > i; i++) {
				if (proLength[i].mentor_id === this.state.mentor_id) {
					program.push(proLength[i])
				}
			}
			this.setState({
				program: program
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submit(){
		if (this.state.array.length === 0) {
			alert('Please checked')
		} else {
			fetch(`${config.base_url}/purchased_programs_multiple_update`,{
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					doc: this.state.array
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
				let obj=JSON.parse(responseText);
				if (obj.status === 'Success!!!') {
					alert("Successfull!!!")
					window.location.reload()
				} else {
					alert("Failed...")
				}
			})
			.catch((error) => {
				console.log(error);
			});
		}
	}
	render(){
		const users = this.props.state_get_user_by_user_roll
		const program = this.props.state_get_all_purchased_programs
		console.log(this.state.program)
		if(!this.state.loggedIn){
			return <Redirect to="/admin" />
		}
		return(
			<section className="admin">
				<AdminSideBar />
				<div className="adminArticle">
					<AdminHeader />
					<div className="adminHead">
						<h3>Mentor List</h3>
						<div className="userList">
							<Row>
								<Col md={8}>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Name</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{users === undefined || program === undefined ? null : users.map((user, i) => (
											<tr key={i}>
												<td>{user.name}</td>
												<td><button className="subBtn" onClick={() => this.handleShow(user.user_id)}>Pay Detail</button></td>
											</tr>
											))}
										</tbody>
									</Table>
								</Col>
							</Row>
						</div>
					</div>
				</div>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Payment Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="text-center mb10">
							<Table striped bordered hover size="sm">
								<thead>
									<tr>
										<th></th>
										<th>S.No</th>
										<th>Course Name</th>
										<th>Ammount</th>
										<th>Payment Status</th>
									</tr>
								</thead>
								<tbody>
									{this.state.program.length === 0 ? <tr><td colSpan="5">No Payment</td></tr> : this.state.program.map((pro, i) => (
										<tr key={i}>
											<td>{pro.mentor_part.status === 0 ? <input type="checkbox" name={i} value={pro._id} onChange={this.checkHanler} /> : <span className="checked"><i className="fa fa-check-square-o"></i></span>}</td>
											<td>{i+1}</td>
											<td>{pro.course_name}</td>
											<td>Rs.{pro.mentor_part.ammount}</td>
											<td>{pro.mentor_part.status === 0 ? 'Panding' : 'Compeleted'}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
						<button className="mainBtn" onClick={this.submit}>Submit</button>
					</Modal.Body>
				</Modal>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_user_by_user_roll: state.state_get_user_by_user_roll,
		state_get_all_purchased_programs: state.state_get_all_purchased_programs
	}
}
export default connect(mapStateToProps, { getUserByUserRoll, getAllPurchasedPrograms}) (MentorPayment);
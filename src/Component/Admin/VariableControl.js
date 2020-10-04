import React, { Component } from 'react';
import { Row, Col, Table, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { regFees, getPercent } from '../../store/action/action';
import config from '../../Config/Config';

class VariableControl extends Component {
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
			revenueModel: false,
			id: '',
			mentor: '',
			affilite: '',
			batch: '',
			mentee: '',
			percent: [],
			direct_pay: '',
			by_mentor_pay: '',
			mentor_pay: '',
			by_affiliate_pay: '',
			loader: false,
			loggedIn
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.regSubmit = this.regSubmit.bind(this);
		this.submit = this.submit.bind(this);
	}
	handleShow = (e) => this.setState({show: true, id: e});
	handleClose = (e) => this.setState({show: false, id: ''});
	handleChange = (e) => this.setState({[e.target.name]: e.target.value});
	revenueModel = (e) => this.setState({revenueModel: true, id: e});
	revenueModelClose = () => this.setState({revenueModel: false,id: ''});

	handleCh = (e) => {
		if (e.target.value <= 99) {
			this.setState({
				[e.target.name]: e.target.value
			})
		} 
	}

	async componentDidMount(){
		await this.props.regFees()
		await this.props.getPercent()
		this.increment();
	}
	timer(){
		if (this.props.state_get_reg_fees === undefined || this.props.state_get_percent === undefined) {	
		} else {
			let fees = this.props.state_get_reg_fees
			this.setState({
				mentor: fees[0].mentor_reg,
				affilite: fees[0].affiliate_reg,
				batch: fees[0].seate_limit,
				mentee: fees[0].course_ammount_limit,
				percent: this.props.state_get_percent[0],
				direct_pay: this.props.state_get_percent[0].direct_pay,
				by_mentor_pay: this.props.state_get_percent[0].by_mentor_pay,
				mentor_pay: this.props.state_get_percent[0].mentor_pay,
				by_affiliate_pay: this.props.state_get_percent[0].by_affiliate_pay
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	regSubmit(e) {
		this.setState({
			loader: true
		})
		e.preventDefault();
		fetch(`${config.base_url}/regfees_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: this.state.id,
				mentor: this.state.mentor,
				affilite: this.state.affilite,
				batch: this.state.batch,
				mentee: this.state.mentee
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				alert(obj.status)
				window.location.reload()
			} else {
				alert(obj.status)
				window.location.reload()
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	submit(e){
		this.setState({
			loader: true
		})
		e.preventDefault();
		fetch(`${config.base_url}/pay_percent_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: this.state.id,
				direct_pay: this.state.direct_pay,
				by_mentor_pay: this.state.by_mentor_pay,
				mentor_pay: this.state.mentor_pay,
				by_affiliatepay: this.state.by_affiliatepay
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
				alert(obj.status)
				window.location.reload()
			} else {
				alert(obj.status)
				window.location.reload()
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
			{this.state.loader ?  
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div> : null
			}
				<AdminSideBar />
				<div className="adminArticle">
					<AdminHeader />
					<div className="adminHead">
						<h3>Variable Control</h3>
						<div className="userList">
							<Row>
								<Col md={12}>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Mentor Reg Fee</th>
												<th>Affiliate Reg Fee</th>
												<th>Max Batch Size</th>
												<th>Min Cost Per Mentee</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{this.props.state_get_reg_fees === undefined ? null : 
												this.props.state_get_reg_fees.map((fees, i) => (
													<tr key={i}>
														<td>Rs.{fees.mentor_reg}</td>
														<td>Rs.{fees.affiliate_reg}</td>
														<td>{fees.seate_limit}</td>
														<td>Rs.{fees.course_ammount_limit}</td>
														<td><button className="subBtn" onClick={() => this.handleShow(fees._id)}>Edit</button></td>
													</tr>
												))
											}
										</tbody>
									</Table>
									<br/>
									<h5 className="text-left">Revenue Model</h5>
									<Row>
										<Col md={8}>
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th></th>
														<th>By C4</th>
														<th>By Mentor</th>
														<th>By Affiliate</th>
													</tr>
												</thead>
												{this.state.percent.length === 0 ? null : 
												<tbody>
													<tr>
														<th className="text-left">Received by Mentor</th>
														<td>{this.state.percent.direct_pay}%</td>
														<td>{this.state.percent.by_mentor_pay}%</td>
														<td>{this.state.percent.mentor_pay}%</td>
													</tr>
													<tr>
														<th className="text-left">Received by Affiliate</th>
														<td>0</td>
														<td>0</td>
														<td>{this.state.percent.by_affiliate_pay}%</td>
													</tr>
													<tr>
														<th className="text-left">Received by C4</th>
														<td>{100 - this.state.percent.direct_pay}%</td>
														<td>{100 - this.state.percent.by_mentor_pay}%</td>
														<td>{100 - (this.state.percent.mentor_pay + this.state.percent.by_affiliate_pay)}%</td>
													</tr>
												</tbody>
												}
											</Table>
											<br/>
											<div className="text-left">
												<button className="mainBtn" onClick={() => this.revenueModel(this.state.percent._id)}>Edit Revenue Model</button>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</div>
					</div>
				</div>

				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Variable Control</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form onSubmit={this.regSubmit}>
							<div className="form-group">
								<label>Mentor Reg Fee</label>
								<input type="number" name="mentor" value={this.state.mentor} onChange={this.handleChange} className="form-control" required />
							</div>
							<div className="form-group">
								<label>Affiliate Reg Fee</label>
								<input type="number" name="affilite" value={this.state.affilite} onChange={this.handleChange} className="form-control" required />
							</div>
							<div className="form-group">
								<label>Max Batch Size</label>
								<input type="number" name="batch" value={this.state.batch} onChange={this.handleChange} className="form-control" required />
							</div>
							<div className="form-group">
								<label>Min Cost Per Mentee</label>
								<input type="number" name="mentee" value={this.state.mentee} onChange={this.handleChange} className="form-control" required />
							</div>
							<div>
								<button className="mainBtn" type="submit">Submit</button>
							</div>
						</form>
					</Modal.Body>
				</Modal>

				<Modal show={this.state.revenueModel} onHide={this.revenueModelClose} size="lg">
					<Modal.Header closeButton>
						<Modal.Title>Revenue Model</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form onSubmit={this.submit}>
							<Table striped bordered hover size="sm">
								<thead>
									<tr>
										<th></th>
										<th>By C4</th>
										<th>By Mentor</th>
										<th>By Affiliate</th>
									</tr>
								</thead>
								{this.state.percent.length === 0 ? null : 
								<tbody>
									<tr>
										<th className="text-left">Received by Mentor</th>
										<td><input type="number" className="form-control" name="direct_pay" value={this.state.direct_pay} required onChange={this.handleCh} /></td>
										<td><input type="number" className="form-control" name="by_mentor_pay" value={this.state.by_mentor_pay} required onChange={this.handleCh} /></td>
										<td><input type="number" className="form-control" name="mentor_pay" value={this.state.mentor_pay} required onChange={this.handleCh} /></td>
									</tr>
									<tr>
										<th className="text-left">Received by Affiliate</th>
										<td>0</td>
										<td>0</td>
										<td><input type="number" className="form-control" name="by_affiliate_pay" value={this.state.by_affiliate_pay} required onChange={this.handleCh} /></td>
									</tr>
									<tr>
										<th className="text-left">Received by C4</th>
										<td>{100 - this.state.direct_pay}%</td>
										<td>{100 - this.state.by_mentor_pay}%</td>
										<td>{100 - (parseInt(this.state.mentor_pay) + parseInt(this.state.by_affiliate_pay))}%</td>
									</tr>
								</tbody>
								}
							</Table>
							<div>
								<button className="mainBtn" type="submit">Submit</button>
							</div>
						</form>
					</Modal.Body>
				</Modal>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_reg_fees: state.state_get_reg_fees,
		state_get_percent: state.state_get_percent
	}
}
export default connect(mapStateToProps, {regFees, getPercent}) (VariableControl);

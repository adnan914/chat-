import React, { Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getReports } from '../../store/action/action';
import config from '../../Config/Config';

class Reports extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			loggedIn
		}
	}

	async componentDidMount(){
		await this.props.getReports()
		fetch(`${config.base_url}/update_reports_status_multiple`)
		.then((response) => response.text())
		.then((responseText) => {  })
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
						<h3>Reports</h3>
						<div className="userList">
							<Row>
								<Col md={12}>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Name</th>
												<th>Subject</th>
												<th>User Role</th>
												<th>Date</th>
												<th>Proof</th>
												<th>Description</th>
											</tr>
										</thead>
										<tbody>
										{ this.props.state_get_all_reports === undefined ? null : 
											
											this.props.state_get_all_reports.map((reports, i) => (
											<tr key={i}>
												<td>{reports.name}</td>
												<td>{reports.subject}</td>
												<td>{reports.user_role}</td>
												<td>{reports.current_date.slice(10)}</td>
												<td>{reports.proof === 'No' ? 'No' : <a href={`http://localhost:3001/upload/${reports.proof}`} rel="noopener noreferrer" target="_blank" className="subBtn">View</a>}</td>
												<td>{reports.description}</td>
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
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_all_reports: state.state_get_all_reports
	}
}
export default connect(mapStateToProps, {getReports}) (Reports);

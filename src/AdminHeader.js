import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Toast } from 'react-bootstrap';
import {connect} from 'react-redux';
import { getApprovedAllData, getApprovedAllDataAff, getAllCourses, getReports, getAllPurchasedPrograms } from './store/action/action';


class AdminHeader extends Component{
	constructor(props){
		super(props);
		this.state = {
			number: 0,
			numberAff: 0,
			numberCourse: 0,
			batch_status: 0,
			report_status: 0,
			certificat: 0
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}
	logout = () => {
		localStorage.clear();
		window.location.reload();
	}
	async componentDidMount(){
		await this.props.getApprovedAllData()
		await this.props.getApprovedAllDataAff()
		await this.props.getAllPurchasedPrograms()
		await this.props.getAllCourses()
		await this.props.getReports()
		this.increment();
	}
	timer(){
		if ((this.props.state_user_approveds_all === undefined || this.props.state_user_approveds_all.length === 0) && (this.props.state_aff_approveds_all === undefined || this.props.state_aff_approveds_all.length === 0 || this.props.state_get_all_reports === undefined || this.props.state_get_all_purchased_programs === undefined)) {	
		} else {
			let users = this.props.state_user_approveds_all
			for(let i=0; users.length > i; i++){

				if (users[i].status === 0) {
					this.setState({
						number: this.state.number + 1
					})
				}
			}
			let aff = this.props.state_aff_approveds_all
			for(let i=0; aff.length > i; i++){
				if (aff[i].status === 0) {
					this.setState({
						numberCourse: this.state.numberAff + 1
					})
				}
			}
			let cours = this.props.state_get_all_courses
			for(let i=0; cours.length > i; i++){
				if (cours[i].status === 0) {
					this.setState({
						numberAff: this.state.numberAff + 1
					})
				}
			}
			for(let i=0; cours.length > i; i++){
				for(let j=0; cours[i].batche_time.length > j; j++){
					if (cours[i].batche_time[j].batch_status === 0) {
						this.setState({
							batch_status: this.state.batch_status + 1
						})
					}
				}
			}
			let report = this.props.state_get_all_reports
			for(let i=0; report.length > i; i++){
				if (report[i].status === 0) {
					this.setState({
						report_status: this.state.report_status + 1
					})
				}
			}

			let certificat = this.props.state_get_all_purchased_programs
			for(let i=0; certificat.length > i; i++){

				if (certificat[i].submit_course[0] !== 0 && certificat[i].certificate_url === undefined) {
					this.setState({
						certificat: this.state.certificat + 1
					})
				}
			}

			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}

	render(){
	return(
		<header className="adminHeader">
			<Navbar bg="dark" variant="dark">
			<Nav className="mr-auto">
				<Nav.Link href="">Profile</Nav.Link>
			</Nav>
			<button className="mainBtn" onClick={this.logout}>Logout</button>
			    <div className="dropDiv">
					<Dropdown>
						<Dropdown.Toggle variant="success" id="dropdown-basic">
							{this.state.number === 0 && this.state.numberAff === 0 && this.state.batch_status === 0 && this.state.numberCourse === 0 && this.state.report_status === 0 && this.state.certificat === 0 ? null : <span className="nitiCounter">{this.state.number + this.state.numberAff + this.state.numberCourse + this.state.batch_status + this.state.report_status + this.state.certificat}</span> }
							<i className="fa fa-bell" aria-hidden="true"></i>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{ this.props.state_user_approveds_all === undefined || this.props.state_user_approveds_all.length === 0 ? null : 
								this.props.state_user_approveds_all.map((userrequest, i) => (
									<Link to="/admin/uerapprovelist" key={i} className={ userrequest.status === 0 ? 'panding' : null} style={{ 'display':  userrequest.status === 1 || userrequest.status === 2 ? 'none' : null }}>
										<Toast className="toster">
											<Toast.Body>{userrequest.message}</Toast.Body>
										</Toast>
									</Link>
								))
							}
							{ this.props.state_aff_approveds_all === undefined || this.props.state_aff_approveds_all.length === 0 ? null : 
								this.props.state_aff_approveds_all.map((userrequest, i) => (
									<Link to="/admin/affiliatapproveList" key={i} className={ userrequest.status === 0 ? 'panding' : null} style={{ 'display':  userrequest.status === 1 || userrequest.status === 2 ? 'none' : null }}>
										<Toast className="toster">
											<Toast.Body>{userrequest.message}</Toast.Body>
										</Toast>
									</Link>
								))
							}
							{ this.props.state_get_all_courses === undefined || this.props.state_get_all_courses.length === 0 ? null : 
								this.props.state_get_all_courses.map((userrequest, i) => (
									<Link to="/admin/courseapprovelist" key={i} className={ userrequest.status === 0 ? 'panding' : null} style={{ 'display':  userrequest.status === 1 || userrequest.status === 2 ? 'none' : null }}>
										<Toast className="toster">
											<Toast.Body>{`${userrequest.mentor_name} Added Course `}<b>{`'${userrequest.course_name}'`}</b></Toast.Body>
										</Toast>
									</Link>
								))
							}
							{ this.props.state_get_all_courses === undefined || this.props.state_get_all_courses.length === 0 ? null : 
								this.props.state_get_all_courses.map((userrequest, i) => (

									userrequest.batche_time.map((batch, j) => (
										batch.batch_status === 0 ?
									<Link to="/admin/coursebatches" key={j} className='panding'>
										<Toast className="toster">
											<Toast.Body>{`${userrequest.mentor_name} Add Batches for `}<b>{`'${userrequest.course_name}'`}</b></Toast.Body>
										</Toast>
									</Link>: null
									))
								))
							}
							{ this.props.state_get_all_reports === undefined || this.props.state_get_all_reports.length === 0 ? null : 
								this.props.state_get_all_reports.map((report, i) => (

									report.status === 0 ?
									<Link to="/admin/reports" key={i} className='panding'>
										<Toast className="toster">
											<Toast.Body>{`${report.name} sent report `}</Toast.Body>
										</Toast>
									</Link>: null
								))
							}
							{ this.props.state_get_all_purchased_programs === undefined ? null : 
								this.props.state_get_all_purchased_programs.map((program, i) => (

									program.submit_course[0] === 0 ? null : 
									 program.certificate_url === undefined ?
									<Link to="/admin/genratecertificate" key={i} className='panding'>
										<Toast className="toster">
											<Toast.Body>{`${program.student_name} sent certificate request`} {program.certificate_url}</Toast.Body>
										</Toast>
									</Link> : null
								))
							}
						</Dropdown.Menu>
					</Dropdown>
			    </div>

			</Navbar>
		</header>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		state_user_approveds_all: state.state_user_approveds_all,
		state_aff_approveds_all: state.state_aff_approveds_all,
		state_get_all_courses: state.state_get_all_courses,
		state_get_all_reports: state.state_get_all_reports,
		state_get_all_purchased_programs: state.state_get_all_purchased_programs
	}
}
export default connect(mapStateToProps, {getApprovedAllData, getApprovedAllDataAff, getAllCourses, getReports, getAllPurchasedPrograms}) (AdminHeader);

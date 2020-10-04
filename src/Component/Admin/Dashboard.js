import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { MDBDataTableV5 } from 'mdbreact';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getAllStudent, getAllCourses } from '../../store/action/action';




class Dashboard extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			user_roll_count: [],
			loggedIn
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.getUniqueDataCount = this.getUniqueDataCount.bind(this);
	}
	async componentDidMount(){
		await this.props.getAllStudent()
		this.increment();
	}
	timer(){
		if (this.props.state_get_all_student === undefined ) {	
		} else {
			var data= this.props.state_get_all_student;
	  		this.getUniqueDataCount(data, 'user_roll')
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	getUniqueDataCount(objArr, propName) {
        let data = [];
		objArr.forEach((d, index) => {
			if (d[propName]) {
				data.push(d[propName]);
			}
		});

		let uniqueList = [...new Set(data)];

		let dataSet = {};
		for (let i=0; i < uniqueList.length; i++) {
			dataSet[uniqueList[i]] = data.filter(x => x === uniqueList[i]).length;
		}
		this.setState({
			user_roll_count: dataSet
		})
    }
	render(){
		const course = this.props.state_get_all_courses
		const student = this.props.state_get_all_student
		const datatable = {columns: [
			{
				label: 'Email',
				field: 'email'
			},
			{
				label: 'User Role',
				field: 'user_roll'
			},
			{
				label: 'Username',
				field: 'username'
			}
			],
			rows: student
		}
		console.log(student)
		if(!this.state.loggedIn){
			return <Redirect to="/admin" />
		}
		return(
			<section className="admin">
				<AdminSideBar />
				<div className="adminArticle">
					<AdminHeader />
					<div className="adminHead">
						<h3>Dashboard</h3>
						<div className="userList">
							<Row>
								<Col md={3}>
									<div className="boxes">
										<span className="purpel"><i className="fa fa-users"></i></span>
										<div className="boxContain">
											<p>{this.state.user_roll_count.Mentor}</p>
											<h4>Mentor</h4>
										</div>
									</div>
								</Col>
								<Col md={3}>
									<div className="boxes">
										<span className="border-success alert-success"><i className="fa fa-users"></i></span>
										<div className="boxContain">
											<p>{this.state.user_roll_count.Mentee}</p>
											<h4>Mentee</h4>
										</div>
									</div>
								</Col>
								<Col md={3}>
									<div className="boxes">
										<span className="border-info alert-info"><i className="fa fa-users"></i></span>
										<div className="boxContain">
											<p>{this.state.user_roll_count.Affiliate}</p>
											<h4>Affiliate</h4>
										</div>
									</div>
								</Col>
								<Col md={3}>
									<div className="boxes">
										<span className="border-warning alert-warning"><i className="fa fa-book"></i></span>
										<div className="boxContain">
											<p>{course === undefined ? null : course.length}</p>
											<h4>Total Courses</h4>
										</div>
									</div>
								</Col>
							</Row>
						</div>

						<div className="dashTable">
							<h5>Email &amp; Contacts</h5>
							<div className="table table-sm table-striped table-hover tableBorder">
								<MDBDataTableV5 hover entriesOptions={[10, 15, 20]} entries={10} pagesAmount={2} data={datatable} />
							</div>
						</div>

					</div>
				</div>
				
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_all_student: state.state_get_all_student,
		state_get_all_courses: state.state_get_all_courses
	}
}
export default connect(mapStateToProps, {getAllStudent, getAllCourses}) (Dashboard);

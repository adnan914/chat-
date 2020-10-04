import React, { Component } from 'react';
// import { Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AdminHeader from '../../AdminHeader';
import AdminSideBar from '../../AdminSideBar';
import {connect} from 'react-redux';
import { getAllStudent, getAllCourses } from '../../store/action/action';
import config from '../../Config/Config';


class TemlatesCoupons extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("admin_email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			certificate: '',
			id: '',
			loggedIn
		}
		this.submit = this.submit.bind(this);
	}
	changeHandler = (e) => {
		if (e.target.value.length <= 385) {
			this.setState({[e.target.name]: e.target.value})
		} else {
			alert('Word limit less then 385')
		}
	}

	componentDidMount(){
		fetch(`${config.base_url}/certificates`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			this.setState({
				certificate: obj[0].certificate,
				id: obj[0]._id
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	submit(e){
		e.preventDefault();
		fetch(`${config.base_url}/certificates_update`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': this.state.id,
				'certificate': this.state.certificate
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
						<h3>Temlates &amp; Coupons</h3>
						<div className="coupons">
							<form onSubmit={this.submit}>
								<div className="form-group">
									<label>Certificate Upload</label>
									<textarea className="form-control" rows="5" placeholder="Certificate Upload" value={this.state.certificate} name="certificate" onChange={this.changeHandler} required></textarea>
									<small>Word Limit Less then: 385</small>
								</div>
								<button type="submit" className="mainBtn">Submit</button>
							</form>
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
export default connect(mapStateToProps, {getAllStudent, getAllCourses}) (TemlatesCoupons);

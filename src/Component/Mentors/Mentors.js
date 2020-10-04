import React, { Component } from 'react';
import config from '../../Config/Config';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllCourses } from '../../store/action/action';

class Mentors extends Component {
	constructor(props){
		super(props);
		const token = localStorage.getItem("email")
		let loggedIn = true
		if(token === null)
		{
			loggedIn = false
		}
		this.state = {
			grid: 3,
			coursFull: '',
			gridClass: true,
			obj: [],
			visible: false,
			loader: true,
			search: '',
			loggedIn
		}
		this.getUsers = this.getUsers.bind(this);
		this.updateUser = this.updateUser.bind(this);
	}
	search = (e) => this.setState({search: e.target.value});
	async componentDidMount(){
		await this.props.getAllCourses()
		if (!this.state.loggedIn) {
			fetch(`http://c4projects.tech/wp-json/app/login/${this.props.match.params.id}`)
			.then((response) => response.text())
			.then((responseText) => {
				let obj = JSON.parse(responseText)
				console.log(obj)
				this.getUsers(obj.data.data.user_email)
				this.setState({
					obj: obj
				})
			})
			.catch((error) => {
				console.log(error);
			});
		} else {
			this.setState({
				loader: false
			})
		}
	}
	getUsers(e){
		fetch(`${config.base_url}/getusers`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'email': e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj = JSON.parse(responseText)
			if (obj.length === 0) {
				// if user not found in mongoDB
				this.updateUser()
			} else {

				// if user found in mongoDB
				localStorage.setItem('name', obj[0].name);
				localStorage.setItem('email', obj[0].email);
				localStorage.setItem('user_id', obj[0].user_id);
				localStorage.setItem('username', obj[0].username);
				localStorage.setItem('user_roll', obj[0].user_roll);

				this.setState({
					loader: false
				})
			}
			//localStorage.getItem('name')
			//localStorage.clear();
		})
		.catch((error) => {
			console.log(error);
		});
	}
	updateUser(){
		fetch(`${config.base_url}/users`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': this.state.obj.data.data.ID,
				'name': this.state.obj.data.data.display_name,
				'email': this.state.obj.data.data.user_email,
				'username': this.state.obj.data.data.user_nicename,
				'user_roll': 'Mentee'
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj = JSON.parse(responseText)
			if (obj.status === 'Success!!!') {
				this.getUsers(this.state.obj.data.data.user_email)
			} else {
				//window.location.assign("https://www.w3schools.com")
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		return(
			<section className="course">
				{this.state.loader ?
					<div className="loader" style={{'display':this.state.display}}>
						<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
					</div> : null
				}
				<Container>
					<Row>
						<Col md={6}>
							<ul className="thLarg">
                                <li className={this.state.gridClass ? 'active' : null}>
                                	<span onClick={ () => this.setState({grid: 3,coursFull: '',gridClass: true})}>
                                		<i className="fa fa-th-large"></i>
                                	</span>
                                </li>
                                <li className={this.state.gridClass ? null : 'active'}>
                                	<span onClick={ () => this.setState({grid: 12,coursFull: 'coursFull', gridClass: false})}>
                                		<i className="fa fa-list"></i>
                                	</span>
                                </li>
                                <li>
                                	<p className="showing">Showing 1 - 16 of 36 results</p>
                                </li>
                            </ul>
						</Col>
						<Col md={6}>
							<Row>
								<Col md={6}>
								</Col>
								<Col md={6}>
									<div className="filterForm">
										<input type="text" name="search" placeholder="Search course" className="form-control" value={this.state.search} onChange={this.search} />
										<i className="fa fa-search"></i>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
					<div className="coursList">
						<Row>
							{this.props.state_get_all_courses === undefined ? 
								<div className="loader" style={{'display':this.state.display}}>
									<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
								</div>
							  : this.props.state_get_all_courses.length === 0 ? <div className="nocord col-md-12"><p className="text-center">No Courses</p></div> : 
							 this.props.state_get_all_courses
							 .filter(item => !this.state.search || item.course_name.toLowerCase().includes(this.state.search.toLowerCase()))
							 .slice(0, 10) 
							 .map((courses, i) => (
							 	courses.status === 0 ? null :
							 <Col lg={this.state.grid} key={i}>
								<Link to={`/coursedetail/${courses._id}`} className={`courseDe ${this.state.coursFull}`}>
									<div className="imgDiv">
										<img src={`${config.base_url}/upload/${courses.image_url}`} alt="courses" />
									</div>
									<div className="corCont">
										<span>#{courses.mentor_name}</span>
										<h3>{courses.course_name}</h3>
										<p>{courses.brief_description.substring(0, 100)}{courses.brief_description.length < 100 ? '' : '...'}</p>
										<div className="durat"><span>Duration: {courses.duration}</span> | <span>Fee: Rs.{courses.fee}</span></div>
										<div className="rating">
											Rating: {courses.rating === null ? '--' : courses.rating.toFixed(0) }
										</div>
									</div>
								</Link>
							</Col>
							 ))
							}
						</Row>
					</div>
				</Container>
			</section>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		state_get_all_courses: state.state_get_all_courses,
	}
}
export default connect(mapStateToProps, {getAllCourses}) (Mentors);
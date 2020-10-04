import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { getAllCourses } from '../../store/action/action';
import config from '../../Config/Config';

var today = new Date()
today.setDate(today.getDate() + 8);
var date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;


class Programs extends Component {
	constructor(props){
		super(props);
		this.state = {
			coursid: []
		}
	}
	async componentDidMount(){
		await this.props.getAllCourses()

		fetch(`${config.base_url}/get_purchased_programs`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'users_id': localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(Date.parse(obj[0].end_date) > Date.parse(date))
			console.log(obj[0].end_date , date)
			this.setState({
				coursid: obj
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<h3 className="mainHead mb30">Programs</h3>
							{this.state.coursid.length === 0 ? 
								<div className="nocord">
									<p className="text-center">No Records</p>
								</div>
							:null}

							{ (this.props.state_get_all_courses === undefined || this.props.state_get_all_courses.length === 0) ? null : 
								this.props.state_get_all_courses.map((purchas, i) => (
								<div key={i}>
								 { this.state.coursid.length === 0 ? null : 
								 	this.state.coursid.map((cors, ii) => (
								 	<div key={ii}>
								 	{ (cors.course_id === purchas._id) && (Date.parse(cors.end_date) > Date.parse(date)) ? 
								 	<Link to={`/progrmcuriculm/${purchas._id}`} className="courseDe coursFull">
										<div className="imgDiv">
											<img src={`${config.base_url}/upload/${purchas.image_url}`} alt="courses" />
										</div>
										<div className="corCont">
											<span>#{purchas.mentor_name}</span>
											<h3>{purchas.course_name}</h3>
											<p>{purchas.course_description.substring(0, 100)}{purchas.course_description.length < 100 ? '' : '...'}</p>
											<div className="durat">
												{Object.keys(purchas.domain_tag).map((key) => (
													<span key={key.toString()} className="tag">
														{ purchas.domain_tag[key].replace() }
													</span>
												))}
											</div>
											<div className="rating">
												Rating: 4.6/(82 Viewers)
											</div>
										</div>
									</Link>
									: null }
									</div>

								 ))}
								
								
								</div>
								))
							}
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_all_courses: state.state_get_all_courses
	}
}
export default connect(mapStateToProps, {getAllCourses}) (Programs);

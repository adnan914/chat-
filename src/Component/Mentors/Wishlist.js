import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getWishlistByUserId, getAllCourses } from '../../store/action/action';
import config from '../../Config/Config';

class Wishlist extends Component {
	constructor(props){
		super(props);
		this.state = {
			loader: false
		}
		this.remove = this.remove.bind(this);
	}
	async componentDidMount(){
		await this.props.getWishlistByUserId()
		await this.props.getAllCourses()
	}
	remove(e) {
		this.setState({
			loader: true
		})
		fetch(`${config.base_url}/remove_wishlist_by_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				alert('Removed Successfully!!!')
				window.location.reload();
			} else {
				alert('Failed')
			}
			this.setState({
				loader: false
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		return(
			<section className="course">

			{this.state.loader ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			: null }

			{this.props.state_get_all_courses === undefined || this.props.state_get_wishlist_by_user_id === undefined ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			: 
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<h3 className="mainHead mb30">Wishlist</h3>
							{this.props.state_get_wishlist_by_user_id.length === 0 ? <div className="nocord" style={{'margin': '0 0 15px'}}><p className="text-center">No Wishlist Added</p></div> : 
							this.props.state_get_all_courses.map((course, i) => (
								this.props.state_get_wishlist_by_user_id.map((wishlists, k) => (
									course._id === wishlists.course_id ? 
									<div className="rem" key={k}>
										<button className="removeWishlist" onClick={() => this.remove(wishlists._id)}>x</button>
									<Link className="courseDe coursFull" to={`/coursedetail/${course._id}`}>
										<div className="imgDiv">
											<img src={`${config.base_url}/upload/${course.image_url}`} alt="courses" />
										</div>
										<div className="corCont">
											<span>#{course.mentor_name}</span>
											<h3>{course.course_name}</h3>
											<p>{course.brief_description.substring(0, 100)}{course.brief_description.length < 100 ? '' : '...'}</p>
											<div className="durat"><span>Duration: {course.duration}</span> | <span>Fee: Rs.{course.fee}</span></div>
											<div className="rating">
												Rating: <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star"></i>
											</div>
										</div>
									</Link>
									</div>
									: null
								))
							))}
						</Col>
					</Row>
				</Container>
			 }
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_wishlist_by_user_id: state.state_get_wishlist_by_user_id,
		state_get_all_courses: state.state_get_all_courses
	}
}
export default connect(mapStateToProps, {getWishlistByUserId, getAllCourses}) (Wishlist);
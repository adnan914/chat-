import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCartByUserId, getAllCourses, getPercent } from '../../store/action/action';
import config from '../../Config/Config';

class Cart extends Component {
	constructor(props){
		super(props);
		this.state = {
			doc: [],
			cartDel: [],
			ocumulate: [],
			loader: false
		}
		this.checkout = this.checkout.bind(this);
		this.deleteCart = this.deleteCart.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
		this.ocumulate = this.ocumulate.bind(this);
	}
	async componentDidMount(){
		await this.props.getCartByUserId()
		await this.props.getAllCourses()
		await this.props.getPercent()
		this.increment();
	}
	timer(){
		if ( this.props.state_get_carts_by_user_id === undefined || this.props.state_get_all_courses === undefined || this.props.state_get_percent === undefined ) {	
		} else {
			var count = this.props.state_get_carts_by_user_id;
			var doc = [];
			var cartDel = [];
			for(let i=0; count.length > i; i++){
				let menter_part = (count[i].course_amount/100)*this.props.state_get_percent[0].direct_pay
				let admin_part = count[i].course_amount - menter_part
				doc.push({
					course_id : count[i].course_id,
					user_id : localStorage.getItem('user_id'),
					mentor_id: count[i].user_id,
					transection_id: Date.now(),
					course_amount: count[i].fee,
					mentor_part: {ammount:menter_part,status: 0},
					admin_part: admin_part,
					affiliate_part: {ammount:0,status: 0},
					affiliate_id: 0,
					course_name: count[i].course_name,
					student_name: localStorage.getItem('name'),
					batche_id: count[i].batche_id,
					curriculum_index : [],
					assignment : [],
				})
				cartDel.push(count[i]._id)

				let courseID = this.props.state_get_all_courses
				let ocumulate = []
				for (let j=0; courseID.length > j; j++) {
					if (courseID[j]._id === count[i].course_id) {
						ocumulate.push({ocumulate: courseID[j].batche_time[count[i].batche_id-1].ocumulate+1, course_id: courseID[j]._id,batche_id: count[i].batche_id})
					}
				}
				this.setState({
					ocumulate: ocumulate
				})
			}
			this.setState({
				doc: doc,
				cartDel: cartDel
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	checkout() {
		this.setState({
			loader: true,
			oculoader: true
		})
		fetch(`${config.base_url}/purchased_programs_multiple`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				doc: this.state.doc
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				this.deleteCart()
			} else {
				alert('Failed')
				this.setState({
					loader: false
				})
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	deleteCart() {
		fetch(`${config.base_url}/delete_cart_record`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				doc: this.state.cartDel
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				//this.props.history.push('/programs')
				this.ocumulate()
			} else {
				alert('Failed to delete')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	ocumulate(){
		let ocu = this.state.ocumulate
		for (let i=0; ocu.length > i; i++) {
			fetch(`${config.base_url}/courses_update_ocumulate`,{
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					course_id: ocu[i].course_id,
					batche_id: ocu[i].batche_id,
					ocumulate: ocu[i].ocumulate
				})
			})
			.then((res) => res.text())
			.then((responseText) => {
				console.log('responseText', responseText)
				let obj=JSON.parse(responseText);
				if (obj.status === "Success!!!") {
					alert('Purchased Program Successfully!!!')
					this.props.history.push('/programs')
				} else {
					alert('Failed to purchase Program')
				}
				this.setState({
					loader: false
				})
			})
			.catch((error) => {
				console.log(error);
			});
		}
	}
	render(){
		console.log(this.state.ocumulate)
		return(
			<section className="course">

			{this.state.loader ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			: null }

			{this.props.state_get_all_courses === undefined || this.props.state_get_carts_by_user_id === undefined ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			: 
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<h3 className="mainHead mb30">Cart</h3>
							{this.props.state_get_carts_by_user_id.length === 0 ? <div className="nocord" style={{'margin': '0 0 15px'}}><p className="text-center">No Cart Added</p></div> : 
							this.props.state_get_all_courses.map((course, i) => (
								this.props.state_get_carts_by_user_id.map((carts, k) => (
									course._id === carts.course_id ? 
									<Link to="#" className="courseDe coursFull" key={k}>
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
									: null
								))
							))}
						</Col>
					</Row>
					{this.props.state_get_carts_by_user_id.length === 0 ? null : 
					<div className="text-center">
						<button className="mainBtn" onClick={this.checkout}>Checkout</button>
					</div>}
				</Container>
			 }
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_carts_by_user_id: state.state_get_carts_by_user_id,
		state_get_all_courses: state.state_get_all_courses,
		state_get_percent: state.state_get_percent
	}
}
export default connect(mapStateToProps, {getCartByUserId, getAllCourses, getPercent}) (Cart);
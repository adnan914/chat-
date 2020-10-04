import React, { Component } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { gerCourseById, getCartByUserCourseId, getWishlistsByUserCourseId } from '../../store/action/action';
import config from '../../Config/Config';

class Coursedetail extends Component {
	constructor(props){
		super(props);
		this.state = {
			course_id: '',
			show: false,
			name: `${window.location.href}/${localStorage.getItem('user_id')}`,
			cartloader: false,
			cartlod: false,
			seat_full: false
		}
		this.cart = this.cart.bind(this);
		this.wishlist = this.wishlist.bind(this);
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}
	hide = () => this.setState({show: false});
	showHandler = () => {
		this.setState({show: true});
	}
	// this.props.state_course_by_id === undefined
	async componentDidMount(){
		await this.props.gerCourseById(this.props.match.params.id)
		await this.props.getCartByUserCourseId(this.props.match.params.id)
		await this.props.getWishlistsByUserCourseId(this.props.match.params.id)
		this.increment();
		fetch(`${config.base_url}/get_purchased_programs_by_course_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				users_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.id
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			this.setState({
				course_id: obj[0].course_id
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	timer(){
		if (this.props.state_course_by_id === undefined) {	
		} else {
			let today = new Date()
			let current_date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;


			let lenghthh = this.props.state_course_by_id[0].batche_time
			let seat_status;
			for (let i=0; lenghthh.length > i; i++) {
				if ( (Date.parse(current_date) < Date.parse(lenghthh[i].start_date)) && (lenghthh[i].seate_limit === lenghthh[i].ocumulate)) {
					seat_status = true
				} else {
					seat_status = false
				}
			}
			this.setState({
				seat_full: seat_status
			})
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	cart(){
		try{
			this.setState({
				cartlod: true
			})
			let batche_time = this.props.state_course_by_id[0].batche_time
			let id;
			for(let i=0; batche_time.length > i; i++){
				id = batche_time[i].id
				if(batche_time[i].seate_limit !== batche_time[i].ocumulate) {
					break;
				}
			}
			fetch(`${config.base_url}/cart`,{
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					user_id: localStorage.getItem('user_id'),
					course_id: this.props.match.params.id,
					mentor_id: this.props.state_course_by_id[0].user_id,
					course_amount: this.props.state_course_by_id[0].fee,
					course_name: this.props.state_course_by_id[0].course_name,
					batche_id: id
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
				let obj=JSON.parse(responseText);
				if (obj.status === "Success!!!") {
					this.setState({
						cartloader: true,
						cartlod: false
					})
					window.location.reload();
				} else {
					alert('Failed to Added to Cart')
					this.setState({
						cartloader: true,
						cartlod: false
					})
					window.location.reload();
				}
			})
			.catch((error) => {
				console.log(error);
			});
		}catch(err){
			console.log(err)
		}
	}
	wishlist(){
		this.setState({
			cartlod: true
		})
		fetch(`${config.base_url}/wishlists`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.id,
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === "Success!!!") {
				this.setState({
					cartlod: false
				})
				window.location.reload();
			} else {
				alert('Failed to Added to Cart')
				this.setState({
					cartlod: false
				})
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		return(
			<section className="courses-details">
			{this.state.cartlod ? 
				<div className="loader">
					<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
				</div>
			 : null
			}

			{this.props.state_course_by_id === undefined || this.props.state_get_carts_by_user_course_id === undefined || this.props.state_get_wishlist_by_user_course_id === undefined ? 
			<div className="loader">
				<img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Loading..." />
			</div>
			: 
        <Container>
            <Row>
                <Col lg={9}>
                    <div className="courses-details-content mt-50">
                    	<img src={`${config.base_url}/upload/${this.props.state_course_by_id[0].image_url}`} alt="Course" className="courseImg" />
                        <h2 className="title">{this.props.state_course_by_id[0].course_name}</h2>
						<p>{this.props.state_course_by_id[0].course_description}</p>
	                    <div className="courses-details-tab">
	                        <div className="curriculum-content">
	                        <h5 className="sub-title">Course Curriculum</h5>
	                            <div className="row">
	                                {this.props.state_course_by_id[0].curriculum.map((curriculums, i) => (
	                                <Col lg={4} md={6} key={i}>
	                                    <div className="single-curriculum">
	                                        <h4 className="title">Week-{i+1}</h4>
	                                        <ul className="curriculum-list">
	                                        	{curriculums.map((curriculumsss, key) => (
	                                            <li key={key}>
	                                            	<a href={curriculumsss.link} target="_blank" rel="noopener noreferrer"><i className="fa fa-book"></i> {curriculumsss.topik}</a>
	                                            </li>
	                                        	))}
	                                        </ul>
	                                    </div>
	                                </Col>
	                                ))}
	                            </div>
	                        </div>
	                    </div>


	                    <div className="feedBack">
	                    	<h5 className="sub-title">Feedbacks -</h5>
	                    	<Row>
	                    		<Col md={8}>
	                    			{this.props.state_course_by_id[0].feedback.length === 0 ? 'No feedback' : 
	                    				this.props.state_course_by_id[0].feedback.map((feedbacks, i) => (
											<div className="feedContent" key={i}>
												<h5>{feedbacks.name}</h5>
												<p>{feedbacks.comment}</p>
											</div>
	                    				))
	                    			}
	                    		</Col>
	                    	</Row>
	                    </div>

                    </div>
                </Col>
                <Col lg={3}>
                    <div className="courses-sidebar pt-20">
                        <div className="courses-features mt-30">
                            <div className="sidebar-title">
                                <h4 className="title">{this.props.state_course_by_id[0].mentor_name}</h4>
                            </div>
                            <ul className="courses-features-items">
                                <li>Fee <strong><i className="fa fa-inr"></i>{this.props.state_course_by_id[0].fee}</strong></li>
                                
                                <li>Start Date <strong>{this.props.state_course_by_id[0].batche_time.length === 0 ? 'Comming soon' : this.props.state_course_by_id[0].batche_time[0].start_date}</strong></li>
                                
                                <li>Duration <strong>{this.props.state_course_by_id[0].duration}</strong></li>
                                <li>Course Rating <strong>{this.props.state_course_by_id[0].rating === null ? '--' : `${this.props.state_course_by_id[0].rating.toFixed(0)}/5` }</strong></li>
                                <li>Brief Description <p>{this.props.state_course_by_id[0].brief_description.substring(0, 100)}{this.props.state_course_by_id[0].brief_description.length < 100 ? '' : '...'}</p></li>
                            </ul>
                            	{this.props.state_course_by_id[0].mentor_name === localStorage.getItem('name') ? null : 
                            	this.state.course_id === this.props.state_course_by_id[0]._id ? null : 
		                            this.props.match.params.affiliat_id === localStorage.getItem('user_id') ? null : 
	                            	
		                            this.props.state_course_by_id[0].batche_time.length === 0 ? null :
	                            	<div>
	                            		{this.state.seat_full ? null : 
			                             localStorage.getItem('user_id') === null ? null :
				                            <div className="sidebar-btn">
				                            	{this.props.state_get_carts_by_user_course_id.length === 0 ? <Link className="mainBtn" to={this.props.match.params.affiliat_id ===  undefined ? `/coursepayment/${this.props.match.params.id}` : `/coursepaymentmentee/${this.props.match.params.id}/${this.props.match.params.affiliat_id}`}>Enroll Course</Link> : this.props.state_get_carts_by_user_course_id[0].course_id === this.props.match.params.id ? null : 
				                                <Link className="mainBtn" to={this.props.match.params.affiliat_id ===  undefined ? `/coursepayment/${this.props.match.params.id}` : `/coursepaymentmentee/${this.props.match.params.id}/${this.props.match.params.affiliat_id}`}>Enroll Course</Link>
				                                }
												{this.props.match.params.affiliat_id ===  undefined ?<button className={this.props.state_get_carts_by_user_course_id.length === 0 ? 'mainBtn bgChan' : this.state.cartloader || this.props.state_get_carts_by_user_course_id[0].course_id === this.props.match.params.id ? 'mainBtn bgChan addedd' : 'mainBtn bgChan'} onClick={this.cart}>{this.props.state_get_carts_by_user_course_id.length === 0 ? 'Add to cart' : this.state.cartloader || this.props.state_get_carts_by_user_course_id[0].course_id === this.props.match.params.id ? 'Added to cart' : 'Add to cart'}</button> : null}
				                            </div>
			                            }


				                        { localStorage.getItem('user_id') === null ? null :
				               				this.props.match.params.affiliat_id ===  undefined ?
				                            <div className="wish">
					                            <button onClick={this.wishlist} className={this.props.state_get_wishlist_by_user_course_id.length === 0 ? 'mainBtn bgChan' : this.state.cartloader || this.props.state_get_wishlist_by_user_course_id[0].course_id === this.props.match.params.id ? 'mainBtn bgChan addedd' : 'mainBtn bgChan'}>{this.props.state_get_wishlist_by_user_course_id.length === 0 ? 'Add to Wishlist' : this.state.cartloader || this.props.state_get_wishlist_by_user_course_id[0].course_id === this.props.match.params.id ? 'Added to Wishlist' : 'Add to Wishlist'}</button>
					                        </div>: null
					                    }
					                    { localStorage.getItem('user_id') === null ? 
					                    <div className="signUpForm">
					                    	<p>Please login or signup for Enroll this course and hite this link again</p>
					                    	<div className="sidebar-btn btRe">
				                                <a href="http://e-shopping.ga/c4projects/login/" target="_blank" rel="noopener noreferrer" className="mainBtn">Login</a>
				                                <Link className="mainBtn" to={`/register/${this.props.match.params.id}/${this.props.match.params.affiliat_id}`}>Register</Link>
										   </div>
									   </div> : null
										}
			                        </div>


                                }
                        </div>
                        {localStorage.getItem('user_roll') !== 'Affiliate' ? null :
                        this.props.match.params.affiliat_id === localStorage.getItem('user_id') ? null : 
                        <div className="courses-sidebar-banner mt-30">
                            <button className="mainBtn text-center" onClick={this.showHandler}>
                            	Advertise Course
                            </button>
                        </div>
                    	}
                        <div className="mt-30">
                        	<div className="sidebar-title">
								<h6>Similiar Cources</h6>
							</div>
                        	<ul className="recent-posts">
                        		<li className="post">
                        			<div className="post-inner">
										<figure className="post-thumb"><img src="http://demo.auburnforest.com/html/akadimia/akadimia/images/resource/post-thumb-1.jpg" alt="" /><Link to="#" className="overlay-box"></Link></figure>
										<div className="text"><Link to="#">Interface Introduction</Link></div>
										<div className="author">By: David Smith</div>
									</div>
                        		</li>
                        		<li className="post">
                        			<div className="post-inner">
										<figure className="post-thumb"><img src="http://demo.auburnforest.com/html/akadimia/akadimia/images/resource/post-thumb-1.jpg" alt="" /><Link to="#" className="overlay-box"></Link></figure>
										<div className="text"><Link to="#">Interface Introduction</Link></div>
										<div className="author">By: David Smith</div>
									</div>
                        		</li>
                        		<li className="post">
                        			<div className="post-inner">
										<figure className="post-thumb"><img src="http://demo.auburnforest.com/html/akadimia/akadimia/images/resource/post-thumb-1.jpg" alt="" /><Link to="#" className="overlay-box"></Link></figure>
										<div className="text"><Link to="#">Interface Introduction</Link></div>
										<div className="author">By: David Smith</div>
									</div>
                        		</li>
                        		<li className="post">
                        			<div className="post-inner">
										<figure className="post-thumb"><img src="http://demo.auburnforest.com/html/akadimia/akadimia/images/resource/post-thumb-1.jpg" alt="" /><Link to="#" className="overlay-box"></Link></figure>
										<div className="text"><Link to="#">Interface Introduction</Link></div>
										<div className="author">By: David Smith</div>
									</div>
                        		</li>
                        		<li className="post">
                        			<div className="post-inner">
										<figure className="post-thumb"><img src="http://demo.auburnforest.com/html/akadimia/akadimia/images/resource/post-thumb-1.jpg" alt="" /><Link to="#" className="overlay-box"></Link></figure>
										<div className="text"><Link to="#">Interface Introduction</Link></div>
										<div className="author">By: David Smith</div>
									</div>
                        		</li>
                        	</ul>
                        </div>
                        
                    </div>
                </Col>
            </Row>
            <Modal show={this.state.show} onHide={this.hide}>
					<Modal.Header closeButton>
						<Modal.Title>Copy Link and Share</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<form>
								<div className="form-group">
									<input type="text" name="name" defaultValue={this.state.name} className="form-control" />
								</div>
							</form>
						</div>
					</Modal.Body>
				</Modal>
        </Container>
    }
    </section>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		state_course_by_id: state.state_course_by_id,
		state_get_carts_by_user_course_id: state.state_get_carts_by_user_course_id,
		state_get_wishlist_by_user_course_id: state.state_get_wishlist_by_user_course_id
	}
}
export default connect(mapStateToProps, {gerCourseById, getCartByUserCourseId, getWishlistsByUserCourseId}) (Coursedetail);
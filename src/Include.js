import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux';
import { getApprovedData, getApprovedDataAff } from './store/action/action';

class Header extends Component{
	constructor(props){
		super(props);
		this.state = {
			loader: false,
			status: 0
		}
	}
	async componentDidMount(){
		await this.props.getApprovedData()
		await this.props.getApprovedDataAff()
	}
	render(){
	return(
		<header id="header">
			<Container>
				<div className="headerLinks">
					<div id="logo">
						<img src="http://e-shopping.ga/c4projects/wp-content/uploads/2020/07/cropped-new-c4project-logo-1.png" alt="Logo" />
					</div>
					<div id="gNavi">
						<nav>
							<ul>
								<li className="active">
									<Link to="/">Home</Link>
								</li>
								<li>
									<Link to="#">Blog</Link>
								</li>
								<li>
									<Link to="#">Forum</Link>
								</li>
								<li>
									<Link to={`/mentor/${localStorage.getItem('user_id')}`}>Mentorship</Link>
								</li>
								<li>
									<Link to="/programs/">Programs</Link>
								</li>
								<li>
									<Link to="#">About Us</Link>
								</li>
								<li>
									<Link to="#" className="drop">
										<i className="fa fa-user"></i>
									</Link>
									<ul className="dropDown">
										<li>
											<Link to="#">Profile</Link>
										</li>
										<li>
											<Link to="#">My Account</Link>
										</li>
										<li>
											<Link to="#">Contact Us</Link>
										</li>
										<li>
											<Link to={ this.props.state_user_approveds === undefined || this.props.state_user_approveds.length === 0 ? "/mentorpolicy" : this.props.state_user_approveds[0].status === 0 ? '/approved' : this.props.state_user_approveds[0].status === 1 ? '/mentorprofile' : this.props.state_user_approveds[0].status === 2 ? '/deny' : null }>{this.props.state_user_approveds === undefined || this.props.state_user_approveds.length === 0 ? "Register as a Mentor" : this.props.state_user_approveds[0].status === 1 ? 'Mentor Profile' : 'Register as a Mentor'}</Link>	
										</li>
										{ localStorage.getItem('user_roll') === 'Mentor' ? 
										null
										:
										<li>
											<Link to={ this.props.get_aff_approved_data === undefined || this.props.get_aff_approved_data.length === 0 ? "/affiliatepolicy" : this.props.get_aff_approved_data[0].status === 0 ? '/approved' : this.props.get_aff_approved_data[0].status === 1 ? '/affiliatprofile' : this.props.get_aff_approved_data[0].status === 2 ? '/deny' : null }>{this.props.get_aff_approved_data === undefined || this.props.get_aff_approved_data.length === 0 ? "Register as an Affiliate" : this.props.get_aff_approved_data[0].status === 1 ? 'Affiliate Profile' : 'Register as an Affiliate'}</Link>
										</li>
										}
										<li>
											<Link to="/wishlist">Wishlist</Link>
										</li>
										<li>
											<Link to="/cart">Cart</Link>
										</li>
										<li>
											<Link to="#">Logout</Link>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</Container>
		</header>
	)
	}
}
const mapStateToProps = (state) => {
	return {
		state_user_approveds: state.state_user_approveds,
		get_aff_approved_data: state.get_aff_approved_data,
	}
}
export default connect(mapStateToProps, {getApprovedData, getApprovedDataAff}) (Header);

export const Footer = () => {
	return(
		<footer id="footer">
			<Container>
				<Row>
					<Col md={6}>
						<p className="cont">Contact us: info.c4projects@gmail.com</p>
					</Col>
					<Col md={6}>
						<ul className="social">
							<li><Link to="https://www.instagram.com/thedevelopersrepublic/"><i className="fa fa-instagram"></i></Link></li>
							<li><Link to="#"><i className="fa fa-facebook"></i></Link></li>
							<li><Link to="#"><i className="fa fa-whatsapp"></i></Link></li>
							<li><Link to="#"><i className="fa fa-linkedin"></i></Link></li>
						</ul>
					</Col>
				</Row>
				<p className="copy">Copyright &copy; All rights reserved</p>
			</Container>
		</footer>
	)
}

export function Programside (props) {
	return(
		<div className="courseTab">
	
			<div className="profileCard">
				<img src="https://196034-584727-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2018/10/Front-End-developer-profile-picture.jpg" alt="user" className="profilePhoto" />
				<h5>{localStorage.getItem('name')}</h5>
			</div>
			<div className="sideList">
				<ul>
					<li>
						<Link to={`/progrmcuriculm/${props.courseid}`}><i className="fa fa-users usersCl"></i>Curriculum</Link>
					</li>
					<li>
						<Link to={`/progrmtaskicul/${props.courseid}`}><i className="fa fa-tasks tastCl"></i>Task</Link>
					</li>
					<li>
						<Link to={`/chats/${props.courseid}`}><i className="fa fa-comments chatCl"></i>Chat</Link>
					</li>
					<li>
						<Link to={`/progrmfileculu/${props.courseid}`}><i className="fa fa-file-text filesCl"></i>Files</Link>
					</li>
					<li>
						<Link to={`/projectsubmitu/${props.courseid}`}><i className="fa fa-file projectCl"></i>Projects</Link>
					</li>
					<li>
						<Link to={`/certificatesub/${props.courseid}`}><i className="fa fa-file usersCl"></i>Certificate</Link>
					</li>
					{/*<li>
						<Link to="#"><i className="fa fa-file-o certiCl"></i>Download Course Data</Link>
					</li>*/}
					<li>
						<Link to={`/reportmentee/${props.courseid}`}><i className="fa fa fa-flag filesCl	"></i>Report</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MentorSide extends Component{
	render(){
		return(
			<div className="courseTab">
		
				<div className="profileCard">
					<img src="https://196034-584727-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2018/10/Front-End-developer-profile-picture.jpg" alt="user" className="profilePhoto" />
					<h5>{localStorage.getItem('name')}</h5>
				</div>
				<div className="sideList">
					<ul>
						<li>
							<Link to={`/mentortask/${this.props.link}`}><i className="fa fa-tasks tastCl"></i>Task</Link>
						</li>
						<li>
							<Link to={`/students/${this.props.link}`}><i className="fa fa-users usersCl"></i>Student</Link>
						</li>
						<li>
							<Link to={`/chatgroup/${this.props.link}`}><i className="fa fa-comments chatCl"></i>Chat</Link>
						</li>
						<li>
							<Link to={`/filesupload/${this.props.link}`}><i className="fa fa-file-text filesCl"></i>Files</Link>
						</li>
						<li>
							<Link to={`/mentorproject/${this.props.link}`}><i className="fa fa-file projectCl"></i>Projects</Link>
						</li>
						<li>
							<Link to={`/reportmentor/${this.props.link}`}><i className="fa fa fa-flag filesCl"></i>Report</Link>
						</li>
					</ul>
				</div>
			</div>
			)
	}
}
export default MentorSide;
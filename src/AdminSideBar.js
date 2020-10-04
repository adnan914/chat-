import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AdminSideBar extends Component{
	render(){
	return(
		<aside className="adminSide">
			<div className="adminLogo">
				<img src="http://e-shopping.ga/c4projects/wp-content/uploads/2020/07/cropped-new-c4project-logo-1.png" alt="Logo" />
				<h3>Admin Name</h3>
			</div>
			<div className="navList">
				<ul>
					<li>
						<Link to="/admin/dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/admin/mentorapproveques">Mentor Register Question</Link>
					</li>
					<li>
						<Link to="/admin/uerapprovelist">Mentor Approval List</Link>
					</li>
					<li>
						<Link to="/admin/affiliatregisterquestion">Affilliat Register Question</Link>
					</li>
					<li>
						<Link to="/admin/affiliatapproveList">Affilliat Approval List</Link>
					</li>
					<li>
						<Link to="/admin/courseapprovelist">Course Approval List</Link>
					</li>
					<li>
						<Link to="/admin/coursebatches">Course Batches</Link>
					</li>
					<li>
						<Link to="/admin/mentorpayment">Mentor Payment</Link>
					</li>
					<li>
						<Link to="/admin/affiliatepayment">Affiliate Payment</Link>
					</li>
					<li>
						<Link to="/admin/variablecontrol">Variable Control</Link>
					</li>
					<li>
						<Link to="/admin/temlatescoupons">Temlates &amp; Coupons</Link>
					</li>
					<li>
						<Link to="/admin/genratecertificate">Genrate Certificate</Link>
					</li>
					<li>
						<Link to="/admin/reports">Reports</Link>
					</li>
				</ul>
			</div>
		</aside>
		)
	}
}

export default AdminSideBar;

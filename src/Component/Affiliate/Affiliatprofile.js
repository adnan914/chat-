import React, { Component } from 'react';
import { Container, Row, Col,  Tabs, Tab, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Affiliatprofile extends Component {
	render(){
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<div className="curii">
								<div className="profile">
									<div className="proImg">
										<img src="https://eshendetesia.com/images/user-profile.png" alt="Profile" />
									</div>
									<div className="proDetail">
										<h3>Mannan Qureshi</h3>
										<p>Full Stack Developer</p>
										<div className="proDe">
											<ul>
												<li>
													<h4>No. of Programs</h4>
													<span>24</span>
												</li>
												<li>
													<h4>Total Experience</h4>
													<span>2 Year</span>
												</li>
												<li>
													<h4>Total Students</h4>
													<span>24</span>
												</li>
												<li>
													<h4>Reviews &amp; Rating</h4>
													<div className="starRating">
														<i className="fa fa-star"></i>
														<i className="fa fa-star"></i>
														<i className="fa fa-star"></i>
														<i className="fa fa-star"></i>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="proTabs">
									<Tabs defaultActiveKey="curriculum" id="uncontrolled-tab-example">
										<Tab eventKey="curriculum" title="Curriculum">
											<div className="curiTable">
												<div className="text-right"><Link className="mainBtn" to="/createcurriculum">Create Curriculum</Link></div>
												<Table striped bordered hover size="sm">
													<thead>
														<tr>
															<th>Curriculum</th>
															<th>Date</th>
															<th>Duration</th>
															<th>Status</th>
															<th>Edit</th>
															<th>Shift to course</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
															<td>Waiting for approval</td>
															<td><Link to="#" className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td><Link to="#" className="btn btn-danger"><i className="fa fa-sign-out"></i></Link></td>
														</tr>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
															<td>Waiting for approval</td>
															<td><Link to="#" className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td><Link to="#" className="btn btn-danger"><i className="fa fa-sign-out"></i></Link></td>
														</tr>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
															<td>Waiting for approval</td>
															<td><Link to="#" className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td><Link to="#" className="btn btn-danger"><i className="fa fa-sign-out"></i></Link></td>
														</tr>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
															<td>Waiting for approval</td>
															<td><Link to="#" className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td><Link to="#" className="btn btn-danger"><i className="fa fa-sign-out"></i></Link></td>
														</tr>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
															<td>Waiting for approval</td>
															<td><Link to="#" className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td><Link to="#" className="btn btn-danger"><i className="fa fa-sign-out"></i></Link></td>
														</tr>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
															<td>Waiting for approval</td>
															<td><Link to="#" className="btn btn-primary"><i className="fa fa-edit"></i></Link></td>
															<td><Link to="#" className="btn btn-danger"><i className="fa fa-sign-out"></i></Link></td>
														</tr>
													</tbody>
												</Table>
											</div>
										</Tab>
										<Tab eventKey="programs" title="Programs">
											<div className="curiTable">
												<Table striped bordered hover size="sm">
													<thead>
														<tr>
															<th>Curriculum</th>
															<th>Date</th>
															<th>Duration</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>Vew.js</td>
															<td>17/02/2020</td>
															<td>4 month</td>
														</tr>
													</tbody>
												</Table>
											</div>
										</Tab>
										<Tab eventKey="payment" title="Payments">
											3
										</Tab>
										<Tab eventKey="feedback" title="Feedback">
											3
										</Tab>
									</Tabs>
								</div>



							</div>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
export default Affiliatprofile;
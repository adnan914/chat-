import React, { Component } from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Programside } from '../../Include';
import config from '../../Config/Config';

class Certificate extends Component {
	constructor(props){
		super(props);
		this.state = {
			course: [],
			loader: true,
			rating: null,
			certificate_url: ''
		}
	}
	componentDidMount(){
		fetch(`${config.base_url}/get_purchased_programs_by_course_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'users_id': localStorage.getItem('user_id'),
				'course_id': this.props.match.params.id
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			this.setState({
				course: obj[0].submit_course,
				loader: false,
				rating: obj[0].rating,
				certificate_url: obj[0].certificate_url
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		console.log(this.state.certificate_url)
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 10, offset: 1 }}>
							<div className="courseProgram">
								<Programside courseid={this.props.match.params.id} />
								<div className="courseTabDetail">
									<div className="curii">
										{this.state.loader ? null : 
											this.state.course.length === 0 || this.state.course[0] === 0 ? <p>Please Submit Final Projects</p> : 
											this.state.rating === null ? <Link to={`/review/${this.props.match.params.id}`} className="mainBtn">Request to Certificate</Link> : this.state.certificate_url === undefined ? <h3>Waiting for Certificate</h3> : <object data={`${config.base_url}/uploadspdf/${this.state.certificate_url}`} type="application/pdf" width="300" height="200"><a href={`${config.base_url}/uploadspdf/${this.state.certificate_url}`}>test.pdf</a></object>
										}

									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
export default Certificate;
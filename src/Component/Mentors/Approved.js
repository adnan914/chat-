import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux';
import { getApprovedData, getApprovedAllDataAff } from '../../store/action/action';

class Approved extends Component {
	async componentDidMount(){
		await this.props.getApprovedData()
		await this.props.getApprovedAllDataAff()
	}
	render(){
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 6, offset: 3 }}>
							<div className="curii">
								<div>
									<h3>Waiting for Approvel...</h3>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_user_approveds: state.state_user_approveds
	}
}
export default connect(mapStateToProps, {getApprovedData, getApprovedAllDataAff}) (Approved);
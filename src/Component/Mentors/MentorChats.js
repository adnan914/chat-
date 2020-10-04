import React, { Component } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import MentorSide from '../../MentorSide';
import io from 'socket.io-client'
import moment from 'moment';
import { connect } from 'react-redux';
import { getChatsByBatcheId, gerCourseById } from '../../store/action/action';
import config from '../../Config/Config';

class MentorChats extends Component {
	constructor(props){
		super(props);

		this.state = {
			chatMessage: '',
			batche_id: this.props.match.params.batchid,
			course_name: '',
			chats: []
		}
		this.increment = this.increment.bind(this);
		this.timer = this.timer.bind(this);
	}

	async componentDidMount(){
		
		let server = config.base_url;
		this.socket = io(server);
		this.socket.on("Output Chat Message", messageFromBackEnd => {
			let chats = this.state.chats
			if (messageFromBackEnd.batche_id === parseInt(this.state.batche_id)) {
				chats.push(messageFromBackEnd)
			}
			this.setState({
				chats: chats
			})
			document.querySelector('.chat-history').scrollTop = document.querySelector('.chat-history').scrollHeight
		})

			await this.props.gerCourseById(this.props.match.params.courseid)
			this.props.getChatsByBatcheId(this.state.batche_id)
			this.increment();
	}
	handleSearchChange = (e) => {
		this.setState({chatMessage: e.target.value})
	}
	timer(){
		if (this.props.state_get_chats_by_batche_id === undefined || this.props.state_course_by_id === undefined) {	
		} else {
			this.setState({
				chats: this.props.state_get_chats_by_batche_id,
				course_name: this.props.state_course_by_id[0].course_name
			})
			document.querySelector('.chat-history').scrollTop = document.querySelector('.chat-history').scrollHeight
			clearInterval(this.countdown);
		}
	}
	increment(){
		this.countdown = setInterval(this.timer, 1000);
	}
	submitChate = (e) => {
		e.preventDefault();

		let chatMessage = this.state.chatMessage;
		let userId = localStorage.getItem('user_id');
		let userName = localStorage.getItem('username');
		let nowTime = moment();
		let course_id = this.props.match.params.courseid;
		let batche_id = this.state.batche_id;
		let type = "text";

		this.socket.emit("Input Chate Message", {
			chatMessage,
			userId,
			userName,
			nowTime,
			course_id,
			batche_id,
			type
		})
		this.setState({
			chatMessage: ''
		})

	}
	render(){
		console.log(this.props.state_get_chats_by_batche_id)
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 10, offset: 1 }}>
							<div className="courseProgram">
								<MentorSide link={this.props.match.params.courseid} />
								<div className="courseTabDetail">
									<div className="curii">
										<div>
											
											<div className="chat">
												<div className="chat-header clearfix">
													<div className="chat-about">
														<div className="chat-with">{this.state.course_name}</div>
													</div>
												</div>
      
												<div className="chat-history">
													<ul>
														{this.state.chats.length === 0 ? 
															<p className="text-center">No Message</p>
														: this.state.chats.map((chatss, i) => (
														<li className="clearfix" key={i}>
															<div className={chatss.sender_id === parseInt(localStorage.getItem('user_id')) ? "message-data align-right" : "message-data" }>
																<span className="message-data-time" >{chatss.updatedAt.slice(0, 10)}</span> &nbsp; &nbsp;
																<span className="message-data-name" >{chatss.sender_id === parseInt(localStorage.getItem('user_id')) ? 'Me' : chatss.sender_name }</span> &nbsp; &nbsp;&nbsp; &nbsp;
															</div>
															<div className={chatss.sender_id === parseInt(localStorage.getItem('user_id')) ? "message other-message float-right" : "message my-message" }>
																{chatss.message}
															</div>
														</li>
														))} 
													</ul>
												</div>
												<Form onSubmit={this.submitChate} className="chat-message clearfix">
													<input type="text" name="chatMessage" value={this.state.chatMessage} placeholder ="Type your message..." onChange={this.handleSearchChange} className="form-control" />
													<br/>
													<button type="submit" className="mainBtn">Submit</button>
												</Form>
											</div>
										</div>
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
const mapStateToProps = (state) => {
	return {
		state_get_chats_by_batche_id: state.state_get_chats_by_batche_id,
		state_course_by_id: state.state_course_by_id
	}
}
export default connect(mapStateToProps, {getChatsByBatcheId, gerCourseById}) (MentorChats);
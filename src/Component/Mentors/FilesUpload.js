import React, { Component } from 'react';
import { Container, Row, Col, Table, Modal } from 'react-bootstrap';
import MentorSide from '../../MentorSide';
import {connect} from 'react-redux';
import { getFilesCourseId } from '../../store/action/action';
import config from '../../Config/Config';

class FilesUpload extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			link: '',
			show: false,
			apiUrl: '',
			notesHead: '',
			id: ''
		}
		this.notes = this.notes.bind(this);
	}
	changeHandler = (e) => this.setState({[e.target.name]: e.target.value});
	hide = () => this.setState({show: false, apiUrl: '',notesHead: ''});
	showHandler = (e,h,id) => this.setState({show: true,apiUrl: e,notesHead: h, id: id})
	async componentDidMount(){
		await this.props.getFilesCourseId(this.props.match.params.courseid)
	}
	notes(e){
		e.preventDefault();
		fetch(`${config.base_url}/${this.state.apiUrl}`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				id: this.state.id,
				user_id: localStorage.getItem('user_id'),
				course_id: this.props.match.params.courseid,
				file_name: this.state.name,
				link: this.state.link
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			if (obj.status === 'Success!!!') {
					alert('Successfully!!!')
					window.location.reload();
			}else {
				alert('Failed!!!')
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}
	render(){
		return(
			<section className="course">
				<Container>
					<Row>
						<Col md={{ span: 10, offset: 1 }}>
							<div className="courseProgram">
								<MentorSide link={this.props.match.params.courseid} />
								<div className="courseTabDetail">
									<div className="curii">
										<div className="text-right">
											<button className="mainBtn" onClick={() => this.showHandler('insert_notes', 'Add Notes', '')}>Add Notes</button>
										</div>
										<div className="text-center">
											<Table striped bordered hover size="sm">
												<thead>
													<tr>
														<th>Files</th>
														<th>Date</th>
														<th>Link</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
												{this.props.state_get_file_by_user_id_course_id === undefined || this.props.state_get_file_by_user_id_course_id.length === 0 ? 
													<tr>
														<td colSpan="4">No Notes Added</td>
													</tr>
													:
												this.props.state_get_file_by_user_id_course_id.map((files, i) => (
													<tr key={i}>
														<td>{files.file_name}</td>
														<td>{files.current_date.slice(0, 10)}</td>
														<td><a href={files.link} target="_blank" rel="noopener noreferrer" className="subBtn">Download</a></td>
														<td className="curiTable">
															<button className="btn btn-primary" onClick={() => this.showHandler('update_notes_id','Edit Notes', files._id)}><i className="fa fa-edit"></i></button>
														</td>
													</tr>
												))
												}
												</tbody>
											</Table>
										</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
				<Modal show={this.state.show} onHide={this.hide}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.notesHead}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qList">
							<form onSubmit={this.notes}>
								<div className="form-group">
									<label>File Name</label>
									<input type="text" name="name" value={this.state.name} onChange={this.changeHandler} className="form-control" required />
								</div>
								<div className="form-group">
									<label>Link</label>
									<input type="text" name="link" value={this.state.link} onChange={this.changeHandler} className="form-control" required />
								</div>
								<div>
									<button className="mainBtn" type="submit">Submit</button>
								</div>
							</form>
						</div>
					</Modal.Body>
				</Modal>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state_get_file_by_user_id_course_id: state.state_get_file_by_user_id_course_id
	}
}
export default connect(mapStateToProps, {getFilesCourseId}) (FilesUpload);
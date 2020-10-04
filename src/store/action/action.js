import actionTypes from '../constant/constant';
import config from '../../Config/Config';
//import axios from "axios";

export const getApprovedData = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_user_approved`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.STATE_USER_APPROVEDS, state_user_approveds: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}
export const getApprovedDataAff = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_aff_approved_data`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_AFF_APPROVED_DATA, get_aff_approved_data : obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

export const getApprovedAllData = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_user_approved_all`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.STATE_USER_APPROVEDS_ALL, state_user_approveds_all: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

export const getApprovedAllDataAff = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_affiliat_approved`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.STATE_AFF_APPROVEDS_ALL, state_aff_approveds_all: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

export const gerCourseByUserId = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_course_by_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'user_id': localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.STATE_COURSE_BY_USER_ID, state_course_by_user_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}
export const gerCourseById = (id) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_course_by_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				'id': id
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.STATE_COURSE_BY_ID, state_course_by_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// Get All Courses
export const getAllCourses = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_all_courses`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_ALL_COURSES, state_get_all_courses: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// Get Task By Course Id
export const getTaskByCourseId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_tasks_by_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_TAST_BY_COURSE_ID, state_task_by_course_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// Get Task By Course Id
export const getAssigmentByCourseId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_all_assigment`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			console.log(obj)
			dispatch({ type: actionTypes.GET_ASSIGMENT_BY_COURSE_ID, state_assigment_by_course_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// Get All Student
export const getAllStudent = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_student`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_ALL_STUDENT, state_get_all_student: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


export const getFilesCourseId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_files_by_user_id_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_FILES_BY_USER_ID_COURSE_ID, state_get_file_by_user_id_course_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


// Get All Carts
export const getAllSCarts = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_all_cart`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_ALL_CARTS, state_get_all_carts: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// Get Carts By User Course ID
export const getCartByUserCourseId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_cart_by_user_id_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: e,
				user_id: localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_CARTS_BY_USER_COURSE_ID, state_get_carts_by_user_course_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

//  Get Carts By User ID
export const getCartByUserId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_cart_by_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_CARTS_BY_USER_ID, state_get_carts_by_user_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// get_wishlists_by_user_course_id

export const getWishlistsByUserCourseId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_wishlists_by_user_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: e,
				user_id: localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_WISHLIST_BY_USER_COURSE_ID, state_get_wishlist_by_user_course_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

export const getWishlistByUserId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_wishlist_by_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: localStorage.getItem('user_id')
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_WISHLIST_BY_USER_ID, state_get_wishlist_by_user_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// Get All References
export const getAllReferences = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_all_references`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_ALL_REFERENCES, state_get_all_references: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


// get user by user_id
export const getUserByUserId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_user_by_user_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_USER_BY_USER_ID, state_get_user_user_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// pay_percent
export const getPercent = () => {
	return async dispatch => {
		fetch(`${config.base_url}/pay_percent`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_PERCENT, state_get_percent: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


// get_user_by_user_roll
export const getUserByUserRoll = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_user_by_user_roll`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				user_roll: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_USER_BY_USER_ROLL, state_get_user_by_user_roll: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// get_all_purchased_programs
export const getAllPurchasedPrograms = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_all_purchased_programs`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_ALL_PURCHASED_PROGRAM, state_get_all_purchased_programs: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


// get Purchased Programs By Course Id
export const getPurchasedProgramsByCourseId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_purchased_programs_by_course_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				course_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_PURCHASED_PROGRAM_BY_COURSE_ID, state_get_purchased_programs_by_course_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


// Get Reports
export const getReports = () => {
	return async dispatch => {
		fetch(`${config.base_url}/get_reports`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_REPORTS, state_get_all_reports: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// get_purchased_programs_by_mentor_id
export const getPurchasedProgramsByMentorId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_purchased_programs_by_mentor_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				mentor_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_PURCHASED_PROGRAM_BY_MENTOR_ID, state_get_purchased_programs_by_mentor_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}


// regfees
export const regFees = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/regfees`)
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_REG_FEES, state_get_reg_fees: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

// get_chats_by_batche_id
export const getChatsByBatcheId = (e) => {
	return async dispatch => {
		fetch(`${config.base_url}/get_chats_by_batche_id`,{
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				batche_id: e
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			let obj=JSON.parse(responseText);
			dispatch({ type: actionTypes.GET_CHATS_BY_BATCH_ID, state_get_chats_by_batche_id: obj })
		})
		.catch((error) => {
			console.log(error);
		});
	}
}
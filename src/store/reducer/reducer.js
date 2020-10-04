import actionTypes from '../constant/constant';

const INITIAL_STATE = {
	state_user_approveds: [],
	state_user_approveds_all: [],
	state_aff_approveds_all: [],
	state_course_by_user_id: [],
	state_course_by_id: [],
	get_aff_approved_data: [],
	state_task_by_course_id: [],
	state_assigment_by_course_id: [],
	state_get_all_student: [],
	state_get_file_by_user_id_course_id: [],
	state_get_all_carts: [],
	state_get_carts_by_user_course_id: [],
	state_get_carts_by_user_id: [],
	state_get_wishlist_by_user_course_id: [],
	state_get_wishlist_by_user_id: [],
	state_get_all_references: [],
	state_get_user_user_id: [],
	state_get_percent: [],
	state_get_user_by_user_roll: [],
	state_get_all_purchased_programs: [],
	state_get_purchased_programs_by_course_id: [],
	state_get_all_reports: [],
	state_get_purchased_programs_by_mentor_id: [],
	state_get_reg_fees: [],
	state_get_chats_by_batche_id: []
}

export default (states = INITIAL_STATE, action) => {
	switch(action.type){
		case actionTypes.STATE_USER_APPROVEDS:
			return ({
				...states,
				state_user_approveds: action.state_user_approveds,
				loader_user_approveds: false
			})
		case actionTypes.STATE_USER_APPROVEDS_ALL:
			return ({
				...states,
				state_user_approveds_all: action.state_user_approveds_all
			})
		case actionTypes.STATE_AFF_APPROVEDS_ALL:
			return ({
				...states,
				state_aff_approveds_all: action.state_aff_approveds_all
			})
		case actionTypes.STATE_COURSE_BY_USER_ID:
			return ({
				...states,
				state_course_by_user_id: action.state_course_by_user_id
			})
		case actionTypes.STATE_COURSE_BY_ID:
			return ({
				...states,
				state_course_by_id: action.state_course_by_id
			})
		case actionTypes.GET_AFF_APPROVED_DATA:
			return ({
				...states,
				get_aff_approved_data: action.get_aff_approved_data
			})
		case actionTypes.GET_ALL_COURSES:
			return ({
				...states,
				state_get_all_courses: action.state_get_all_courses
			})
		case actionTypes.GET_TAST_BY_COURSE_ID:
			return ({
				...states,
				state_task_by_course_id: action.state_task_by_course_id
			})
		case actionTypes.GET_ASSIGMENT_BY_COURSE_ID:
			return ({
				...states,
				state_assigment_by_course_id: action.state_assigment_by_course_id
			})
		case actionTypes.GET_ALL_STUDENT:
			return ({
				...states,
				state_get_all_student: action.state_get_all_student
			})
		case actionTypes.GET_FILES_BY_USER_ID_COURSE_ID:
			return ({
				...states,
				state_get_file_by_user_id_course_id: action.state_get_file_by_user_id_course_id
			})
		case actionTypes.GET_ALL_CARTS:
			return ({
				...states,
				state_get_all_carts: action.state_get_all_carts
			})
		case actionTypes.GET_CARTS_BY_USER_COURSE_ID:
			return ({
				...states,
				state_get_carts_by_user_course_id: action.state_get_carts_by_user_course_id
			})
		case actionTypes.GET_CARTS_BY_USER_ID:
			return ({
				...states,
				state_get_carts_by_user_id: action.state_get_carts_by_user_id
			})
		case actionTypes.GET_WISHLIST_BY_USER_COURSE_ID:
			return ({
				...states,
				state_get_wishlist_by_user_course_id: action.state_get_wishlist_by_user_course_id
			})
		case actionTypes.GET_WISHLIST_BY_USER_ID:
			return ({
				...states,
				state_get_wishlist_by_user_id: action.state_get_wishlist_by_user_id
			})
		case actionTypes.GET_ALL_REFERENCES:
			return ({
				...states,
				state_get_all_references: action.state_get_all_references
			})
		case actionTypes.GET_USER_BY_USER_ID:
			return ({
				...states,
				state_get_user_user_id: action.state_get_user_user_id
			})
		case actionTypes.GET_PERCENT:
			return ({
				...states,
				state_get_percent: action.state_get_percent
			})
		case actionTypes.GET_USER_BY_USER_ROLL:
			return ({
				...states,
				state_get_user_by_user_roll: action.state_get_user_by_user_roll
			})
		case actionTypes.GET_ALL_PURCHASED_PROGRAM:
			return ({
				...states,
				state_get_all_purchased_programs: action.state_get_all_purchased_programs
			})
		case actionTypes.GET_PURCHASED_PROGRAM_BY_COURSE_ID:
			return ({
				...states,
				state_get_purchased_programs_by_course_id: action.state_get_purchased_programs_by_course_id
			})
		case actionTypes.GET_REPORTS:
			return ({
				...states,
				state_get_all_reports: action.state_get_all_reports
			})
		case actionTypes.GET_PURCHASED_PROGRAM_BY_MENTOR_ID:
			return ({
				...states,
				state_get_purchased_programs_by_mentor_id: action.state_get_purchased_programs_by_mentor_id
			})
		case actionTypes.GET_REG_FEES:
			return ({
				...states,
				state_get_reg_fees: action.state_get_reg_fees
			})
		case actionTypes.GET_CHATS_BY_BATCH_ID:
			return ({
				...states,
				state_get_chats_by_batche_id: action.state_get_chats_by_batche_id
			})
		default:
			return states;
	}
}

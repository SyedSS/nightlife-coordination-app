
import { combineReducers } from 'redux'

import { SEARCH_SUBMITTED, SEARCH_FAILED, HANDLE_SEARCH_RESULTS } from '../actions/yelp'

const defaultState = {
	isSearching: false,
	data: [],
	attendance: []
}

const yelp = (state = defaultState, action) => {

	switch(action.type) {
		
		case SEARCH_SUBMITTED:
			return Object.assign({}, state, {
				isSearching: true,
				data: [],
				attendance: []
			});

		case SEARCH_FAILED:
			return Object.assign({}, state, {
				isSearching: false,
				data: [],
				attendance: []
			});
		
		case HANDLE_SEARCH_RESULTS:
			return Object.assign({}, state, {
				isSearching: false,
				data: action.data,
				attendance: action.attendance
			});
		
		default:
			return state
	}

}

export default yelp;

import { combineReducers } from 'redux'

import { SEARCH_SUBMITTED, HANDLE_SEARCH_RESULTS } from '../actions/yelp'

const defaultState = {
	isSearching: false,
	data: []
}

const yelp = (state = defaultState, action) => {

	switch(action.type) {
		
		case SEARCH_SUBMITTED:
			return Object.assign({}, state, {
				isSearching: true,
				data: []
			});
		
		case HANDLE_SEARCH_RESULTS:
			console.log('action data:', action.data);
			return Object.assign({}, state, {
				isSearching: false,
				data: action.data
			});
		
		default:
			return state
	}

}

export default yelp;

import axios from 'axios'

export const SEARCH_SUBMITTED = 'SEARCH_SUBMITTED'
export const HANDLE_SEARCH_RESULTS = 'HANDLE_SEARCH_RESULTS'

export function handleSearchResults(results) {
	return {
		type: HANDLE_SEARCH_RESULTS,
		data: results.data,
		attendance: results.attendance
	}
}

export function submitSearch() {
	return {
		type: SEARCH_SUBMITTED
	}
}

export function searchYelp(query) {
	return dispatch => 	{
		// save user's search in local storage
		localStorage.setItem('nightlife', query);
		dispatch(submitSearch());
		return axios.post('/api/yelp', { query: query }).then ( (response) => {
			dispatch(handleSearchResults(response.data));
		});
	}
}

export function attendBar(data) {
	return dispatch => {
		axios.post('/api/attend', data).then( (response) => {
			dispatch(searchYelp(data.location));
		}).catch(error => alert(error.response.data));
	}
}
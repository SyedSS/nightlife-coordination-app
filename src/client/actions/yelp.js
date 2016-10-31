
import axios from 'axios'

export const SEARCH_SUBMITTED = 'SEARCH_SUBMITTED'
export const HANDLE_SEARCH_RESULTS = 'HANDLE_SEARCH_RESULTS'

export function handleSearchResults(results) {
	return {
		type: HANDLE_SEARCH_RESULTS,
		data: results
	}
}

export function submitSearch() {
	return {
		type: SEARCH_SUBMITTED
	}
}

export function searchYelp(query) {
	return dispatch => 	{
		dispatch(submitSearch());
		return axios.post('/api/yelp', {query: query}).then ( (response) => {
			console.log('Data received on client:', response.data);
			dispatch(handleSearchResults(response.data));
		});
	}
}
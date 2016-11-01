import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'

import { searchYelp, attendBar } from '../actions/yelp'

import barStyles from '../theme/bar.scss'

@connect(
	state => ({
		isAuthenticated: state.auth.isAuthenticated,
		searchResults: state.yelp.data,
		currentAttendance: state.yelp.attendance
	}),
	dispatch => ({
		searchYelp: bindActionCreators(searchYelp, dispatch),
		submitAttendance: bindActionCreators(attendBar, dispatch)
	})
)
class Nightlife extends React.Component {
	static propTypes = {
		isAuthenticated: React.PropTypes.bool.isRequired,
		searchResults: React.PropTypes.array.isRequired,
		currentAttendance: React.PropTypes.array.isRequired,
		searchYelp: React.PropTypes.func.isRequired
	}
	componentWillMount() {
		if (this.props.searchResults.length === 0 && localStorage.getItem('nightlife')) {
			this.props.searchYelp(localStorage.getItem('nightlife'));
		}
		window.addEventListener('keypress', this.handleKeypress);
	}
	constructor(props) {
    super(props);
    this.state = {
    	query: ''
    }
    this.attend = this.attend.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
  }
  handleKeypress(event) { if (event.keyCode === 13) { this.submit() }}
  handleChange(event) {
  	this.setState({
  		query: event.target.value
  	})
  }
  attend(bar_id) {
  	const data = {
  		bar_id,
  		user_id: localStorage.getItem('user_id'),
  		token: localStorage.getItem('id_token'),
  		location: localStorage.getItem('nightlife')
  	}
  	this.props.submitAttendance(data);
  }
  submit() {
  	const { query } = this.state;
  	if (query !== '') { this.props.searchYelp(query) }
  }
 	render() {
 		const attendees = this.props.currentAttendance.slice();
 		function countAttendees(barID) {
 			for (let i = 0; i < attendees.length; i++) {
 				if (attendees[i].id === barID) {
 					return attendees[i].attendees.length;
 				}
 			}
 			return 0;
 		}
 		function checkAttending(barID) {
 			for (let i = 0; i < attendees.length; i++) {
 				if (attendees[i].id === barID) {
 					for (let j = 0; j < attendees[i].attendees.length; j++) {
 						if (attendees[i].attendees[j] === localStorage.getItem('user_id')) {
 						 return true;
 						}
 					}
 				}
 			}
 			return false;	
 		}
 		const renderResults = this.props.searchResults.map( (bar, idx) => {
 			return (
 				<div key = {idx} className = "barWrapper">
 					<h1>{bar.name}</h1>
 					<img src={bar.image_url} alt={bar.name + ' Yelp Image'}/>
 					<p>{bar.snippet_text}</p>
 					<div className = 'attendance attendBlock'>
 						<p>{countAttendees(bar.id)} Going Tonight</p>
 					</div>
 					<div className = 'userAttendance attendBlock' onClick = {this.attend.bind(this, bar.id)}>
 						<p>{ checkAttending(bar.id) ? 'You are attending!' : 'Do you want to go?' }</p>
 					</div>
 				</div>
 			);
 		});
 		return (
		  <div className = 'nightlifeWrapper'>
		    { !this.props.isAuthenticated && <h1>Welcome to the Free Code Camp Nightlife Coordination App</h1> }

		    { !this.props.isAuthenticated && <div>
		    	<h3>Please <Link to = '/login'>login</Link> or <Link to = '/signup'>sign up</Link> to record your attendance to local bars.</h3>
		    </div> }

					<div>
						<input
							autoFocus
							type = 'text'
							className = 'searchBars'
							placeholder = 'Type your city to search for local bars'
							value = {this.state.query}
							onChange = {this.handleChange} />
						<button onClick = {this.submit}>Submit</button>
					</div>

					{ this.props.isAuthenticated && this.props.searchResults.length > 0 &&
						<h2>Welcome {localStorage.getItem('user')}, here are the results for local bars <strong>{localStorage.getItem('nightlife')}</strong>.
						To change locations, submit a new search.</h2> }

					{ localStorage.getItem('nightlife') && this.props.searchResults.length === 0 && 
						<h2>Searching...</h2>}

					{ localStorage.getItem('nightlife') && this.props.searchResults.length > 0 && !this.props.isAuthenticated &&
						<h2>Here are the results for local bars in <strong>{localStorage.getItem('nightlife')}</strong>. To change locations, submit a new search.</h2> }

					{ this.props.searchResults.length > 0 && <div className = 'barContainer'>
						{renderResults}
					</div> }

		  </div>
	  );
 	}
}
export default Nightlife;

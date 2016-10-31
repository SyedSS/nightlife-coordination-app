import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'

import { searchYelp } from '../actions/yelp'

@connect(
	state => ({
		isAuthenticated: state.auth.isAuthenticated,
		searchResults: state.yelp.data
	}),
	dispatch => ({
		searchYelp: bindActionCreators(searchYelp, dispatch)
	})
)
class Nightlife extends React.Component {
	static propTypes = {
		isAuthenticated: React.PropTypes.bool.isRequired,
		searchResults: React.PropTypes.array.isRequired,
		searchYelp: React.PropTypes.func.isRequired
	}
	componentWillMount() {
		if (this.props.searchResults.length === 0 && localStorage.getItem('nightlife')) {
			this.props.searchYelp(localStorage.getItem('nightlife'));
		}
		window.addEventListener('keypress', this.handleKeypress)
	}
	constructor(props) {
    super(props);
    this.state = {
    	query: ''
    }
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
  submit() {
  	const { query } = this.state;
  	if (query !== '') { this.props.searchYelp(query) }
  }
 	render() {
 		const renderResults = this.props.searchResults.map( (bar, idx) => {
 			return (
 				<div key = {idx}>
 					<h1>{bar.name}</h1>
 					<img src={bar.image_url} alt={bar.name + ' Yelp Image'}/>
 					<p>{bar.phone}</p>
 					<p>{bar.snippet_text}</p>
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

					{ this.props.isAuthenticated &&
						<h2>Welcome {localStorage.getItem('user')}, here are the results for {localStorage.getItem('nightlife')}.
						To change locations, submit a new search.</h2> }

					{ localStorage.getItem('nightlife') &&
						<h2>Here are the results of your last search. To change locations, submit a new search.</h2> }

					{ this.props.searchResults.length > 0 && <div>
						{renderResults}
					</div> }

		  </div>
	  );
 	}
}
export default Nightlife;

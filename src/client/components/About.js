import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'

import { searchYelp } from '../actions/yelp'

@connect(
	state => ({
		isAuthenticated: state.auth.isAuthenticated,
		searchResults: state.yelp.data.data
	}),
	dispatch => ({
		searchYelp: bindActionCreators(searchYelp, dispatch)
	})
)
class About extends React.Component {
	static propTypes = {
		isAuthenticated: React.PropTypes.bool.isRequired,
		searchYelp: React.PropTypes.func.isRequired
	}
	componentWillMount() { window.addEventListener('keypress', this.handleKeypress) }
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
 		return (
		  <div className = 'aboutWrapper'>
		    <h1>Welcome to the Free Code Camp Nightlife Coordination App</h1>

		    { !this.props.isAuthenticated && <div>
		    	<h3>Please <Link to = '/login'>login</Link> or <Link to = '/signup'>sign up</Link> to view local bars in your area and mark that you are attending.</h3>
		    </div> }

				{ this.props.isAuthenticated && <div>
					<h2>Welcome {localStorage.getItem('user')}</h2>
					<p>This voting app allows you to create polls and share them with your friends.
							You can add and delete polls, and add new options to polls if you want.
							Anyone can vote, but you must create an account to add new polls. Have fun! <i className = "em em-smile"></i>
					</p>
					<h3 className = 'credits'><a target = "_blank" href = "https://github.com/bonham000/voting-app">View the source on GitHub</a></h3>
					<h3 className = 'credits'>This app was created with React and Redux and is a <a target = "_blank" href = "https://www.freecodecamp.com/challenges/build-a-voting-app">project for Free Code Camp</a>.</h3>
					</div> }

					{ this.props.searchResults.length > 0 ? <div>
						{JSON.stringify(this.props.searchResults)}
					</div> : <div>
						<input
							autoFocus
							type = 'text'
							className = 'searchBars'
							placeholder = 'Type your city to search for local bars'
							value = {this.state.query}
							onChange = {this.handleChange} />
						<button onClick = {this.submit}>Submit</button>
					</div> }

		  </div>
	  );
 	}
}
export default About;

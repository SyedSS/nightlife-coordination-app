import React from 'react'

class About extends React.Component {
	render() {
		return (
			<div className = "aboutWrapper">
				<h1>About the Nightlife Coordination App</h1>
				<h3 className = 'credits'>This <a target = "_blank" href = "https://www.freecodecamp.com/challenges/build-a-nightlife-coordination-app">Free Code Camp Project</a> is a single-page React/Redux app created with Node and Express on the back end.</h3>
				<h3 className = 'credits'><a target = "_blank" href = "https://github.com/bonham000/nightlife-coordination-app">View the source on GitHub</a></h3>
			</div>
		);
	}
};

export default About;
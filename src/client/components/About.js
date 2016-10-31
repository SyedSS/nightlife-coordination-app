import React from 'react'

class About extends React.Component {
	render() {
		return (
			<div className = "aboutWrapper">
				<h1>About the Nightlife Coordination App</h1>
				<h3 className = 'credits'>This <a target = "_blank" href = "https://www.freecodecamp.com/challenges/build-a-nightlife-coordination-app">Free Code Camp Project</a> was created with React and Redux.</h3>
				<h3 className = 'credits'><a target = "_blank" href = "https://github.com/bonham000/nightlife-coordination-app">View the source on GitHub</a></h3>
			</div>
		);
	}
};

export default About;
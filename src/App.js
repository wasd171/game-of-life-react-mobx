import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import Card from 'material-ui/Card'
import styled from 'styled-components'
import Field from './Field'
import Controls from './Controls'


const GameContainer = styled.div`
	max-width: 35em;
	margin: auto;
	margin-top: 1em;
	margin-bottom: 2em;
`;

class App extends Component {
	render() {
		return (
			<div>
				<AppBar title="Game of Life" showMenuIconButton={false}/>
				<GameContainer>
					<Card>
						<Field/>
						<Controls/>
					</Card>
				</GameContainer>
			</div>
		)
	}
}

export default App
import React, {Component} from 'react'
import {CardActions, SelectField, MenuItem, RaisedButton} from 'material-ui'
import {AvPlayCircleOutline, AvPauseCircleOutline, NavigationCancel} from 'material-ui/svg-icons'
import {inject, observer} from 'mobx-react'


@inject('store')
@observer
class Controls extends Component {
	handleIntervalChange = (event, index, value) => {
		this.props.store.setInterval(index);
	};

	handleSizeChange = (event, index, value) => {
		this.props.store.setSize(index);
	};

	render() {
		const {intervals, interval, sizes, size, gameIsRunning, resetCells, startGame, stopGame} = this.props.store;

		return (
			<div>
				<CardActions>
					<SelectField
						floatingLabelText="Refresh rate, ms"
						value={interval}
						onChange={this.handleIntervalChange}
						disabled={gameIsRunning}
					>
						{intervals.map(interval => (
							<MenuItem key={interval} value={interval} primaryText={interval}/>
						))}
					</SelectField>
					<SelectField
						floatingLabelText="Field size"
						value={size}
						onChange={this.handleSizeChange}
						disabled={gameIsRunning}
					>
						{sizes.map(size => {
							const text = `${size}x${size}`;
							return <MenuItem key={size} value={size} primaryText={text}/>
						})}
					</SelectField>
				</CardActions>
				<CardActions>
					<RaisedButton
						label="Play"
						labelPosition="after"
						primary={true}
						icon={<AvPlayCircleOutline/>}
						disabled={gameIsRunning}
						onTouchTap={startGame}
					/>
					<RaisedButton
						label="Pause"
						labelPosition="after"
						secondary={true}
						icon={<AvPauseCircleOutline/>}
						disabled={!gameIsRunning}
						onTouchTap={stopGame}
					/>
					<RaisedButton
						label="Reset"
						labelPosition="after"
						icon={<NavigationCancel/>}
						disabled={gameIsRunning}
						onTouchTap={resetCells}
					/>
				</CardActions>
			</div>
		)
	}
}

export default Controls
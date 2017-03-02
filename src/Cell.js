import React, {Component} from 'react'
import {reaction} from 'mobx'
import {inject} from 'mobx-react'
import {white, green500} from 'material-ui/styles/colors'
import {ALIVE} from './constants'
import {Rect} from 'react-konva'


@inject('store')
class Cell extends Component {
	disposer;
	cell;

	cellRef = (el) => {
		if (!this.cell) {
			this.cell = el;
		}
	};

	handleClick = () => {
		if (!this.props.store.gameIsRunning) {
			this.props.store.toggleCell(this.props.cellKey);
		}
	};

	componentDidMount() {
		this.disposer = reaction(
			() => this.props.store.cells.get(this.props.cellKey),
			(status) => {
				if (status === ALIVE) {
					this.cell.fill(green500);
				} else {
					this.cell.fill(white);
				}
				this.cell.draw();
			}
		)
	}

	componentWillUnmount() {
		this.disposer();
		this.disposer = null;
	}

	render() {
		return (
			<Rect
				width={this.props.cellSize}
				height={this.props.cellSize}
				x={this.props.x*this.props.cellSize}
				y={this.props.y*this.props.cellSize}
				fill={white}
				onClick={this.handleClick}
				ref={this.cellRef}
			/>
		)
	}
}

export default Cell;
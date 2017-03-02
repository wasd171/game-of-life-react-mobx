import React, {Component} from 'react'
import styled from 'styled-components'
import muiThemeable from 'material-ui/styles/muiThemeable'
import {observable, action, computed} from 'mobx'
import {inject, observer} from 'mobx-react'
import Cell from './Cell'
import {Stage, Layer, Group, Line} from 'react-konva'


const CellsContainer = styled.div`
	padding: 8px;
	max-width: 100%;
`;

const CellsWrapper = styled.div`
	width: 100%;
	height: ${props => props.height}px;
`;

@inject('store')
@muiThemeable()
@observer
class Field extends Component {
	wrapper;
	@observable width = 0;

	@computed get cellSize() {
		return this.width / this.props.store.size;
	}

	wrapperRef = (el) => {
		if (!this.wrapper) {
			this.wrapper = el;
		}
	};

	renderCell = (arr, x, y) => {
		const key = this.props.store.getCellKey(x, y);
		arr.push(
			<Group key={key}>
				<Cell cellKey={key} size={this.props.store.size} x={x} y={y} cellSize={this.cellSize}/>
			</Group>
		)
	};

	renderCells = () => {
		const {iterateCells} = this.props.store;
		const cellComponents = [];
		iterateCells(this.renderCell.bind(this, cellComponents));

		return cellComponents
	};

	renderLine = (arr, x, y) => {
		const color = this.props.muiTheme.palette.borderColor;
		if (x === 0 && y === 0) {
			arr.push(
				<Line stroke={color} strokeWidth={1} points={[0, 0, 0, this.width]} key={`${x}-v`}/>,
				<Line stroke={color} strokeWidth={1} points={[0, 0, this.width, 0]} key={`${y}-h`}/>,
				<Line stroke={color} strokeWidth={1} points={[this.width, 0, this.width, this.width]} key={`last-v`}/>,
				<Line stroke={color} strokeWidth={1} points={[0, this.width, this.width, this.width]} key={`last-h`}/>
			)
		} else if (x === 0) {
			arr.push(
				<Line
					stroke={color}
					strokeWidth={1}
					points={[0, y*this.cellSize, this.width, y*this.cellSize]}
					key={`${y}-h`}
				/>
			)
		} else if (y === 0) {
			arr.push(
				<Line
					stroke={color}
					strokeWidth={1}
					points={[x*this.cellSize, 0, x*this.cellSize, this.width]}
					key={`${x}-v`}
				/>
			)
		}
	};

	renderLines = () => {
		const {iterateCells} = this.props.store;
		const lineComponents = [];
		iterateCells(this.renderLine.bind(this, lineComponents));

		return lineComponents
	};

	renderContent = () => ([
		<Layer key="cells">
			{this.renderCells()}
		</Layer>,
		<Layer key="lines">
			{this.renderLines()}
		</Layer>
	]);

	@action.bound setWidth() {
		this.width = this.wrapper.offsetWidth;
	}

	componentDidMount() {
		this.setWidth();
		window.addEventListener('resize', this.setWidth);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.setWidth);
	}

	render() {
		return (
			<CellsContainer>
				<CellsWrapper innerRef={this.wrapperRef} height={this.width}>
					<Stage width={this.width} height={this.width}>
						{this.width !== 0 && this.renderContent()}
					</Stage>
				</CellsWrapper>
			</CellsContainer>
		)
	}
}

export default Field
import React, {Component} from 'react'
import styled from 'styled-components'
import {inject, observer} from 'mobx-react'
import Cell from './Cell'


const CellsContainer = styled.div`
	padding: 8px;
`;

const CellsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

@inject('store')
@observer
class Field extends Component {
	renderCell = (arr, x, y) => {
		const key = this.props.store.getCellKey(x, y);
		arr.push(
			<Cell key={key} cellKey={key} size={this.props.store.size} x={x} y={y}/>
		)
	};

	renderCells = () => {
		const {iterateCells} = this.props.store;
		const cellComponents = [];
		iterateCells(this.renderCell.bind(this, cellComponents));

		return cellComponents
	};

	render() {
		return (
			<CellsContainer>
				<CellsWrapper>
					{this.renderCells()}
				</CellsWrapper>
			</CellsContainer>
		)
	}
}

export default Field
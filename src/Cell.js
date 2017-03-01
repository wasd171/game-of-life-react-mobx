import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import styled from 'styled-components'
import {white, green500} from 'material-ui/styles/colors'
import {ALIVE} from './constants'


const BasicCell = styled.div`
	position: relative;
	width: ${props => 100/props.size}%;
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
	&:before {
		content: "";
		cursor: pointer;
		user-select: none;
		display: block;
		padding-top: 100%;
		border-top: 1px solid ${props => props.theme.palette.borderColor};
		border-left: 1px solid ${props => props.theme.palette.borderColor};
		${props => props.x === props.size - 1 && `border-right: 1px solid ${props.theme.palette.borderColor};`}
		${props => props.y === props.size - 1 && `border-bottom: 1px solid ${props.theme.palette.borderColor};`}
		background-color: ${props => props.status === ALIVE ? green500 : white};
	}
`;

@inject('store')
@observer
class Cell extends Component {
	handleClick = () => {
		this.props.store.toggleCell(this.props.cellKey);
	};

	render() {
		const status = this.props.store.cells.get(this.props.cellKey);

		return (
			<BasicCell
				size={this.props.size}
				x={this.props.x}
				y={this.props.y}
				status={status}
				onClick={this.handleClick}
			/>
		)
	}
}

export default Cell;
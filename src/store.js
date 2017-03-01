import {observable, action, reaction, computed} from 'mobx'
import mobxUtils from 'mobx-utils'
import {ALIVE, DEAD} from './constants'


class Store {
	disposer;
	@observable gameIsRunning = false;
	@observable cells = new Map();
	possiblyChangedCells = new Set();
	possiblyChangedCellsNextTick = new Set();
	keyRegex = /^(.*)_(.*)$/;

	@observable intervals = [50, 100, 250, 500, 1000];
	@observable interval = this.intervals[2];

	@observable sizes = [15, 30, 60, 100];
	@observable size = this.sizes[0];

	@computed get range() {
		return [...new Array(this.size).keys()];
	}

	iterateCells = (func) => {
		for (let y of this.range) {
			for (let x of this.range) {
				func(x, y);
			}
		}
	};

	@action.bound setInterval(index) {
		this.interval = this.intervals[index];
	}

	@action.bound setSize(index) {
		this.size = this.sizes[index];
		this.resetCells();
	}

	getCellKey(x, y) {
		return `${x}_${y}`
	}

	@action.bound clearCell(x, y) {
		this.cells.set(this.getCellKey(x, y), DEAD);
	}

	@action.bound resetCells() {
		this.cells.clear();
		this.iterateCells(this.clearCell);
	}

	@action.bound toggleCell(key) {
		const status = this.cells.get(key);
		if (status === DEAD) {
			this.cells.set(key, ALIVE);
		} else {
			this.cells.set(key, DEAD);
		}
	}

	normalizeCoor = (coor) => {
		switch (coor) {
			case this.size:
				return 0;
			case -1:
				return this.size - 1;
			default:
				return coor;
		}
	};

	getNeighbours = (x, y) => {
		const neighbours = [];
		let cell, cellKey;

		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const normX = this.normalizeCoor(x + dx);
				const normY = this.normalizeCoor(y + dy);
				const key = this.getCellKey(normX, normY);
				neighbours.push({status: this.cells.get(key), key});
				if (dx === 0 && dy === 0) {
					cellKey = key;
					cell = this.cells.get(key);
				}
			}
		}

		return {neighbours, cell, key: cellKey};
	};


	filterChanged = (arr, x, y) => {
		const {neighbours, cell, key} = this.getNeighbours(x, y);
		const status = cell === ALIVE;
		const aliveNeighbours = neighbours.filter(neighbour => neighbour.status === ALIVE).length;
		if (!status) {
			if (aliveNeighbours === 3) {
				neighbours.forEach(neighbour => this.possiblyChangedCellsNextTick.add(neighbour.key));
				arr.push(key)
			}
		} else {
			if (!(aliveNeighbours === 4 || aliveNeighbours === 3)) {
				neighbours.forEach(neighbour => this.possiblyChangedCellsNextTick.add(neighbour.key));
				arr.push(key)
			}
		}
	};

	prepareForInitialTick = (x, y) => {
		const key = this.getCellKey(x, y);
		const cell = this.cells.get(key);
		if (cell === ALIVE) {
			const {neighbours} = this.getNeighbours(x, y);
			neighbours.forEach(neighbour => this.possiblyChangedCells.add(neighbour.key));
		}
	};

	@action.bound recalculateCells() {
		if (this.possiblyChangedCells.size === 0) {
			this.iterateCells(this.prepareForInitialTick)
		}
		const changedCells = [];

		for (let key of this.possiblyChangedCells) {
			const [, xStr, yStr] = this.keyRegex.exec(key);
			const [x, y] = [xStr, yStr].map(num => parseInt(num, 10));
			this.filterChanged(changedCells, x, y);
		}
		changedCells.forEach(this.toggleCell);
		this.possiblyChangedCells = this.possiblyChangedCellsNextTick;
		this.possiblyChangedCellsNextTick.clear();
	}

	@action.bound startGame() {
		this.gameIsRunning = true;
		this.disposer = reaction(
			() => mobxUtils.now(this.interval),
			this.recalculateCells
		)
	}

	@action.bound stopGame() {
		this.disposer();
		this.disposer = null;
		this.possiblyChangedCells.clear();
		this.possiblyChangedCellsNextTick.clear();
		this.gameIsRunning = false;
	}

	constructor() {
		this.resetCells();
	}
}

export default Store
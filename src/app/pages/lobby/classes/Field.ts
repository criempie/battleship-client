import { CellState, Coordinates, Field as Field_ } from '@battleship/common';

export class Field extends Field_ {
  constructor(size: number);
  constructor(cellStates: CellState[][]);
  constructor(sizeOrCellStates: number | CellState[][]) {
    if (typeof sizeOrCellStates === 'number') {
      const size = sizeOrCellStates;
      super(size);
    } else {
      const cellStates = sizeOrCellStates;
      const size = cellStates.length;
      super(size);

      cellStates.forEach((row, x) => {
        row.forEach((state, y) => (this.cells[x][y].state = state));
      });
    }
  }

  public setStateToCell({ x, y }: Coordinates, state: CellState) {
    this._cells[x][y].state = state;
  }
}

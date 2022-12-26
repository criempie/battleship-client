import {
  CellState,
  Coordinates,
  Field as Field_,
  MinifiedField,
} from '@battleship/common';

export class Field extends Field_ {
  constructor(size: number, minifiedField?: MinifiedField) {
    super(size);

    if (minifiedField) {
      minifiedField.forEach(({ x, y, state }) => {
        this._cells[x][y].state = state;
      });
    }
  }

  public setStateToCell({ x, y }: Coordinates, state: CellState) {
    this._cells[x][y].state = state;
  }
}

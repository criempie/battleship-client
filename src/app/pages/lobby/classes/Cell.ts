import { Cell as Cell_, CellState, Coordinates } from '@battleship/common';

export class Cell extends Cell_ {
  constructor(coords: Coordinates, state?: CellState) {
    super(coords, state);
  }
}

import { Player as Player_ } from '@battleship/common';
import { Field } from './Field';

export class Opponent extends Player_<Field> {
  constructor(id: string, field: Field) {
    super(id, field);
  }
}

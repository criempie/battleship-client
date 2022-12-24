import { Player as Player_ } from '@battleship/common';
import { Field } from './Field';

export class Player extends Player_<Field> {
  public get socketId() {
    return this._actualSocketId!;
  }

  constructor(id: Player_['id'], socketId: string, field: Field) {
    super(id, socketId, field);
  }
}

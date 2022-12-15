import { Player as Player_ } from '@battleship/common';

export class Player extends Player_ {
  constructor(id: number, socketId: string) {
    super(id, socketId);
  }
}

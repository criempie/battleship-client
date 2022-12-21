import { Player as Player_ } from '@battleship/common';

export class Player extends Player_ {
  constructor(id: Player_['id'], socketId: string) {
    super(id, socketId);
  }
}

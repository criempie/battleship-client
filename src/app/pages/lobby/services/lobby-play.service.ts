import { io, Socket } from 'socket.io-client';
import { enviroment } from 'src/envitoment/enviroment';
import {
  Cell,
  CellState,
  Coordinates,
  FireData,
  ServerEventGameLog,
  SocketFireAnswer,
  socketSettings,
} from '@battleship/common';

export class LobbyPlayService {
  public readonly lobbyId?: number;

  private _socket: Socket;
  private _playerCells: Cell[][];
  private _opponentCells: Cell[][];
  private _isMyTurn = true;

  private static _fieldSize = 10;

  constructor(private id: string | null) {
    if (id) this.lobbyId = +id;
    else {
    }

    this._playerCells = LobbyPlayService.generateClearFieldOfCells(
      LobbyPlayService._fieldSize
    );

    this._opponentCells = LobbyPlayService.generateClearFieldOfCells(
      LobbyPlayService._fieldSize
    );

    this._socket = io(`${enviroment.socketUrl}/${socketSettings.namespace}`, {
      transports: ['websocket'],
    });

    this._socket.on('connect', () => console.log('connected to socket'));
    this._socket.on('message', (m) => console.info('message from socket: ', m));
    this._socket.on('gameLog', this._gameLogEventHandler.bind(this));

    this._socket.emit(
      'joinLobby',
      JSON.stringify({ id: this.lobbyId }),
      (v: number) => console.log('connected to lobby', v)
    );
  }

  public get playerCells() {
    return this._playerCells.slice();
  }

  public get opponentCells() {
    return this._opponentCells.slice();
  }

  public fire(coords: Coordinates) {
    const data: FireData = { coords, lobbyId: this.lobbyId! };
    this._socket.emit(
      'fire',
      JSON.stringify(data),
      this._fireSocketCallback.bind(this)
    );
  }

  private _fireSocketCallback(data: SocketFireAnswer) {
    // if (data.success) {
    //   this._isMyTurn = data.isYourTurn;
    //   this._opponentCells[data.target.x][data.target.y].state = data.state;
    // }
  }

  private _gameLogEventHandler(data: ServerEventGameLog) {
    console.log(data);

    const cells =
      data.toSocketId === this._socket.id
        ? this._playerCells
        : this._opponentCells;

    cells[data.target.x][data.target.y].state = data.result;
  }

  public static generateClearFieldOfCells(size: number): Cell[][] {
    return Array(size)
      .fill(null)
      .map((_, x) =>
        Array(size)
          .fill(null)
          .map((_, y) => new Cell())
      );
  }
}

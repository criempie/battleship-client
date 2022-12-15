import { io, Socket } from 'socket.io-client';
import { enviroment } from 'src/envitoment/enviroment';
import {
  Cell,
  CellState,
  Coordinates,
  FireData,
  JoinLobbyData,
  JoinLobbyReturn,
  ServerEventGameLog,
  SocketFireAnswer,
  socketSettings,
} from '@battleship/common';
import { Player } from '../classes/Player';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export class LobbyPlayService {
  public readonly lobbyId?: number;

  private _socket: Socket;
  private _player?: Player;
  private _playerCells: Cell[][];
  private _opponentCells: Cell[][];
  private _isMyTurn = true;

  private static _fieldSize = 10;

  constructor(
    private id: string | null,
    private _cookieService: CookieService
  ) {
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

    const joinLobbyData: JoinLobbyData = {
      id: this.lobbyId!,
    };

    if (
      this._cookieService.check('playerId') &&
      this._cookieService.check('socketId')
    ) {
      joinLobbyData['player'] = {
        id: +this._cookieService.get('playerId'),
        socketId: this._cookieService.get('socketId'),
      };
    }

    this._socket.emit(
      'joinLobby',
      joinLobbyData,
      this._joinLobbySocketCallback.bind(this)
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

  private _joinLobbySocketCallback({ player, lobbyId }: JoinLobbyReturn) {
    this._player = new Player(player.id, player.socketId);

    this._cookieService.set('playerId', this._player.id.toString());
    this._cookieService.set('socketId', this._player.socketId);

    console.info(`joined to lobby ${lobbyId} as player ${player.id}`);
  }

  private _fireSocketCallback(data: SocketFireAnswer) {
    // if (data.success) {
    //   this._isMyTurn = data.isYourTurn;
    //   this._opponentCells[data.target.x][data.target.y].state = data.state;
    // }
  }

  private _gameLogEventHandler(data: ServerEventGameLog) {
    if (!this._player) return;

    const cells =
      data.toPlayer === this._player.id
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

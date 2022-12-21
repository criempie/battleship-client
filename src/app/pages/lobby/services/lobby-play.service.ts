import { io, Socket } from 'socket.io-client';
import { enviroment } from 'src/envitoment/enviroment';
import {
  Cell,
  CellState,
  ClientFireData,
  ClientJoinLobbyData,
  Coordinates,
  FireData,
  JoinLobbyData,
  JoinLobbyReturn,
  ServerEventGameLog,
  ServerFireData,
  serverLobbyEvents,
  SocketFireAnswer,
  socketSettings,
} from '@battleship/common';
import { Player } from '../classes/Player';
import { CookieService } from 'ngx-cookie-service';

export class LobbyPlayService {
  public readonly lobbyId?: string;

  private _socket: Socket;
  private _player?: Player;
  private _playerCells: Cell[][];
  private _opponentCells: Cell[][];

  private static _fieldSize = 10;

  constructor(
    private id: string | null,
    private _cookieService: CookieService
  ) {
    if (id) this.lobbyId = id;

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
        id: this._cookieService.get('playerId'),
        socketId: this._cookieService.get('socketId'),
      };
    }

    this._socket.emit(
      serverLobbyEvents.joinLobby,
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
    const data: ServerFireData = { coords, lobbyId: this.lobbyId! };
    this._socket.emit(
      serverLobbyEvents.fire,
      data,
      this._fireSocketCallback.bind(this)
    );
  }

  private _joinLobbySocketCallback(
    data: ClientJoinLobbyData | { success: false; reason?: string }
  ) {
    if ('success' in data && data.success === false) {
      console.error(data.reason);
      return;
    }

    data = data as ClientJoinLobbyData;

    this._player = new Player(data.player.id, data.player.socketId);

    this._cookieService.set('playerId', this._player.id.toString(), {
      path: `/lobby/${data.id}`,
    });
    this._cookieService.set('socketId', this._player.socketId, {
      path: `/lobby/${data.id}`,
    });

    if ('fields' in data) {
      data.fields!.forEach((field) => {
        if (field.owner === this._player?.id) {
          this._playerCells = LobbyPlayService.formatFieldFromSocket(
            field.field
          );
        } else {
          this._opponentCells = LobbyPlayService.formatFieldFromSocket(
            field.field
          );
        }
      });
    }

    console.info(`joined to lobby ${data.id} as player ${data.player.id}`);
  }

  private _fireSocketCallback(data: ClientFireData) {
    if (!data.success) {
      console.error(data.reason);
    }
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

  public static formatFieldFromSocket(field: CellState[][]) {
    return field.map((row) => row.map((cellState) => new Cell(cellState)));
  }
}

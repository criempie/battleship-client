import { io, Socket } from 'socket.io-client';
import { enviroment } from 'src/envitoment/enviroment';
import {
  Cell,
  CellState,
  ClientFireData,
  ClientJoinLobbyData,
  Coordinates,
  JoinLobbyData,
  ServerEventGameLog,
  ServerFireData,
  ServerJoinLobbyData,
  clientLobbyEvents,
  ServerGameLogData,
  socketSettings,
  serverLobbyEvents,
  ServerLobbyLogData,
  LobbyLogTypes,
} from '@battleship/common';
import { Player } from '../classes/Player';
import { CookieService } from 'ngx-cookie-service';
import { Field } from '../classes/Field';
import { Opponent } from '../classes/Opponent';

export class LobbyPlayService {
  public readonly lobbyId?: string;

  private _socket: Socket;
  private _player?: Player;
  private _opponent?: Opponent;

  private static _fieldSize = 10;

  constructor(
    private id: string | null,
    private _cookieService: CookieService
  ) {
    if (id) this.lobbyId = id;

    this._socket = io(`${enviroment.socketUrl}/${socketSettings.namespace}`, {
      transports: ['websocket'],
    });

    this._socket.on('connect', () => console.log('connected to socket'));
    this._socket.on('message', (m) => console.info('message from socket: ', m));
    this._socket.on(
      serverLobbyEvents.gameLog,
      this._gameLogEventHandler.bind(this)
    );
    this._socket.on(
      serverLobbyEvents.lobbyLog,
      this._lobbyLogEventHandler.bind(this)
    );

    const joinLobbyData: ServerJoinLobbyData = {
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
      clientLobbyEvents.joinLobby,
      joinLobbyData,
      this._joinLobbySocketCallback.bind(this)
    );
  }

  public get playerCells() {
    return this._player?.field.cells ?? [];
  }

  public get opponentCells() {
    return this._opponent?.field.cells ?? [];
  }

  public fire(coords: Coordinates) {
    const data: ServerFireData = { coords, lobbyId: this.lobbyId! };
    this._socket.emit(
      clientLobbyEvents.fire,
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

    this._player = new Player(
      data.player.id,
      data.player.socketId,
      new Field(data.player.field)
    );

    this._cookieService.set('playerId', this._player.id.toString(), {
      path: `/lobby/${data.id}`,
    });
    this._cookieService.set('socketId', this._player.socketId, {
      path: `/lobby/${data.id}`,
    });

    if (data.otherPlayers.length > 0) {
      this._opponent = new Opponent(
        data.otherPlayers[0].id,
        new Field(data.otherPlayers[0].field)
      );
    }

    console.info(`joined to lobby ${data.id} as player ${data.player.id}`);
  }

  private _fireSocketCallback(data: ClientFireData) {
    if (!data.success) {
      console.error(data.reason);
    }
  }

  private _gameLogEventHandler(data: ServerGameLogData) {
    if (!this._player || !this._opponent) return;

    if (data.toPlayer === this._player.id) {
      this._player.field.setStateToCell(data.target, data.result);
    } else if (data.toPlayer === this._opponent.id) {
      this._opponent.field.setStateToCell(data.target, data.result);
    }
  }

  private _lobbyLogEventHandler(data: ServerLobbyLogData) {
    console.log(data);

    if (data.type === LobbyLogTypes.playerJoin && !this._opponent) {
      this._opponent = new Opponent(
        data.playerId,
        new Field(LobbyPlayService._fieldSize)
      );
    }
  }
}

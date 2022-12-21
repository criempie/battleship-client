import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateLobbyReturn } from '@battleship/common';
import axios from 'axios';
import { enviroment } from 'src/envitoment/enviroment';

@Injectable()
export class LobbyCreateService {
  constructor() {}

  public async createLobby() {
    const response = await axios.post<CreateLobbyReturn>(
      `${enviroment.restUrl}/lobby`
    );

    return response;
  }
}

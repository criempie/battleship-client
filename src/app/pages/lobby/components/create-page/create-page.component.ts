import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyCreateService } from '../../services/lobby-create.service';

@Component({
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css'],
  providers: [LobbyCreateService],
})
export class CreatePageComponent {
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _lobbyCreateService: LobbyCreateService
  ) {}

  public formSubmit() {
    this._lobbyCreateService
      .createLobby()
      .then((response) =>
        this._router.navigate([response.data.id], {
          relativeTo: this._activatedRoute,
        })
      );
  }
}

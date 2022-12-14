import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LobbyPlayService } from '../../services/lobby-play.service';

@Component({
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css'],
  providers: [
    {
      provide: LobbyPlayService,
      deps: [ActivatedRoute],
      useFactory: (activatedRoute: ActivatedRoute) =>
        new LobbyPlayService(activatedRoute.snapshot.paramMap.get('id')),
    },
  ],
})
export class PlayPageComponent {
  constructor(public lobbyPlayService: LobbyPlayService) {}
}

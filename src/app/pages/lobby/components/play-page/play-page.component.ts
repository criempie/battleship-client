import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LobbyPlayService } from '../../services/lobby-play.service';

@Component({
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css'],
  providers: [
    CookieService,
    {
      provide: LobbyPlayService,
      deps: [ActivatedRoute, CookieService],
      useFactory: (
        activatedRoute: ActivatedRoute,
        cookieService: CookieService
      ) =>
        new LobbyPlayService(
          activatedRoute.snapshot.paramMap.get('id'),
          cookieService
        ),
    },
  ],
})
export class PlayPageComponent {
  constructor(public lobbyPlayService: LobbyPlayService) {}
}

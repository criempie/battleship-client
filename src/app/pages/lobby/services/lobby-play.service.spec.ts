import { TestBed } from '@angular/core/testing';

import { LobbyPlayService } from './lobby-play.service';

describe('LobbyPlayService', () => {
  let service: LobbyPlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbyPlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

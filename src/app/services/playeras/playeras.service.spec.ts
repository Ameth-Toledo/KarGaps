import { TestBed } from '@angular/core/testing';

import { PlayerasService } from './playeras.service';

describe('PlayerasService', () => {
  let service: PlayerasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

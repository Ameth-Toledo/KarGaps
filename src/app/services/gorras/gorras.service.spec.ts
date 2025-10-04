import { TestBed } from '@angular/core/testing';

import { GorrasService } from './gorras.service';

describe('GorrasService', () => {
  let service: GorrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GorrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

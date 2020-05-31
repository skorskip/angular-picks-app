import { TestBed } from '@angular/core/testing';

import { StarGateService } from './star-gate.service';

describe('StarGateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarGateService = TestBed.get(StarGateService);
    expect(service).toBeTruthy();
  });
});

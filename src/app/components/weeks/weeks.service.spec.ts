import { TestBed } from '@angular/core/testing';

import { WeeksService } from './weeks.service';

describe('WeeksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeeksService = TestBed.get(WeeksService);
    expect(service).toBeTruthy();
  });
});

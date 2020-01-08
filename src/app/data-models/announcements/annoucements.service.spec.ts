import { TestBed } from '@angular/core/testing';

import { AnnoucementsService } from './announcements.service';

describe('AnnoucementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnoucementsService = TestBed.get(AnnoucementsService);
    expect(service).toBeTruthy();
  });
});

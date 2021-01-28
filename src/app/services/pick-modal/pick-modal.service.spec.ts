import { TestBed } from '@angular/core/testing';

import { PickModalService } from './pick-modal.service';

describe('PickModalService', () => {
  let service: PickModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

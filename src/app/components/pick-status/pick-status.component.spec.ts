import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickStatusComponent } from './pick-status.component';

describe('PickStatusComponent', () => {
  let component: PickStatusComponent;
  let fixture: ComponentFixture<PickStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

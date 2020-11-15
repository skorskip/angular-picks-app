import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickLogoComponent } from './pick-logo.component';

describe('PickLogoComponent', () => {
  let component: PickLogoComponent;
  let fixture: ComponentFixture<PickLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

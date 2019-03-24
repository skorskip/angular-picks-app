import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicksDashboardComponent } from './picks-dashboard.component';

describe('PicksDashboardComponent', () => {
  let component: PicksDashboardComponent;
  let fixture: ComponentFixture<PicksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

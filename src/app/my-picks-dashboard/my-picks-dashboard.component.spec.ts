import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPicksDashboardComponent } from './my-picks-dashboard.component';

describe('MyPicksDashboardComponent', () => {
  let component: MyPicksDashboardComponent;
  let fixture: ComponentFixture<MyPicksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPicksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPicksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

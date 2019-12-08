import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPickDataComponent } from './users-pick-data.component';

describe('UsersPickDataComponent', () => {
  let component: UsersPickDataComponent;
  let fixture: ComponentFixture<UsersPickDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersPickDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPickDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

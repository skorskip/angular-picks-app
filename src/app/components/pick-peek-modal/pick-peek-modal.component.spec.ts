import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickPeekModalComponent } from './pick-peek-modal.component';

describe('PickPeekModalComponent', () => {
  let component: PickPeekModalComponent;
  let fixture: ComponentFixture<PickPeekModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickPeekModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickPeekModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

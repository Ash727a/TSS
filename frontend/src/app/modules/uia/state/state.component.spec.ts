import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIAStateComponent } from './state.component';

describe('StateComponent', () => {
  let component: UIAStateComponent;
  let fixture: ComponentFixture<UIAStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UIAStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UIAStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

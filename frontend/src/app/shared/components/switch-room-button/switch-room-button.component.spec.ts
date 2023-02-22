import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchRoomButtonComponent } from './switch-room-button.component';

describe('SwitchRoomButtonComponent', () => {
  let component: SwitchRoomButtonComponent;
  let fixture: ComponentFixture<SwitchRoomButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchRoomButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchRoomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

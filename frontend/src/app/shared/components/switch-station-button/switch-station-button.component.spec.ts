import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchStationButtonComponent } from './switch-station-button.component';

describe('SwitchStationButtonComponent', () => {
  let component: SwitchStationButtonComponent;
  let fixture: ComponentFixture<SwitchStationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchStationButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchStationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

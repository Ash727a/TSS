import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSwitchCardComponent } from './station-switch-card.component';

describe('StationSwitchCardComponent', () => {
  let component: StationSwitchCardComponent;
  let fixture: ComponentFixture<StationSwitchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationSwitchCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationSwitchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

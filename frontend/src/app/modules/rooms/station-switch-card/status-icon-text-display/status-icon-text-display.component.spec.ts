import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusIconTextDisplayComponent } from './status-icon-text-display.component';

describe('StatusIconTextDisplayComponent', () => {
  let component: StatusIconTextDisplayComponent;
  let fixture: ComponentFixture<StatusIconTextDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusIconTextDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusIconTextDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationTagComponent } from './station-tag.component';

describe('StationTagComponent', () => {
  let component: StationTagComponent;
  let fixture: ComponentFixture<StationTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

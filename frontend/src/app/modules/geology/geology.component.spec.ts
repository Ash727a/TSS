import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeologyComponent } from './geology.component';

describe('GeologyComponent', () => {
  let component: GeologyComponent;
  let fixture: ComponentFixture<GeologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeologyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIAComponent } from './uia.component';

describe('UIAComponent', () => {
  let component: UIAComponent;
  let fixture: ComponentFixture<UIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UIAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

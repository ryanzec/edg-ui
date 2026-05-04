import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonToggle } from './button-toggle';

describe('ButtonToggle', () => {
  let component: ButtonToggle;
  let fixture: ComponentFixture<ButtonToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

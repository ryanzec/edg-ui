import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderInput } from './slider-input';

describe('SliderInput', () => {
  let component: SliderInput;
  let fixture: ComponentFixture<SliderInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

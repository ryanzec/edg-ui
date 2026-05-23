import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { SlideContainer } from './slide-container';

describe('SlideContainer', () => {
  let component: SlideContainer;
  let fixture: ComponentFixture<SlideContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

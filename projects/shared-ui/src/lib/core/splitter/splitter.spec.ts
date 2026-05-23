import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { Splitter } from './splitter';

describe('Splitter', () => {
  let component: Splitter;
  let fixture: ComponentFixture<Splitter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Splitter],
    }).compileComponents();

    fixture = TestBed.createComponent(Splitter);
    fixture.componentRef.setInput('direction', 'horizontal');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

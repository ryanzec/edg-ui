import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { DropDownSelector } from './drop-down-selector';
import { type SelectionValue } from '../drop-down-selector/drop-down-selector-brain';

describe('DropDownSelector', () => {
  let component: DropDownSelector;
  let fixture: ComponentFixture<DropDownSelector>;

  const mockItems: SelectionValue<string>[] = [
    { value: 'active', display: 'Active only' },
    { value: 'deleted', display: 'Deleted only' },
    { value: 'all', display: 'Show all' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownSelector);
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('label', 'Status');
    fixture.componentRef.setInput('selectedItems', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

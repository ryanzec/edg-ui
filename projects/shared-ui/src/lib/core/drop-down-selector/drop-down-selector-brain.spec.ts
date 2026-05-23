import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { DropDownSelectorBrainDirective, type SelectionValue } from './drop-down-selector-brain';

@Component({
  selector: 'test-drop-down-selector-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DropDownSelectorBrainDirective,
      inputs: ['items', 'label', 'selectedItems', 'selectionMode', 'disabled'],
      outputs: ['selectedItemsChange'],
    },
  ],
  template: '',
})
class DropDownSelectorBrainHost {
  public readonly brain = viewChild.required(DropDownSelectorBrainDirective);
}

describe('DropDownSelectorBrainDirective', () => {
  const items: SelectionValue<string>[] = [
    { value: 'active', display: 'Active only' },
    { value: 'deleted', display: 'Deleted only' },
    { value: 'all', display: 'Show all' },
    { value: 'archived', display: 'Archived' },
  ];

  let fixture: ComponentFixture<DropDownSelectorBrainHost>;
  let brain: DropDownSelectorBrainDirective<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownSelectorBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownSelectorBrainHost);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('label', 'Status');
    fixture.componentRef.setInput('selectedItems', []);
    await fixture.whenStable();
    brain = fixture.componentInstance.brain() as unknown as DropDownSelectorBrainDirective<string>;
  });

  describe('filteredItems', () => {
    it('returns the full list when the search query is empty', () => {
      expect(brain.filteredItems()).toEqual(items);
    });

    it('filters by case-insensitive substring match on display', () => {
      brain.setSearchQuery('ONLY');

      expect(brain.filteredItems().map((item) => item.value)).toEqual(['active', 'deleted']);
    });

    it('returns an empty array when no items match the query', () => {
      brain.setSearchQuery('zzz-no-match');

      expect(brain.filteredItems()).toEqual([]);
    });

    it('reports hasSearchQuery=true while a query is active', () => {
      brain.setSearchQuery('show');

      expect(brain.hasSearchQuery()).toBe(true);
    });
  });

  describe('close', () => {
    it('clears the search query so reopening shows the full list', () => {
      brain.open();
      brain.setSearchQuery('show');
      brain.close();

      expect(brain.searchQuery()).toBe('');
      expect(brain.filteredItems()).toEqual(items);
    });
  });

  describe('setSearchQuery', () => {
    it('resets the active index to the first filtered item', () => {
      brain.open();
      brain.handleTriggerKeyDown(new KeyboardEvent('keydown', { key: 'End' }));
      brain.setSearchQuery('only');

      expect(brain.activeIndex()).toBe(0);
    });

    it('resets the active index to -1 when the query has no matches', () => {
      brain.open();
      brain.setSearchQuery('zzz-no-match');

      expect(brain.activeIndex()).toBe(-1);
    });

    it('is gated by the disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      brain.setSearchQuery('only');

      expect(brain.searchQuery()).toBe('');
    });
  });

  describe('handleSearchKeyDown', () => {
    it('moves the active index down on ArrowDown', () => {
      brain.open();
      brain.setSearchQuery('only');
      brain.handleSearchKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(brain.activeIndex()).toBe(1);
    });

    it('selects the active item on Enter', () => {
      brain.open();
      brain.setSearchQuery('only');
      brain.handleSearchKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(brain.selectedItems()).toEqual([{ value: 'active', display: 'Active only' }]);
    });

    it('closes the menu on Escape', () => {
      brain.open();
      brain.handleSearchKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(brain.isOpen()).toBe(false);
    });
  });

  describe('trigger-driven type-ahead', () => {
    it('is skipped while a search query is active so the inline search owns typing', () => {
      brain.open();
      brain.setSearchQuery('only');
      const indexBefore = brain.activeIndex();
      brain.handleTriggerKeyDown(new KeyboardEvent('keydown', { key: 'a' }));

      expect(brain.activeIndex()).toBe(indexBefore);
    });
  });
});

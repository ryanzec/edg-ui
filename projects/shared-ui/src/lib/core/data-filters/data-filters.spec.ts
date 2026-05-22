import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormRecord } from '@angular/forms';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { DataFilters } from './data-filters';
import type { DataFilter, DataFiltersValue } from './data-filters-types';

const baseFilters: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: '' },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: false },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: [],
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
    ],
  },
];

const allBaseFilterNames = baseFilters.map((filter) => filter.name);

@Component({
  selector: 'test-data-filters-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataFilters],
  template: `
    <org-data-filters
      [availableFilters]="availableFilters()"
      [(activeFilters)]="activeFilters"
      (filtersChanged)="onFiltersChanged($event)"
    />
  `,
})
class DataFiltersHost {
  public readonly availableFilters = signal<DataFilter[]>(baseFilters);

  public readonly activeFilters = signal<string[]>(allBaseFilterNames);

  public readonly events = signal<DataFiltersValue[]>([]);

  public onFiltersChanged(value: DataFiltersValue): void {
    this.events.update((current) => [...current, value]);
  }
}

const getDataFilters = (fixture: ComponentFixture<DataFiltersHost>): DataFilters => {
  return fixture.debugElement.children[0].componentInstance as DataFilters;
};

const getFormHandle = (fixture: ComponentFixture<DataFiltersHost>): FormRecord<FormControl> => {
  return (getDataFilters(fixture) as unknown as { form: FormRecord<FormControl> }).form;
};

describe('DataFilters', () => {
  describe('rendering', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders an input element for each text filter', () => {
      const inputs = fixture.nativeElement.querySelectorAll('org-input');

      expect(inputs.length).toBe(1);
    });

    it('renders a checkbox-toggle for each toggle filter', () => {
      const toggles = fixture.nativeElement.querySelectorAll('org-checkbox-toggle');

      expect(toggles.length).toBe(1);
    });

    it('renders a combobox for each array filter', () => {
      const comboboxes = fixture.nativeElement.querySelectorAll('org-combobox');

      expect(comboboxes.length).toBe(1);
    });
  });

  describe('activeFilters rendering', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
    });

    it('only renders filters whose name is in activeFilters', async () => {
      fixture.componentInstance.activeFilters.set(['search']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelectorAll('org-input').length).toBe(1);
      expect(fixture.nativeElement.querySelectorAll('org-checkbox-toggle').length).toBe(0);
      expect(fixture.nativeElement.querySelectorAll('org-combobox').length).toBe(0);
    });

    it('renders nothing when activeFilters is empty', async () => {
      fixture.componentInstance.activeFilters.set([]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelectorAll('.filter-row').length).toBe(0);
    });

    it('renders in availableFilters order regardless of activeFilters order', async () => {
      fixture.componentInstance.activeFilters.set(['role', 'search', 'isActive']);
      fixture.detectChanges();
      await fixture.whenStable();

      const rows = fixture.nativeElement.querySelectorAll('.filter-row');
      const firstRowHasInput = rows[0].querySelector('org-input') !== null;
      const secondRowHasToggle = rows[1].querySelector('org-checkbox-toggle') !== null;
      const thirdRowHasCombobox = rows[2].querySelector('org-combobox') !== null;

      expect(firstRowHasInput).toBe(true);
      expect(secondRowHasToggle).toBe(true);
      expect(thirdRowHasCombobox).toBe(true);
    });
  });

  describe('initial emission', () => {
    it('does not emit filtersChanged on initial render', async () => {
      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      const fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.events().length).toBe(0);
    });
  });

  describe('text debounce', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      vi.useFakeTimers();

      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits filtersChanged with the new value after 250 ms when a text control changes', () => {
      const component = fixture.componentInstance;
      const form = getFormHandle(fixture);

      form.controls['search'].setValue('alice');

      vi.advanceTimersByTime(249);
      expect(component.events().length).toBe(0);

      vi.advanceTimersByTime(1);
      expect(component.events().length).toBe(1);
      expect(component.events()[0]['search']).toBe('alice');
    });
  });

  describe('immediate emission', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      vi.useFakeTimers();

      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits filtersChanged synchronously when a toggle changes', () => {
      const component = fixture.componentInstance;
      const form = getFormHandle(fixture);

      form.controls['isActive'].setValue(true);

      expect(component.events().length).toBe(1);
      expect(component.events()[0]['isActive']).toBe(true);
    });

    it('emits filtersChanged synchronously when an array selection changes', () => {
      const component = fixture.componentInstance;
      const form = getFormHandle(fixture);

      form.controls['role'].setValue(['admin']);

      expect(component.events().length).toBe(1);
      expect(component.events()[0]['role']).toEqual(['admin']);
    });
  });

  describe('distinct emission', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      vi.useFakeTimers();

      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not emit twice for the same value', () => {
      const component = fixture.componentInstance;
      const form = getFormHandle(fixture);

      form.controls['isActive'].setValue(true);
      form.controls['isActive'].setValue(true);

      expect(component.events().length).toBe(1);
    });
  });

  describe('dynamic availableFilters updates', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      vi.useFakeTimers();

      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('removes the form control when a filter is removed from availableFilters', async () => {
      const component = fixture.componentInstance;
      const form = getFormHandle(fixture);

      component.availableFilters.set([{ type: 'text', name: 'search', label: 'Search', defaultValue: '' }]);
      component.activeFilters.set(['search']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(form.contains('search')).toBe(true);
      expect(form.contains('isActive')).toBe(false);
      expect(form.contains('role')).toBe(false);
    });

    it('adds a new form control when a filter is added to availableFilters and activeFilters', async () => {
      const component = fixture.componentInstance;
      const form = getFormHandle(fixture);

      component.availableFilters.set([
        ...baseFilters,
        { type: 'text', name: 'email', label: 'Email', defaultValue: '' },
      ]);
      component.activeFilters.update((current) => [...current, 'email']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(form.contains('email')).toBe(true);
    });
  });

  describe('remove via X', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('removes the filter from activeFilters when its remove button is clicked', async () => {
      const removeButton = fixture.nativeElement.querySelector(
        'button[aria-label="Remove Search filter"]'
      ) as HTMLButtonElement;

      removeButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.activeFilters()).toEqual(['isActive', 'role']);
    });

    it('drops the corresponding form control after the remove button is clicked', async () => {
      const removeButton = fixture.nativeElement.querySelector(
        'button[aria-label="Remove Search filter"]'
      ) as HTMLButtonElement;

      removeButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getFormHandle(fixture).contains('search')).toBe(false);
    });
  });

  describe('Add Filter menu items', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
    });

    it('exposes menu items only for filters that are not currently active', async () => {
      fixture.componentInstance.activeFilters.set(['search']);
      fixture.detectChanges();
      await fixture.whenStable();

      const dataFilters = getDataFilters(fixture);
      const menuItems = (
        dataFilters as unknown as { addFilterMenuItems: () => { id: string; label: string }[] }
      ).addFilterMenuItems();

      expect(menuItems.map((item) => item.id)).toEqual(['isActive', 'role']);
      expect(menuItems.map((item) => item.label)).toEqual(['Active only', 'Role']);
    });

    it('hides the Add Filter button when every available filter is active', async () => {
      fixture.componentInstance.activeFilters.set(allBaseFilterNames);
      fixture.detectChanges();
      await fixture.whenStable();

      const addFilterButton = Array.from(
        fixture.nativeElement.querySelectorAll('org-button') as NodeListOf<HTMLElement>
      ).find((element) => element.textContent?.includes('Add Filter'));

      expect(addFilterButton).toBeUndefined();
    });

    it('renders the Add Filter button when at least one filter is inactive', async () => {
      fixture.componentInstance.activeFilters.set(['search']);
      fixture.detectChanges();
      await fixture.whenStable();

      const addFilterButton = Array.from(
        fixture.nativeElement.querySelectorAll('org-button') as NodeListOf<HTMLElement>
      ).find((element) => element.textContent?.includes('Add Filter'));

      expect(addFilterButton).toBeDefined();
    });
  });

  describe('filtersChanged on activeFilters change', () => {
    let fixture: ComponentFixture<DataFiltersHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DataFiltersHost] }).compileComponents();

      fixture = TestBed.createComponent(DataFiltersHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits a payload containing only currently-active filter values when activeFilters changes', async () => {
      fixture.componentInstance.events.set([]);
      fixture.componentInstance.activeFilters.set(['search']);
      fixture.detectChanges();
      await fixture.whenStable();

      const events = fixture.componentInstance.events();

      expect(events.length).toBe(1);
      expect(Object.keys(events[0])).toEqual(['search']);
      expect(events[0]['search']).toBe('');
    });

    it('resets filter values to defaults when a removed filter is re-added', async () => {
      const form = getFormHandle(fixture);

      form.controls['search'].setValue('alice', { emitEvent: false });

      fixture.componentInstance.activeFilters.set(['isActive', 'role']);
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.activeFilters.set(['search', 'isActive', 'role']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getFormHandle(fixture).getRawValue()['search']).toBe('');
    });

    it('preserves existing filter values when a sibling filter is added', async () => {
      const form = getFormHandle(fixture);

      form.controls['search'].setValue('alice', { emitEvent: false });

      fixture.componentInstance.activeFilters.set(['search', 'isActive']);
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.activeFilters.set(['search', 'isActive', 'role']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getFormHandle(fixture).getRawValue()['search']).toBe('alice');
    });
  });
});

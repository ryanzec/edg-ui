import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { isEqual } from 'es-toolkit';
import { Button } from '../button/button';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Combobox } from '../combobox/combobox';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { OverlayMenu, type OverlayMenuItem } from '../overlay-menu/overlay-menu';
import { OverlayMenuTriggerDirective } from '../overlay-menu/overlay-menu-trigger';
import type { DataFilter, DataFiltersValue } from './data-filters-types';

/** default value for the availableFilters input */
export const DATA_FILTERS_AVAILABLE_FILTERS_DEFAULT: DataFilter[] = [];

/** default value for the activeFilters model */
export const DATA_FILTERS_ACTIVE_FILTERS_DEFAULT: string[] = [];

/** debounce in ms applied to text-type filter value changes before emission */
export const DATA_FILTERS_TEXT_DEBOUNCE_MS = 250;

/**
 * declarative filter bar that renders a form input per active filter and emits a flat record of the
 * active filters' current values whenever any filter changes. text filters are debounced at 250ms;
 * toggle and array filters emit immediately. the active set is controlled via the `activeFilters`
 * model and can be mutated from inside (X remove button + add-filter menu) or by the parent.
 */
@Component({
  selector: 'org-data-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Button,
    FormField,
    FormFields,
    Label,
    Input,
    CheckboxToggle,
    Combobox,
    OverlayMenu,
    OverlayMenuTriggerDirective,
  ],
  templateUrl: './data-filters.html',
  styleUrl: './data-filters.css',
})
export class DataFilters {
  private readonly _destroyRef = inject(DestroyRef);

  /** the full catalog of filters the parent makes available */
  public readonly availableFilters = input<DataFilter[]>(DATA_FILTERS_AVAILABLE_FILTERS_DEFAULT);

  /** names of currently-visible filters; two-way so internal add/remove updates flow back to the parent */
  public readonly activeFilters = model<string[]>(DATA_FILTERS_ACTIVE_FILTERS_DEFAULT);

  /** internal reactive form whose controls track the currently-active filters */
  protected readonly form = new FormRecord<FormControl>({});

  /** subset of availableFilters rendered in the form, ordered by availableFilters position */
  protected readonly effectiveFilters = computed<DataFilter[]>(() => {
    const activeSet = new Set(this.activeFilters());

    return this.availableFilters().filter((filter) => activeSet.has(filter.name));
  });

  /** items presented in the add-filter overlay menu — every available filter that is not yet active */
  protected readonly addFilterMenuItems = computed<OverlayMenuItem[]>(() => {
    const activeSet = new Set(this.activeFilters());

    return this.availableFilters()
      .filter((filter) => !activeSet.has(filter.name))
      .map((filter) => ({ id: filter.name, label: filter.label, icon: null }));
  });

  private readonly _filtersChanged$ = new Subject<DataFiltersValue>();

  /** emits the record of currently-active filter values whenever the active set or any value changes */
  public readonly filtersChanged = outputFromObservable(this._filtersChanged$);

  private _valueChangesSubscription: Subscription | null = null;

  private _hasRunInitialRebuild = false;

  constructor() {
    // rebuild controls + re-wire value-change pipelines whenever the effective filter set changes,
    // then emit the post-rebuild record so parents stay in sync when activeFilters changes; the
    // initial rebuild is skipped to preserve the no-initial-emit contract
    effect(() => {
      const filters = this.effectiveFilters();

      untracked(() => {
        this._rebuildForm(filters);
        this._wireValueChanges(filters);

        if (this._hasRunInitialRebuild) {
          this._emitCurrentValue();
        }

        this._hasRunInitialRebuild = true;
      });
    });
  }

  /** removes the named filter from the active set; the effect handles form rebuild + emission */
  protected removeFilter(name: string): void {
    this.activeFilters.update((current) => current.filter((existing) => existing !== name));
  }

  /** adds the named filter to the active set if it is not already active */
  protected addFilter(name: string): void {
    this.activeFilters.update((current) => (current.includes(name) ? current : [...current, name]));
  }

  /** handler for the overlay menu's itemClicked output — the item's id is the filter name */
  protected onAddFilterMenuItemClick(item: OverlayMenuItem): void {
    this.addFilter(item.id);
  }

  /** synchronizes the form controls with the latest filter definitions without recreating the group */
  private _rebuildForm(filters: DataFilter[]): void {
    const nextNames = new Set(filters.map((filter) => filter.name));

    for (const name of Object.keys(this.form.controls)) {
      if (nextNames.has(name)) {
        continue;
      }

      this.form.removeControl(name, { emitEvent: false });
    }

    for (const filter of filters) {
      if (this.form.contains(filter.name)) {
        this.form.controls[filter.name].setValue(filter.defaultValue, { emitEvent: false });
        continue;
      }

      this.form.addControl(filter.name, new FormControl(filter.defaultValue, { nonNullable: true }), {
        emitEvent: false,
      });
    }
  }

  /** subscribes to each control's valueChanges with the per-type debounce, emitting a deduped record */
  private _wireValueChanges(filters: DataFilter[]): void {
    this._valueChangesSubscription?.unsubscribe();

    if (filters.length === 0) {
      this._valueChangesSubscription = null;

      return;
    }

    const textChanges = filters
      .filter((filter) => filter.type === 'text')
      .map((filter) => this.form.controls[filter.name].valueChanges.pipe(debounceTime(DATA_FILTERS_TEXT_DEBOUNCE_MS)));

    const otherChanges = filters
      .filter((filter) => filter.type !== 'text')
      .map((filter) => this.form.controls[filter.name].valueChanges);

    this._valueChangesSubscription = merge(...textChanges, ...otherChanges)
      .pipe(
        map(() => this.form.getRawValue() as DataFiltersValue),
        distinctUntilChanged((previous, current) => isEqual(previous, current)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((value) => this._filtersChanged$.next(value));
  }

  /** pushes the current form value onto the filtersChanged stream — used after a rebuild */
  private _emitCurrentValue(): void {
    this._filtersChanged$.next(this.form.getRawValue() as DataFiltersValue);
  }
}

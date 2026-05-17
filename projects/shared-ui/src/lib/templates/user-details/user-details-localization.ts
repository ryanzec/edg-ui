import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, startWith, switchMap } from 'rxjs';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { DropDownSelector } from '../../core/drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../../brain/drop-down-selector-brain/drop-down-selector-brain';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { Label } from '../../core/label/label';
import type { UserDetailsLocalizationOption } from './user-details-types';

@Component({
  selector: 'org-user-details-localization',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, DropDownSelector, FormField, FormFields, Label, ReactiveFormsModule],
  templateUrl: './user-details-localization.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsLocalization {
  private readonly _timezoneValue = signal<string>('');

  private readonly _languageValue = signal<string>('');

  /** the FormGroup slice for the localization fields */
  public readonly formGroup = input.required<FormGroup>();

  /** the timezone options surfaced in the dropdown */
  public readonly timezoneOptions = input.required<UserDetailsLocalizationOption[]>();

  /** the language options surfaced in the dropdown */
  public readonly languageOptions = input.required<UserDetailsLocalizationOption[]>();

  /** rendered timezone items for the dropdown */
  protected readonly timezoneItems = computed<SelectionValue<string>[]>(() =>
    this.timezoneOptions().map((option) => ({ value: option.value, display: option.display }))
  );

  /** rendered language items for the dropdown */
  protected readonly languageItems = computed<SelectionValue<string>[]>(() =>
    this.languageOptions().map((option) => ({ value: option.value, display: option.display }))
  );

  /** currently selected timezone items array used by the dropdown's model */
  protected readonly timezoneSelectedItems = computed<SelectionValue<string>[]>(() => {
    const current = this._timezoneValue();
    const match = this.timezoneItems().find((item) => item.value === current);

    return match ? [match] : [];
  });

  /** currently selected language items array used by the dropdown's model */
  protected readonly languageSelectedItems = computed<SelectionValue<string>[]>(() => {
    const current = this._languageValue();
    const match = this.languageItems().find((item) => item.value === current);

    return match ? [match] : [];
  });

  constructor() {
    /**
     * keeps the timezone signal in sync with the form control so the dropdown's selectedItems reflects the
     * current form value reactively.
     */
    toObservable(this.formGroup)
      .pipe(
        switchMap((formGroup) => {
          const control = formGroup.get('timezone');

          if (!control) {
            return EMPTY;
          }

          return control.valueChanges.pipe(startWith(control.value));
        }),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe((value: string | null | undefined) => this._timezoneValue.set(value ?? ''));

    /** keeps the language signal in sync with the form control */
    toObservable(this.formGroup)
      .pipe(
        switchMap((formGroup) => {
          const control = formGroup.get('language');

          if (!control) {
            return EMPTY;
          }

          return control.valueChanges.pipe(startWith(control.value));
        }),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe((value: string | null | undefined) => this._languageValue.set(value ?? ''));
  }

  /** writes the selected timezone back to the form control */
  protected onTimezoneSelectionChange(selected: SelectionValue<string>[]): void {
    const first = selected[0];

    if (!first) {
      return;
    }

    const control = this.formGroup().get('timezone');

    if (!control) {
      return;
    }

    control.setValue(first.value);
    control.markAsDirty();
  }

  /** writes the selected language back to the form control */
  protected onLanguageSelectionChange(selected: SelectionValue<string>[]): void {
    const first = selected[0];

    if (!first) {
      return;
    }

    const control = this.formGroup().get('language');

    if (!control) {
      return;
    }

    control.setValue(first.value);
    control.markAsDirty();
  }
}

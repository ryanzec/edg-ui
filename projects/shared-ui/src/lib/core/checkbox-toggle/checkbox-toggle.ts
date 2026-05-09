import { Component, ChangeDetectionStrategy, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularUtils } from '@organization/shared-utils';
import { IconName } from '../../brain/icon-brain/icon-brain';
import { Icon, IconSize } from '../icon/icon';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';
import { CheckboxToggleBrainDirective } from '../../brain/checkbox-toggle-brain/checkbox-toggle-brain';

export const allCheckboxToggleSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

export type CheckboxToggleSize = (typeof allCheckboxToggleSizes)[number];

/** default value for the checked model */
export const CHECKBOX_TOGGLE_CHECKED_DEFAULT = false;

/** default value for the disabled input */
export const CHECKBOX_TOGGLE_DISABLED_DEFAULT = false;

/** default value for the size input */
export const CHECKBOX_TOGGLE_SIZE_DEFAULT: CheckboxToggleSize = 'base';

/** default value for the onIcon input */
export const CHECKBOX_TOGGLE_ON_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the offIcon input */
export const CHECKBOX_TOGGLE_OFF_ICON_DEFAULT: IconName | undefined = undefined;

@Component({
  selector: 'org-checkbox-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective, CheckboxToggleBrainDirective],
  templateUrl: './checkbox-toggle.html',
  styleUrl: './checkbox-toggle.css',
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxToggle),
      multi: true,
    },
  ],
})
export class CheckboxToggle implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private readonly _formDisabled = signal<boolean>(false);

  public readonly name = input.required<string>();
  public readonly value = input.required<string>();

  public readonly checked = model<boolean>(CHECKBOX_TOGGLE_CHECKED_DEFAULT);
  public readonly disabled = input<boolean>(CHECKBOX_TOGGLE_DISABLED_DEFAULT);
  public readonly size = input<CheckboxToggleSize>(CHECKBOX_TOGGLE_SIZE_DEFAULT);
  public readonly onIcon = input<IconName | undefined, IconName | null | undefined>(CHECKBOX_TOGGLE_ON_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
  public readonly offIcon = input<IconName | undefined, IconName | null | undefined>(CHECKBOX_TOGGLE_OFF_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._formDisabled());

  public readonly textSize = computed<TextSize>(() => {
    return this.size() === 'lg' ? 'xl' : this.size();
  });

  public readonly displayIcon = computed<IconName | undefined>(() => {
    if (this.checked()) {
      return this.onIcon();
    }

    return this.offIcon();
  });

  public readonly iconSize = computed<IconSize>(() => {
    switch (this.size()) {
      case 'base':
        return '2xs';
      case 'lg':
        return 'sm';
      default:
        return '2xs';
    }
  });

  protected onBrainChanged(value: boolean): void {
    this.checked.set(value);
    this._onChange(value);
  }

  protected onBrainTouched(): void {
    this._onTouched();
  }

  public writeValue(value: boolean): void {
    this.checked.set(value ?? false);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }
}

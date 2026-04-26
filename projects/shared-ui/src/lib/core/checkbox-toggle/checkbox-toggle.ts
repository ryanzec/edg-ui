import { Component, ChangeDetectionStrategy, input, computed, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon, IconName, IconSize } from '../icon/icon';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';
import { FORM_FIELD_COMPONENT } from '../form-field/form-field';
import { CheckboxToggleBrainDirective } from '../../brain/checkbox-toggle-brain/checkbox-toggle-brain';

export const allCheckboxToggleSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

export type CheckboxToggleSize = (typeof allCheckboxToggleSizes)[number];

@Component({
  selector: 'org-checkbox-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective],
  templateUrl: './checkbox-toggle.html',
  styleUrl: './checkbox-toggle.css',
  hostDirectives: [
    {
      directive: CheckboxToggleBrainDirective,
      inputs: ['checkboxToggleChecked: checked', 'checkboxToggleDisabled: disabled'],
      outputs: ['checkboxToggleChanged: checkedChange'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-checked]': 'isChecked() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
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
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true, host: true });
  protected readonly brain = inject(CheckboxToggleBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  public readonly name = input.required<string>();
  public readonly value = input.required<string>();

  public readonly checked = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly size = input<CheckboxToggleSize>('base');
  public readonly onIcon = input<IconName | null>(null);
  public readonly offIcon = input<IconName | null>(null);

  public readonly isChecked = computed<boolean>(() => this.brain.isChecked());
  public readonly isDisabled = computed<boolean>(() => this.brain.isDisabled());

  public readonly textSize = computed<TextSize>(() => {
    switch (this.size()) {
      case 'base':
        return 'sm';
      case 'lg':
        return 'md';
      default:
        return 'xs';
    }
  });

  public readonly displayIcon = computed<IconName | null>(() => {
    if (this.isChecked()) {
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

  public readonly hasValidationMessage = computed<boolean>(() => {
    return !!this._formField?.hasValidationMessage();
  });

  public readonly ariaDescribedBy = computed<string | null>(() => {
    if (this.hasValidationMessage()) {
      return `validation-message-${this.name()}`;
    }

    return null;
  });

  public readonly ariaInvalid = computed<boolean | null>(() => {
    if (this.hasValidationMessage()) {
      return true;
    }

    return null;
  });

  constructor() {
    this.brain.checkboxToggleChanged.subscribe((value) => {
      this._onChange(value);
    });

    this.brain.checkboxToggleTouched.subscribe(() => {
      this._onTouched();
    });
  }

  protected onClick(event: Event): void {
    this.brain.handleClick(event);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    this.brain.handleKeyDown(event);
  }

  public writeValue(value: boolean): void {
    this.brain.setInternalChecked(value);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.brain.setFormControlled();
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}

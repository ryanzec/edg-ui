import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  ViewChild,
  ElementRef,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon, IconName } from '../icon/icon';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';
import { FORM_FIELD_COMPONENT } from '../form-field/form-field';
import { CheckboxBrainDirective } from '../../brain/checkbox-brain/checkbox-brain';

/** all available checkbox size values */
export const allCheckboxSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the checkbox */
export type CheckboxSize = (typeof allCheckboxSizes)[number];

/** default value for the checked input */
export const CHECKBOX_CHECKED_DEFAULT = false;

/** default value for the indeterminate input */
export const CHECKBOX_INDETERMINATE_DEFAULT = false;

/** default value for the disabled input */
export const CHECKBOX_DISABLED_DEFAULT = false;

/** default value for the size input */
export const CHECKBOX_SIZE_DEFAULT: CheckboxSize = 'base';

@Component({
  selector: 'org-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
  hostDirectives: [
    {
      directive: CheckboxBrainDirective,
      inputs: ['checkboxChecked: checked', 'checkboxIndeterminate: indeterminate', 'checkboxDisabled: disabled'],
      outputs: ['checkboxCheckedChange: checkedChange', 'checkboxIndeterminateChange: indeterminateChange'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-indeterminate]': 'indeterminate() ? "" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
})
export class Checkbox implements ControlValueAccessor {
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true, host: true });
  protected readonly brain = inject(CheckboxBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** @ViewChild reference to the hidden native input element */
  @ViewChild('inputRef', { static: true })
  public readonly inputRef!: ElementRef<HTMLInputElement>;

  /** name attribute for the checkbox input */
  public readonly name = input.required<string>();

  /** value attribute for the checkbox input */
  public readonly value = input.required<string>();

  /** whether the checkbox is checked */
  public readonly checked = model<boolean>(CHECKBOX_CHECKED_DEFAULT);

  /** whether the checkbox is in an indeterminate state */
  public readonly indeterminate = model<boolean>(CHECKBOX_INDETERMINATE_DEFAULT);

  /** whether the checkbox is disabled */
  public readonly disabled = input<boolean>(CHECKBOX_DISABLED_DEFAULT);

  /** the size variant of the checkbox */
  public readonly size = input<CheckboxSize>(CHECKBOX_SIZE_DEFAULT);

  /** the text size derived from the checkbox size */
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

  /** the icon name representing the current checkbox state */
  public readonly currentIcon = computed<IconName>(() => {
    if (this.checked()) {
      return 'square-check-big';
    }

    if (this.indeterminate()) {
      return 'square-minus';
    }

    return 'square';
  });

  /** whether the parent form field has an active validation message */
  public readonly hasValidationMessage = computed<boolean>(() => {
    return !!this._formField?.hasValidationMessage();
  });

  /** the aria-describedby id linking to the validation message when present */
  public readonly ariaDescribedBy = computed<string | null>(() => {
    if (this.hasValidationMessage()) {
      return `validation-message-${this.name()}`;
    }

    return null;
  });

  /** the aria-invalid value when a validation message is present */
  public readonly ariaInvalid = computed<boolean | null>(() => {
    if (this.hasValidationMessage()) {
      return true;
    }

    return null;
  });

  constructor() {
    // forward brain user-interaction events to the reactive-forms callbacks
    this.brain.checkboxChanged.subscribe((value) => {
      this._onChange(value);
    });

    this.brain.checkboxTouched.subscribe(() => {
      this._onTouched();
    });
  }

  /** handles click interaction by delegating to the brain */
  protected onClick(event: Event): void {
    this.brain.handleClick(event);
  }

  /** handles keyboard interaction by delegating to the brain */
  protected onKeyDown(event: KeyboardEvent): void {
    this.brain.handleKeyDown(event);
  }

  /** sets the checkbox value from the reactive forms api */
  public writeValue(value: boolean): void {
    this.checked.set(value ?? false);
    this.indeterminate.set(false);
  }

  /** registers the on-change callback for reactive forms */
  public registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  /** registers the on-touched callback for reactive forms */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** required by controlvalueaccessor; disabled state is managed via the disabled input */
  public setDisabledState(_isDisabled: boolean): void {
    // required by controlvalueaccessor
  }
}

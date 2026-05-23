import {
  Component,
  ChangeDetectionStrategy,
  effect,
  input,
  computed,
  ViewChild,
  ElementRef,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconName } from '../icon/icon-brain';
import { Icon } from '../icon/icon';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';
import { FORM_FIELD_COMPONENT } from '../form-fields/form-field';
import { CheckboxBrainDirective } from '../checkbox/checkbox-brain';

/** all available checkbox size values */
export const allCheckboxSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the checkbox */
export type CheckboxSize = (typeof allCheckboxSizes)[number];

/** all available checkbox color values */
export const allCheckboxColors = ['primary', 'danger'] as const;

/** the color variant of the checkbox */
export type CheckboxColor = (typeof allCheckboxColors)[number];

/** default value for the size input */
export const CHECKBOX_SIZE_DEFAULT: CheckboxSize = 'base';

/** default value for the color input */
export const CHECKBOX_COLOR_DEFAULT: CheckboxColor = 'primary';

/** default value for the description input */
export const CHECKBOX_DESCRIPTION_DEFAULT = '';

@Component({
  selector: 'org-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
  hostDirectives: [
    {
      directive: CheckboxBrainDirective,
      inputs: ['checked', 'indeterminate', 'disabled'],
      outputs: ['checkedChange', 'indeterminateChange'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-checked]': 'brain.checked() ? "" : null',
    '[attr.data-indeterminate]': 'brain.indeterminate() ? "" : null',
    '[attr.data-state]': 'brain.ariaInvalid() ? "error" : null',
    '[attr.data-disabled]': 'brain.disabled() ? "1" : null',
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
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });
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

  /** the size variant of the checkbox */
  public readonly size = input<CheckboxSize>(CHECKBOX_SIZE_DEFAULT);

  /** the color variant of the checkbox */
  public readonly color = input<CheckboxColor>(CHECKBOX_COLOR_DEFAULT);

  /** optional description sub-line rendered beneath the label */
  public readonly description = input<string>(CHECKBOX_DESCRIPTION_DEFAULT);

  /** the text size derived from the checkbox size */
  public readonly textSize = computed<TextSize>(() => {
    return this.size() === 'lg' ? 'xl' : this.size();
  });

  /** the icon name representing the current checkbox state */
  public readonly currentIcon = computed<IconName>(() => {
    if (this.brain.checked()) {
      return 'square-check-big';
    }

    if (this.brain.indeterminate()) {
      return 'square-minus';
    }

    return 'square';
  });

  constructor() {
    // forward brain user-interaction events to the reactive-forms callbacks
    this.brain.changed.subscribe((value) => {
      this._onChange(value);
    });

    this.brain.touched.subscribe(() => {
      this._onTouched();
    });

    // syncs form-field validation context into the brain so it can derive aria-invalid / aria-describedby
    effect(() => {
      const formFieldBrain = this._formField?.brain;
      const hasMessage = !!formFieldBrain?.hasValidationMessage();
      const messageId = hasMessage ? (formFieldBrain?.validationMessageId ?? null) : null;

      this.brain.setValidationContext(hasMessage, messageId);
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
    this.brain.setChecked(value ?? false);
    this.brain.setIndeterminate(false);
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

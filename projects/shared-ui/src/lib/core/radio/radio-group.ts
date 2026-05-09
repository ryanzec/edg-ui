import { Component, ChangeDetectionStrategy, forwardRef, inject, input, computed, InjectionToken } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  RadioGroupBrainDirective,
  RadioGroupOrientation,
  RADIO_GROUP_ORIENTATION_DEFAULT,
} from '../../brain/radio-group-brain/radio-group-brain';

/** injection token for accessing the radio group component from child components */
export const RADIO_GROUP_COMPONENT = new InjectionToken<RadioGroup>('RadioGroup Component');

/** default value for the value input */
export const RADIO_GROUP_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const RADIO_GROUP_DISABLED_DEFAULT = false;

/** default value for the name input */
export const RADIO_GROUP_NAME_DEFAULT = '';

/** default value for the ariaLabel input */
export const RADIO_GROUP_ARIA_LABEL_DEFAULT: string | null = null;

@Component({
  selector: 'org-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.html',
  hostDirectives: [
    {
      directive: RadioGroupBrainDirective,
      inputs: ['value', 'disabled', 'orientation', 'ariaLabel'],
      outputs: ['valueChange'],
    },
  ],
  styleUrl: './radio-group.css',
  host: {
    '[attr.data-orientation]': 'orientation()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
    { provide: RADIO_GROUP_COMPONENT, useExisting: RadioGroup },
  ],
})
export class RadioGroup implements ControlValueAccessor {
  private readonly _brain = inject(RadioGroupBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** the externally bound value input (used in non-form binding) */
  public readonly value = input<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** whether all radios in the group are disabled */
  public readonly disabled = input<boolean>(RADIO_GROUP_DISABLED_DEFAULT);

  /** the name attribute shared across all child radio inputs */
  public readonly name = input<string>(RADIO_GROUP_NAME_DEFAULT);

  /** orientation of the group; gates which arrow keys route next/previous */
  public readonly orientation = input<RadioGroupOrientation>(RADIO_GROUP_ORIENTATION_DEFAULT);

  /** accessibility label exposed on the host as `aria-label` */
  public readonly ariaLabel = input<string | null>(RADIO_GROUP_ARIA_LABEL_DEFAULT);

  /** the resolved current value — proxied from the brain */
  public readonly currentValue = computed<string>(() => this._brain.currentValue());

  constructor() {
    /** forward brain value changes to the reactive-forms callbacks; auto-cleaned when this component destroys */
    this._brain.valueChange.subscribe((value) => {
      this._onChange(value);
      this._onTouched();
    });
  }

  /** sets the selected value from the reactive forms api */
  public writeValue(value: string): void {
    this._brain.setInternalValue(value);
  }

  /** registers the on-change callback for reactive forms */
  public registerOnChange(fn: (value: string) => void): void {
    this._brain.setFormControlled();
    this._onChange = fn;
  }

  /** registers the on-touched callback for reactive forms */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** required by controlvalueaccessor */
  public setDisabledState(_isDisabled: boolean): void {
    // TODO: implement programmatic disabled state via the disabled input signal
  }
}

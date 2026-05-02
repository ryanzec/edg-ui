import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  contentChildren,
  effect,
  inject,
  input,
  output,
  computed,
  InjectionToken,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioGroupBrainDirective } from '../../brain/radio-group-brain/radio-group-brain';
import { Radio } from './radio';

/** injection token for accessing the radio group component from child components */
export const RADIO_GROUP_COMPONENT = new InjectionToken<RadioGroup>('RadioGroup Component');

/** default value for the value input */
export const RADIO_GROUP_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const RADIO_GROUP_DISABLED_DEFAULT = false;

/** default value for the name input */
export const RADIO_GROUP_NAME_DEFAULT = '';

@Component({
  selector: 'org-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.html',
  hostDirectives: [
    {
      directive: RadioGroupBrainDirective,
      inputs: ['value', 'disabled'],
      outputs: ['valueChange'],
    },
  ],
  styleUrl: './radio-group.css',
  host: {
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
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

  /** emits the newly selected value when a radio is selected */
  public readonly valueChange = output<string>();

  /** the resolved current value — proxied from the brain */
  public readonly currentValue = computed<string>(() => this._brain.currentValue());

  /** all descendant radio components */
  private readonly _radios = contentChildren(
    forwardRef(() => Radio),
    { descendants: true }
  );

  constructor() {
    /** wire the brain's ordered-values provider to the current contentChildren list */
    this._brain.setOrderedValuesProvider(() => this._radios().map((radio) => radio.value()));

    /** sync selected state on all child radios whenever the current value or radio list changes */
    effect(() => {
      const currentValue = this.currentValue();
      const radios = this._radios();

      radios.forEach((radio) => {
        radio._setSelected(currentValue === radio.value());
      });
    });

    /** forward brain value changes to the reactive-forms callbacks */
    this._brain.valueChange.subscribe((value) => {
      this._onChange(value);
      this._onTouched();
      this.valueChange.emit(value);
    });
  }

  /**
   * @internal called by child Radio when it is selected
   */
  public _onRadioSelect(value: string): void {
    this._brain.selectValue(value);
  }

  /**
   * @internal moves selection to the radio after the one with the given value
   */
  public _focusNext(currentValue: string): void {
    this._brain.selectNext(currentValue);
  }

  /**
   * @internal moves selection to the radio before the one with the given value
   */
  public _focusPrevious(currentValue: string): void {
    this._brain.selectPrevious(currentValue);
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

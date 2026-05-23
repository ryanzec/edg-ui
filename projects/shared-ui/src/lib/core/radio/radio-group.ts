import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  InjectionToken,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ComponentSize } from '../types/component-types';
import { FORM_FIELD_COMPONENT } from '../form-fields/form-field';
import { RadioGroupBrainDirective } from '../radio/radio-group-brain';

/** injection token for accessing the radio group component from child components */
export const RADIO_GROUP_COMPONENT = new InjectionToken<RadioGroup>('RadioGroup Component');

/** all available radio group size values */
export const allRadioGroupSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant cascaded to child radios in the group */
export type RadioGroupSize = (typeof allRadioGroupSizes)[number];

/** default value for the value input */
export const RADIO_GROUP_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const RADIO_GROUP_DISABLED_DEFAULT = false;

/** default value for the name input */
export const RADIO_GROUP_NAME_DEFAULT = '';

/** default value for the size input */
export const RADIO_GROUP_SIZE_DEFAULT: RadioGroupSize = 'base';

/** default value for the legend input */
export const RADIO_GROUP_LEGEND_DEFAULT = '';

/** default value for the description input */
export const RADIO_GROUP_DESCRIPTION_DEFAULT = '';

/** default value for the required input */
export const RADIO_GROUP_REQUIRED_DEFAULT = false;

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
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'isInError() ? "error" : null',
    '[attr.aria-labelledby]': 'legend() ? legendId : null',
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
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** stable dom id for the legend element so the host can reference it via aria-labelledby */
  public readonly legendId = `radio-group-legend-${uuidv4()}`;

  /** the externally bound value input (used in non-form binding) */
  public readonly value = input<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** whether all radios in the group are disabled */
  public readonly disabled = input<boolean>(RADIO_GROUP_DISABLED_DEFAULT);

  /** the name attribute shared across all child radio inputs */
  public readonly name = input<string>(RADIO_GROUP_NAME_DEFAULT);

  /** the size variant cascaded to child radios via the host data-size attribute */
  public readonly size = input<RadioGroupSize>(RADIO_GROUP_SIZE_DEFAULT);

  /** optional legend text rendered above the options */
  public readonly legend = input<string>(RADIO_GROUP_LEGEND_DEFAULT);

  /** optional description rendered between the legend and the options */
  public readonly description = input<string>(RADIO_GROUP_DESCRIPTION_DEFAULT);

  /** whether the group is required — drives the asterisk indicator on the legend */
  public readonly required = input<boolean>(RADIO_GROUP_REQUIRED_DEFAULT);

  /** the resolved current value — proxied from the brain */
  public readonly currentValue = computed<string>(() => this._brain.currentValue());

  /** whether the group is currently in an error state — driven from a parent form-field's validation context */
  protected readonly isInError = computed<boolean>(() => this._brain.hasValidationMessage());

  constructor() {
    /** forward brain value changes to the reactive-forms callbacks; auto-cleaned when this component destroys */
    this._brain.valueChange.subscribe((value) => {
      this._onChange(value);
      this._onTouched();
    });

    /**
     * syncs validation context from a parent form-field into the brain so it (and every registered child
     * radio) can derive aria-invalid / aria-describedby and render the error visual treatment.
     */
    effect(() => {
      const formFieldBrain = this._formField?.brain;
      const hasMessage = !!formFieldBrain?.hasValidationMessage();
      const messageId = hasMessage ? (formFieldBrain?.validationMessageId ?? null) : null;

      this._brain.setValidationContext(hasMessage, messageId);
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

  /** required by controlvalueaccessor; programmatic disabled state is handled via the `disabled` input */
  public setDisabledState(_isDisabled: boolean): void {
    // required by controlvalueaccessor — programmatic disabled is plumbed via the disabled input signal
  }
}

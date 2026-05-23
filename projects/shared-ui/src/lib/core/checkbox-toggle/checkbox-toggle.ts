import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularUtils } from '@organization/shared-utils';
import { CheckboxToggleBrainDirective } from '../checkbox-toggle/checkbox-toggle-brain';
import { IconName } from '../icon/icon-brain';
import { FORM_FIELD_COMPONENT } from '../form-fields/form-field';
import { Icon, IconSize } from '../icon/icon';
import { TextDirective, TextSize } from '../text-directive/text-directive';
import { ComponentSize } from '../types/component-types';

/** all available checkbox-toggle size values */
export const allCheckboxToggleSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the checkbox-toggle */
export type CheckboxToggleSize = (typeof allCheckboxToggleSizes)[number];

/** all available checkbox-toggle color values */
export const allCheckboxToggleColors = ['primary', 'safe', 'danger'] as const;

/** the color variant of the checkbox-toggle */
export type CheckboxToggleColor = (typeof allCheckboxToggleColors)[number];

/** all available checkbox-toggle label-position values */
export const allCheckboxToggleLabelPositions = ['end', 'start'] as const;

/** the label-position variant of the checkbox-toggle */
export type CheckboxToggleLabelPosition = (typeof allCheckboxToggleLabelPositions)[number];

/** default value for the size input */
export const CHECKBOX_TOGGLE_SIZE_DEFAULT: CheckboxToggleSize = 'base';

/** default value for the color input */
export const CHECKBOX_TOGGLE_COLOR_DEFAULT: CheckboxToggleColor = 'primary';

/** default value for the labelPosition input */
export const CHECKBOX_TOGGLE_LABEL_POSITION_DEFAULT: CheckboxToggleLabelPosition = 'end';

/** default value for the description input */
export const CHECKBOX_TOGGLE_DESCRIPTION_DEFAULT = '';

/** default value for the iconOn input */
export const CHECKBOX_TOGGLE_ICON_ON_DEFAULT: IconName | undefined = undefined;

/** default value for the iconOff input */
export const CHECKBOX_TOGGLE_ICON_OFF_DEFAULT: IconName | undefined = undefined;

@Component({
  selector: 'org-checkbox-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TextDirective],
  templateUrl: './checkbox-toggle.html',
  styleUrl: './checkbox-toggle.css',
  hostDirectives: [
    {
      directive: CheckboxToggleBrainDirective,
      inputs: ['checked', 'disabled'],
      outputs: ['checkedChange'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-label-position]': 'labelPosition()',
    '[attr.data-checked]': 'brain.checked() ? "" : null',
    '[attr.data-disabled]': 'brain.isDisabled() ? "" : null',
    '[attr.data-state]': 'brain.ariaInvalid() ? "error" : null',
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
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });
  protected readonly brain = inject(CheckboxToggleBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: boolean) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** @ViewChild reference to the hidden native input element */
  @ViewChild('inputRef', { static: true })
  public readonly inputRef!: ElementRef<HTMLInputElement>;

  /** name attribute for the checkbox-toggle input */
  public readonly name = input.required<string>();

  /** value attribute for the checkbox-toggle input */
  public readonly value = input.required<string>();

  /** the size variant of the checkbox-toggle */
  public readonly size = input<CheckboxToggleSize>(CHECKBOX_TOGGLE_SIZE_DEFAULT);

  /** the color variant of the checkbox-toggle (drives the on-state ramp + on-icon color) */
  public readonly color = input<CheckboxToggleColor>(CHECKBOX_TOGGLE_COLOR_DEFAULT);

  /** the position of the label relative to the track (end = track-pre, start = track-post) */
  public readonly labelPosition = input<CheckboxToggleLabelPosition>(CHECKBOX_TOGGLE_LABEL_POSITION_DEFAULT);

  /** optional description sub-line rendered beneath the label */
  public readonly description = input<string>(CHECKBOX_TOGGLE_DESCRIPTION_DEFAULT);

  /** optional icon shown on the knob when the toggle is on */
  public readonly iconOn = input<IconName | undefined, IconName | null | undefined>(CHECKBOX_TOGGLE_ICON_ON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional icon shown on the knob when the toggle is off */
  public readonly iconOff = input<IconName | undefined, IconName | null | undefined>(CHECKBOX_TOGGLE_ICON_OFF_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the text size derived from the checkbox-toggle size */
  public readonly textSize = computed<TextSize>(() => {
    if (this.size() === 'lg') {
      return 'lg';
    }

    if (this.size() === 'sm') {
      return 'sm';
    }

    return 'base';
  });

  /** the icon size derived from the checkbox-toggle size */
  public readonly iconSize = computed<IconSize>(() => {
    if (this.size() === 'lg') {
      return 'xs';
    }

    return '2xs';
  });

  constructor() {
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

  /** sets the checkbox-toggle value from the reactive forms api */
  public writeValue(value: boolean): void {
    this.brain.setChecked(value ?? false);
  }

  /** registers the on-change callback for reactive forms */
  public registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  /** registers the on-touched callback for reactive forms */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** receives the form-disabled state from reactive forms */
  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}

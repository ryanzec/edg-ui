import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  computed,
  ViewChild,
  forwardRef,
  AfterViewInit,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularUtils } from '@organization/shared-utils';
import { Input as BaseInput, type InputVariant } from '../input/input';
import { TimeInputBrainDirective } from '../../brain/time-input-brain/time-input-brain';

/** available time segments for the time input component */
export type TimeSegment = 'hours' | 'minutes' | 'ampm';

/** default value for the variant input */
export const TIME_INPUT_VARIANT_DEFAULT: InputVariant = 'bordered';

/** default value for the placeholder input */
export const TIME_INPUT_PLACEHOLDER_DEFAULT = 'Enter time';

/** default value for the disabled input */
export const TIME_INPUT_DISABLED_DEFAULT = false;

/** default value for the readonly input */
export const TIME_INPUT_READONLY_DEFAULT = false;

/** default value for the defaultValue input */
export const TIME_INPUT_DEFAULT_VALUE_DEFAULT = '';

/** default value for the autoFocus input */
export const TIME_INPUT_AUTO_FOCUS_DEFAULT = false;

/** default value for the ariaLabel input */
export const TIME_INPUT_ARIA_LABEL_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-time-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseInput],
  templateUrl: './time-input.html',
  styleUrl: './time-input.css',
  hostDirectives: [
    {
      directive: TimeInputBrainDirective,
      inputs: ['timeInputDisabled: disabled', 'timeInputReadonly: readonly'],
      outputs: ['timeInputFocused: focused', 'timeInputBlurred: blurred'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInput),
      multi: true,
    },
  ],
})
export class TimeInput implements AfterViewInit, ControlValueAccessor {
  protected readonly brain = inject(TimeInputBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /**
   * @internal only exposed for testing purposes
   */
  @ViewChild('inputComponent')
  public readonly _inputComponent!: BaseInput;

  /** visual variant of the input */
  public readonly variant = input<InputVariant>(TIME_INPUT_VARIANT_DEFAULT);

  /** placeholder text displayed when the input is empty */
  public readonly placeholder = input<string>(TIME_INPUT_PLACEHOLDER_DEFAULT);

  /** whether the input is disabled */
  public readonly disabled = input<boolean>(TIME_INPUT_DISABLED_DEFAULT);

  /** whether the input is readonly */
  public readonly readonly = input<boolean>(TIME_INPUT_READONLY_DEFAULT);

  /** name attribute for the input element */
  public readonly name = input.required<string>();

  /** default time value to initialize the component, only applied when no reactive form value is present (format: "hh:mm am/pm") */
  public readonly defaultValue = input<string>(TIME_INPUT_DEFAULT_VALUE_DEFAULT);

  /** whether the input should automatically receive focus on mount */
  public readonly autoFocus = input<boolean>(TIME_INPUT_AUTO_FOCUS_DEFAULT);

  /** accessible label passed through to the native input element */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(TIME_INPUT_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** current time value in "hh:mm am/pm" format, supports two-way binding */
  public readonly value = model<string>('');

  /** emitted when the input receives focus */
  public readonly focused = output<void>();

  /** emitted when the input loses focus */
  public readonly blurred = output<void>();

  /** the formatted time string derived from the brain state, used for the inner input display */
  protected readonly formattedValue = computed<string>(() => this.brain.formattedValue());

  /** whether the input is effectively disabled (proxied from brain) */
  protected readonly isDisabled = computed<boolean>(() => this.brain.isDisabled());

  constructor() {
    // forward brain value-change events to the form callbacks and value model
    this.brain.timeInputValueChanged.subscribe((newValue) => {
      this._onChange(newValue);
      this.value.set(newValue);
    });

    // forward brain touched events to the form's onTouched callback
    this.brain.timeInputTouched.subscribe(() => {
      this._onTouched();
    });

    // parse and apply the externally provided value into the brain when it changes
    effect(() => {
      const externalValue = this.value();
      const currentFormatted = untracked(() => this.brain.formattedValue());

      if (!externalValue || externalValue === currentFormatted) {
        return;
      }

      untracked(() => this.brain.parseAndSetValue(externalValue));
    });
  }

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this.brain.setInputElement(this._inputComponent.inputRef.nativeElement);

    if (this.defaultValue() && !this.brain.hasReceivedCvaValue()) {
      this.brain.parseAndSetValue(this.defaultValue());
      this.value.set(this.brain.formattedValue());
    }
  }

  /** delegates keydown to the brain */
  protected onKeyDown(event: KeyboardEvent): void {
    this.brain.handleKeyDown(event);
  }

  /** delegates focus to the brain */
  protected onFocus(): void {
    this.brain.handleFocus();
  }

  /** delegates blur to the brain */
  protected onBlur(): void {
    this.brain.handleBlur();
  }

  /** delegates click to the brain */
  protected onClick(): void {
    this.brain.handleClick();
  }

  /** @inheritdoc */
  public writeValue(value: string): void {
    this.brain.markReceivedCvaValue();

    if (!value) {
      return;
    }

    this.brain.parseAndSetValue(value);
    this.value.set(this.brain.formattedValue());
  }

  /** @inheritdoc */
  public registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  /** @inheritdoc */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** @inheritdoc */
  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}

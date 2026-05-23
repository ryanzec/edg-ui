import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import { allInputVariants, type InputVariant } from '../input/input';
import {
  TimeInputBrainDirective,
  TIME_INPUT_ARIA_LABEL_DEFAULT,
  TIME_INPUT_AUTO_FOCUS_DEFAULT,
  TIME_INPUT_DISABLED_DEFAULT,
  TIME_INPUT_FORMAT_DEFAULT,
  TIME_INPUT_READONLY_DEFAULT,
  type TimeInputFormat,
  type TimeInputSegment,
} from '../time-input/time-input-brain';

export { allTimeInputFormats, type TimeInputFormat } from '../time-input/time-input-brain';
export { allInputVariants, type InputVariant };

/** default value for the variant input */
export const TIME_INPUT_VARIANT_DEFAULT: InputVariant = 'bordered';

/** default value for the defaultValue input */
export const TIME_INPUT_DEFAULT_VALUE_DEFAULT = '';

/** placeholder glyph rendered when a digit segment has no value yet */
const DIGIT_PLACEHOLDER = '--';

/** placeholder glyph rendered when the meridiem segment has no value yet */
const MERIDIEM_PLACEHOLDER = '--';

@Component({
  selector: 'org-time-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './time-input.html',
  hostDirectives: [
    {
      directive: TimeInputBrainDirective,
      inputs: ['format', 'disabled', 'readonly', 'autoFocus', 'ariaLabel'],
      outputs: ['focused', 'blurred'],
    },
  ],
  host: {
    class: 'org-input',
    role: 'group',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[attr.data-time-input]': '"1"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-format]': 'format()',
    '[attr.data-state]': 'error() ? "error" : null',
    '[attr.data-focused]': 'brain.isFocused() ? "1" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-has-pre]': '"1"',
    '[attr.aria-label]': 'brain.ariaLabel()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '(focus)': 'onShellFocus()',
    '(blur)': 'onShellBlur()',
    '(keydown)': 'onShellKeyDown($event)',
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
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly brain = inject(TimeInputBrainDirective, { self: true });

  /** clock format — `'12-hour'` shows three segments, `'24-hour'` shows two */
  public readonly format = input<TimeInputFormat>(TIME_INPUT_FORMAT_DEFAULT);

  /** visual variant of the field shell */
  public readonly variant = input<InputVariant>(TIME_INPUT_VARIANT_DEFAULT);

  /** whether the field is disabled */
  public readonly disabled = input<boolean>(TIME_INPUT_DISABLED_DEFAULT);

  /** whether the field is readonly */
  public readonly readonly = input<boolean>(TIME_INPUT_READONLY_DEFAULT);

  /** name attribute used for the hidden form-value input */
  public readonly name = input.required<string>();

  /** default time value applied at init when no reactive form value is present */
  public readonly defaultValue = input<string>(TIME_INPUT_DEFAULT_VALUE_DEFAULT);

  /** whether the field should automatically receive focus on mount */
  public readonly autoFocus = input<boolean>(TIME_INPUT_AUTO_FOCUS_DEFAULT);

  /** accessible label for the shell */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(TIME_INPUT_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the field is in an error state (drives the error border via `data-state="error"`) */
  public readonly error = input<boolean>(false);

  /** current time value, supports two-way binding — `"hh:mm am/pm"` (12-hour) or `"HH:mm"` (24-hour) */
  public readonly value = model<string>('');

  /** emitted when the shell receives focus */
  public readonly focused = output<void>();

  /** emitted when the shell loses focus */
  public readonly blurred = output<void>();

  /** combined disabled state (proxied from brain) */
  protected readonly isDisabled = computed<boolean>(() => this.brain.isDisabled());

  /** hours-segment display glyph (real digits or placeholder dashes when empty) */
  protected readonly hoursDisplay = computed<string>(() =>
    this.brain.isHoursEmpty() ? DIGIT_PLACEHOLDER : this.brain.hours()
  );

  /** minutes-segment display glyph */
  protected readonly minutesDisplay = computed<string>(() =>
    this.brain.isMinutesEmpty() ? DIGIT_PLACEHOLDER : this.brain.minutes()
  );

  /** meridiem-segment display glyph (uppercased when present, dashes when empty) */
  protected readonly meridiemDisplay = computed<string>(() => {
    const value = this.brain.meridiem();

    if (value === '') {
      return MERIDIEM_PLACEHOLDER;
    }

    return value.toUpperCase();
  });

  /** whether the meridiem segment should render (only in 12-hour format) */
  protected readonly showMeridiem = computed<boolean>(() => this.format() === '12-hour');

  /** the value emitted into the hidden form input (always the brain's formatted value) */
  protected readonly hiddenInputValue = computed<string>(() => this.brain.formattedValue());

  constructor() {
    // forwards brain value-change events to the public value model so two-way `[(value)]` stays in sync
    this.brain.valueChanged.subscribe((newValue) => {
      this.value.set(newValue);
    });

    // parses and applies the externally provided value into the brain when it changes
    effect(() => {
      const externalValue = this.value();
      const currentFormatted = untracked(() => this.brain.formattedValue());

      if (externalValue === currentFormatted) {
        return;
      }

      untracked(() => {
        if (!externalValue) {
          this.brain.writeValue('');

          return;
        }

        this.brain.parseAndSetValue(externalValue);
      });
    });
  }

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this.brain.setHostElement(this._elementRef.nativeElement);

    if (this.defaultValue() && !this.brain.hasReceivedCvaValue()) {
      this.brain.parseAndSetValue(this.defaultValue());
      this.value.set(this.brain.formattedValue());
    }
  }

  /** segment click handler — selects the clicked segment as the active one */
  protected selectSegment(segment: TimeInputSegment, event: MouseEvent): void {
    event.stopPropagation();
    this.brain.selectSegment(segment);
    this._elementRef.nativeElement.focus();
  }

  /** shell focus handler — proxies to brain */
  protected onShellFocus(): void {
    this.brain.handleFocus();
  }

  /** shell blur handler — proxies to brain */
  protected onShellBlur(): void {
    this.brain.handleBlur();
  }

  /** shell keydown handler — proxies to brain */
  protected onShellKeyDown(event: KeyboardEvent): void {
    this.brain.handleKeyDown(event);
  }

  /** @inheritdoc */
  public writeValue(value: string): void {
    this.brain.writeValue(value);
    this.value.set(this.brain.formattedValue());
  }

  /** @inheritdoc */
  public registerOnChange(fn: (value: string) => void): void {
    this.brain.setOnChange(fn);
  }

  /** @inheritdoc */
  public registerOnTouched(fn: () => void): void {
    this.brain.setOnTouched(fn);
  }

  /** @inheritdoc */
  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}

import { Directive, computed, input, output, signal } from '@angular/core';

/** all available radio group orientation values */
export const allRadioGroupOrientations = ['horizontal', 'vertical'] as const;

/** the orientation of the radio group, used for keyboard arrow navigation */
export type RadioGroupOrientation = (typeof allRadioGroupOrientations)[number];

/**
 * shape required of any radio that wants to register with the radio group brain. kept free of any
 * `org` / `brain` naming so it stays a generic contract.
 */
export type RegisterableRadio = {
  /** the value the radio represents */
  value(): string;

  /** sets the selected state on the radio */
  setSelected(selected: boolean): void;

  /** moves dom focus to the radio */
  focus(): void;

  /** the radio's host element, used to sort registrants in dom order */
  hostElement(): HTMLElement;
};

/** default value for the value input */
export const RADIO_GROUP_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const RADIO_GROUP_DISABLED_DEFAULT = false;

/** default value for the orientation input */
export const RADIO_GROUP_ORIENTATION_DEFAULT: RadioGroupOrientation = 'vertical';

/** default value for the ariaLabel input */
export const RADIO_GROUP_ARIA_LABEL_DEFAULT: string | null = null;

/**
 * headless brain directive for the radio-group component. owns the selected value state, the form-controlled flag,
 * the orientation that drives keyboard arrow routing, and a registry of child radio brains so it can drive their
 * selected state and dom focus directly without depending on any specific child component type.
 */
@Directive({
  selector: '[orgRadioGroupBrain]',
  exportAs: 'orgRadioGroupBrain',
  host: {
    '[attr.role]': '"radiogroup"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class RadioGroupBrainDirective {
  /** whether the group is currently controlled by reactive forms */
  private readonly _isFormControlled = signal<boolean>(false);

  /** internal signal holding the currently selected value */
  private readonly _internalValue = signal<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** registered child radios; iterated in dom order via `compareDocumentPosition` */
  private readonly _registered = new Set<RegisterableRadio>();

  /** the externally bound value input (used in non-form binding) */
  public readonly value = input<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** whether all radios in the group are disabled */
  public readonly disabled = input<boolean>(RADIO_GROUP_DISABLED_DEFAULT);

  /** orientation of the group; gates which arrow keys route next/previous */
  public readonly orientation = input<RadioGroupOrientation>(RADIO_GROUP_ORIENTATION_DEFAULT);

  /** accessibility label exposed on the host as `aria-label` */
  public readonly ariaLabel = input<string | null>(RADIO_GROUP_ARIA_LABEL_DEFAULT);

  /** emits the newly selected value when a radio is selected via this brain */
  public readonly valueChange = output<string>();

  /** the resolved current value — uses internal state when form-controlled, otherwise the value input */
  public readonly currentValue = computed<string>(() => {
    if (this._isFormControlled()) {
      return this._internalValue();
    }

    return this.value();
  });

  /** registers a child radio so the group can drive its selected state and dom focus */
  public registerRadio(radio: RegisterableRadio): void {
    this._registered.add(radio);
    radio.setSelected(radio.value() === this.currentValue());
  }

  /** unregisters a previously-registered child radio */
  public unregisterRadio(radio: RegisterableRadio): void {
    this._registered.delete(radio);
  }

  /** marks the group as reactive-forms-controlled and switches `currentValue` to the internal source */
  public setFormControlled(): void {
    this._isFormControlled.set(true);
  }

  /** sets the internal value (used by writeValue from reactive forms) */
  public setInternalValue(value: string): void {
    this._internalValue.set(value ?? RADIO_GROUP_VALUE_DEFAULT);
    this._syncSelectedStates();
  }

  /** selects the given value and emits the change; gated by disabled */
  public selectValue(value: string): void {
    if (this.disabled()) {
      return;
    }

    this._internalValue.set(value);
    this.valueChange.emit(value);
    this._syncSelectedStates();
  }

  /** moves selection AND dom focus to the registrant after the given current value, wrapping around */
  public focusNext(currentValue: string): void {
    if (this.disabled()) {
      return;
    }

    const ordered = this._orderedRegistered();

    if (ordered.length === 0) {
      return;
    }

    const currentIndex = ordered.findIndex((radio) => radio.value() === currentValue);
    const next = ordered[(currentIndex + 1) % ordered.length];
    this.selectValue(next.value());
    next.focus();
  }

  /** moves selection AND dom focus to the registrant before the given current value, wrapping around */
  public focusPrevious(currentValue: string): void {
    if (this.disabled()) {
      return;
    }

    const ordered = this._orderedRegistered();

    if (ordered.length === 0) {
      return;
    }

    const currentIndex = ordered.findIndex((radio) => radio.value() === currentValue);
    const previous = ordered[(currentIndex - 1 + ordered.length) % ordered.length];
    this.selectValue(previous.value());
    previous.focus();
  }

  /** pushes the current selected state to every registrant */
  private _syncSelectedStates(): void {
    const current = this.currentValue();

    this._registered.forEach((radio) => {
      radio.setSelected(radio.value() === current);
    });
  }

  /** sorts registrants by dom position so navigation order matches the rendered tree */
  private _orderedRegistered(): RegisterableRadio[] {
    return [...this._registered].sort((first, second) => {
      const position = first.hostElement().compareDocumentPosition(second.hostElement());

      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }

      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }

      return 0;
    });
  }
}

import { Directive, DestroyRef, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { RadioGroupBrainDirective, RegisterableRadio } from './radio-group-brain';

/** default value for the disabled input */
export const RADIO_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the radio component. owns the registration with the group, the local selected
 * state, and the resolved disabled / validation context the presentation needs to drive its visual states.
 *
 * a11y, focus, and click/keyboard activation are intentionally NOT handled here — the presentation renders a
 * real `<input type="radio">` inside a wrapping `<label>`, and the native input owns role, aria-checked,
 * focus, space/enter activation, and arrow-key routing within shared `name`. the brain only listens for the
 * native `change` event (via `handleNativeChange`) so it can route selection to the group or emit
 * `selectionRequested` for standalone consumers.
 */
@Directive({
  selector: '[orgRadioBrain]',
  exportAs: 'orgRadioBrain',
})
export class RadioBrainDirective implements RegisterableRadio {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _groupBrain = inject(RadioGroupBrainDirective, { optional: true });
  private readonly _selected = signal<boolean>(false);
  private readonly _hasValidationMessage = signal<boolean>(false);
  private readonly _validationMessageId = signal<string | null>(null);

  /** the value this radio represents */
  public readonly value = input.required<string>();

  /** whether the radio is locally disabled */
  public readonly disabled = input<boolean>(RADIO_DISABLED_DEFAULT);

  /** whether this radio is currently selected */
  public readonly isChecked = computed<boolean>(() => this._selected());

  /** the resolved disabled state — local disabled OR the parent group's disabled */
  public readonly effectiveDisabled = computed<boolean>(() => {
    return this.disabled() || (this._groupBrain?.disabled() ?? false);
  });

  /** the resolved aria-invalid value — true when this radio (or its group) has a validation message */
  public readonly ariaInvalid = computed<boolean | null>(() => {
    if (this._hasValidationMessage() || (this._groupBrain?.hasValidationMessage() ?? false)) {
      return true;
    }

    return null;
  });

  /** the resolved aria-describedby value — uses the local message id when present, falling back to the group's */
  public readonly ariaDescribedBy = computed<string | null>(() => {
    if (this._hasValidationMessage()) {
      return this._validationMessageId();
    }

    if (this._groupBrain?.hasValidationMessage()) {
      return this._groupBrain.validationMessageId();
    }

    return null;
  });

  /** emitted when the user activates this radio (only meaningful for standalone use; group-mode is driven by the group) */
  public readonly selectionRequested = output<void>();

  constructor() {
    const groupBrain = this._groupBrain;

    if (groupBrain) {
      groupBrain.registerRadio(this);
      inject(DestroyRef).onDestroy(() => groupBrain.unregisterRadio(this));

      /**
       * reactively syncs the local selected state to the group's current value. running inside an effect
       * (rather than reading `value()` synchronously in the constructor) is required because the `value`
       * required-input is not yet bound at constructor time — angular 21 throws NG0950 if you read it then.
       * effects first-run during the next change-detection pass, after inputs have been bound.
       */
      effect(() => {
        this._selected.set(this.value() === groupBrain.currentValue());
      });
    }
  }

  /** moves dom focus to the host element (used by the group brain when programmatically syncing focus) */
  public focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** the host element, exposed so the group brain can sort registrants in dom order */
  public hostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** sets the validation context driving aria-invalid / aria-describedby for this radio */
  public setValidationContext(hasMessage: boolean, messageId: string | null): void {
    this._hasValidationMessage.set(hasMessage);
    this._validationMessageId.set(messageId);
  }

  /** routes a native `change` event from the presentation's `<input type="radio">` into the brain's selection logic */
  public handleNativeChange(): void {
    if (this.effectiveDisabled()) {
      return;
    }

    if (this._groupBrain) {
      this._groupBrain.selectValue(this.value());

      return;
    }

    if (!this.isChecked()) {
      this._selected.set(true);
    }

    this.selectionRequested.emit();
  }
}

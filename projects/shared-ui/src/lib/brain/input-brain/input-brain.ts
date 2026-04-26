import { Directive, OnDestroy, computed, effect, inject, input, output, signal } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';

/** default value for the inputSelectAllOnFocus input */
export const INPUT_SELECT_ALL_ON_FOCUS_DEFAULT = false;

/** default value for the inputDisabled input */
export const INPUT_DISABLED_DEFAULT = false;

/** the internal state shape for the input brain directive */
type InputState = {
  isFocused: boolean;
  showPassword: boolean;
  isDisabledFromForms: boolean;
};

/**
 * headless brain directive for the input component. owns the interaction state (focused, password-visible,
 * form-disabled), the FocusMonitor lifecycle, focused / blurred event emission with the optional select-all-on-focus
 * behaviour, and the password visibility toggle. the presentation pushes the native input element into the brain
 * once viewchild resolves so the brain can monitor focus and select-all without owning the template ref directly.
 */
@Directive({
  selector: '[orgInputBrain]',
  exportAs: 'orgInputBrain',
})
export class InputBrainDirective implements OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);

  private readonly _state = signal<InputState>({
    isFocused: false,
    showPassword: false,
    isDisabledFromForms: false,
  });

  private readonly _inputElement = signal<HTMLInputElement | null>(null);

  private _focusSubscription: { unsubscribe: () => void } | null = null;
  private _monitoredElement: HTMLInputElement | null = null;

  /** whether to select all text when the input receives focus */
  public readonly inputSelectAllOnFocus = input<boolean>(INPUT_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether the input is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly inputDisabled = input<boolean>(INPUT_DISABLED_DEFAULT);

  /** emitted when the input receives focus */
  public readonly inputFocused = output<void>();

  /** emitted when the input loses focus */
  public readonly inputBlurred = output<void>();

  /** whether the input currently has focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** whether the password is currently visible (only meaningful when showPasswordToggle is enabled and type is password) */
  public readonly showPassword = computed<boolean>(() => this._state().showPassword);

  /** the resolved disabled state (consumer-disabled OR form-disabled) */
  public readonly isDisabled = computed<boolean>(() => this.inputDisabled() || this._state().isDisabledFromForms);

  constructor() {
    // start / restart focus monitoring whenever the input element is (re)provided
    effect(() => {
      const element = this._inputElement();

      if (this._monitoredElement && this._monitoredElement !== element) {
        this._focusSubscription?.unsubscribe();
        this._focusMonitor.stopMonitoring(this._monitoredElement);
        this._monitoredElement = null;
        this._focusSubscription = null;
      }

      if (!element || this._monitoredElement === element) {
        return;
      }

      this._monitoredElement = element;
      this._focusSubscription = this._focusMonitor.monitor(element).subscribe((origin) => {
        const wasFocused = this._state().isFocused;
        const isFocused = !!origin;

        this._state.update((state) => ({
          ...state,
          isFocused,
        }));

        if (isFocused && !wasFocused) {
          this.inputFocused.emit();

          if (this.inputSelectAllOnFocus()) {
            element.select();
          }
        } else if (!isFocused && wasFocused) {
          this.inputBlurred.emit();
        }
      });
    });
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this._focusSubscription?.unsubscribe();

    if (this._monitoredElement) {
      this._focusMonitor.stopMonitoring(this._monitoredElement);
      this._monitoredElement = null;
    }
  }

  /** registers the native input element so the brain can monitor focus on it */
  public setInputElement(element: HTMLInputElement | null): void {
    this._inputElement.set(element);
  }

  /** toggles the password visibility; presentation is responsible for gating this on input type / consumer opt-in */
  public togglePasswordVisibility(): void {
    this._state.update((state) => ({
      ...state,
      showPassword: !state.showPassword,
    }));
  }

  /** sets the form-controlled disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(disabled: boolean): void {
    this._state.update((state) => ({
      ...state,
      isDisabledFromForms: disabled,
    }));
  }

  /** programmatically focuses the registered native input element */
  public focusInput(): void {
    if (this.isDisabled()) {
      return;
    }

    this._inputElement()?.focus();
  }
}

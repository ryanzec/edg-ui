import { Directive, OnDestroy, computed, effect, inject, input, output, signal } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';

/** default value for the selectAllOnFocus input */
export const TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT = false;

/** default value for the disabled input */
export const TEXTAREA_DISABLED_DEFAULT = false;

/** default value for the inverseEnter input */
export const TEXTAREA_INVERSE_ENTER_DEFAULT = false;

/** the internal state shape for the textarea brain directive */
type TextareaState = {
  isFocused: boolean;
  isDisabledFromForms: boolean;
};

/**
 * headless brain directive for the textarea component. mirrors the input-brain shape — owns focus / form-disabled
 * state, FocusMonitor lifecycle, focused / blurred event emission with select-all-on-focus, and programmatic focus.
 * additionally owns the enter-key handling that respects the inverseEnter configuration. the presentation pushes
 * the native textarea element into the brain once viewchild resolves.
 */
@Directive({
  selector: '[orgTextareaBrain]',
  exportAs: 'orgTextareaBrain',
})
export class TextareaBrainDirective implements OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);

  private readonly _state = signal<TextareaState>({
    isFocused: false,
    isDisabledFromForms: false,
  });

  private readonly _textareaElement = signal<HTMLTextAreaElement | null>(null);

  private readonly _enterPressed$ = new Subject<void>();

  private _focusSubscription: { unsubscribe: () => void } | null = null;
  private _monitoredElement: HTMLTextAreaElement | null = null;

  /** whether to select all text when the textarea receives focus */
  public readonly selectAllOnFocus = input<boolean>(TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether the textarea is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly disabled = input<boolean>(TEXTAREA_DISABLED_DEFAULT);

  /** when true, enter submits and shift+enter adds a new line; when false, the behavior is reversed */
  public readonly inverseEnter = input<boolean>(TEXTAREA_INVERSE_ENTER_DEFAULT);

  /** emitted when the textarea receives focus */
  public readonly focused = output<void>();

  /** emitted when the textarea loses focus */
  public readonly blurred = output<void>();

  /** emitted when the configured submit key combination is pressed */
  public readonly enterPressed = outputFromObservable(this._enterPressed$);

  /** whether the textarea currently has focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** the resolved disabled state (consumer-disabled OR form-disabled) */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._state().isDisabledFromForms);

  constructor() {
    // start / restart focus monitoring whenever the textarea element is (re)provided
    effect(() => {
      const element = this._textareaElement();

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
          this.focused.emit();

          if (this.selectAllOnFocus()) {
            element.select();
          }
        } else if (!isFocused && wasFocused) {
          this.blurred.emit();
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

  /** registers the native textarea element so the brain can monitor focus on it */
  public setTextareaElement(element: HTMLTextAreaElement | null): void {
    this._textareaElement.set(element);
  }

  /** sets the form-controlled disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(disabled: boolean): void {
    this._state.update((state) => ({
      ...state,
      isDisabledFromForms: disabled,
    }));
  }

  /** programmatically focuses the registered native textarea element */
  public focusTextarea(): void {
    this._textareaElement()?.focus();
  }

  /** handles keydown events; when the configured submit key combo is pressed, prevents default and emits enterPressed */
  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    const shouldTriggerEvent = this.inverseEnter() ? !event.shiftKey : event.shiftKey;

    if (!shouldTriggerEvent) {
      return;
    }

    event.preventDefault();
    this._enterPressed$.next();
  }
}

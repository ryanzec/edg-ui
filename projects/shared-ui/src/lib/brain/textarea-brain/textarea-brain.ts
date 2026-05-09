import {
  DestroyRef,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { angularUtils } from '@organization/shared-utils';
import { FORM_FIELD_COMPONENT } from '../../core/form-fields/form-field';

/** default initial value the brain assigns when no writes have happened */
export const TEXTAREA_INITIAL_VALUE = '';

/** default value for the selectAllOnFocus input */
export const TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT = false;

/** default value for the disabled input */
export const TEXTAREA_DISABLED_DEFAULT = false;

/** default value for the readonly input */
export const TEXTAREA_READONLY_DEFAULT = false;

/** default value for the autoFocus input */
export const TEXTAREA_AUTO_FOCUS_DEFAULT = false;

/** default value for the inverseEnter input */
export const TEXTAREA_INVERSE_ENTER_DEFAULT = false;

/** default value for the preIconAriaLabel input */
export const TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the postIconAriaLabel input */
export const TEXTAREA_POST_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** the internal state shape for the textarea brain directive */
type TextareaState = {
  isFocused: boolean;
  isDisabledFromForms: boolean;
};

/**
 * headless brain directive for the textarea. owns interaction state (focused, form-disabled, value), focus monitoring
 * via the angular cdk, native value / blur / input event handling, accessible attribute exposure (including
 * pre/post-icon aria labels and form-field validation a11y wiring), submit-key (enter / shift+enter) routing, and
 * reactive forms callback plumbing. carries no styling — apply directly to a native textarea element inside a
 * presentation component.
 */
@Directive({
  selector: 'textarea[orgTextareaBrain]',
  exportAs: 'orgTextareaBrain',
  host: {
    '[value]': 'value()',
    '[disabled]': 'isDisabled()',
    '[readonly]': 'readonly()',
    '[name]': 'name()',
    '[attr.id]': 'name() || null',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '(input)': 'handleNativeInput($event)',
    '(blur)': 'handleNativeBlur()',
    '(keydown)': 'handleKeyDown($event)',
  },
})
export class TextareaBrainDirective implements OnInit, OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });

  /** the ElementRef for the native textarea element this brain is attached to */
  public readonly elementRef = inject(ElementRef<HTMLTextAreaElement>);

  private readonly _state = signal<TextareaState>({
    isFocused: false,
    isDisabledFromForms: false,
  });

  private readonly _submitKeyPressed$ = new Subject<void>();
  private readonly _preIconRequested$ = new Subject<void>();
  private readonly _postIconRequested$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private _hasAppliedAutoFocus = false;

  /** the textarea name attribute, also used as the element id for label association */
  public readonly name = input.required<string>();

  /** the current value of the textarea, two-way bindable via [(value)] */
  public readonly value = model<string>(TEXTAREA_INITIAL_VALUE);

  /** whether to select all text when the textarea receives focus */
  public readonly selectAllOnFocus = input<boolean>(TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether the textarea is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly disabled = input<boolean>(TEXTAREA_DISABLED_DEFAULT);

  /** whether the textarea is readonly */
  public readonly readonly = input<boolean>(TEXTAREA_READONLY_DEFAULT);

  /** whether the textarea should automatically receive focus on first commit */
  public readonly autoFocus = input<boolean>(TEXTAREA_AUTO_FOCUS_DEFAULT);

  /** when true, enter submits and shift+enter adds a new line; when false, the behavior is reversed */
  public readonly inverseEnter = input<boolean>(TEXTAREA_INVERSE_ENTER_DEFAULT);

  /** accessible label for the pre-icon button when it is interactive */
  public readonly preIconAriaLabel = input<string | undefined, string | null | undefined>(
    TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** accessible label for the post-icon button when it is interactive */
  public readonly postIconAriaLabel = input<string | undefined, string | null | undefined>(
    TEXTAREA_POST_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** emitted when the textarea receives focus */
  public readonly focused = output<void>();

  /** emitted when the textarea loses focus */
  public readonly blurred = output<void>();

  /** emitted when the configured submit key combination is pressed */
  public readonly submitKeyPressed = outputFromObservable(this._submitKeyPressed$);

  /** emitted by the brain when a pre-icon click was requested and the textarea is interactive */
  public readonly preIconRequested = outputFromObservable(this._preIconRequested$);

  /** emitted by the brain when a post-icon click was requested and the textarea is interactive */
  public readonly postIconRequested = outputFromObservable(this._postIconRequested$);

  /** whether the textarea currently has focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** the resolved disabled state combining the consumer-provided disabled input and the form-controlled state */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._state().isDisabledFromForms);

  /** whether the user is currently allowed to interact with the textarea */
  public readonly isInteractive = computed<boolean>(() => !this.isDisabled());

  /** whether the user is allowed to modify content (combines disabled and readonly) */
  public readonly canModifyContent = computed<boolean>(() => !this.isDisabled() && !this.readonly());

  /** whether the pre-icon click has any registered listener */
  public readonly hasPreIconObserver = computed<boolean>(() => this._preIconRequested$.observed);

  /** whether the post-icon click has any registered listener */
  public readonly hasPostIconObserver = computed<boolean>(() => this._postIconRequested$.observed);

  /** whether the pre-icon should be rendered as an interactive button (click observed) */
  public readonly isPreIconInteractive = computed<boolean>(() => this.hasPreIconObserver());

  /** whether the post-icon should be rendered as an interactive button (click observed) */
  public readonly isPostIconInteractive = computed<boolean>(() => this.hasPostIconObserver());

  /** whether the associated form-field currently has a validation message */
  public readonly hasValidationMessage = computed<boolean>(() => {
    return !!this._formField?.brain.hasValidationMessage();
  });

  /** aria-describedby value pointing to the form-field validation message id when present */
  public readonly ariaDescribedBy = computed<string | null>(() => {
    if (!this.hasValidationMessage()) {
      return null;
    }

    return this._formField?.brain.validationMessageId ?? null;
  });

  /** aria-invalid value, true when a validation message is currently present */
  public readonly ariaInvalid = computed<boolean | null>(() => (this.hasValidationMessage() ? true : null));

  constructor() {
    // apply auto-focus exactly once on the first true value
    effect(() => {
      if (this._hasAppliedAutoFocus || !this.autoFocus()) {
        return;
      }

      this._hasAppliedAutoFocus = true;
      this.elementRef.nativeElement.focus();
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    this._focusMonitor
      .monitor(this.elementRef.nativeElement)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((origin) => {
        const wasFocused = this._state().isFocused;
        const isFocused = !!origin;

        this._state.update((state) => ({ ...state, isFocused }));

        if (isFocused && !wasFocused) {
          this.focused.emit();

          if (this.selectAllOnFocus()) {
            this.elementRef.nativeElement.select();
          }

          return;
        }

        if (!isFocused && wasFocused) {
          this.blurred.emit();
        }
      });
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  /** handles native input events, updating internal value and notifying the form / consumer */
  public handleNativeInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const nextValue = target.value;

    this.value.set(nextValue);
    this._onChange(nextValue);
  }

  /** handles native blur events, marking the form control as touched */
  public handleNativeBlur(): void {
    this._onTouched();
  }

  /** handles keydown events; when the configured submit key combo is pressed, prevents default and emits submitKeyPressed */
  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    const shouldTriggerEvent = this.inverseEnter() ? !event.shiftKey : event.shiftKey;

    if (!shouldTriggerEvent) {
      return;
    }

    event.preventDefault();
    this._submitKeyPressed$.next();
  }

  /** routes a pre-icon click request through the brain's interaction gating */
  public handlePreIconRequest(): void {
    if (!this.isInteractive()) {
      return;
    }

    this._preIconRequested$.next();
  }

  /** routes a post-icon click request through the brain's interaction gating */
  public handlePostIconRequest(): void {
    if (!this.isInteractive()) {
      return;
    }

    this._postIconRequested$.next();
  }

  /** programmatically focuses the native textarea element when interaction is allowed */
  public focusInput(): void {
    if (!this.isInteractive()) {
      return;
    }

    this.elementRef.nativeElement.focus();
  }

  /** programmatically blurs the native textarea element */
  public blurInput(): void {
    this.elementRef.nativeElement.blur();
  }

  /** sets the form-controlled disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(isDisabled: boolean): void {
    this._state.update((state) => ({ ...state, isDisabledFromForms: isDisabled }));
  }

  /** writes a value into the textarea from a reactive form */
  public writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
  }

  /** registers the form's onChange callback */
  public setOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  /** registers the form's onTouched callback */
  public setOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}

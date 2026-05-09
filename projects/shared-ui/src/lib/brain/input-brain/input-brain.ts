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

/** all input types supported by the brain */
export const allInputTypes = ['text', 'password', 'email', 'number', 'tel', 'url'] as const;

/** union type of all supported input types */
export type InputType = (typeof allInputTypes)[number];

/** default initial value the brain assigns when no writes have happened */
export const INPUT_INITIAL_VALUE = '';

/** default value for the type input */
export const INPUT_TYPE_DEFAULT: InputType = 'text';

/** default value for the selectAllOnFocus input */
export const INPUT_SELECT_ALL_ON_FOCUS_DEFAULT = false;

/** default value for the disabled input */
export const INPUT_DISABLED_DEFAULT = false;

/** default value for the readonly input */
export const INPUT_READONLY_DEFAULT = false;

/** default value for the autoFocus input */
export const INPUT_AUTO_FOCUS_DEFAULT = false;

/** default value for the showPasswordToggle input */
export const INPUT_SHOW_PASSWORD_TOGGLE_DEFAULT = false;

/** default value for the autocomplete input */
export const INPUT_AUTOCOMPLETE_DEFAULT = 'off';

/** default value for the blockPasswordManager input */
export const INPUT_BLOCK_PASSWORD_MANAGER_DEFAULT = true;

/** default value for the ariaExpanded input */
export const INPUT_ARIA_EXPANDED_DEFAULT: boolean | undefined = undefined;

/** default value for the ariaHasPopup input */
export const INPUT_ARIA_HAS_POPUP_DEFAULT: string | undefined = undefined;

/** default value for the ariaAutoComplete input */
export const INPUT_ARIA_AUTO_COMPLETE_DEFAULT: string | undefined = undefined;

/** default value for the ariaActiveDescendant input */
export const INPUT_ARIA_ACTIVE_DESCENDANT_DEFAULT: string | undefined = undefined;

/** default value for the ariaControls input */
export const INPUT_ARIA_CONTROLS_DEFAULT: string | undefined = undefined;

/** default value for the role input */
export const INPUT_ROLE_DEFAULT: string | undefined = undefined;

/** default value for the ariaLabel input */
export const INPUT_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** the internal state shape for the input brain directive */
type InputState = {
  isFocused: boolean;
  showPassword: boolean;
  isDisabledFromForms: boolean;
};

/**
 * headless brain directive for the input. owns interaction state (focused, password-visible, form-disabled, value),
 * focus monitoring via the angular cdk, native value / blur / input event handling, password visibility toggle,
 * accessible attribute exposure, validation a11y wiring through the form-field token, and reactive forms callback
 * plumbing. carries no styling — apply directly to a native input element inside a presentation component.
 */
@Directive({
  selector: 'input[orgInputBrain]',
  exportAs: 'orgInputBrain',
  host: {
    '[type]': 'effectiveType()',
    '[value]': 'value()',
    '[disabled]': 'isDisabled()',
    '[readonly]': 'readonly()',
    '[name]': 'name()',
    '[attr.id]': 'name() || null',
    '[attr.autocomplete]': 'autocomplete()',
    '[attr.data-ip-ignore]': 'blockPasswordManager() ? "true" : null',
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-expanded]': 'ariaExpanded()',
    '[attr.aria-haspopup]': 'ariaHasPopup()',
    '[attr.aria-autocomplete]': 'ariaAutoComplete()',
    '[attr.aria-activedescendant]': 'ariaActiveDescendant()',
    '[attr.aria-controls]': 'ariaControls()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '(input)': 'handleNativeInput($event)',
    '(blur)': 'handleNativeBlur()',
  },
})
export class InputBrainDirective implements OnInit, OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });

  /** the ElementRef for the native input element this brain is attached to */
  public readonly elementRef = inject(ElementRef<HTMLInputElement>);

  private readonly _state = signal<InputState>({
    isFocused: false,
    showPassword: false,
    isDisabledFromForms: false,
  });

  private readonly _preIconRequested$ = new Subject<void>();
  private readonly _postIconRequested$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private _hasAppliedAutoFocus = false;

  /** the html input type */
  public readonly type = input<InputType>(INPUT_TYPE_DEFAULT);

  /** the input name attribute, also used as the element id for label association */
  public readonly name = input.required<string>();

  /** the current value of the input, two-way bindable via [(value)] */
  public readonly value = model<string>(INPUT_INITIAL_VALUE);

  /** whether to select all text when the input receives focus */
  public readonly selectAllOnFocus = input<boolean>(INPUT_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether the input is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly disabled = input<boolean>(INPUT_DISABLED_DEFAULT);

  /** whether the input is readonly */
  public readonly readonly = input<boolean>(INPUT_READONLY_DEFAULT);

  /** whether the input should automatically receive focus on first commit */
  public readonly autoFocus = input<boolean>(INPUT_AUTO_FOCUS_DEFAULT);

  /** whether to expose a password visibility toggle (only meaningful when type is password) */
  public readonly showPasswordToggle = input<boolean>(INPUT_SHOW_PASSWORD_TOGGLE_DEFAULT);

  /** value for the native autocomplete attribute */
  public readonly autocomplete = input<string>(INPUT_AUTOCOMPLETE_DEFAULT);

  /** whether to add the data attribute that blocks password manager extensions */
  public readonly blockPasswordManager = input<boolean>(INPUT_BLOCK_PASSWORD_MANAGER_DEFAULT);

  /** aria-expanded attribute value forwarded to the native input */
  public readonly ariaExpanded = input<boolean | undefined, boolean | null | undefined>(INPUT_ARIA_EXPANDED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-haspopup attribute value forwarded to the native input */
  public readonly ariaHasPopup = input<string | undefined, string | null | undefined>(INPUT_ARIA_HAS_POPUP_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-autocomplete attribute value forwarded to the native input */
  public readonly ariaAutoComplete = input<string | undefined, string | null | undefined>(
    INPUT_ARIA_AUTO_COMPLETE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** aria-activedescendant attribute value forwarded to the native input */
  public readonly ariaActiveDescendant = input<string | undefined, string | null | undefined>(
    INPUT_ARIA_ACTIVE_DESCENDANT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** aria-controls attribute value forwarded to the native input */
  public readonly ariaControls = input<string | undefined, string | null | undefined>(INPUT_ARIA_CONTROLS_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** role attribute value forwarded to the native input */
  public readonly role = input<string | undefined, string | null | undefined>(INPUT_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-label forwarded to the native input */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(INPUT_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** emitted when the input receives focus */
  public readonly focused = output<void>();

  /** emitted when the input loses focus */
  public readonly blurred = output<void>();

  /** emitted by the brain when a pre-icon click was requested and the input is interactive */
  public readonly preIconRequested = outputFromObservable(this._preIconRequested$);

  /** emitted by the brain when a post-icon click was requested and the action is not the password toggle */
  public readonly postIconRequested = outputFromObservable(this._postIconRequested$);

  /** whether the input currently has focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** whether the password is currently visible */
  public readonly showPassword = computed<boolean>(() => this._state().showPassword);

  /** the resolved disabled state combining the consumer-provided disabled input and the form-controlled state */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._state().isDisabledFromForms);

  /** the effective type attribute, accounting for the password visibility toggle when active */
  public readonly effectiveType = computed<InputType>(() => {
    if (this.type() === 'password' && this.showPasswordToggle() && this.showPassword()) {
      return 'text';
    }

    return this.type();
  });

  /** whether the user is currently allowed to interact with the input */
  public readonly isInteractive = computed<boolean>(() => !this.isDisabled());

  /** whether the user is allowed to modify content (combines disabled and readonly) */
  public readonly canModifyContent = computed<boolean>(() => !this.isDisabled() && !this.readonly());

  /** whether the post-icon should route to the password toggle action when clicked */
  public readonly isPasswordToggleActive = computed<boolean>(() => {
    return this.showPasswordToggle() && this.type() === 'password';
  });

  /** whether the post-icon click has any registered listener (icon-clicked output observed) */
  public readonly hasPostIconObserver = computed<boolean>(() => this._postIconRequested$.observed);

  /** whether the pre-icon click has any registered listener */
  public readonly hasPreIconObserver = computed<boolean>(() => this._preIconRequested$.observed);

  /** whether the post-icon should be rendered as an interactive button (password toggle or click observed) */
  public readonly isPostIconInteractive = computed<boolean>(() => {
    return this.isPasswordToggleActive() || this.hasPostIconObserver();
  });

  /** whether the pre-icon should be rendered as an interactive button (click observed) */
  public readonly isPreIconInteractive = computed<boolean>(() => this.hasPreIconObserver());

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
    const target = event.target as HTMLInputElement;
    const nextValue = target.value;

    this.value.set(nextValue);
    this._onChange(nextValue);
  }

  /** handles native blur events, marking the form control as touched */
  public handleNativeBlur(): void {
    this._onTouched();
  }

  /** routes a pre-icon click request through the brain's interaction gating */
  public handlePreIconRequest(): void {
    if (!this.isInteractive()) {
      return;
    }

    this._preIconRequested$.next();
  }

  /** routes a post-icon click request, toggling password visibility when appropriate */
  public handlePostIconRequest(): void {
    if (!this.isInteractive()) {
      return;
    }

    if (this.isPasswordToggleActive()) {
      this._togglePasswordVisibility();

      return;
    }

    this._postIconRequested$.next();
  }

  /** programmatically focuses the native input element when interaction is allowed */
  public focusInput(): void {
    if (!this.isInteractive()) {
      return;
    }

    this.elementRef.nativeElement.focus();
  }

  /** programmatically blurs the native input element */
  public blurInput(): void {
    this.elementRef.nativeElement.blur();
  }

  /** sets the form-controlled disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(isDisabled: boolean): void {
    this._state.update((state) => ({ ...state, isDisabledFromForms: isDisabled }));
  }

  /** writes a value into the input from a reactive form */
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

  /** toggles password visibility */
  private _togglePasswordVisibility(): void {
    this._state.update((state) => ({ ...state, showPassword: !state.showPassword }));
  }
}

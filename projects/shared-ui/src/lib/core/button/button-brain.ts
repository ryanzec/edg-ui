import {
  Directive,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { angularUtils, logManager } from '@organization/shared-utils';

/** the internal state shape for the button brain directive */
type ButtonState = {
  isPressed: boolean;
  isFocused: boolean;
};

/** default value for the disabled input */
export const BUTTON_DISABLED_DEFAULT = false;

/** default value for the loading input */
export const BUTTON_LOADING_DEFAULT = false;

/** default value for the iconOnly input */
export const BUTTON_ICON_ONLY_DEFAULT = false;

/** default value for the active input */
export const BUTTON_ACTIVE_DEFAULT = false;

/** default value for the ariaLabel input */
export const BUTTON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the ariaExpanded input */
export const BUTTON_ARIA_EXPANDED_DEFAULT: boolean | undefined = undefined;

/** default value for the ariaPressed input */
export const BUTTON_ARIA_PRESSED_DEFAULT: boolean | undefined = undefined;

/** default value for the ariaHaspopup input */
export const BUTTON_ARIA_HASPOPUP_DEFAULT: string | undefined = undefined;

/** default value for the ariaControls input */
export const BUTTON_ARIA_CONTROLS_DEFAULT: string | undefined = undefined;

/** default value for the ariaActivedescendant input */
export const BUTTON_ARIA_ACTIVEDESCENDANT_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the button. owns interaction state (pressed / focused), pointer and touch event
 * handling, focus monitoring via the angular cdk, native disabled binding, and all aria attributes. carries no
 * styling or template — apply it to a native button element inside a presentation component.
 */
@Directive({
  selector: 'button[orgButtonBrain]',
  exportAs: 'orgButtonBrain',
  host: {
    '[disabled]': 'isDisabled()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-expanded]': 'ariaExpanded()',
    '[attr.aria-pressed]': 'ariaPressed()',
    '[attr.aria-haspopup]': 'ariaHaspopup()',
    '[attr.aria-controls]': 'ariaControls()',
    '[attr.aria-activedescendant]': 'ariaActivedescendant()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '(click)': 'click()',
    '(mousedown)': 'mouseDown()',
    '(mouseup)': 'mouseUp()',
    '(mouseleave)': 'mouseLeave()',
    '(touchstart)': 'touchStart()',
    '(touchend)': 'touchEnd()',
    '(touchcancel)': 'touchCancel()',
  },
})
export class ButtonBrainDirective implements OnInit, OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _state = signal<ButtonState>({
    isPressed: false,
    isFocused: false,
  });

  private readonly _clicked$ = new Subject<void>();

  /** whether the button is disabled and non-interactive */
  public readonly disabled = input<boolean>(BUTTON_DISABLED_DEFAULT);

  /** whether the button is in a loading state, also disables interaction */
  public readonly loading = input<boolean>(BUTTON_LOADING_DEFAULT);

  /** whether the host button is rendered in icon-only mode; used to enforce the aria-label requirement */
  public readonly iconOnly = input<boolean>(BUTTON_ICON_ONLY_DEFAULT);

  /** whether the button is rendered in its active (pressed) visual state */
  public readonly active = input<boolean>(BUTTON_ACTIVE_DEFAULT);

  /** accessible label for icon-only buttons or when the visual label needs an override */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(BUTTON_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates whether a controlled element is expanded or collapsed */
  public readonly ariaExpanded = input<boolean | undefined, boolean | null | undefined>(BUTTON_ARIA_EXPANDED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates the pressed/selected state when used as a toggle button */
  public readonly ariaPressed = input<boolean | undefined, boolean | null | undefined>(BUTTON_ARIA_PRESSED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates that the button opens a popup (e.g. `'listbox'`, `'menu'`, `'dialog'`) */
  public readonly ariaHaspopup = input<string | undefined, string | null | undefined>(BUTTON_ARIA_HASPOPUP_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** identifies the element controlled by this button (e.g. the panel id) */
  public readonly ariaControls = input<string | undefined, string | null | undefined>(BUTTON_ARIA_CONTROLS_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** identifies the currently active descendant for composite widgets (e.g. listbox option ids) */
  public readonly ariaActivedescendant = input<string | undefined, string | null | undefined>(
    BUTTON_ARIA_ACTIVEDESCENDANT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** emitted when the host button is clicked while not disabled or loading */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** whether the button is currently being pressed */
  public readonly isPressed = computed<boolean>(() => this._state().isPressed);

  /** whether the button currently holds keyboard or pointer focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** whether the button should be treated as disabled (true when either disabled or loading) */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this.loading());

  constructor() {
    // warn when an icon-only button is missing the aria label required for accessibility
    effect(() => {
      if (this.iconOnly() && !this.ariaLabel()) {
        logManager.warn({
          type: 'button-missing-aria-label',
          message: 'icon-only buttons require an ariaLabel input for accessibility',
        });
      }
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    this._focusMonitor
      .monitor(this._elementRef.nativeElement, true)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((origin) => {
        queueMicrotask(() => {
          this._state.update((state) => ({
            ...state,
            isFocused: !!origin,
          }));
        });
      });
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  /** handles click events, emitting clicked when the button is not disabled or loading */
  protected click(): void {
    if (this.isDisabled()) {
      return;
    }

    this._clicked$.next();
  }

  /** sets the pressed state when the pointer is depressed over the button */
  protected mouseDown(): void {
    if (this.isDisabled()) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      isPressed: true,
    }));
  }

  /** clears the pressed state when the pointer is released */
  protected mouseUp(): void {
    this._state.update((state) => ({
      ...state,
      isPressed: false,
    }));
  }

  /** clears the pressed state when the pointer leaves the button area */
  protected mouseLeave(): void {
    this._state.update((state) => ({
      ...state,
      isPressed: false,
    }));
  }

  /** sets the pressed state when the button is touched */
  protected touchStart(): void {
    if (this.isDisabled()) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      isPressed: true,
    }));
  }

  /** clears the pressed state when the touch is released */
  protected touchEnd(): void {
    this._state.update((state) => ({
      ...state,
      isPressed: false,
    }));
  }

  /** clears the pressed state when the touch is cancelled */
  protected touchCancel(): void {
    this._state.update((state) => ({
      ...state,
      isPressed: false,
    }));
  }
}

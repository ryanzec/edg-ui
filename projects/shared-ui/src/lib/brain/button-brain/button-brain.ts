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
import { logManager } from '@organization/shared-utils';

/** the internal state shape for the button brain directive */
type ButtonState = {
  isPressed: boolean;
  isFocused: boolean;
};

/** default value for the buttonDisabled input */
export const BUTTON_DISABLED_DEFAULT = false;

/** default value for the buttonLoading input */
export const BUTTON_LOADING_DEFAULT = false;

/** default value for the buttonIconOnly input */
export const BUTTON_ICON_ONLY_DEFAULT = false;

/** default value for the buttonAriaLabel input */
export const BUTTON_ARIA_LABEL_DEFAULT: string | null = null;

/** default value for the buttonAriaExpanded input */
export const BUTTON_ARIA_EXPANDED_DEFAULT: boolean | null = null;

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
    '[attr.aria-label]': 'buttonAriaLabel()',
    '[attr.aria-expanded]': 'buttonAriaExpanded()',
    '[attr.aria-busy]': 'buttonLoading() ? "true" : null',
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
  public readonly buttonDisabled = input<boolean>(BUTTON_DISABLED_DEFAULT);

  /** whether the button is in a loading state, also disables interaction */
  public readonly buttonLoading = input<boolean>(BUTTON_LOADING_DEFAULT);

  /** whether the host button is rendered in icon-only mode; used to enforce the aria-label requirement */
  public readonly buttonIconOnly = input<boolean>(BUTTON_ICON_ONLY_DEFAULT);

  /** accessible label for icon-only buttons or when the visual label needs an override */
  public readonly buttonAriaLabel = input<string | null>(BUTTON_ARIA_LABEL_DEFAULT);

  /** communicates whether a controlled element is expanded or collapsed */
  public readonly buttonAriaExpanded = input<boolean | null>(BUTTON_ARIA_EXPANDED_DEFAULT);

  /** emitted when the host button is clicked while not disabled or loading */
  public readonly buttonClicked = outputFromObservable(this._clicked$);

  /** whether the button is currently being pressed */
  public readonly isPressed = computed<boolean>(() => this._state().isPressed);

  /** whether the button currently holds keyboard or pointer focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** whether the button should be treated as disabled (true when either disabled or loading) */
  public readonly isDisabled = computed<boolean>(() => this.buttonDisabled() || this.buttonLoading());

  constructor() {
    // warn when an icon-only button is missing the aria label required for accessibility
    effect(() => {
      if (this.buttonIconOnly() && !this.buttonAriaLabel()) {
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

  /** handles click events, emitting buttonClicked when the button is not disabled or loading */
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

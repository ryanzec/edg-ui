import { Directive, DestroyRef, ElementRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

/** the internal interaction state for the box brain directive */
type BoxState = {
  isPressed: boolean;
  isFocused: boolean;
};

/**
 * headless brain directive for the box. owns the optional clickable interaction layer — role/tabindex/keyboard
 * activation, pressed/focused state, and the clicked output — without any styling concerns. clickable mode is
 * auto-detected when a consumer subscribes to the `clicked` output, and can also be forced on by a wrapping
 * component (e.g. card) via `setExternallyClickable`.
 */
@Directive({
  selector: '[orgBoxBrain]',
  exportAs: 'orgBoxBrain',
  host: {
    '[attr.role]': 'isClickable() ? "button" : null',
    '[attr.tabindex]': 'isClickable() ? "0" : null',
    '[attr.data-clickable]': 'isClickable() ? "" : null',
    '[attr.data-pressed]': 'isPressed() ? "" : null',
    '(click)': 'click()',
    '(keydown)': 'keydown($event)',
    '(mousedown)': 'mouseDown()',
    '(mouseup)': 'mouseUp()',
    '(mouseleave)': 'mouseLeave()',
  },
})
export class BoxBrainDirective implements OnInit, OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _state = signal<BoxState>({
    isPressed: false,
    isFocused: false,
  });

  private readonly _externallyClickable = signal<boolean>(false);

  private readonly _clicked$ = new Subject<void>();

  /** emitted when the host is clicked or activated via Enter / Space while in clickable mode */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** whether the host should render as an interactive button (auto-detected, or forced by a wrapper) */
  public readonly isClickable = computed<boolean>(() => {
    // read both eagerly so `_externallyClickable` is always registered as a signal dependency — short-circuit
    // evaluation on `||` would otherwise skip the signal read when `_clicked$.observed` is true, leaving the
    // computed unable to invalidate when a wrapper (e.g. card) later flips externally-clickable back off.
    const observed = this._clicked$.observed;
    const externallyClickable = this._externallyClickable();

    return observed || externallyClickable;
  });

  /** whether the host is currently being pressed by mouse or keyboard activation */
  public readonly isPressed = computed<boolean>(() => this._state().isPressed);

  /** whether the host currently holds keyboard or pointer focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

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

  /**
   * lets a wrapping component force the host into clickable mode regardless of whether the `clicked` output is
   * directly observed. used by card to propagate its own listener detection down to the inner box.
   */
  public setExternallyClickable(value: boolean): void {
    this._externallyClickable.set(value);
  }

  /** handles pointer clicks, emitting clicked when the host is in clickable mode */
  protected click(): void {
    if (!this.isClickable()) {
      return;
    }

    this._clicked$.next();
  }

  /** handles enter / space activation, emitting clicked and suppressing default behavior */
  protected keydown(event: KeyboardEvent): void {
    if (!this.isClickable()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this._clicked$.next();
  }

  /** sets the pressed state when the pointer is depressed over the host */
  protected mouseDown(): void {
    if (!this.isClickable()) {
      return;
    }

    this._state.update((state) => ({ ...state, isPressed: true }));
  }

  /** clears the pressed state when the pointer is released */
  protected mouseUp(): void {
    this._state.update((state) => ({ ...state, isPressed: false }));
  }

  /** clears the pressed state when the pointer leaves the host area */
  protected mouseLeave(): void {
    this._state.update((state) => ({ ...state, isPressed: false }));
  }
}

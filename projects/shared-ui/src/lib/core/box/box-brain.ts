import {
  Directive,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocusMonitor } from '@angular/cdk/a11y';

/** the internal interaction state for the box brain directive */
type BoxState = {
  isPressed: boolean;
  isFocused: boolean;
};

/** default value for the isClickable input */
export const BOX_BRAIN_IS_CLICKABLE_DEFAULT = false;

/** all available box expanded state values */
export const allBoxExpandedStates = ['full', 'header-only', 'none'] as const;

/**
 * the tri-state expand mode for the box.
 *
 * full: the box surface renders fully expanded (header + all regions)
 * header-only: the box surface renders but the collapsible regions (image / content / footer) are hidden
 * none: the box surface does not render at all — only an outer header (if projected) remains
 */
export type BoxExpandedState = (typeof allBoxExpandedStates)[number];

/** default value for the expandedState model */
export const BOX_EXPANDED_STATE_DEFAULT: BoxExpandedState = 'full';

/** default value for the isExpandable input */
export const BOX_BRAIN_IS_EXPANDABLE_DEFAULT = false;

/**
 * headless brain directive for the box. owns the optional clickable interaction layer — role/tabindex/keyboard
 * activation, pressed/focused state, and the clicked output — without any styling concerns. clickable mode is
 * enabled by the explicit `isClickable` input, and can also be forced on by a wrapping component (e.g. card)
 * via `setExternallyClickable`. it also owns the box's tri-state expand affordance (`expandedState`): the two
 * box headers inject Box to drive different transitions — the internal header flips full ⟷ header-only, the
 * outer header flips full ⟷ none.
 */
@Directive({
  selector: '[orgBoxBrain]',
  exportAs: 'orgBoxBrain',
  host: {
    '[attr.role]': 'isInteractive() ? "button" : null',
    '[attr.tabindex]': 'isInteractive() ? "0" : null',
    '[attr.data-clickable]': 'isInteractive() ? "" : null',
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

  /** whether the host is an explicit click target */
  public readonly isClickable = input<boolean>(BOX_BRAIN_IS_CLICKABLE_DEFAULT);

  /** whether the host supports the expand / collapse affordance at all */
  public readonly isExpandable = input<boolean>(BOX_BRAIN_IS_EXPANDABLE_DEFAULT);

  /** the current expanded state of the box; ignored by consumers when isExpandable is false */
  public readonly expandedState = model<BoxExpandedState>(BOX_EXPANDED_STATE_DEFAULT);

  /** emitted when the host is clicked or activated via Enter / Space while in clickable mode */
  public readonly clicked = output<void>();

  /** whether the host should render as an interactive button (explicit isClickable input, or forced by a wrapper) */
  public readonly isInteractive = computed<boolean>(() => {
    // read both eagerly so each stays a registered dependency regardless of `||` short-circuit evaluation,
    // keeping the computed reactive when a wrapper (e.g. card) later flips externally-clickable back off.
    const clickable = this.isClickable();
    const externallyClickable = this._externallyClickable();

    return clickable || externallyClickable;
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

  /**
   * internal box header toggle: flips between full and header-only. no-ops when not expandable so consumers do
   * not need to guard. only meaningful while the box surface renders (state is not none).
   */
  public toggleHeaderOnly(): void {
    if (!this.isExpandable()) {
      return;
    }

    this.expandedState.update((value) => (value === 'full' ? 'header-only' : 'full'));
  }

  /**
   * outer box header toggle: flips between full and none. no-ops when not expandable so consumers do not need to
   * guard. collapsing from header-only also resolves to none so the single outer toggle always restores to full.
   */
  public toggleNone(): void {
    if (!this.isExpandable()) {
      return;
    }

    this.expandedState.update((value) => (value === 'none' ? 'full' : 'none'));
  }

  /** handles pointer clicks, emitting clicked when the host is in clickable mode */
  protected click(): void {
    if (!this.isInteractive()) {
      return;
    }

    this.clicked.emit();
  }

  /** handles enter / space activation, emitting clicked and suppressing default behavior */
  protected keydown(event: KeyboardEvent): void {
    if (!this.isInteractive()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.clicked.emit();
  }

  /** sets the pressed state when the pointer is depressed over the host */
  protected mouseDown(): void {
    if (!this.isInteractive()) {
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

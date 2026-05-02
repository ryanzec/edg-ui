import { Directive, DestroyRef, PLATFORM_ID, computed, effect, inject, input, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import scrollparent from 'scrollparent';
import { domUtils } from '@organization/shared-utils';

/** all valid auto scroll states */
export const allAutoScrollStates = ['enabled', 'disabled', 'forced-disabled'] as const;

/** the auto scroll state machine value */
export type AutoScrollState = (typeof allAutoScrollStates)[number];

/** options for the public scrollToBottom method */
export type AutoScrollScrollToBottomOptions = {
  onAfterScroll?: () => void;
};

/** default value for the enabled input */
export const AUTO_SCROLL_ENABLED_DEFAULT = true;

/** the internal state shape for the auto scroll brain directive */
type AutoScrollDirectiveState = {
  autoScrollState: AutoScrollState;
};

/**
 * headless brain directive for the auto-scroll component. owns the auto-scroll state machine, the intersection /
 * resize / scroll observers, programmatic scroll tracking, the public scrollToBottom api, and cleanup. carries no
 * styling and no template.
 *
 * the presentation component is responsible for rendering the sentinel and content-wrapper elements, then pushing
 * those native references into this directive via the `setSentinelElement` and `setContentWrapperElement` methods
 * once the view has rendered. the presentation should also detect dom mutations (e.g. via cdkObserveContent) and
 * call `notifyContentChanged` so the brain can re-evaluate scroll position.
 */
@Directive({
  selector: '[orgAutoScrollBrain]',
  exportAs: 'orgAutoScrollBrain',
})
export class AutoScrollBrainDirective {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _state = signal<AutoScrollDirectiveState>({
    autoScrollState: 'enabled',
  });

  private readonly _sentinelElement = signal<HTMLElement | null>(null);
  private readonly _contentWrapperElement = signal<HTMLElement | null>(null);

  private _scrollableParent: HTMLElement | null = null;
  private _scrollListenerTarget: HTMLElement | null = null;
  private _scrollListener: (() => void) | null = null;
  private _intersectionObserver: IntersectionObserver | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _targetScrollTop: number | null = null;
  private _scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
  private _pendingScrollCallback: (() => void) | null = null;

  /** whether auto-scroll-to-bottom is currently enabled by the consumer */
  public readonly enabled = input<boolean>(AUTO_SCROLL_ENABLED_DEFAULT);

  /** emitted whenever the internal auto-scroll state changes */
  public readonly stateChange = output<AutoScrollState>();

  /** emitted once the brain has detected a scrollable parent and finished initialising its observers */
  public readonly ready = output<void>();

  /** the current auto-scroll state */
  public readonly autoScrollState = computed<AutoScrollState>(() => this._state().autoScrollState);

  constructor() {
    this._setupEnabledInputEffect();
    this._setupStateChangeEffect();
    this._setupInitializationEffect();

    this._destroyRef.onDestroy(() => {
      this._cleanup();
    });
  }

  /** sets the sentinel element from the presentation; brain initialises observers once both refs are populated */
  public setSentinelElement(element: HTMLElement | null): void {
    this._sentinelElement.set(element);
  }

  /** sets the content-wrapper element from the presentation; brain initialises observers once both refs are populated */
  public setContentWrapperElement(element: HTMLElement | null): void {
    this._contentWrapperElement.set(element);
  }

  /** notifies the brain that projected content has mutated; presentation calls this from cdkObserveContent */
  public notifyContentChanged(): void {
    if (this._state().autoScrollState === 'enabled') {
      this._scrollToBottom();
    }
  }

  /** updates the auto scroll state machine */
  public setAutoScrollState(newState: AutoScrollState): void {
    this._state.update((state) => ({
      ...state,
      autoScrollState: newState,
    }));
  }

  /** returns the current auto scroll state */
  public getAutoScrollState(): AutoScrollState {
    return this._state().autoScrollState;
  }

  /** programmatically scrolls the detected scrollable parent to its bottom */
  public scrollToBottom(options?: AutoScrollScrollToBottomOptions): void {
    if (!isPlatformBrowser(this._platformId) || !this._scrollableParent) {
      return;
    }

    this._targetScrollTop = this._scrollableParent.scrollHeight - this._scrollableParent.clientHeight;

    if (options?.onAfterScroll) {
      this._pendingScrollCallback = options.onAfterScroll;
    }

    this._scrollableParent.scrollTo({
      top: this._targetScrollTop,
      behavior: 'smooth',
    });
  }

  /** initialises observers and the scroll listener once both element refs are populated and we are in the browser */
  private _setupInitializationEffect(): void {
    let initialized = false;

    effect(() => {
      const sentinel = this._sentinelElement();
      const contentWrapper = this._contentWrapperElement();

      if (initialized || !sentinel || !contentWrapper || !isPlatformBrowser(this._platformId)) {
        return;
      }

      this._detectScrollableParent(contentWrapper);

      if (!this._scrollableParent) {
        return;
      }

      this._setupIntersectionObserver(sentinel);
      this._setupResizeObserver(contentWrapper);
      this._setupScrollListener();
      this._initializeAutoScrollState();
      initialized = true;
      this.ready.emit();
    });
  }

  /** detects the nearest scrollable ancestor of the provided element */
  private _detectScrollableParent(element: HTMLElement): void {
    const parent = scrollparent(element);

    if (!parent || parent === document.documentElement || parent === document.body) {
      this._scrollableParent = null;

      return;
    }

    this._scrollableParent = parent as HTMLElement;
  }

  /** sets initial state based on the enabled input */
  private _initializeAutoScrollState(): void {
    if (this.enabled()) {
      this._state.update((state) => ({
        ...state,
        autoScrollState: 'enabled',
      }));

      return;
    }

    this._state.update((state) => ({
      ...state,
      autoScrollState: 'forced-disabled',
    }));
  }

  /** observes the sentinel element to determine whether the user is at the bottom */
  private _setupIntersectionObserver(sentinel: HTMLElement): void {
    if (!this._scrollableParent) {
      return;
    }

    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        this._onIntersection(entries);
      },
      {
        root: this._scrollableParent,
      }
    );

    this._intersectionObserver.observe(sentinel);
  }

  /** observes the content wrapper for size changes that may require an auto-scroll */
  private _setupResizeObserver(contentWrapper: HTMLElement): void {
    if (!this._scrollableParent) {
      return;
    }

    this._resizeObserver = new ResizeObserver(() => {
      if (this._state().autoScrollState === 'enabled') {
        this._scrollToBottom();
      }
    });

    this._resizeObserver.observe(contentWrapper);
  }

  /** listens for scroll events on the scrollable parent to detect programmatic scroll completion */
  private _setupScrollListener(): void {
    if (!this._scrollableParent) {
      return;
    }

    this._scrollListener = () => this._onScroll();
    this._scrollListenerTarget = this._scrollableParent;
    this._scrollableParent.addEventListener('scroll', this._scrollListener);
  }

  /** emits stateChange whenever the internal state machine transitions */
  private _setupStateChangeEffect(): void {
    effect(() => {
      this.stateChange.emit(this._state().autoScrollState);
    });
  }

  /** reacts to enabled transitions to force-disable or re-evaluate the state machine */
  private _setupEnabledInputEffect(): void {
    let previousValue = this.enabled();

    effect(() => {
      const currentValue = this.enabled();

      if (previousValue === currentValue) {
        return;
      }

      // true -> false: force-disable
      if (previousValue && !currentValue) {
        this._state.update((state) => ({
          ...state,
          autoScrollState: 'forced-disabled',
        }));
      }

      // false -> true: re-evaluate based on sentinel visibility
      if (!previousValue && currentValue) {
        this._checkSentinelVisibility();
      }

      previousValue = currentValue;
    });
  }

  /** updates the state machine based on whether the sentinel is currently visible in the scrollable parent */
  private _checkSentinelVisibility(): void {
    const sentinel = this._sentinelElement();

    if (!this._scrollableParent || !sentinel) {
      return;
    }

    const isOutOfView = domUtils.isElementOutOfView(this._scrollableParent, sentinel);

    this._state.update((state) => ({
      ...state,
      autoScrollState: !isOutOfView ? 'enabled' : 'disabled',
    }));
  }

  /** updates state machine based on intersection observer entries */
  private _onIntersection(entries: IntersectionObserverEntry[]): void {
    if (this._state().autoScrollState === 'forced-disabled' || this._targetScrollTop !== null) {
      return;
    }

    for (const entry of entries) {
      this._state.update((state) => ({
        ...state,
        autoScrollState: entry.isIntersecting ? 'enabled' : 'disabled',
      }));
    }
  }

  /** detects programmatic scroll completion to fire the pending after-scroll callback */
  private _onScroll(): void {
    if (!this._scrollableParent) {
      return;
    }

    if (this._scrollEndTimeout) {
      clearTimeout(this._scrollEndTimeout);
    }

    if (this._targetScrollTop === null) {
      return;
    }

    const currentScrollTop = this._scrollableParent.scrollTop;
    const threshold = 2;

    if (Math.abs(currentScrollTop - this._targetScrollTop) >= threshold) {
      return;
    }

    const callback = this._pendingScrollCallback;
    this._targetScrollTop = null;
    this._pendingScrollCallback = null;

    if (!callback) {
      return;
    }

    this._scrollEndTimeout = setTimeout(() => {
      callback();
      this._scrollEndTimeout = null;
    }, 150);
  }

  /** smooth-scrolls the detected scrollable parent to its bottom */
  private _scrollToBottom(): void {
    if (!this._scrollableParent) {
      return;
    }

    this._targetScrollTop = this._scrollableParent.scrollHeight - this._scrollableParent.clientHeight;

    this._scrollableParent.scrollTo({
      top: this._targetScrollTop,
      behavior: 'smooth',
    });
  }

  /** disconnects observers, removes listeners, and clears any pending timeout */
  private _cleanup(): void {
    if (this._scrollListener && this._scrollListenerTarget) {
      this._scrollListenerTarget.removeEventListener('scroll', this._scrollListener);
      this._scrollListenerTarget = null;
      this._scrollListener = null;
    }

    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    if (this._scrollEndTimeout) {
      clearTimeout(this._scrollEndTimeout);
      this._scrollEndTimeout = null;
    }

    this._pendingScrollCallback = null;
  }
}

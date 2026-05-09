import { Directive, computed, input, model, signal } from '@angular/core';
import type { TabBrainDirective } from '../tab-brain/tab-brain';

type TabListRole = 'tablist';

/** default value for the scrollable input */
export const TABS_SCROLLABLE_DEFAULT = false;

/** the internal state shape for the tabs brain directive */
type TabsState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

/**
 * headless brain directive for the tabs component. owns the active value (model), scrollable mode flag,
 * the scroll-state machine for horizontal scroll controls, the keyboard navigation handler for the
 * tablist, and the active-tab scroll-into-view behavior. the presentation pushes a `setOrderedTabsProvider`
 * callback (its contentChildren-derived ordered list of tab brains) and registers the tablist scroll
 * container so the brain can route focus and recompute scroll state without depending on any specific
 * dom traversal.
 */
@Directive({
  selector: '[orgTabsBrain]',
  exportAs: 'orgTabsBrain',
})
export class TabsBrainDirective {
  private readonly _state = signal<TabsState>({
    canScrollLeft: false,
    canScrollRight: false,
  });

  /** lookup the presentation pushes in to provide the ordered list of tab brains */
  private _getOrderedTabs: () => readonly TabBrainDirective[] = () => [];

  /** the registered scroll container element (the tablist); set by the presentation after view init */
  private _scrollContainer: HTMLElement | null = null;

  /** the active tab value; two-way bound by the presentation host */
  public readonly value = model.required<string>();

  /** whether the tabs are scrollable with navigation controls and scroll-state routing */
  public readonly scrollable = input<boolean>(TABS_SCROLLABLE_DEFAULT);

  /** static aria role applied by the presentation to the inner tablist element */
  public readonly tablistRole: TabListRole = 'tablist';

  /** whether the tabs container can be scrolled to the left */
  public readonly canScrollLeft = computed<boolean>(() => this._state().canScrollLeft);

  /** whether the tabs container can be scrolled to the right */
  public readonly canScrollRight = computed<boolean>(() => this._state().canScrollRight);

  /** registers the lookup the brain uses to resolve the ordered list of tab brains */
  public setOrderedTabsProvider(provider: () => readonly TabBrainDirective[]): void {
    this._getOrderedTabs = provider;
  }

  /** registers the tablist scroll container; recomputes scroll state once registered */
  public registerScrollContainer(container: HTMLElement | null): void {
    this._scrollContainer = container;

    if (container) {
      this.recalcScrollState(container);
    }
  }

  /** smooth-scrolls the registered container to the left by 80% of its visible width */
  public scrollLeft(): void {
    this._scrollByPercent(-1);
  }

  /** smooth-scrolls the registered container to the right by 80% of its visible width */
  public scrollRight(): void {
    this._scrollByPercent(1);
  }

  /** recomputes the scroll-state from the provided container's current scroll position */
  public recalcScrollState(container: HTMLElement): void {
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 1;

    this._state.set({
      canScrollLeft,
      canScrollRight,
    });
  }

  /** event handler bound to the tablist scroll/scrollend events; recomputes scroll state from the event target */
  public handleContainerScroll(event: Event): void {
    const target = event.currentTarget as HTMLElement | null;

    if (!target) {
      return;
    }

    this.recalcScrollState(target);
  }

  /** keyboard navigation handler for the tablist: arrow-left / arrow-right wrap focus, home / end jump to ends */
  public handleKeyDown(event: KeyboardEvent): void {
    const tabs = this._getOrderedTabs();

    if (tabs.length === 0) {
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab.hasFocus());

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        tabs[previousIndex]?.focus();
        break;
      }

      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        tabs[nextIndex]?.focus();
        break;
      }

      case 'Home': {
        event.preventDefault();
        tabs[0]?.focus();
        break;
      }

      case 'End': {
        event.preventDefault();
        tabs[tabs.length - 1]?.focus();
        break;
      }
    }
  }

  /** scrolls the active tab into view; no-op when scrollable is false or no active tab is found */
  public scrollActiveIntoView(): void {
    if (!this.scrollable()) {
      return;
    }

    const tabs = this._getOrderedTabs();
    const activeTab = tabs.find((tab) => tab.value() === this.value());

    activeTab?.hostElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }

  private _scrollByPercent(direction: -1 | 1): void {
    const container = this._scrollContainer;

    if (!container) {
      return;
    }

    const scrollAmount = container.clientWidth * 0.8 * direction;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  }
}

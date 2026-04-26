import { Directive, computed, signal } from '@angular/core';

/** the internal state shape for the tabs brain directive */
type TabsState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

/**
 * headless brain directive for the tabs component. owns the scroll-state machine for the horizontal scroll
 * controls. the presentation owns the tabs container element and pushes scroll-state recalculations into the brain
 * by calling `recalcScrollState(container)`. the brain's scroll methods receive the container as a parameter so the
 * brain stays detached from any specific dom reference.
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

  /** whether the tabs container can be scrolled to the left */
  public readonly canScrollLeft = computed<boolean>(() => this._state().canScrollLeft);

  /** whether the tabs container can be scrolled to the right */
  public readonly canScrollRight = computed<boolean>(() => this._state().canScrollRight);

  /** smooth-scrolls the provided container to the left by 80% of its visible width */
  public scrollLeft(container: HTMLElement): void {
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  }

  /** smooth-scrolls the provided container to the right by 80% of its visible width */
  public scrollRight(container: HTMLElement): void {
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
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
}

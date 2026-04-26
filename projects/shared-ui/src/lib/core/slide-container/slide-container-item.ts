import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { SLIDE_CONTAINER } from './slide-container';

@Component({
  selector: 'org-slide-container-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './slide-container-item.css',
  host: {
    role: 'group',
    '[attr.data-position]': 'position()',
    '[attr.data-orientation]': 'containerOrientation()',
    '[attr.data-size]': 'containerSize()',
    '[attr.aria-roledescription]': '"slide"',
    '[attr.aria-label]': 'slideAriaLabel()',
    '[attr.aria-hidden]': 'ariaHidden()',
  },
})
export class SlideContainerItem {
  /** reference to the parent slide container via injection token */
  private readonly _container = inject(SLIDE_CONTAINER, { host: true });

  /** reference to the host element for measuring content height */
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  /** zero-based index of this item within the container, set by the parent */
  private readonly _index = signal<number>(-1);

  /** position of this item relative to the active slide, drives css animation */
  protected readonly position = computed<'active' | 'before' | 'after' | null>(() => {
    const myIndex = this._index();

    if (myIndex === -1) {
      return null;
    }

    const activeIndex = this._container.displayActiveIndex();

    if (myIndex === activeIndex) {
      return 'active';
    }

    if (this._container.allowLooping() === false) {
      return myIndex < activeIndex ? 'before' : 'after';
    }

    // for looping: the previously active item must exit in the direction of navigation
    // so that wrap-around exits animate correctly (e.g. last→first exits left, not right)
    const previousIndex = this._container.previousDisplayIndex();

    if (myIndex === previousIndex) {
      return this._container.navigationDirection() === 'forward' ? 'before' : 'after';
    }

    return myIndex < activeIndex ? 'before' : 'after';
  });

  /** orientation mirrored from the parent container for css styling */
  protected readonly containerOrientation = computed(() => this._container.orientation());

  /** size mode mirrored from the parent container for css styling */
  protected readonly containerSize = computed(() => this._container.size());

  /** accessible label announcing this slide's position within the set */
  protected readonly slideAriaLabel = computed<string | null>(() => {
    const index = this._index();

    if (index === -1) {
      return null;
    }

    return `Slide ${index + 1} of ${this._container.slideCount()}`;
  });

  /** hides inactive slides from assistive technology */
  protected readonly ariaHidden = computed<'true' | null>(() => (this.position() !== 'active' ? 'true' : null));

  /**
   * sets the zero-based index of this item within the container
   * called by the parent SlideContainer during content synchronisation
   */
  public setIndex(index: number): void {
    this._index.set(index);
  }

  /** returns the rendered height of this item's host element in pixels */
  public getContentHeight(): number {
    return this._elementRef.nativeElement.offsetHeight;
  }
}

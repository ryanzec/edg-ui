import { Directive, computed, inject, signal } from '@angular/core';
import { SlideContainerBrainDirective } from '../slide-container-brain/slide-container-brain';

/** position of a slide-container item relative to the active slide */
export const allSlideContainerItemPositions = ['active', 'before', 'after'] as const;

/** position type for a slide-container item; null when the item has not yet been registered */
export type SlideContainerItemPosition = (typeof allSlideContainerItemPositions)[number] | null;

/** sentinel index used until the presentation registers the item's index via setIndex */
const UNREGISTERED_INDEX = -1;

/**
 * headless brain directive for slide-container item content. owns the item's index registration with the
 * parent slide-container brain, the position computation (active/before/after) that drives both
 * presentation styling and aria-hidden state, and the slide-role + aria-label + aria-hidden accessibility
 * wiring on the host. carries no sizing, spacing, color, or animation concerns.
 */
@Directive({
  selector: '[orgSlideContainerItemBrain]',
  exportAs: 'orgSlideContainerItemBrain',
  host: {
    role: 'group',
    '[attr.aria-roledescription]': '"slide"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-hidden]': 'ariaHidden()',
  },
})
export class SlideContainerItemBrainDirective {
  /** reference to the parent slide-container brain for shared navigation state */
  private readonly _parentBrain = inject(SlideContainerBrainDirective);

  /** zero-based index of this item within the container, set by the presentation */
  private readonly _index = signal<number>(UNREGISTERED_INDEX);

  /** zero-based index of this item; -1 until registered by the presentation */
  public readonly index = computed<number>(() => this._index());

  /** position of this item relative to the active slide; drives presentation styling and aria-hidden */
  public readonly position = computed<SlideContainerItemPosition>(() => {
    const myIndex = this._index();

    if (myIndex === UNREGISTERED_INDEX) {
      return null;
    }

    const activeIndex = this._parentBrain.displayActiveIndex();

    if (myIndex === activeIndex) {
      return 'active';
    }

    if (this._parentBrain.allowLooping() === false) {
      return myIndex < activeIndex ? 'before' : 'after';
    }

    // for looping: the previously active item must exit in the direction of navigation so wrap-around
    // exits animate correctly (e.g. last→first exits left, not right)
    const previousIndex = this._parentBrain.previousDisplayIndex();

    if (myIndex === previousIndex) {
      return this._parentBrain.navigationDirection() === 'forward' ? 'before' : 'after';
    }

    return myIndex < activeIndex ? 'before' : 'after';
  });

  /** accessible label announcing this slide's position within the set */
  public readonly ariaLabel = computed<string | null>(() => {
    const index = this._index();

    if (index === UNREGISTERED_INDEX) {
      return null;
    }

    return `Slide ${index + 1} of ${this._parentBrain.slideCount()}`;
  });

  /** hides inactive slides from assistive technology */
  public readonly ariaHidden = computed<'true' | null>(() => (this.position() !== 'active' ? 'true' : null));

  /** sets the zero-based index of this item within the container; called by the presentation */
  public setIndex(index: number): void {
    this._index.set(index);
  }
}

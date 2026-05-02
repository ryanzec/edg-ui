import {
  Directive,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';

/** all valid orientation values for the slide container brain */
export const allSlideContainerOrientations = ['horizontal', 'vertical'] as const;

/** orientation type for the slide container brain */
export type SlideContainerOrientation = (typeof allSlideContainerOrientations)[number];

/** all valid size values for the slide container brain */
export const allSlideContainerSizes = ['stable', 'dynamic'] as const;

/** size type for the slide container brain */
export type SlideContainerSize = (typeof allSlideContainerSizes)[number];

/** default value for the orientation input */
export const SLIDE_CONTAINER_ORIENTATION_DEFAULT: SlideContainerOrientation = 'horizontal';

/** default value for the size input */
export const SLIDE_CONTAINER_SIZE_DEFAULT: SlideContainerSize = 'stable';

/** default value for the allowLooping input */
export const SLIDE_CONTAINER_ALLOW_LOOPING_DEFAULT = false;

/** default value for the activeIndex model */
export const SLIDE_CONTAINER_ACTIVE_INDEX_DEFAULT = 0;

/** the navigation direction tracked by the brain */
export type SlideContainerDirection = 'forward' | 'backward';

/** the internal state shape for the slide container brain directive */
type SlideContainerState = {
  slideCount: number;
  direction: SlideContainerDirection;
  previousDisplayIndex: number;
  displayActiveIndex: number;
};

/**
 * headless brain directive for the slide container component. owns the active index, the navigation direction
 * tracking, the slide count state, and the dynamic-height measurement scheduling. does not own the contentChildren
 * query — the presentation owns that and pushes the slide count into the brain via setSlideCount, since the
 * children depend on the presentation component as an injection token.
 */
@Directive({
  selector: '[orgSlideContainerBrain]',
  exportAs: 'orgSlideContainerBrain',
})
export class SlideContainerBrainDirective {
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _injector = inject(Injector);

  private readonly _state = signal<SlideContainerState>({
    slideCount: 0,
    direction: 'forward',
    previousDisplayIndex: 0,
    displayActiveIndex: 0,
  });

  /** orientation of the slide animation */
  public readonly orientation = input<SlideContainerOrientation>(SLIDE_CONTAINER_ORIENTATION_DEFAULT);

  /** sizing mode — stable keeps the largest slide height; dynamic resizes to the active slide */
  public readonly size = input<SlideContainerSize>(SLIDE_CONTAINER_SIZE_DEFAULT);

  /** whether navigation wraps around from the last slide back to the first */
  public readonly allowLooping = input<boolean>(SLIDE_CONTAINER_ALLOW_LOOPING_DEFAULT);

  /** two-way bindable index of the currently active slide */
  public readonly activeIndex = model<number>(SLIDE_CONTAINER_ACTIVE_INDEX_DEFAULT);

  /** total number of slide items */
  public readonly slideCount = computed<number>(() => this._state().slideCount);

  /** index of the currently displayed active slide */
  public readonly displayActiveIndex = computed<number>(() => this._state().displayActiveIndex);

  /** current navigation direction, used by items to animate in the correct direction */
  public readonly navigationDirection = computed<SlideContainerDirection>(() => this._state().direction);

  /** index that was previously displayed, used by items to animate out correctly during looping */
  public readonly previousDisplayIndex = computed<number>(() => this._state().previousDisplayIndex);

  constructor() {
    // track direction so the exiting item animates to the correct side
    effect(() => {
      const newIndex = this.activeIndex();
      const allowLooping = this.allowLooping();
      const prevState = untracked(() => this._state());
      const prevIndex = prevState.displayActiveIndex;
      const count = prevState.slideCount;

      if (newIndex === prevIndex) {
        return;
      }

      let direction: SlideContainerDirection;

      if (allowLooping && count > 1) {
        const forwardDist = (newIndex - prevIndex + count) % count;
        const backwardDist = (prevIndex - newIndex + count) % count;
        direction = forwardDist <= backwardDist ? 'forward' : 'backward';
      } else {
        direction = newIndex > prevIndex ? 'forward' : 'backward';
      }

      this._state.update((state) => ({
        ...state,
        direction,
        previousDisplayIndex: prevIndex,
        displayActiveIndex: newIndex,
      }));
    });
  }

  /** sets the total slide count; called by the presentation when projected items change */
  public setSlideCount(count: number): void {
    this._state.update((state) => ({ ...state, slideCount: count }));
  }

  /** schedules a dom measurement for the active slide and applies the resulting height as a css custom property */
  public scheduleDynamicHeightUpdate(getActiveItemHeight: () => number | null): void {
    if (this.size() !== 'dynamic') {
      return;
    }

    afterNextRender(
      () => {
        const height = getActiveItemHeight();

        if (height === null) {
          return;
        }

        this._elementRef.nativeElement.style.setProperty('--slide-container-active-height', `${height}px`);
      },
      { injector: this._injector }
    );
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import {
  SLIDE_CONTAINER_ACTIVE_INDEX_DEFAULT,
  SLIDE_CONTAINER_ALLOW_LOOPING_DEFAULT,
  SLIDE_CONTAINER_ORIENTATION_DEFAULT,
  SLIDE_CONTAINER_SIZE_DEFAULT,
  SlideContainerBrainDirective,
  allSlideContainerOrientations,
  allSlideContainerSizes,
  type SlideContainerOrientation,
  type SlideContainerSize,
} from '../../brain/slide-container-brain/slide-container-brain';
import { SlideContainerItem } from './slide-container-item';

export {
  SLIDE_CONTAINER_ACTIVE_INDEX_DEFAULT,
  SLIDE_CONTAINER_ALLOW_LOOPING_DEFAULT,
  SLIDE_CONTAINER_ORIENTATION_DEFAULT,
  SLIDE_CONTAINER_SIZE_DEFAULT,
  allSlideContainerOrientations,
  allSlideContainerSizes,
  type SlideContainerOrientation,
  type SlideContainerSize,
};

/** injection token for accessing the slide container from child components */
export const SLIDE_CONTAINER = new InjectionToken<SlideContainer>('SlideContainer');

/** default value for the ariaLabel input */
export const SLIDE_CONTAINER_ARIA_LABEL_DEFAULT = 'Slide container';

@Component({
  selector: 'org-slide-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
  styleUrl: './slide-container.css',
  providers: [{ provide: SLIDE_CONTAINER, useExisting: SlideContainer }],
  hostDirectives: [
    {
      directive: SlideContainerBrainDirective,
      inputs: ['orientation', 'size', 'allowLooping', 'activeIndex'],
      outputs: ['activeIndexChange'],
    },
  ],
  host: {
    role: 'region',
    'aria-live': 'polite',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-size]': 'size()',
    '[attr.data-allow-looping]': 'allowLooping() ? "" : null',
    '[attr.aria-roledescription]': '"carousel"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class SlideContainer {
  private readonly _brain = inject(SlideContainerBrainDirective, { self: true });

  /** content-projected slide items */
  private readonly _slideItems = contentChildren(SlideContainerItem);

  /** orientation of the slide animation */
  public readonly orientation = input<SlideContainerOrientation>(SLIDE_CONTAINER_ORIENTATION_DEFAULT);

  /** sizing mode — stable keeps the largest slide height; dynamic resizes to the active slide */
  public readonly size = input<SlideContainerSize>(SLIDE_CONTAINER_SIZE_DEFAULT);

  /** whether navigation wraps around from the last slide back to the first */
  public readonly allowLooping = input<boolean>(SLIDE_CONTAINER_ALLOW_LOOPING_DEFAULT);

  /** two-way bindable index of the currently active slide */
  public readonly activeIndex = model<number>(SLIDE_CONTAINER_ACTIVE_INDEX_DEFAULT);

  /** accessible label for the carousel region */
  public readonly ariaLabel = input<string>(SLIDE_CONTAINER_ARIA_LABEL_DEFAULT);

  /** total number of slide items (proxied from brain) */
  public readonly slideCount = computed<number>(() => this._brain.slideCount());

  /** index of the currently displayed active slide (proxied from brain) */
  public readonly displayActiveIndex = computed<number>(() => this._brain.displayActiveIndex());

  /** current navigation direction (proxied from brain) */
  public readonly navigationDirection = computed<'forward' | 'backward'>(() => this._brain.navigationDirection());

  /** previously displayed index (proxied from brain) */
  public readonly previousDisplayIndex = computed<number>(() => this._brain.previousDisplayIndex());

  constructor() {
    // sync projected item indices and brain slide count whenever projected content changes
    effect(() => {
      const items = this._slideItems();
      this._brain.setSlideCount(items.length);

      items.forEach((item, index) => {
        item.setIndex(index);
      });
    });

    // request a dynamic-height measurement whenever the active slide changes
    effect(() => {
      const activeIndex = this._brain.displayActiveIndex();

      this._brain.scheduleDynamicHeightUpdate(() => {
        const items = this._slideItems();

        if (!items.length) {
          return null;
        }

        const activeItem = items[activeIndex];

        if (!activeItem) {
          return null;
        }

        return activeItem.getContentHeight();
      });
    });
  }
}

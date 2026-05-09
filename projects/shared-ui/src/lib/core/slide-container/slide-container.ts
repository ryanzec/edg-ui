import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
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
  SLIDE_CONTAINER_ARIA_LABEL_DEFAULT,
  SLIDE_CONTAINER_ORIENTATION_DEFAULT,
  SlideContainerBrainDirective,
  allSlideContainerOrientations,
  type SlideContainerDirection,
  type SlideContainerOrientation,
} from '../../brain/slide-container-brain/slide-container-brain';
import { SlideContainerItem } from './slide-container-item';

export {
  SLIDE_CONTAINER_ACTIVE_INDEX_DEFAULT,
  SLIDE_CONTAINER_ALLOW_LOOPING_DEFAULT,
  SLIDE_CONTAINER_ARIA_LABEL_DEFAULT,
  SLIDE_CONTAINER_ORIENTATION_DEFAULT,
  allSlideContainerOrientations,
  type SlideContainerOrientation,
};

/** all valid size values for the slide container */
export const allSlideContainerSizes = ['stable', 'dynamic'] as const;

/** size mode for the slide container — stable keeps the largest slide height; dynamic resizes to the active slide */
export type SlideContainerSize = (typeof allSlideContainerSizes)[number];

/** default value for the size input */
export const SLIDE_CONTAINER_SIZE_DEFAULT: SlideContainerSize = 'stable';

@Component({
  selector: 'org-slide-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
  styleUrl: './slide-container.css',
  hostDirectives: [
    {
      directive: SlideContainerBrainDirective,
      inputs: ['orientation', 'allowLooping', 'activeIndex', 'ariaLabel'],
      outputs: ['activeIndexChange'],
    },
  ],
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-size]': 'size()',
    '[attr.data-allow-looping]': 'allowLooping() ? "" : null',
  },
})
export class SlideContainer {
  private readonly _brain = inject(SlideContainerBrainDirective, { self: true });
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _injector = inject(Injector);

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
  public readonly navigationDirection = computed<SlideContainerDirection>(() => this._brain.navigationDirection());

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

    // measure the active slide's height and apply it as a css variable when in dynamic mode
    effect(() => {
      const activeIndex = this._brain.displayActiveIndex();

      if (this.size() !== 'dynamic') {
        return;
      }

      afterNextRender(
        () => {
          const items = this._slideItems();

          if (!items.length) {
            return;
          }

          const activeItem = items[activeIndex];

          if (!activeItem) {
            return;
          }

          this._elementRef.nativeElement.style.setProperty(
            '--slide-container-active-height',
            `${activeItem.getContentHeight()}px`
          );
        },
        { injector: this._injector }
      );
    });
  }
}

import { Component, ChangeDetectionStrategy, input, viewChild, computed } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import type { ScrollbarOrientation, ScrollbarVisibility } from 'ngx-scrollbar';
import { angularUtils, cssUtils } from '@organization/shared-utils';

/** valid scroll directions for the scroll area component */
export const allScrollAreaDirections = ['vertical', 'horizontal', 'both'] as const;

/** union type of all valid scroll directions */
export type ScrollAreaDirection = (typeof allScrollAreaDirections)[number];

/** default scroll direction */
export const SCROLL_AREA_DIRECTION_DEFAULT: ScrollAreaDirection = 'vertical';

/** default value for the onlyShowOnHover input */
export const SCROLL_AREA_ONLY_SHOW_ON_HOVER_DEFAULT = false;

/** default value for the enabled input */
export const SCROLL_AREA_ENABLED_DEFAULT = true;

/** default value for the containerClass input */
export const SCROLL_AREA_CONTAINER_CLASS_DEFAULT = '';

/** default value for the spacingClass input */
export const SCROLL_AREA_SPACING_CLASS_DEFAULT = '';

/** default value for the role input */
export const SCROLL_AREA_ROLE_DEFAULT: string | undefined = undefined;

/** default value for the ariaLabel input */
export const SCROLL_AREA_ARIA_LABEL_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-scroll-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgScrollbar],
  templateUrl: './scroll-area.html',
  styleUrl: './scroll-area.css',
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.data-only-show-on-hover]': 'onlyShowOnHover() ? "" : null',
    '[attr.data-enabled]': 'enabled() ? "" : null',
  },
})
export class ScrollArea {
  private readonly _ngScrollbarComponent = viewChild.required<NgScrollbar>('ngScrollbarComponent');

  /** scroll direction controlling which axes are scrollable */
  public direction = input<ScrollAreaDirection>(SCROLL_AREA_DIRECTION_DEFAULT);

  /** when true, the scrollbar is only visible on hover */
  public onlyShowOnHover = input<boolean>(SCROLL_AREA_ONLY_SHOW_ON_HOVER_DEFAULT);

  /** when false, the scrollbar track and thumb are hidden */
  public enabled = input<boolean>(SCROLL_AREA_ENABLED_DEFAULT);

  /** additional css classes applied to the ng-scrollbar host container */
  public containerClass = input<string>(SCROLL_AREA_CONTAINER_CLASS_DEFAULT);

  /** css classes applied to the ng-scrollbar host for sizing and border styling */
  public scrollClass = input.required<string>();

  /** css classes applied to the inner wrapper div for padding/spacing */
  public spacingClass = input<string>(SCROLL_AREA_SPACING_CLASS_DEFAULT);

  /** aria role attribute forwarded to the ng-scrollbar host */
  public role = input<string | undefined, string | null | undefined>(SCROLL_AREA_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-label attribute forwarded to the ng-scrollbar host */
  public ariaLabel = input<string | undefined, string | null | undefined>(SCROLL_AREA_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** reference to the cssUtils merge function for combining class strings in the template */
  protected mergeClasses = cssUtils.merge;

  protected readonly orientation = computed<ScrollbarOrientation>(() => {
    const direction = this.direction();

    return direction === 'both' ? 'auto' : direction;
  });

  protected readonly visibility = computed<ScrollbarVisibility>(() => {
    return this.onlyShowOnHover() ? 'hover' : 'native';
  });

  protected readonly hiddenScrollbarClass = computed<string>(() => {
    return this.enabled() ? '' : 'org-scroll-area-hidden-scrollbar';
  });

  /**
   * the native inner scroll container element, used by parent components to check scroll state
   */
  public readonly containerElement = computed<HTMLElement>(() => {
    return this._ngScrollbarComponent().adapter.viewportElement;
  });
}

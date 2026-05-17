import {
  Component,
  ChangeDetectionStrategy,
  input,
  viewChild,
  computed,
  inject,
  NgZone,
  DestroyRef,
  ElementRef,
} from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { Subject, type Observable } from 'rxjs';
import { NgScrollbar, NgScrollbarExt } from 'ngx-scrollbar';
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

/** default value for the externalViewport input */
export const SCROLL_AREA_EXTERNAL_VIEWPORT_DEFAULT: string | undefined = undefined;

/** default value for the externalContentWrapper input */
export const SCROLL_AREA_EXTERNAL_CONTENT_WRAPPER_DEFAULT: string | undefined = undefined;

/** default value for the externalSpacer input */
export const SCROLL_AREA_EXTERNAL_SPACER_DEFAULT: string | undefined = undefined;

/**
 * minimal CdkScrollable-shaped adapter so CDK's ScrollDispatcher can be told about an `ngx-scrollbar`
 * viewport element. ScrollDispatcher only needs `elementScrolled()` for its subscription bookkeeping,
 * and `getElementRef()` for ancestor-containment checks performed by the cdk overlay's reposition logic.
 */
class _NgScrollbarCdkScrollable {
  private readonly _elementScrolled$ = new Subject<Event>();
  private readonly _elementRef: ElementRef<HTMLElement>;
  private readonly _viewportElement: HTMLElement;
  private readonly _onScroll: (event: Event) => void;

  constructor(viewportElement: HTMLElement, ngZone: NgZone) {
    this._viewportElement = viewportElement;
    this._elementRef = new ElementRef(viewportElement);
    this._onScroll = (event: Event) => this._elementScrolled$.next(event);
    ngZone.runOutsideAngular(() => {
      viewportElement.addEventListener('scroll', this._onScroll, { passive: true });
    });
  }

  /** scroll stream consumed by CDK's ScrollDispatcher */
  public elementScrolled(): Observable<Event> {
    return this._elementScrolled$;
  }

  /** viewport element ref consumed by CDK's reposition strategy for ancestor checks */
  public getElementRef(): ElementRef<HTMLElement> {
    return this._elementRef;
  }

  /** removes the dom listener and completes the scroll stream */
  public destroy(): void {
    this._viewportElement.removeEventListener('scroll', this._onScroll);
    this._elementScrolled$.complete();
  }
}

@Component({
  selector: 'org-scroll-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgScrollbar, NgScrollbarExt, NgTemplateOutlet],
  templateUrl: './scroll-area.html',
  styleUrl: './scroll-area.css',
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.data-only-show-on-hover]': 'onlyShowOnHover() ? "" : null',
    '[attr.data-enabled]': 'enabled() ? "" : null',
  },
})
export class ScrollArea {
  private readonly _scrollDispatcher = inject(ScrollDispatcher);
  private readonly _ngZone = inject(NgZone);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _ngScrollbarComponent = viewChild.required<NgScrollbar | NgScrollbarExt>('ngScrollbarComponent');

  /** the active cdk-shaped scrollable adapter; tracked so it can be deregistered on destroy */
  private _cdkScrollable: _NgScrollbarCdkScrollable | null = null;

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

  /**
   * css selector identifying a consumer-provided viewport element inside the projected content. when set, ngx-scrollbar
   * attaches to that element instead of using its internal viewport, allowing the consumer's layout to control viewport
   * sizing. needed when ngx-scrollbar's content-derived internal viewport height would break a nested layout (e.g. a
   * horizontal scroll wrapping vertically-scrollable children that need a definite container height).
   */
  public externalViewport = input<string | undefined, string | null | undefined>(
    SCROLL_AREA_EXTERNAL_VIEWPORT_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** optional css selector for the content-wrapper element inside the external viewport */
  public externalContentWrapper = input<string | undefined, string | null | undefined>(
    SCROLL_AREA_EXTERNAL_CONTENT_WRAPPER_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** optional css selector for the spacer element inside the external viewport (virtual-scroll integration) */
  public externalSpacer = input<string | undefined, string | null | undefined>(SCROLL_AREA_EXTERNAL_SPACER_DEFAULT, {
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

  constructor() {
    this._destroyRef.onDestroy(() => {
      if (!this._cdkScrollable) {
        return;
      }

      this._scrollDispatcher.deregister(this._cdkScrollable as unknown as CdkScrollable);
      this._cdkScrollable.destroy();
    });
  }

  /**
   * registers the ngx-scrollbar viewport with cdk's scrolldispatcher so cdk overlays anchored to a
   * trigger inside this scroll area receive scroll events and reposition (or close) accordingly —
   * without this, overlays stay fixed in viewport coordinates while the trigger moves underneath.
   *
   * invoked from ng-scrollbar's `(afterInit)` event so the viewport element is guaranteed to be
   * available in both standard and externalViewport modes (in externalViewport mode the adapter is
   * initialized via afterNextRender, which fires after the parent's ngAfterViewInit).
   */
  protected onScrollbarInitialized(): void {
    if (this._cdkScrollable) {
      return;
    }

    const viewportElement = this.containerElement();

    if (!viewportElement) {
      return;
    }

    this._cdkScrollable = new _NgScrollbarCdkScrollable(viewportElement, this._ngZone);
    this._scrollDispatcher.register(this._cdkScrollable as unknown as CdkScrollable);
  }
}

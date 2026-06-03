import { Directive, computed, inject, input, output, signal } from '@angular/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, type IsActiveMatchOptions } from '@angular/router';
import { angularUtils } from '@organization/shared-utils';

/** default value for the disabled input */
export const LIST_ITEM_DISABLED_DEFAULT = false;

/** default value for the isClickable input */
export const LIST_ITEM_BRAIN_IS_CLICKABLE_DEFAULT = false;

/** default value for the routerLink input */
export const LIST_ITEM_BRAIN_ROUTER_LINK_DEFAULT: string | undefined = undefined;

/** default value for the routerMatchExact input */
export const LIST_ITEM_BRAIN_ROUTER_MATCH_EXACT_DEFAULT = false;

/**
 * headless brain directive for the list-item component. owns the explicit clickable flag and the clicked
 * output, the router-link-active computation (mirroring RouterLink semantics by resolving relative paths
 * against ActivatedRoute), and the click handler that suppresses interaction when disabled.
 */
@Directive({
  selector: '[orgListItemBrain]',
  exportAs: 'orgListItemBrain',
})
export class ListItemBrainDirective {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  // mirrors router.url into a signal so isRouterLinkActive recomputes on navigation
  // (router.url is a getter, not reactive)
  private readonly _currentUrl = signal<string>(this._router.url);

  /** whether the list item is disabled */
  public readonly disabled = input<boolean>(LIST_ITEM_DISABLED_DEFAULT);

  /** whether the list item is itself a click target (renders the no-tag item as a button and emits clicked) */
  public readonly isClickable = input<boolean>(LIST_ITEM_BRAIN_IS_CLICKABLE_DEFAULT);

  /** the router link the item navigates to; also used to compute the router-active state */
  public readonly routerLink = input<string | undefined, string | null | undefined>(
    LIST_ITEM_BRAIN_ROUTER_LINK_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** when true, router-active matches only on exact path equality; when false, subset matching is used */
  public readonly routerMatchExact = input<boolean>(LIST_ITEM_BRAIN_ROUTER_MATCH_EXACT_DEFAULT);

  /** emits when the list item is clicked and is not disabled */
  public readonly clicked = output<void>();

  /** whether the router link is currently active based on the current url and match mode */
  public readonly isRouterLinkActive = computed<boolean>(() => {
    // read so the computed re-evaluates on navigation
    this._currentUrl();

    const link = this.routerLink();

    if (!link) {
      return false;
    }

    const matchOptions: IsActiveMatchOptions = {
      paths: this.routerMatchExact() ? 'exact' : 'subset',
      queryParams: 'subset',
      matrixParams: 'subset',
      fragment: 'ignored',
    };

    // resolve relative paths against the activated route to mirror RouterLink semantics
    const urlTree = this._router.createUrlTree([link], { relativeTo: this._activatedRoute });

    return this._router.isActive(urlTree, matchOptions);
  });

  public constructor() {
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this._currentUrl.set(event.urlAfterRedirects);
      });
  }

  /** handles click events, suppressing interaction when the item is disabled */
  public handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    this.clicked.emit();
  }
}

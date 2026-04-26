import { Directive, computed, input, signal } from '@angular/core';
import { Observable, Subject, type Subscriber } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';

/** default value for the listItemDisabled input */
export const LIST_ITEM_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the list-item component. owns the click subject (with observer-tracking so the
 * presentation can flip clickable styles based on whether anyone is listening), the router-link-active signal,
 * and the click handler that suppresses interaction when disabled.
 */
@Directive({
  selector: '[orgListItemBrain]',
  exportAs: 'orgListItemBrain',
})
export class ListItemBrainDirective {
  private readonly _isRouterLinkActive = signal<boolean>(false);
  private readonly _hasClickObserver = signal<boolean>(false);
  private readonly _clicked$ = new Subject<void>();

  /** whether the list item is disabled */
  public readonly listItemDisabled = input<boolean>(LIST_ITEM_DISABLED_DEFAULT);

  /** emits when the list item is clicked and is not disabled; observer-tracked so presentation can react */
  public readonly listItemClicked = outputFromObservable(
    new Observable<void>((subscriber: Subscriber<void>) => {
      this._hasClickObserver.set(true);

      const subscription = this._clicked$.subscribe(subscriber);

      return () => {
        subscription.unsubscribe();
        this._hasClickObserver.set(this._clicked$.observed);
      };
    })
  );

  /** whether at least one observer is currently subscribed to the click output */
  public readonly hasClickObserver = computed<boolean>(() => this._hasClickObserver());

  /** whether the router link is currently active */
  public readonly isRouterLinkActive = computed<boolean>(() => this._isRouterLinkActive());

  /** updates the router-link-active state; called by the presentation from RouterLinkActive change events */
  public setRouterLinkActive(isActive: boolean): void {
    this._isRouterLinkActive.set(isActive);
  }

  /** handles click events, suppressing interaction when the item is disabled */
  public handleClick(event: MouseEvent): void {
    if (this.listItemDisabled()) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    if (this._clicked$.observed) {
      this._clicked$.next();
    }
  }
}

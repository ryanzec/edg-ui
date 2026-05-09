import { Directive, computed, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';

/**
 * headless brain directive for the empty-indicator component. owns the action click event plumbing,
 * tracks subscriber count on the actionTriggered output to drive the action-button rendering decision,
 * and applies the static role="status" accessibility attribute. carries no styling or template — apply
 * it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgEmptyIndicatorBrain]',
  exportAs: 'orgEmptyIndicatorBrain',
  host: {
    role: 'status',
  },
})
export class EmptyIndicatorBrainDirective {
  /** tracks the number of active listeners on the actionTriggered output */
  private readonly _actionTriggeredListenerCount = signal<number>(0);

  /** subject that drives the actionTriggered output */
  private readonly _actionTriggeredSubject = new Subject<void>();

  /** observable wrapper that keeps _actionTriggeredListenerCount in sync with subscription state */
  private readonly _actionTriggeredObservable = new Observable<void>((subscriber) => {
    this._actionTriggeredListenerCount.update((count) => count + 1);
    const subscription = this._actionTriggeredSubject.subscribe(subscriber);

    return () => {
      this._actionTriggeredListenerCount.update((count) => count - 1);
      subscription.unsubscribe();
    };
  });

  /** emitted when the action button is triggered */
  public readonly actionTriggered = outputFromObservable(this._actionTriggeredObservable);

  /** whether at least one consumer is currently subscribed to actionTriggered */
  public readonly hasActionListener = computed<boolean>(() => this._actionTriggeredListenerCount() > 0);

  /** triggers the actionTriggered output; intended to be called by the presentation when its action button is clicked */
  public triggerAction(): void {
    this._actionTriggeredSubject.next();
  }
}

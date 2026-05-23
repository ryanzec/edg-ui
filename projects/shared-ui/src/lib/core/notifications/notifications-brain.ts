import { Directive, input, output } from '@angular/core';

/** default value for the ariaLabel input */
export const NOTIFICATIONS_ARIA_LABEL_DEFAULT = 'Notifications';

/**
 * headless brain directive for the notifications container component. owns the live-region accessibility surface
 * (aria-live, aria-label) and exposes a closeRequested output the presentation can wire to its application-level
 * removal logic (e.g. removing the notification from a manager). carries no styling, layout, or template — apply
 * it via hostDirectives on the presentation component.
 */
@Directive({
  selector: '[orgNotificationsBrain]',
  exportAs: 'orgNotificationsBrain',
  host: {
    'aria-live': 'polite',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class NotificationsBrainDirective {
  /** accessibility label applied to the notifications live region */
  public readonly ariaLabel = input<string>(NOTIFICATIONS_ARIA_LABEL_DEFAULT);

  /** emitted with the notification id whenever a child notification has finished closing */
  public readonly closeRequested = output<string>();

  /** triggers the closeRequested output for the given notification id; called by the presentation when a child closes */
  public requestClose(id: string): void {
    this.closeRequested.emit(id);
  }
}

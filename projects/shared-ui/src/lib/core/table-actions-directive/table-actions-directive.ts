import { Directive } from '@angular/core';

/**
 * applied to an interactive control placed inside a clickable container (e.g. a clickable table row,
 * clickable card, or clickable list item) so the control's own click / keyboard-activation events do
 * not bubble up and also trigger the surrounding container's click handler. swallows native click and
 * keyboard activation (Enter / Space) — for Enter / Space the default action is also suppressed so the
 * browser does not synthesize a click on the surrounding container.
 */
@Directive({
  selector: '[orgTableActions]',
  host: {
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class TableActionsDirective {
  /** stops the click from bubbling up to a parent clickable container */
  protected handleClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /** swallows Enter / Space activations so a parent clickable container is not also activated */
  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
  }
}

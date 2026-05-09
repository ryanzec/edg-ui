import { Directive, inject } from '@angular/core';
import { DialogBrainDirective } from '../dialog-brain/dialog-brain';

/**
 * headless brain directive for the dialog header. owns the accessibility wiring of the header's id to the parent
 * dialog brain's titleId so the dialog host's aria-labelledby resolves correctly. applied as a host directive on
 * the core dialog header component.
 */
@Directive({
  selector: '[orgDialogHeaderBrain]',
  exportAs: 'orgDialogHeaderBrain',
  host: {
    '[attr.id]': 'parentBrain.titleId',
  },
})
export class DialogHeaderBrainDirective {
  /** the parent dialog brain that owns the titleId paired with the dialog host's aria-labelledby */
  protected readonly parentBrain = inject(DialogBrainDirective);
}

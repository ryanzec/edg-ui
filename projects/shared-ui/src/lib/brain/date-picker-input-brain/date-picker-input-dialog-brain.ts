import { Directive, inject, input } from '@angular/core';
import { DatePickerInputBrainDirective } from './date-picker-input-brain';

/** default value for the ariaLabel input */
export const DATE_PICKER_INPUT_DIALOG_ARIA_LABEL_DEFAULT = 'Date picker calendar';

/**
 * headless brain directive for the date-picker-input overlay's dialog wrapper. owns the dialog accessibility
 * contract (role, aria-modal, aria-label, tabindex), the id binding paired with the parent brain's overlayId
 * (which the parent brain publishes as the host's aria-controls target), and the keydown event routing back
 * into the parent brain so that delete / backspace clearing flows through a single owner.
 *
 * applied to the dialog wrapper element rendered inside the cdkConnectedOverlay template — distinct from the
 * primary DatePickerInputBrainDirective that lives on the component host.
 */
@Directive({
  selector: '[orgDatePickerInputDialogBrain]',
  exportAs: 'orgDatePickerInputDialogBrain',
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '0',
    '[attr.id]': 'parentBrain.overlayId',
    '[attr.aria-label]': 'ariaLabel()',
    '(keydown)': 'parentBrain.handleCalendarKeyDown($event)',
  },
})
export class DatePickerInputDialogBrainDirective {
  /** the parent date-picker-input brain whose overlayId / keyboard handlers this dialog wrapper is bound to */
  protected readonly parentBrain = inject(DatePickerInputBrainDirective);

  /** accessible label announced for the dialog when assistive tech enters the overlay */
  public readonly ariaLabel = input<string>(DATE_PICKER_INPUT_DIALOG_ARIA_LABEL_DEFAULT);
}

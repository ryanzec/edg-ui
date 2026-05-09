import { Directive, Signal, computed, inject } from '@angular/core';
import { logManager } from '@organization/shared-utils';
import { DIALOG_TRIGGER } from '../dialog-brain/dialog-brain';

/**
 * headless brain directive for the dialog close button. owns the close action, the visible / enabled state derived
 * from the trigger dialog brain, and the accessible label. applied as a host directive on the inner button element
 * of the core dialog-close-button component.
 */
@Directive({
  selector: '[orgDialogCloseButtonBrain]',
  exportAs: 'orgDialogCloseButtonBrain',
  host: {
    '[attr.data-disabled]': '!enabled() ? "" : null',
    '(click)': 'close()',
  },
})
export class DialogCloseButtonBrainDirective {
  private readonly _triggerBrain = inject(DIALOG_TRIGGER, { optional: true });

  /** the accessible label announced for the close button (owned by brain so a11y stays in brain) */
  public readonly ariaLabel = 'Close';

  /** whether the close button is enabled and clickable; derived from the trigger dialog brain */
  public readonly enabled: Signal<boolean> = computed<boolean>(() => this._triggerBrain?.closeIconEnabled() ?? true);

  /** whether the close button is currently visible; derived from the trigger dialog brain */
  public readonly visible: Signal<boolean> = computed<boolean>(() => this._triggerBrain?.showCloseIconState() ?? true);

  /** handles host click events, requesting the trigger dialog brain to close when enabled */
  protected close(): void {
    if (!this._triggerBrain) {
      logManager.warn({
        type: 'dialog-close-button-no-trigger',
        message: 'dialog close button activated outside of a dialog trigger context',
      });

      return;
    }

    if (!this.enabled()) {
      return;
    }

    this._triggerBrain.closeDialog();
  }
}

import { Directive, computed, input, output, signal } from '@angular/core';

/** default value for the radioDisabled input */
export const RADIO_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the radio component. owns the local selected state and the click / keyboard event
 * handlers. stays framework-agnostic — when keyboard arrow navigation or a selection request fires, the brain emits
 * an abstract event that the presentation routes either to a parent radio group (when one is present) or back into
 * the brain via `setSelected` for standalone use.
 */
@Directive({
  selector: '[orgRadioBrain]',
  exportAs: 'orgRadioBrain',
})
export class RadioBrainDirective {
  private readonly _selected = signal<boolean>(false);

  /** whether the radio is disabled (resolved by the presentation, may include a group's disabled state) */
  public readonly radioDisabled = input<boolean>(RADIO_DISABLED_DEFAULT);

  /** whether this radio is currently selected */
  public readonly isChecked = computed<boolean>(() => this._selected());

  /** emitted when the user activates this radio via click, space, or enter */
  public readonly radioSelectionRequested = output<void>();

  /** emitted when the user requests focus on the next radio via arrow-down or arrow-right */
  public readonly radioFocusNextRequested = output<void>();

  /** emitted when the user requests focus on the previous radio via arrow-up or arrow-left */
  public readonly radioFocusPreviousRequested = output<void>();

  /** sets the local selected state; called by the presentation when used standalone or when synced from a group */
  public setSelected(selected: boolean): void {
    this._selected.set(selected);
  }

  /** handles click interaction; gated by disabled */
  public handleClick(event: Event): void {
    event.preventDefault();

    if (this.radioDisabled()) {
      return;
    }

    this.radioSelectionRequested.emit();
  }

  /** handles keyboard interaction; space / enter selects, arrow keys navigate */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.radioDisabled()) {
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.radioSelectionRequested.emit();

      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.radioFocusNextRequested.emit();

      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.radioFocusPreviousRequested.emit();
    }
  }
}

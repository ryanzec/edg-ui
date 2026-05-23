import { Directive, input, model } from '@angular/core';

/** default value for the isExpandable input */
export const EXPANDABLE_IS_EXPANDABLE_DEFAULT = false;

/** default value for the isExpanded model */
export const EXPANDABLE_IS_EXPANDED_DEFAULT = true;

/**
 * generic headless brain directive that owns expand/collapse state. designed to be applied as a
 * `hostDirective` on any component that needs an expandable affordance (card, accordion-row, panel, etc.).
 * the host component is responsible for the presentation — wiring up a clickable toggle element, hiding the
 * collapsible region, applying any visual indicator. this brain only owns the state and the toggle behavior.
 */
@Directive({
  selector: '[orgExpandableBrain]',
  exportAs: 'orgExpandableBrain',
})
export class ExpandableBrainDirective {
  /** whether the host supports the expand / collapse affordance at all */
  public readonly isExpandable = input<boolean>(EXPANDABLE_IS_EXPANDABLE_DEFAULT);

  /** whether the host is currently expanded; ignored by consumers when isExpandable is false */
  public readonly isExpanded = model<boolean>(EXPANDABLE_IS_EXPANDED_DEFAULT);

  /** toggles the expanded state when expandable; no-ops when not expandable so consumers do not need to guard */
  public toggle(): void {
    if (!this.isExpandable()) {
      return;
    }

    this.isExpanded.update((value) => !value);
  }
}

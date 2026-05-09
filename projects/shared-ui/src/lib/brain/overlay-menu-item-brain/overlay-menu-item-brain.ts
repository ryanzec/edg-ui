import { Directive, input, output } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';
import { type OverlayMenuItemEntry } from '../overlay-menu-brain/overlay-menu-brain';

/**
 * headless brain directive for an overlay menu item. composes `CdkMenuItem` for the `role="menuitem"`
 * semantics and the per-item keyboard / focus interaction. forwards the cdk `cdkMenuItemTriggered`
 * event as a typed `triggered` output carrying the bound item entry. carries no styling, template, or
 * markup — apply on the clickable element rendered by the presentation.
 */
@Directive({
  selector: '[orgOverlayMenuItemBrain]',
  exportAs: 'orgOverlayMenuItemBrain',
  hostDirectives: [CdkMenuItem],
  host: {
    '(cdkMenuItemTriggered)': 'handleTriggered()',
  },
})
export class OverlayMenuItemBrainDirective<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> {
  /** the menu item entry this directive represents */
  public readonly item = input.required<OverlayMenuItemEntry<TMeta>>();

  /** emits the bound item entry when the cdk menu item is triggered (clicked or keyboard activated) */
  public readonly triggered = output<OverlayMenuItemEntry<TMeta>>();

  /** emits the bound item entry via the `triggered` output */
  public handleTriggered(): void {
    this.triggered.emit(this.item());
  }
}

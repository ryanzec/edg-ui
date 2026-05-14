import { Directive, effect, inject, input, output } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';
import { type OverlayMenuItemEntry } from './overlay-menu-brain';

/** default value for the disabled input */
export const OVERLAY_MENU_ITEM_DISABLED_DEFAULT = false;

/**
 * headless brain directive for an overlay menu item. composes `CdkMenuItem` for the `role="menuitem"`
 * semantics and the per-item keyboard / focus interaction. forwards the cdk `cdkMenuItemTriggered`
 * event as a typed `triggered` output carrying the bound item entry. owns a `disabled` input that is
 * synced into `CdkMenuItem.disabled` so cdk skips the row in keyboard nav and suppresses activation.
 * carries no styling, template, or markup — apply on the clickable element rendered by the presentation.
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
  private readonly _cdkMenuItem = inject(CdkMenuItem, { self: true });

  /** the menu item entry this directive represents */
  public readonly item = input.required<OverlayMenuItemEntry<TMeta>>();

  /** whether the menu item is disabled; forwarded to CdkMenuItem so cdk skips it in keyboard nav and suppresses activation */
  public readonly disabled = input<boolean>(OVERLAY_MENU_ITEM_DISABLED_DEFAULT);

  /** emits the bound item entry when the cdk menu item is triggered (clicked or keyboard activated) */
  public readonly triggered = output<OverlayMenuItemEntry<TMeta>>();

  constructor() {
    // syncs the brain's disabled signal into CdkMenuItem's non-signal disabled property each change
    effect(() => {
      this._cdkMenuItem.disabled = this.disabled();
    });
  }

  /** emits the bound item entry via the `triggered` output */
  public handleTriggered(): void {
    this.triggered.emit(this.item());
  }
}

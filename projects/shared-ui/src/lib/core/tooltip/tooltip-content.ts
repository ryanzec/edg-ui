import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from '@angular/core';
import {
  TOOLTIP_OVERLAY_CONTEXT,
  TOOLTIP_PLACEMENT_DEFAULT,
  type TooltipPhase,
  type TooltipPlacement,
} from '../tooltip/tooltip-brain';

export { TOOLTIP_PLACEMENT_DEFAULT, type TooltipPhase, type TooltipPlacement };

/** all valid tooltip layout values */
export const allTooltipLayoutValues = ['label', 'rich'] as const;

/** the visual layout of the tooltip surface */
export type TooltipLayout = (typeof allTooltipLayoutValues)[number];

/** all valid tooltip size values */
export const allTooltipSizeValues = ['sm', 'base'] as const;

/** the size of the tooltip surface */
export type TooltipSize = (typeof allTooltipSizeValues)[number];

/** default value for the layout input */
export const TOOLTIP_CONTENT_LAYOUT_DEFAULT: TooltipLayout = 'label';

/** default value for the size input */
export const TOOLTIP_CONTENT_SIZE_DEFAULT: TooltipSize = 'base';

/** default value for the arrow input */
export const TOOLTIP_CONTENT_ARROW_DEFAULT = true;

/**
 * the visible tooltip surface. owns all chrome (background, border, padding, type, kbd-gap, arrow, motion). when
 * rendered inside a brain-controlled overlay it consumes TOOLTIP_OVERLAY_CONTEXT to read the brain-resolved
 * placement and lifecycle phase; otherwise it falls back to its own placement / phase inputs so it can be used
 * standalone for visual previews and pure-css patterns.
 */
@Component({
  selector: 'org-tooltip-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './tooltip-content.css',
  host: {
    role: 'tooltip',
    '[attr.data-layout]': 'layout()',
    '[attr.data-size]': 'size()',
    '[attr.data-placement]': 'effectivePlacement()',
    '[attr.data-state]': 'effectivePhase()',
    '[attr.data-arrow]': 'arrow() ? null : "off"',
  },
})
export class TooltipContent {
  private readonly _overlayContext = inject(TOOLTIP_OVERLAY_CONTEXT, { optional: true });

  /** the visual layout of the surface */
  public readonly layout = input<TooltipLayout>(TOOLTIP_CONTENT_LAYOUT_DEFAULT);

  /** the size of the surface */
  public readonly size = input<TooltipSize>(TOOLTIP_CONTENT_SIZE_DEFAULT);

  /**
   * placement used by the arrow. ignored when the surface is rendered inside a brain-controlled overlay (the brain's
   * resolved placement wins via TOOLTIP_OVERLAY_CONTEXT so the arrow tracks any auto-flip).
   */
  public readonly placement = input<TooltipPlacement>(TOOLTIP_PLACEMENT_DEFAULT);

  /**
   * lifecycle phase used to drive css transitions. ignored when the surface is rendered inside a brain-controlled
   * overlay (the brain owns the state machine and its phase wins via TOOLTIP_OVERLAY_CONTEXT). when standalone
   * (e.g. for a static visual preview), the consumer can pin a specific phase here.
   */
  public readonly phase = input<TooltipPhase | null>(null);

  /** when false, the arrow is hidden via data-arrow="off" */
  public readonly arrow = input<boolean>(TOOLTIP_CONTENT_ARROW_DEFAULT);

  /** placement used to drive the arrow direction; brain-resolved value wins when present */
  protected readonly effectivePlacement: Signal<TooltipPlacement> = computed<TooltipPlacement>(() => {
    if (this._overlayContext) {
      return this._overlayContext.resolvedPlacement();
    }

    return this.placement();
  });

  /** phase used to drive the data-state attribute; brain-driven value wins when present */
  protected readonly effectivePhase: Signal<TooltipPhase | null> = computed<TooltipPhase | null>(() => {
    if (this._overlayContext) {
      return this._overlayContext.phase();
    }

    return this.phase();
  });
}

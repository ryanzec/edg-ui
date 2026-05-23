import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  TOOLTIP_CLOSE_DELAY_DEFAULT,
  TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT,
  TOOLTIP_OPEN_DELAY_DEFAULT,
  TOOLTIP_PLACEMENT_DEFAULT,
  TOOLTIP_TRIGGER_TYPE_DEFAULT,
  TooltipBrainDirective,
  allTooltipPlacementValues,
  allTooltipPhaseValues,
  allTooltipTriggerTypes,
  type TooltipPhase,
  type TooltipPlacement,
  type TooltipTriggerType,
} from '../tooltip/tooltip-brain';

export {
  TOOLTIP_CLOSE_DELAY_DEFAULT,
  TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT,
  TOOLTIP_OPEN_DELAY_DEFAULT,
  TOOLTIP_PLACEMENT_DEFAULT,
  TOOLTIP_TRIGGER_TYPE_DEFAULT,
  allTooltipPlacementValues,
  allTooltipPhaseValues,
  allTooltipTriggerTypes,
  type TooltipPhase,
  type TooltipPlacement,
  type TooltipTriggerType,
};

/**
 * tooltip wrapper component. wraps the trigger element via default content projection and accepts the surface
 * template via a named <ng-template tooltipContent> child. all interactive logic (trigger handling, overlay
 * lifecycle, position resolution, accessibility, lifecycle phase, click-outside, escape) lives in the brain
 * directive attached via hostDirectives.
 */
@Component({
  selector: 'org-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './tooltip.css',
  hostDirectives: [
    {
      directive: TooltipBrainDirective,
      inputs: ['triggerType', 'openDelay', 'closeDelay', 'keepOpenOnHover', 'placement'],
      outputs: ['opened', 'closed'],
    },
  ],
})
export class Tooltip {
  private readonly _brain = inject(TooltipBrainDirective);

  /** content-projected template containing the org-tooltip-content surface to render in the overlay */
  private readonly _contentTemplate = contentChild<TemplateRef<unknown>>('tooltipContent');

  /** how the tooltip is triggered */
  public readonly triggerType = input<TooltipTriggerType>(TOOLTIP_TRIGGER_TYPE_DEFAULT);

  /** delay in milliseconds before showing the tooltip */
  public readonly openDelay = input<number>(TOOLTIP_OPEN_DELAY_DEFAULT);

  /** delay in milliseconds before hiding the tooltip */
  public readonly closeDelay = input<number>(TOOLTIP_CLOSE_DELAY_DEFAULT);

  /** whether to keep the tooltip open when hovering over its overlay */
  public readonly keepOpenOnHover = input<boolean>(TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT);

  /** placement of the tooltip relative to the trigger (one of 12 = 4 sides × 3 alignments) */
  public readonly placement = input<TooltipPlacement>(TOOLTIP_PLACEMENT_DEFAULT);

  /** emitted when the tooltip opens */
  public readonly opened = output<void>();

  /** emitted when the tooltip closes */
  public readonly closed = output<void>();

  constructor() {
    /** forward the projected <ng-template tooltipContent> child into the brain whenever it resolves */
    effect(() => {
      const template = this._contentTemplate();

      this._brain.setTemplate(template ?? null);
    });
  }
}

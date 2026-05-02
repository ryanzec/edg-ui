import { Component, ChangeDetectionStrategy, TemplateRef, input, output } from '@angular/core';
import {
  TOOLTIP_CLOSE_DELAY_DEFAULT,
  TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT,
  TOOLTIP_OPEN_DELAY_DEFAULT,
  TOOLTIP_TRIGGER_TYPE_DEFAULT,
  TOOLTIP_X_POSITION_DEFAULT,
  TOOLTIP_Y_POSITION_DEFAULT,
  TooltipBrainDirective,
  allTooltipXPositionValues,
  allTooltipYPositionValues,
  type TooltipTriggerType,
  type TooltipXPosition,
  type TooltipYPosition,
} from '../../brain/tooltip-brain/tooltip-brain';

export {
  TOOLTIP_CLOSE_DELAY_DEFAULT,
  TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT,
  TOOLTIP_OPEN_DELAY_DEFAULT,
  TOOLTIP_TRIGGER_TYPE_DEFAULT,
  TOOLTIP_X_POSITION_DEFAULT,
  TOOLTIP_Y_POSITION_DEFAULT,
  allTooltipXPositionValues,
  allTooltipYPositionValues,
  type TooltipTriggerType,
  type TooltipXPosition,
  type TooltipYPosition,
};

/**
 * tooltip component for displaying overlay content attached to a trigger element. all interactive logic, overlay
 * lifecycle, and accessibility wiring lives in the brain directive that this component attaches via hostDirectives.
 */
@Component({
  selector: 'org-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
  styleUrl: './tooltip.css',
  hostDirectives: [
    {
      directive: TooltipBrainDirective,
      inputs: ['triggerType', 'templateRef', 'openDelay', 'closeDelay', 'keepOpenOnHover', 'xPosition', 'yPosition'],
      outputs: ['opened', 'closed'],
    },
  ],
  host: {
    '[attr.data-trigger-type]': 'triggerType()',
    '[attr.data-x-position]': 'xPosition()',
    '[attr.data-y-position]': 'yPosition()',
  },
})
export class Tooltip {
  /** how the tooltip is triggered */
  public readonly triggerType = input<TooltipTriggerType>(TOOLTIP_TRIGGER_TYPE_DEFAULT);

  /** template for the tooltip content */
  public readonly templateRef = input.required<TemplateRef<unknown>>();

  /** delay in milliseconds before showing the tooltip */
  public readonly openDelay = input<number>(TOOLTIP_OPEN_DELAY_DEFAULT);

  /** delay in milliseconds before hiding the tooltip */
  public readonly closeDelay = input<number>(TOOLTIP_CLOSE_DELAY_DEFAULT);

  /** whether to keep the tooltip open when hovering over it */
  public readonly keepOpenOnHover = input<boolean>(TOOLTIP_KEEP_OPEN_ON_HOVER_DEFAULT);

  /** horizontal position of tooltip relative to trigger */
  public readonly xPosition = input<TooltipXPosition>(TOOLTIP_X_POSITION_DEFAULT);

  /** vertical position of tooltip relative to trigger */
  public readonly yPosition = input<TooltipYPosition>(TOOLTIP_Y_POSITION_DEFAULT);

  /** emitted when the tooltip opens */
  public readonly opened = output<void>();

  /** emitted when the tooltip closes */
  public readonly closed = output<void>();
}

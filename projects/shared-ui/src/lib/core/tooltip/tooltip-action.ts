import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** default value for the href input */
export const TOOLTIP_ACTION_HREF_DEFAULT = '#';

/**
 * pointer-active link rendered against the inverse surface inside a rich-layout tooltip. reads at full inverse fg
 * (no link-blue tint) so it stays in the tooltip's voice.
 */
@Component({
  selector: 'org-tooltip-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<a [href]="href()"><ng-content /></a>',
  styleUrl: './tooltip-action.css',
})
export class TooltipAction {
  /** target url for the action link */
  public readonly href = input<string>(TOOLTIP_ACTION_HREF_DEFAULT);
}

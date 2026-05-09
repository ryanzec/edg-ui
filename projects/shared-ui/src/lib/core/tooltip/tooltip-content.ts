import { ChangeDetectionStrategy, Component } from '@angular/core';

/** default chrome wrapper for tooltip overlay content; consumers can omit it for fully custom overlays */
@Component({
  selector: 'org-tooltip-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './tooltip-content.css',
})
export class TooltipContent {}

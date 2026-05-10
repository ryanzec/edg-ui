import { ChangeDetectionStrategy, Component } from '@angular/core';

/** body element used inside a rich-layout tooltip surface */
@Component({
  selector: 'org-tooltip-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './tooltip-body.css',
})
export class TooltipBody {}

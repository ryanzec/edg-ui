import { ChangeDetectionStrategy, Component } from '@angular/core';

/** title element used inside a rich-layout tooltip surface */
@Component({
  selector: 'org-tooltip-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './tooltip-title.css',
})
export class TooltipTitle {}

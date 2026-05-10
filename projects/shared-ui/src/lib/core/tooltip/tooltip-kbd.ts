import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * a quiet inset pill rendered inline after a label tooltip's text. presents a keyboard shortcut hint without
 * competing visually with the label.
 */
@Component({
  selector: 'org-tooltip-kbd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<kbd><ng-content /></kbd>',
  styleUrl: './tooltip-kbd.css',
})
export class TooltipKbd {}

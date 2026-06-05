import { Component, ChangeDetectionStrategy } from '@angular/core';

/** container for the main body content of a box composition */
@Component({
  selector: 'org-box-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './box-content.css',
})
export class BoxContent {}

import { Component, ChangeDetectionStrategy } from '@angular/core';

/** container for the main body content of a card */
@Component({
  selector: 'org-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './card-content.css',
})
export class CardContent {}

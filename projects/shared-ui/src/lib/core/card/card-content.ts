import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Card } from './card';

/** container for the main body content of a card */
@Component({
  selector: 'org-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './card-content.css',
  host: {
    '[attr.data-hidden]': 'isHidden() ? "" : null',
  },
})
export class CardContent {
  private readonly _card = inject(Card);

  /** whether the host should be hidden because the parent card is in collapsed expandable mode */
  protected readonly isHidden = computed<boolean>(
    () => this._card.expandableBrain.isExpandable() && !this._card.expandableBrain.isExpanded()
  );
}

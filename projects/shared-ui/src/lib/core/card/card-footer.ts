import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { Card } from './card';

/** all available card footer alignment values */
export const allCardAlignments = ['start', 'center', 'end'] as const;

/** the horizontal alignment type for card footer content */
export type CardAlignment = (typeof allCardAlignments)[number];

/** default value for the card footer alignment input */
export const CARD_FOOTER_ALIGNMENT_DEFAULT: CardAlignment = 'end';

/** container for card footer actions with configurable horizontal alignment */
@Component({
  selector: 'org-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './card-footer.css',
  host: {
    '[attr.data-alignment]': 'alignment()',
    '[attr.data-hidden]': 'isHidden() ? "" : null',
  },
})
export class CardFooter {
  private readonly _card = inject(Card);

  /** the horizontal alignment of footer content */
  public alignment = input<CardAlignment>(CARD_FOOTER_ALIGNMENT_DEFAULT);

  /** whether the host should be hidden because the parent card is in collapsed expandable mode */
  protected readonly isHidden = computed<boolean>(
    () => this._card.expandableBrain.isExpandable() && !this._card.expandableBrain.isExpanded()
  );
}

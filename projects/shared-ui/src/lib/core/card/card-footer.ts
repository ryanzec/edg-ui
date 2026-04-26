import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** all available card footer alignment values */
export const allCardAlignments = ['start', 'center', 'end'] as const;

/** the horizontal alignment type for card footer content */
export type CardAlignment = (typeof allCardAlignments)[number];

/** default value for the card footer alignment input */
export const CARD_FOOTER_ALIGNMENT_DEFAULT: CardAlignment = 'start';

/** container for card footer actions with configurable horizontal alignment */
@Component({
  selector: 'org-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './card-footer.css',
  host: {
    '[attr.data-alignment]': 'alignment()',
  },
})
export class CardFooter {
  /** the horizontal alignment of footer content */
  public alignment = input<CardAlignment>(CARD_FOOTER_ALIGNMENT_DEFAULT);
}

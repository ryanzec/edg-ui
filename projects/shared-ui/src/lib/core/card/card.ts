import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Box, BOX_BACKGROUND_DEFAULT } from '../box/box';
import type { BoxBackground, BoxBorder } from '../box/box';
import { ComponentColor, allComponentColors } from '../types/component-types';

/** the color variant type for the card component */
export type CardColor = ComponentColor;

/** all available card color values */
export const cardColors = allComponentColors;

/** default value for the card color input */
export const CARD_COLOR_DEFAULT: CardColor | null = null;

/** default value for the card container class input */
export const CARD_CONTAINER_CLASS_DEFAULT = '';

/** default value for the card box border input */
export const CARD_BOX_BORDER_DEFAULT: BoxBorder = 'bordered';

/** default value for the card box background input */
export const CARD_BOX_BACKGROUND_DEFAULT = BOX_BACKGROUND_DEFAULT;

@Component({
  selector: 'org-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  templateUrl: './card.html',
  styleUrl: './card.css',
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-box-border]': 'boxBorder()',
    '[attr.data-box-background]': 'boxBackground()',
  },
})
export class Card {
  /** the semantic color applied to the card border */
  public color = input<CardColor | null>(CARD_COLOR_DEFAULT);

  /** css class(es) applied to the outermost container element */
  public containerClass = input<string>(CARD_CONTAINER_CLASS_DEFAULT);

  /** the border/visual style variant of the card container */
  public boxBorder = input<BoxBorder>(CARD_BOX_BORDER_DEFAULT);

  /** the background style variant of the card container */
  public boxBackground = input<BoxBackground>(CARD_BOX_BACKGROUND_DEFAULT);
}

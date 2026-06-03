import { ChangeDetectionStrategy, Component, effect, inject, input, output, viewChild } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { BoxBrainDirective } from '../box/box-brain';
import { ExpandableBrainDirective } from '../expandable-brain/expandable-brain';
import { Box, BOX_BACKGROUND_DEFAULT, BOX_PADDING_DEFAULT } from '../box/box';
import type { BoxBackground, BoxBorder, BoxPadding } from '../box/box';
import { ComponentColor, allComponentColors } from '../types/component-types';

/** the color variant type for the card component */
export type CardColor = ComponentColor;

/** all available card color values */
export const cardColors = allComponentColors;

/** default value for the card color input */
export const CARD_COLOR_DEFAULT: CardColor | undefined = undefined;

/** default value for the card container class input */
export const CARD_CONTAINER_CLASS_DEFAULT = '';

/** default value for the card box border input */
export const CARD_BOX_BORDER_DEFAULT: BoxBorder = 'bordered';

/** default value for the card box background input */
export const CARD_BOX_BACKGROUND_DEFAULT = BOX_BACKGROUND_DEFAULT;

/** default value for the card box padding input */
export const CARD_BOX_PADDING_DEFAULT = BOX_PADDING_DEFAULT;

/** default value for the card isClickable input */
export const CARD_IS_CLICKABLE_DEFAULT = false;

@Component({
  selector: 'org-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box],
  templateUrl: './card.html',
  styleUrl: './card.css',
  hostDirectives: [
    {
      directive: ExpandableBrainDirective,
      inputs: ['isExpandable', 'isExpanded'],
      outputs: ['isExpandedChange'],
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-box-border]': 'boxBorder()',
    '[attr.data-box-background]': 'boxBackground()',
  },
})
export class Card {
  private readonly _boxBrainDirective = viewChild(BoxBrainDirective);

  /** reference to the host expandable brain directive; sub-components inject Card to read this */
  public readonly expandableBrain = inject(ExpandableBrainDirective);

  /** the semantic color applied to the card border */
  public color = input<CardColor | undefined, CardColor | null | undefined>(CARD_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** css class(es) applied to the outermost container element */
  public containerClass = input<string>(CARD_CONTAINER_CLASS_DEFAULT);

  /** the border/visual style variant of the card container */
  public boxBorder = input<BoxBorder>(CARD_BOX_BORDER_DEFAULT);

  /** the background style variant of the card container */
  public boxBackground = input<BoxBackground>(CARD_BOX_BACKGROUND_DEFAULT);

  /** the padding style variant of the card container */
  public boxPadding = input<BoxPadding>(CARD_BOX_PADDING_DEFAULT);

  /**
   * when true, flips the underlying box into its clickable affordance so the whole card surface is
   * interactive. ignored when isExpandable is true — the expandable header drives the interaction instead.
   */
  public readonly isClickable = input<boolean>(CARD_IS_CLICKABLE_DEFAULT);

  /**
   * emitted when the card is clicked or activated via keyboard while clickable. only meaningful when
   * isClickable is true and the card is not expandable.
   */
  public readonly clicked = output<void>();

  constructor() {
    // forward the inner box's clicked emissions to the card's own clicked output, but only when the card
    // is explicitly clickable AND not in expandable mode. expandable mode owns the clickable affordance on
    // the header itself and cannot share a click target with the whole surface.
    effect((onCleanup) => {
      const brain = this._boxBrainDirective();

      if (!brain) {
        return;
      }

      if (this.expandableBrain.isExpandable()) {
        return;
      }

      if (!this.isClickable()) {
        return;
      }

      brain.setExternallyClickable(true);

      const subscription = brain.clicked.subscribe(() => this.clicked.emit());

      onCleanup(() => {
        brain.setExternallyClickable(false);
        subscription.unsubscribe();
      });
    });
  }
}

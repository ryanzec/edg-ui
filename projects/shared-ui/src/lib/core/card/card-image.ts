import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { CardImageBrainDirective } from '../../brain/card-image-brain/card-image-brain';

/** all available card image mode values */
export const allCardImageModes = ['default', 'fill'] as const;

/**
 * the layout mode for the card image
 *
 * default: the image renders at the explicit width/height inputs
 * fill: the image stretches to fill the container with a forced aspect ratio
 */
export type CardImageMode = (typeof allCardImageModes)[number];

/** default value for the card image mode input */
export const CARD_IMAGE_MODE_DEFAULT: CardImageMode = 'fill';

/** default value for the card image full width input */
export const CARD_IMAGE_FULL_WIDTH_DEFAULT = true;

/** default value for the card image width input */
export const CARD_IMAGE_WIDTH_DEFAULT: number | undefined = undefined;

/** default value for the card image height input */
export const CARD_IMAGE_HEIGHT_DEFAULT: number | undefined = undefined;

/** default value for the card image priority input */
export const CARD_IMAGE_PRIORITY_DEFAULT = false;

/**
 * displays an image inside a card. the default `fill` mode forces a 16:9 aspect ratio that bleeds to the card
 * edges; switch to `default` mode and pass width/height to render an intrinsically sized image.
 */
@Component({
  selector: 'org-card-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './card-image.html',
  styleUrl: './card-image.css',
  hostDirectives: [
    {
      directive: CardImageBrainDirective,
      inputs: ['src', 'alt'],
    },
  ],
  host: {
    '[attr.data-full-width]': 'fullWidth() ? "1" : "0"',
    '[attr.data-mode]': 'mode() === "fill" ? "fill" : null',
    '[attr.data-priority]': 'priority() ? "" : null',
  },
})
export class CardImage {
  /** reference to the host card image brain directive owning src and alt inputs */
  protected readonly cardImageBrainDirective = inject(CardImageBrainDirective);

  /** the layout mode for the image; `fill` forces a 16:9 aspect ratio, `default` uses the width/height inputs */
  public mode = input<CardImageMode>(CARD_IMAGE_MODE_DEFAULT);

  /** whether the image bleeds to the card edges (true) or sits inset within the card gutter (false) */
  public fullWidth = input<boolean>(CARD_IMAGE_FULL_WIDTH_DEFAULT);

  /** the intrinsic width of the image in pixels; required when `mode === "default"` */
  public width = input<number | undefined, number | null | undefined>(CARD_IMAGE_WIDTH_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the intrinsic height of the image in pixels; required when `mode === "default"` */
  public height = input<number | undefined, number | null | undefined>(CARD_IMAGE_HEIGHT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether to treat this image as a lcp element and load it with high priority */
  public priority = input<boolean>(CARD_IMAGE_PRIORITY_DEFAULT);
}

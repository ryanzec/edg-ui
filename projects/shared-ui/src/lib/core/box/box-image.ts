import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { BoxImageBrainDirective } from '../box/box-image-brain';

/** all available box image mode values */
export const allBoxImageModes = ['default', 'fill'] as const;

/**
 * the layout mode for the box image
 *
 * default: the image renders at the explicit width/height inputs
 * fill: the image stretches to fill the container with a forced aspect ratio
 */
export type BoxImageMode = (typeof allBoxImageModes)[number];

/** default value for the box image mode input */
export const BOX_IMAGE_MODE_DEFAULT: BoxImageMode = 'fill';

/** default value for the box image full width input */
export const BOX_IMAGE_FULL_WIDTH_DEFAULT = true;

/** default value for the box image width input */
export const BOX_IMAGE_WIDTH_DEFAULT: number | undefined = undefined;

/** default value for the box image height input */
export const BOX_IMAGE_HEIGHT_DEFAULT: number | undefined = undefined;

/** default value for the box image priority input */
export const BOX_IMAGE_PRIORITY_DEFAULT = false;

/**
 * displays an image inside a box composition. the default `fill` mode forces a 16:9 aspect ratio that bleeds
 * to the box edges; switch to `default` mode and pass width/height to render an intrinsically sized image.
 */
@Component({
  selector: 'org-box-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './box-image.html',
  styleUrl: './box-image.css',
  hostDirectives: [
    {
      directive: BoxImageBrainDirective,
      inputs: ['src', 'alt'],
    },
  ],
  host: {
    '[attr.data-full-width]': 'fullWidth() ? "1" : "0"',
    '[attr.data-mode]': 'mode() === "fill" ? "fill" : null',
    '[attr.data-priority]': 'priority() ? "" : null',
  },
})
export class BoxImage {
  /** reference to the host box image brain directive owning src and alt inputs */
  protected readonly boxImageBrainDirective = inject(BoxImageBrainDirective);

  /** the layout mode for the image; `fill` forces a 16:9 aspect ratio, `default` uses the width/height inputs */
  public mode = input<BoxImageMode>(BOX_IMAGE_MODE_DEFAULT);

  /** whether the image bleeds to the box edges (true) or sits inset within the box gutter (false) */
  public fullWidth = input<boolean>(BOX_IMAGE_FULL_WIDTH_DEFAULT);

  /** the intrinsic width of the image in pixels; required when `mode === "default"` */
  public width = input<number | undefined, number | null | undefined>(BOX_IMAGE_WIDTH_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the intrinsic height of the image in pixels; required when `mode === "default"` */
  public height = input<number | undefined, number | null | undefined>(BOX_IMAGE_HEIGHT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether to treat this image as a lcp element and load it with high priority */
  public priority = input<boolean>(BOX_IMAGE_PRIORITY_DEFAULT);
}

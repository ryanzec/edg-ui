import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { BoxBrainDirective } from '../../brain/box-brain/box-brain';
import { ComponentColor, allComponentColors } from '../types/component-types';

/** the color variant type for the box component */
export type BoxColor = ComponentColor;

/** all available box color values */
export const allBoxColors = allComponentColors;

/** all available box border values */
export const allBoxBorders = ['bordered', 'borderless', 'border-thick', 'border-emphasize'] as const;

/**
 * the border/visual style variant type for the box component
 *
 * bordered: the box has a border around it, using the color input for the border color
 * borderless: the box has no border
 * border-thick: the box has a thick border, using the color input for the border color
 * border-emphasize: the box has a border that is more prominent, using the color input for the border color
 */
export type BoxBorder = (typeof allBoxBorders)[number];

/** all available box padding values */
export const allBoxPaddings = ['none', 'sm', 'base', 'lg'] as const;

/** the internal padding size type for the box component */
export type BoxPadding = (typeof allBoxPaddings)[number];

/** all available box background values */
export const allBoxBackgrounds = ['colored', 'colorless'] as const;

/**
 * the background mode type for the box component
 *
 * colored: the box has a colored background, using the color input
 * colorless: the box has a transparent background, using the color input for borders and text
 */
export type BoxBackground = (typeof allBoxBackgrounds)[number];

/** default value for the box color input */
export const BOX_COLOR_DEFAULT: BoxColor | undefined = undefined;

/** default value for the box border input */
export const BOX_BORDER_DEFAULT: BoxBorder = 'bordered';

/** default value for the box padding input */
export const BOX_PADDING_DEFAULT: BoxPadding = 'base';

/** default value for the box background input */
export const BOX_BACKGROUND_DEFAULT: BoxBackground = 'colored';

@Component({
  selector: 'org-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './box.css',
  hostDirectives: [
    {
      directive: BoxBrainDirective,
      outputs: ['clicked'],
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-border]': 'border()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-background]': 'background()',
  },
})
export class Box {
  /**
   * the semantic color applied to the border and background of the box.
   * note: color variants (danger, warning, info, safe) convey meaning visually only —
   * consumers must add appropriate aria attributes (e.g. role="alert") when the color
   * carries semantic importance for assistive technologies.
   */
  public color = input<BoxColor | undefined, BoxColor | null | undefined>(BOX_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the border/visual style variant of the box */
  public border = input<BoxBorder>(BOX_BORDER_DEFAULT);

  /** the internal padding size of the box */
  public padding = input<BoxPadding>(BOX_PADDING_DEFAULT);

  /** whether the color input should tint the background (colored) or leave the default background (colorless) */
  public background = input<BoxBackground>(BOX_BACKGROUND_DEFAULT);
}

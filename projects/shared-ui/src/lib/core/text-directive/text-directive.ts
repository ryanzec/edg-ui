import { Directive, input } from '@angular/core';
import { ComponentColor, allComponentColors } from '../types/component-types';

/** semantic color options available for the text directive */
export type TextColor = ComponentColor;

/** all valid text color values */
export const textColors = allComponentColors;

/** font size options available for the text directive */
export type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** all valid text size values */
export const textSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const satisfies readonly TextSize[];

/** default value for the textColor input */
export const TEXT_COLOR_DEFAULT: TextColor | null = null;

/** default value for the textSize input */
export const TEXT_SIZE_DEFAULT: TextSize | null = null;

/** applies semantic text color and size utility classes to any host element */
@Directive({
  selector: '[orgText]',
  host: {
    '[attr.data-text-color]': 'textColor()',
    '[attr.data-text-size]': 'textSize()',
  },
})
export class TextDirective {
  /** the semantic color to apply to the text */
  public textColor = input<TextColor | null>(TEXT_COLOR_DEFAULT);

  /** the font size to apply to the text */
  public textSize = input<TextSize | null>(TEXT_SIZE_DEFAULT);
}

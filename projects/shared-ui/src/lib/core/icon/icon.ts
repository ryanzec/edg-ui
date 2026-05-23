import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { IconBrainDirective } from '../icon/icon-brain';
import { allComponentColors, ComponentSize } from '../types/component-types';

/** all valid icon size values */
export const allIconSizes = [
  '2xs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
] as const satisfies readonly ComponentSize[];

/** size variants available for the icon component */
export type IconSize = (typeof allIconSizes)[number];

/** all valid icon color values */
export const allIconColors = ['inherit', 'muted', 'faint', ...allComponentColors] as const;

/** color variants available for the icon component */
export type IconColor = (typeof allIconColors)[number];

/** default value for the icon size input */
export const ICON_SIZE_DEFAULT: IconSize = 'base';

/** default value for the icon color input */
export const ICON_COLOR_DEFAULT: IconColor = 'inherit';

@Component({
  selector: 'org-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  imports: [LucideDynamicIcon],
  hostDirectives: [
    {
      directive: IconBrainDirective,
      inputs: ['name', 'label'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
  },
})
export class Icon {
  /** reference to the host icon brain directive owning name resolution and accessibility derivation */
  protected readonly iconBrainDirective = inject(IconBrainDirective);

  /** the size of the icon */
  public readonly size = input<IconSize>(ICON_SIZE_DEFAULT);

  /** the color variant of the icon */
  public readonly color = input<IconColor>(ICON_COLOR_DEFAULT);
}

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ComponentColor } from '../types/component-types';
import { ProgressBarBrainDirective } from './progress-bar-brain';

/** the color variant applied to the filled portion of the progress bar */
export type ProgressBarColor = ComponentColor;

/** all available progress bar shape values */
export const allProgressBarShapes = ['pill', 'rounded'] as const;

/** the corner shape of the progress bar; 'rounded' swaps the pill radius for the xs radius */
export type ProgressBarShape = (typeof allProgressBarShapes)[number];

/** all available progress bar size values */
export const allProgressBarSizes = ['base', 'sm', 'lg'] as const;

/** the height variant of the progress bar */
export type ProgressBarSize = (typeof allProgressBarSizes)[number];

/** default value for the color input */
export const PROGRESS_BAR_COLOR_DEFAULT: ProgressBarColor = 'primary';

/** default value for the shape input */
export const PROGRESS_BAR_SHAPE_DEFAULT: ProgressBarShape = 'pill';

/** default value for the size input */
export const PROGRESS_BAR_SIZE_DEFAULT: ProgressBarSize = 'base';

@Component({
  selector: 'org-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
  hostDirectives: [
    {
      directive: ProgressBarBrainDirective,
      inputs: ['percentage', 'ariaLabel'],
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-size]': 'size()',
  },
})
export class ProgressBar {
  /** reference to the host progress bar brain directive owning the clamped fill value and a11y surface */
  protected readonly brain = inject(ProgressBarBrainDirective);

  /** the color variant applied to the filled portion of the progress bar */
  public readonly color = input<ProgressBarColor>(PROGRESS_BAR_COLOR_DEFAULT);

  /** the corner shape of the progress bar; 'rounded' swaps the pill radius for the xs radius */
  public readonly shape = input<ProgressBarShape>(PROGRESS_BAR_SHAPE_DEFAULT);

  /** the height variant of the progress bar */
  public readonly size = input<ProgressBarSize>(PROGRESS_BAR_SIZE_DEFAULT);
}

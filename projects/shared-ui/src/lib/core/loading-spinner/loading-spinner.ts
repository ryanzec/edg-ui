import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Icon, IconColor, IconSize } from '../icon/icon';
import { LoadingSpinnerBrainDirective } from '../../brain/loading-spinner-brain/loading-spinner-brain';

/** default value for the size input */
export const LOADING_SPINNER_SIZE_DEFAULT: IconSize = 'base';

/** default value for the icon color input */
export const LOADING_SPINNER_ICON_COLOR_DEFAULT: IconColor = 'inherit';

@Component({
  selector: 'org-loading-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `<org-icon name="loader" [size]="size()" [color]="iconColor()" />`,
  styleUrl: './loading-spinner.css',
  hostDirectives: [
    {
      directive: LoadingSpinnerBrainDirective,
      inputs: ['label'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-icon-color]': 'iconColor()',
  },
})
export class LoadingSpinner {
  /** the size of the spinner icon */
  public size = input<IconSize>(LOADING_SPINNER_SIZE_DEFAULT);

  /** the color of the spinner icon */
  public iconColor = input<IconColor>(LOADING_SPINNER_ICON_COLOR_DEFAULT);
}

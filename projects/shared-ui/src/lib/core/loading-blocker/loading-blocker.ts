import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { LoadingBlockerBrainDirective } from '../../brain/loading-blocker-brain/loading-blocker-brain';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { type IconSize } from '../icon/icon';
import { ComponentColor, allComponentColors } from '../types/component-types';

/** the semantic color tint applied to the loading-blocker spinner + text */
export type LoadingBlockerColor = ComponentColor;

/** all available loading-blocker color values (re-exported from the shared component color set) */
export const allLoadingBlockerColors = allComponentColors;

/** all available loading-blocker intensity values */
export const allLoadingBlockerIntensities = ['light', 'medium', 'heavy'] as const;

/** intensity controls the scrim opacity and backdrop blur strength */
export type LoadingBlockerIntensity = (typeof allLoadingBlockerIntensities)[number];

/** all available loading-blocker scope values */
export const allLoadingBlockerScopes = ['region', 'viewport'] as const;

/** scope determines whether the blocker covers the host (region) or the entire viewport */
export type LoadingBlockerScope = (typeof allLoadingBlockerScopes)[number];

/** all available loading-blocker spinner-size values (subset of icon sizes that fit the centred panel) */
export const allLoadingBlockerSpinnerSizes = ['lg', 'xl', '2xl', '3xl'] as const satisfies readonly IconSize[];

/** the size variant forwarded to the inner org-loading-spinner */
export type LoadingBlockerSpinnerSize = (typeof allLoadingBlockerSpinnerSizes)[number];

/** default value for the intensity input */
export const LOADING_BLOCKER_INTENSITY_DEFAULT: LoadingBlockerIntensity = 'medium';

/** default value for the scope input */
export const LOADING_BLOCKER_SCOPE_DEFAULT: LoadingBlockerScope = 'region';

/** default value for the color input */
export const LOADING_BLOCKER_COLOR_DEFAULT: LoadingBlockerColor | undefined = undefined;

/** default value for the spinnerSize input */
export const LOADING_BLOCKER_SPINNER_SIZE_DEFAULT: LoadingBlockerSpinnerSize = '2xl';

@Component({
  selector: 'org-loading-blocker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner],
  templateUrl: './loading-blocker.html',
  styleUrl: './loading-blocker.css',
  hostDirectives: [
    {
      directive: LoadingBlockerBrainDirective,
      inputs: ['isVisible', 'label'],
    },
  ],
  host: {
    '[attr.data-visible]': 'brain.isVisible() ? "1" : null',
    '[attr.data-intensity]': 'intensity()',
    '[attr.data-scope]': 'scope()',
    '[attr.data-color]': 'color()',
    '[attr.data-spinner-size]': 'spinnerSize()',
  },
})
export class LoadingBlocker {
  /** reference to the host loading-blocker brain directive owning visibility, a11y, and focus trapping */
  protected readonly brain = inject(LoadingBlockerBrainDirective, { self: true });

  /** intensity of the scrim — controls opacity tint and backdrop blur */
  public readonly intensity = input<LoadingBlockerIntensity>(LOADING_BLOCKER_INTENSITY_DEFAULT);

  /** scope of the blocker — region pins to the host, viewport covers the entire window */
  public readonly scope = input<LoadingBlockerScope>(LOADING_BLOCKER_SCOPE_DEFAULT);

  /** optional semantic color tint applied to the spinner + text */
  public readonly color = input<LoadingBlockerColor | undefined, LoadingBlockerColor | null | undefined>(
    LOADING_BLOCKER_COLOR_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    },
  );

  /** size variant forwarded to the inner org-loading-spinner */
  public readonly spinnerSize = input<LoadingBlockerSpinnerSize>(LOADING_BLOCKER_SPINNER_SIZE_DEFAULT);
}

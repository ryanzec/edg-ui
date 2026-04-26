import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  input,
  viewChild,
  ElementRef,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js/auto';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { EmptyIndicator } from '../empty-indicator/empty-indicator';
import { cssUtils } from '@organization/shared-utils';
import { ChartBrainDirective } from '../../brain/chart-brain/chart-brain';

/** default value for the config input */
export const CHART_CONFIG_DEFAULT: ChartConfiguration | null = null;

/** default value for the isLoading input */
export const CHART_IS_LOADING_DEFAULT = false;

/** default value for the containerClass input */
export const CHART_CONTAINER_CLASS_DEFAULT = '';

@Component({
  selector: 'org-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner, EmptyIndicator],
  templateUrl: './chart.html',
  hostDirectives: [
    {
      directive: ChartBrainDirective,
      inputs: ['chartConfig: config', 'chartIsLoading: isLoading'],
    },
  ],
  styleUrl: './chart.css',
  host: {
    '[attr.data-is-loading]': 'isLoading() ? "" : null',
  },
})
export class Chart {
  protected readonly brain = inject(ChartBrainDirective, { self: true });

  /** reference to the canvas element used to render the chart */
  private readonly _canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasRef');

  /** chart.js configuration object; setting this to null clears the chart */
  public readonly config = input<ChartConfiguration | null>(CHART_CONFIG_DEFAULT);

  /** when true, displays a loading spinner in place of the chart */
  public readonly isLoading = input<boolean>(CHART_IS_LOADING_DEFAULT);

  /** additional css classes applied to the outermost container element */
  public readonly containerClass = input<string>(CHART_CONTAINER_CLASS_DEFAULT);

  /** the current error message if chart rendering failed, null otherwise (proxied from brain) */
  protected readonly error = computed<string | null>(() => this.brain.error());

  /** merged css classes for the container element */
  protected readonly containerClasses = computed<string>(() =>
    cssUtils.merge('chart-container', this.containerClass())
  );

  /** true when not loading and no config is provided */
  protected readonly isEmpty = computed<boolean>(() => {
    return !this.isLoading() && !this.config();
  });

  /** true when an error has occurred during chart rendering */
  protected readonly hasError = computed<boolean>(() => {
    return !!this.error();
  });

  /** true when the chart should be visible (not loading, not empty, no error) */
  protected readonly shouldShowChart = computed<boolean>(() => {
    return !this.isLoading() && !this.isEmpty() && !this.hasError();
  });

  /** aria-label value for the canvas element, derived from the chart title when available */
  protected readonly canvasAriaLabel = computed<string>(() => {
    const titleText = this.config()?.options?.plugins?.title?.text;

    if (Array.isArray(titleText)) {
      return titleText.join(' ');
    }

    if (typeof titleText === 'string' && titleText.trim()) {
      return titleText;
    }

    return 'chart';
  });

  constructor() {
    // push the canvas element into the brain whenever it becomes available or changes
    effect(() => {
      this.brain.setCanvasElement(this._canvasRef()?.nativeElement ?? null);
    });
  }
}

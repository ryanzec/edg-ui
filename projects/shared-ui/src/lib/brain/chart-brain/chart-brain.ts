import { Directive, OnDestroy, computed, effect, input, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js/auto';

/** default value for the chartConfig input */
export const CHART_CONFIG_DEFAULT: ChartConfiguration | undefined = undefined;

/** default value for the chartIsLoading input */
export const CHART_IS_LOADING_DEFAULT = false;

/** the internal state shape for the chart brain directive */
type ChartState = {
  error: string | null;
};

/**
 * headless brain directive for the chart component. owns the chart.js instance lifecycle, the create / update /
 * destroy effect, and the error state when rendering fails. the presentation pushes the canvas element into the
 * brain after viewchild resolves so the brain can attach the chart without owning the template ref directly.
 */
@Directive({
  selector: '[orgChartBrain]',
  exportAs: 'orgChartBrain',
})
export class ChartBrainDirective implements OnDestroy {
  private _chartInstance: ChartJS | null = null;

  private readonly _state = signal<ChartState>({
    error: null,
  });

  private readonly _canvasElement = signal<HTMLCanvasElement | null>(null);

  /** chart.js configuration object; setting this to undefined clears the chart */
  public readonly chartConfig = input<ChartConfiguration | undefined, ChartConfiguration | null | undefined>(
    CHART_CONFIG_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** when true, suspends chart creation and clears any existing instance */
  public readonly chartIsLoading = input<boolean>(CHART_IS_LOADING_DEFAULT);

  /** the current error message if chart rendering failed, null otherwise */
  public readonly error = computed<string | null>(() => this._state().error);

  constructor() {
    // create, update, or destroy the chart instance in response to config, loading, and canvas availability changes
    effect(() => {
      const config = this.chartConfig();
      const canvasElement = this._canvasElement();

      if (!config || this.chartIsLoading()) {
        this._destroyChart();

        return;
      }

      if (!canvasElement) {
        return;
      }

      try {
        this._createOrUpdateChart(config, canvasElement);
        this._state.update((state) => ({
          ...state,
          error: null,
        }));
      } catch (error) {
        this._state.update((state) => ({
          ...state,
          error: error instanceof Error ? error.message : 'failed to render chart',
        }));
      }
    });
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this._destroyChart();
  }

  /** registers the canvas element so the brain can attach the chart instance to it */
  public setCanvasElement(canvas: HTMLCanvasElement | null): void {
    this._canvasElement.set(canvas);
  }

  /** creates a new chart instance or updates the existing one in place */
  private _createOrUpdateChart(config: ChartConfiguration, canvas: HTMLCanvasElement): void {
    if (this._chartInstance) {
      // chart.js does not support changing the chart type on an existing instance
      if ((this._chartInstance.config as ChartConfiguration).type !== config.type) {
        this._destroyChart();
        this._chartInstance = new ChartJS(canvas, config);

        return;
      }

      this._chartInstance.data = config.data;
      this._chartInstance.options = config.options ?? {};
      this._chartInstance.update();

      return;
    }

    this._chartInstance = new ChartJS(canvas, config);
  }

  /** destroys the current chart.js instance and releases its resources */
  private _destroyChart(): void {
    if (this._chartInstance) {
      this._chartInstance.destroy();
      this._chartInstance = null;
    }
  }
}

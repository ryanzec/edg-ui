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
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { EmptyIndicator } from '../empty-indicator/empty-indicator';
import { cssUtils } from '@organization/shared-utils';
import { ChartBrainDirective } from '../../brain/chart-brain/chart-brain';

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
      inputs: ['config', 'isLoading'],
    },
  ],
  styleUrl: './chart.css',
  host: {
    '[attr.data-is-loading]': 'brain.isLoading() ? "" : null',
  },
})
export class Chart {
  protected readonly brain = inject(ChartBrainDirective, { self: true });

  /** reference to the canvas element used to render the chart */
  private readonly _canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasRef');

  /** additional css classes applied to the outermost container element */
  public readonly containerClass = input<string>(CHART_CONTAINER_CLASS_DEFAULT);

  /** merged css classes for the container element */
  protected readonly containerClasses = computed<string>(() =>
    cssUtils.merge('chart-container', this.containerClass())
  );

  constructor() {
    // push the canvas element into the brain whenever it becomes available or changes
    effect(() => {
      this.brain.setCanvasElement(this._canvasRef()?.nativeElement ?? null);
    });
  }
}

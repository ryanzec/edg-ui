import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ChartConfiguration } from 'chart.js/auto';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Chart } from './chart';

const buildValidConfig = (): ChartConfiguration => ({
  type: 'bar',
  data: { labels: ['A'], datasets: [{ data: [1] }] },
});

const buildConfigWithStringTitle = (): ChartConfiguration => ({
  type: 'bar',
  data: { labels: ['A'], datasets: [{ data: [1] }] },
  options: { plugins: { title: { text: 'My Chart Title' } } },
});

const buildConfigWithArrayTitle = (): ChartConfiguration => ({
  type: 'bar',
  data: { labels: ['A'], datasets: [{ data: [1] }] },
  options: { plugins: { title: { text: ['Line One', 'Line Two'] } } },
});

const buildConfigWithEmptyTitle = (): ChartConfiguration => ({
  type: 'bar',
  data: { labels: ['A'], datasets: [{ data: [1] }] },
  options: { plugins: { title: { text: '' } } },
});

const buildInvalidConfig = (): ChartConfiguration =>
  ({
    type: 'unknown-chart-type',
    data: { labels: ['A'], datasets: [{ data: [1] }] },
  }) as unknown as ChartConfiguration;

@Component({
  selector: 'test-chart-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chart],
  host: { class: 'block' },
  template: `
    <org-chart data-testid="chart" [config]="config()" [isLoading]="isLoading()" [containerClass]="containerClass()" />
  `,
})
class ChartHost {
  public readonly config = signal<ChartConfiguration | null | undefined>(undefined);
  public readonly isLoading = signal<boolean>(false);
  public readonly containerClass = signal<string>('');
}

type ChartHostConfig = {
  config?: ChartConfiguration | null;
  isLoading?: boolean;
  containerClass?: string;
};

describe('Chart (browser)', () => {
  const { createFixture, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createChart = (config: ChartHostConfig = {}): ComponentFixture<ChartHost> =>
    createFixture(ChartHost, (instance) => {
      if (config.config !== undefined) {
        instance.config.set(config.config);
      }

      if (config.isLoading !== undefined) {
        instance.isLoading.set(config.isLoading);
      }

      if (config.containerClass !== undefined) {
        instance.containerClass.set(config.containerClass);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('default state', () => {
    it('renders the empty indicator by default', () => {
      const fixture = createChart();
      const host = queryByTestId(fixture, 'chart');

      expect(host.querySelector('org-empty-indicator')).not.toBeNull();
      expect(host.querySelector('canvas')).toBeNull();
    });

    it('omits the data-is-loading attribute by default', () => {
      const fixture = createChart();
      const host = queryByTestId(fixture, 'chart');

      expect(host.getAttribute('data-is-loading')).toBeNull();
    });

    it('applies the chart-container class by default', () => {
      const fixture = createChart();
      const host = queryByTestId(fixture, 'chart');

      expect(host.querySelector('.chart-container')).not.toBeNull();
    });
  });

  describe('null config', () => {
    it('treats a null config as no config', async () => {
      const fixture = createChart();
      const host = queryByTestId(fixture, 'chart');

      fixture.componentInstance.config.set(null);

      await waitFor(() => {
        expect(host.querySelector('org-empty-indicator')).not.toBeNull();
        expect(host.querySelector('canvas')).toBeNull();
      });
    });
  });

  describe('loading', () => {
    it('renders the loading spinner when isLoading is true', () => {
      const fixture = createChart({ isLoading: true });
      const host = queryByTestId(fixture, 'chart');

      expect(host.querySelector('org-loading-spinner')).not.toBeNull();
    });

    it('sets the data-is-loading attribute when loading', () => {
      const fixture = createChart({ isLoading: true });
      const host = queryByTestId(fixture, 'chart');

      expect(host.getAttribute('data-is-loading')).toBe('');
    });

    it('hides the empty indicator when loading', () => {
      const fixture = createChart({ isLoading: true });
      const host = queryByTestId(fixture, 'chart');

      expect(host.querySelector('org-loading-spinner')).not.toBeNull();
      expect(host.querySelector('org-empty-indicator')).toBeNull();
    });

    it('keeps the error clear while loading even with config', async () => {
      const fixture = createChart({ isLoading: true, config: buildInvalidConfig() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => expect(host.querySelector('org-loading-spinner')).not.toBeNull());

      expect(host.querySelector('.error-container')).toBeNull();
    });
  });

  describe('container class', () => {
    it('merges a custom container class alongside chart-container', () => {
      const fixture = createChart({ containerClass: 'custom-container' });
      const host = queryByTestId(fixture, 'chart');

      const container = host.querySelector('.chart-container') as HTMLElement;

      expect(container.classList.contains('chart-container')).toBe(true);
      expect(container.classList.contains('custom-container')).toBe(true);
    });
  });

  describe('canvas rendering', () => {
    it('renders the canvas when config is provided and not loading', async () => {
      const fixture = createChart({ config: buildValidConfig() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        expect(host.querySelector('.canvas-container canvas')).not.toBeNull();
        expect(host.querySelector('org-empty-indicator')).toBeNull();
      });
    });

    it('sets role="img" on the canvas', async () => {
      const fixture = createChart({ config: buildValidConfig() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

        expect(canvasEl.getAttribute('role')).toBe('img');
      });
    });

    it('sets the canvas aria-label chart fallback by default', async () => {
      const fixture = createChart({ config: buildValidConfig() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

        expect(canvasEl.getAttribute('aria-label')).toBe('chart');
      });
    });

    it('sets the canvas aria-label to the string title', async () => {
      const fixture = createChart({ config: buildConfigWithStringTitle() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

        expect(canvasEl.getAttribute('aria-label')).toBe('My Chart Title');
      });
    });

    it('joins an array title with spaces for the aria-label', async () => {
      const fixture = createChart({ config: buildConfigWithArrayTitle() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

        expect(canvasEl.getAttribute('aria-label')).toBe('Line One Line Two');
      });
    });

    it('uses the chart fallback for an empty or whitespace title', async () => {
      const fixture = createChart({ config: buildConfigWithEmptyTitle() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

        expect(canvasEl.getAttribute('aria-label')).toBe('chart');
      });
    });
  });

  describe('error', () => {
    it('renders the error container when the config is invalid', async () => {
      const fixture = createChart({ config: buildInvalidConfig() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => {
        const errorContainer = host.querySelector('.error-container');

        expect(errorContainer).not.toBeNull();
        expect(errorContainer?.getAttribute('role')).toBe('alert');

        const message = errorContainer?.querySelector('.error-message');

        expect((message?.textContent ?? '').trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('transitions', () => {
    it('transitions from empty to chart when config is set', async () => {
      const fixture = createChart();
      const host = queryByTestId(fixture, 'chart');

      expect(host.querySelector('org-empty-indicator')).not.toBeNull();

      fixture.componentInstance.config.set(buildValidConfig());

      await waitFor(() => {
        expect(host.querySelector('canvas')).not.toBeNull();
        expect(host.querySelector('org-empty-indicator')).toBeNull();
      });
    });

    it('transitions from chart to loading and clears the canvas', async () => {
      const fixture = createChart({ config: buildValidConfig() });
      const host = queryByTestId(fixture, 'chart');

      await waitFor(() => expect(host.querySelector('canvas')).not.toBeNull());

      fixture.componentInstance.isLoading.set(true);

      await waitFor(() => {
        expect(host.querySelector('canvas')).toBeNull();
        expect(host.querySelector('org-loading-spinner')).not.toBeNull();
      });
    });
  });
});

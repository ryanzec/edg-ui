import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { ChartConfiguration } from 'chart.js/auto';
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
  selector: 'story-chart-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chart],
  host: { class: 'block' },
  template: `
    <org-chart data-testid="chart" [config]="config()" [isLoading]="isLoading()" [containerClass]="containerClass()" />
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-config-clear" (click)="config.set(undefined)">config-clear</button>
      <button type="button" data-testid="ctl-config-null" (click)="config.set(null)">config-null</button>
      <button type="button" data-testid="ctl-config-valid" (click)="setValidConfig()">config-valid</button>
      <button type="button" data-testid="ctl-config-string-title" (click)="setStringTitleConfig()">
        config-string-title
      </button>
      <button type="button" data-testid="ctl-config-array-title" (click)="setArrayTitleConfig()">
        config-array-title
      </button>
      <button type="button" data-testid="ctl-config-empty-title" (click)="setEmptyTitleConfig()">
        config-empty-title
      </button>
      <button type="button" data-testid="ctl-config-invalid" (click)="setInvalidConfig()">config-invalid</button>
      <button type="button" data-testid="ctl-loading-on" (click)="isLoading.set(true)">loading-on</button>
      <button type="button" data-testid="ctl-loading-off" (click)="isLoading.set(false)">loading-off</button>
      <button type="button" data-testid="ctl-container-class-extra" (click)="containerClass.set('custom-container')">
        container-class-extra
      </button>
    </div>
  `,
})
class StoryChartTestsShell {
  protected readonly config = signal<ChartConfiguration | null | undefined>(undefined);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly containerClass = signal<string>('');

  protected setValidConfig(): void {
    this.config.set(buildValidConfig());
  }

  protected setStringTitleConfig(): void {
    this.config.set(buildConfigWithStringTitle());
  }

  protected setArrayTitleConfig(): void {
    this.config.set(buildConfigWithArrayTitle());
  }

  protected setEmptyTitleConfig(): void {
    this.config.set(buildConfigWithEmptyTitle());
  }

  protected setInvalidConfig(): void {
    this.config.set(buildInvalidConfig());
  }
}

const meta: Meta = {
  title: 'Core/Components/Chart/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-chart-tests-shell />`,
  moduleMetadata: { imports: [StoryChartTestsShell] },
});

export const RendersEmptyIndicatorByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await expect(host.querySelector('org-empty-indicator')).not.toBeNull();
    await expect(host.querySelector('canvas')).toBeNull();
  },
};

export const OmitsDataIsLoadingAttributeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await expect(host.getAttribute('data-is-loading')).toBeNull();
  },
};

export const AppliesChartContainerClassByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await expect(host.querySelector('.chart-container')).not.toBeNull();
  },
};

export const TreatsNullConfigAsNoConfig: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-null'));

    await waitFor(() => {
      expect(host.querySelector('org-empty-indicator')).not.toBeNull();
      expect(host.querySelector('canvas')).toBeNull();
    });
  },
};

export const RendersLoadingSpinnerWhenIsLoadingTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(host.querySelector('org-loading-spinner')).not.toBeNull());
  },
};

export const SetsDataIsLoadingAttributeWhenLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(host.getAttribute('data-is-loading')).toBe(''));
  },
};

export const HidesEmptyIndicatorWhenLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => {
      expect(host.querySelector('org-loading-spinner')).not.toBeNull();
      expect(host.querySelector('org-empty-indicator')).toBeNull();
    });
  },
};

export const KeepsErrorClearWhileLoadingEvenWithConfig: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));
    await userEvent.click(canvas.getByTestId('ctl-config-invalid'));

    await waitFor(() => expect(host.querySelector('org-loading-spinner')).not.toBeNull());

    await expect(host.querySelector('.error-container')).toBeNull();
  },
};

export const MergesCustomContainerClassAlongsideChartContainer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-container-class-extra'));

    await waitFor(() => {
      const container = host.querySelector('.chart-container') as HTMLElement;

      expect(container.classList.contains('chart-container')).toBe(true);
      expect(container.classList.contains('custom-container')).toBe(true);
    });
  },
};

export const RendersCanvasWhenConfigProvidedAndNotLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-valid'));

    await waitFor(() => {
      expect(host.querySelector('.canvas-container canvas')).not.toBeNull();
      expect(host.querySelector('org-empty-indicator')).toBeNull();
    });
  },
};

export const SetsCanvasRoleImg: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-valid'));

    await waitFor(() => {
      const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

      expect(canvasEl.getAttribute('role')).toBe('img');
    });
  },
};

export const SetsCanvasAriaLabelChartFallbackByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-valid'));

    await waitFor(() => {
      const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

      expect(canvasEl.getAttribute('aria-label')).toBe('chart');
    });
  },
};

export const SetsCanvasAriaLabelToStringTitle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-string-title'));

    await waitFor(() => {
      const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

      expect(canvasEl.getAttribute('aria-label')).toBe('My Chart Title');
    });
  },
};

export const JoinsArrayTitleWithSpacesForAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-array-title'));

    await waitFor(() => {
      const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

      expect(canvasEl.getAttribute('aria-label')).toBe('Line One Line Two');
    });
  },
};

export const UsesChartFallbackForEmptyOrWhitespaceTitle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-empty-title'));

    await waitFor(() => {
      const canvasEl = host.querySelector('canvas') as HTMLCanvasElement;

      expect(canvasEl.getAttribute('aria-label')).toBe('chart');
    });
  },
};

export const RendersErrorContainerWhenChartConfigIsInvalid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-invalid'));

    await waitFor(() => {
      const errorContainer = host.querySelector('.error-container');

      expect(errorContainer).not.toBeNull();
      expect(errorContainer?.getAttribute('role')).toBe('alert');

      const message = errorContainer?.querySelector('.error-message');

      expect((message?.textContent ?? '').trim().length).toBeGreaterThan(0);
    });
  },
};

export const TransitionsFromEmptyToChartWhenConfigSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await expect(host.querySelector('org-empty-indicator')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-config-valid'));

    await waitFor(() => {
      expect(host.querySelector('canvas')).not.toBeNull();
      expect(host.querySelector('org-empty-indicator')).toBeNull();
    });
  },
};

export const TransitionsFromChartToLoadingClearsCanvas: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('chart');

    await userEvent.click(canvas.getByTestId('ctl-config-valid'));

    await waitFor(() => expect(host.querySelector('canvas')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => {
      expect(host.querySelector('canvas')).toBeNull();
      expect(host.querySelector('org-loading-spinner')).not.toBeNull();
    });
  },
};

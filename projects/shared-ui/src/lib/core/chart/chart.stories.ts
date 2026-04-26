import type { Meta, StoryObj } from '@storybook/angular';
import { Chart } from './chart';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { signal } from '@angular/core';
import { designTokenUtils } from '../../styles/design-tokens';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartConfiguration,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomData = (count: number, min: number, max: number): number[] => {
  return Array.from({ length: count }, () => getRandomInt(min, max));
};

const generateLabels = (count: number, prefix: string): string[] => {
  return Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`);
};

const withAlpha = (color: string, alpha: number): string => {
  return `color-mix(in oklch, ${color} ${Math.round(alpha * 100)}%, transparent)`;
};

const buildVerticalBarConfig = (dataPointCount: number): ChartConfiguration => {
  return {
    type: 'bar',
    data: {
      labels: generateLabels(dataPointCount, 'Item'),
      datasets: [
        {
          label: 'Dataset 1',
          data: generateRandomData(dataPointCount, 10, 100),
          backgroundColor: designTokenUtils.getColorToken('chart.blue.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.blue.2') ?? '',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Vertical Bar Chart' },
      },
      scales: { y: { beginAtZero: true } },
    },
  };
};

const buildHorizontalBarConfig = (dataPointCount: number): ChartConfiguration => {
  return {
    type: 'bar',
    data: {
      labels: generateLabels(dataPointCount, 'Category'),
      datasets: [
        {
          label: 'Dataset 1',
          data: generateRandomData(dataPointCount, 20, 150),
          backgroundColor: designTokenUtils.getColorToken('chart.green.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.green.2') ?? '',
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Horizontal Bar Chart' },
      },
      scales: { x: { beginAtZero: true } },
    },
  };
};

const buildStackedBarConfig = (dataPointCount: number): ChartConfiguration => {
  return {
    type: 'bar',
    data: {
      labels: generateLabels(dataPointCount, 'Month'),
      datasets: [
        {
          label: 'Dataset 1',
          data: generateRandomData(dataPointCount, 10, 50),
          backgroundColor: designTokenUtils.getColorToken('chart.red.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.red.2') ?? '',
          borderWidth: 1,
        },
        {
          label: 'Dataset 2',
          data: generateRandomData(dataPointCount, 10, 50),
          backgroundColor: designTokenUtils.getColorToken('chart.orange.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.orange.2') ?? '',
          borderWidth: 1,
        },
        {
          label: 'Dataset 3',
          data: generateRandomData(dataPointCount, 10, 50),
          backgroundColor: designTokenUtils.getColorToken('chart.amber.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.amber.2') ?? '',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Stacked Bar Chart' },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
    },
  };
};

const buildLineConfig = (dataPointCount: number): ChartConfiguration => {
  const lineColor = designTokenUtils.getColorToken('chart.purple.1') ?? '';

  return {
    type: 'line',
    data: {
      labels: generateLabels(dataPointCount, 'Point'),
      datasets: [
        {
          label: 'Trend Line',
          data: generateRandomData(dataPointCount, 20, 100),
          borderColor: lineColor,
          backgroundColor: withAlpha(lineColor, 0.2),
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: lineColor,
          pointBorderColor: designTokenUtils.getColorToken('background') ?? '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Line Chart with Fill' },
      },
      scales: { y: { beginAtZero: true } },
    },
  };
};

const buildBubbleConfig = (dataPointCount: number): ChartConfiguration => {
  const generateBubbleData = (count: number) => {
    return Array.from({ length: count }, () => ({
      x: getRandomInt(0, 100),
      y: getRandomInt(0, 100),
      r: getRandomInt(5, 25),
    }));
  };

  return {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Bubble Dataset 1',
          data: generateBubbleData(dataPointCount),
          backgroundColor: designTokenUtils.getColorToken('chart.cyan.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.cyan.2') ?? '',
          borderWidth: 1,
        },
        {
          label: 'Bubble Dataset 2',
          data: generateBubbleData(dataPointCount),
          backgroundColor: designTokenUtils.getColorToken('chart.teal.1') ?? '',
          borderColor: designTokenUtils.getColorToken('chart.teal.2') ?? '',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Bubble Chart' },
      },
      scales: {
        x: { beginAtZero: true, max: 100 },
        y: { beginAtZero: true, max: 100 },
      },
    },
  };
};

const pieColors = [
  designTokenUtils.getColorToken('chart.red.1') ?? '',
  designTokenUtils.getColorToken('chart.orange.1') ?? '',
  designTokenUtils.getColorToken('chart.yellow.1') ?? '',
  designTokenUtils.getColorToken('chart.green.1') ?? '',
  designTokenUtils.getColorToken('chart.blue.1') ?? '',
  designTokenUtils.getColorToken('chart.indigo.1') ?? '',
  designTokenUtils.getColorToken('chart.purple.1') ?? '',
  designTokenUtils.getColorToken('chart.pink.1') ?? '',
  designTokenUtils.getColorToken('chart.rose.1') ?? '',
  designTokenUtils.getColorToken('chart.teal.1') ?? '',
  designTokenUtils.getColorToken('chart.cyan.1') ?? '',
  designTokenUtils.getColorToken('chart.sky.1') ?? '',
  designTokenUtils.getColorToken('chart.violet.1') ?? '',
  designTokenUtils.getColorToken('chart.fuchsia.1') ?? '',
  designTokenUtils.getColorToken('chart.lime.1') ?? '',
  designTokenUtils.getColorToken('chart.emerald.1') ?? '',
  designTokenUtils.getColorToken('chart.amber.1') ?? '',
];

const buildPieConfig = (dataPointCount: number): ChartConfiguration => {
  return {
    type: 'pie',
    data: {
      labels: generateLabels(dataPointCount, 'Segment'),
      datasets: [
        {
          label: 'Distribution',
          data: generateRandomData(dataPointCount, 10, 100),
          backgroundColor: Array.from({ length: dataPointCount }, (_, i) => pieColors[i % pieColors.length]),
          borderWidth: 1,
          borderColor: designTokenUtils.getColorToken('background') ?? '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'right' },
        title: { display: true, text: 'Pie Chart' },
      },
    },
  };
};

const polarColors = [
  designTokenUtils.getColorToken('chart.rose.1') ?? '',
  designTokenUtils.getColorToken('chart.pink.1') ?? '',
  designTokenUtils.getColorToken('chart.fuchsia.1') ?? '',
  designTokenUtils.getColorToken('chart.purple.1') ?? '',
  designTokenUtils.getColorToken('chart.violet.1') ?? '',
  designTokenUtils.getColorToken('chart.indigo.1') ?? '',
  designTokenUtils.getColorToken('chart.blue.1') ?? '',
  designTokenUtils.getColorToken('chart.sky.1') ?? '',
  designTokenUtils.getColorToken('chart.cyan.1') ?? '',
  designTokenUtils.getColorToken('chart.teal.1') ?? '',
  designTokenUtils.getColorToken('chart.emerald.1') ?? '',
  designTokenUtils.getColorToken('chart.green.1') ?? '',
  designTokenUtils.getColorToken('chart.lime.1') ?? '',
  designTokenUtils.getColorToken('chart.yellow.1') ?? '',
  designTokenUtils.getColorToken('chart.amber.1') ?? '',
  designTokenUtils.getColorToken('chart.orange.1') ?? '',
  designTokenUtils.getColorToken('chart.red.1') ?? '',
];

const buildPolarConfig = (dataPointCount: number): ChartConfiguration => {
  return {
    type: 'polarArea',
    data: {
      labels: generateLabels(dataPointCount, 'Label'),
      datasets: [
        {
          label: 'Polar Area Dataset',
          data: generateRandomData(dataPointCount, 10, 100),
          backgroundColor: Array.from({ length: dataPointCount }, (_, i) => polarColors[i % polarColors.length]),
          borderWidth: 1,
          borderColor: designTokenUtils.getColorToken('background') ?? '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'right' },
        title: { display: true, text: 'Polar Area Chart' },
      },
    },
  };
};

const buildRadarConfig = (dataPointCount: number): ChartConfiguration => {
  const indigoColor = designTokenUtils.getColorToken('chart.indigo.1') ?? '';
  const indigoColor2 = designTokenUtils.getColorToken('chart.indigo.2') ?? '';
  const background = designTokenUtils.getColorToken('background') ?? '#fff';

  return {
    type: 'radar',
    data: {
      labels: generateLabels(dataPointCount, 'Metric'),
      datasets: [
        {
          label: 'Performance',
          data: generateRandomData(dataPointCount, 20, 100),
          backgroundColor: withAlpha(indigoColor, 0.2),
          borderColor: indigoColor2,
          borderWidth: 2,
          pointBackgroundColor: indigoColor2,
          pointBorderColor: background,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Radar Chart' },
      },
      scales: { r: { beginAtZero: true, max: 100 } },
    },
  };
};

const meta: Meta<Chart> = {
  title: 'Core/Components/Chart',
  component: Chart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Chart Component

  A flexible chart component built on Chart.js that supports multiple chart types, loading states, empty states, and error handling.

  ### Features
  - Support for all Chart.js chart types (bar, line, pie, radar, etc.)
  - Loading state with spinner
  - Empty state indicator
  - Error handling with clear error messages
  - Fixed 16:9 aspect ratio for consistent display
  - Automatic chart updates when configuration changes
  - Proper cleanup on component destroy
  - Custom color tokens for consistent theming

  ### Chart Types
  - **Bar**: Vertical and horizontal bar charts
  - **Stacked Bar**: Stacked bar charts for comparing multiple datasets
  - **Line**: Line charts with optional fill
  - **Bubble**: Bubble charts for three-dimensional data
  - **Pie**: Pie charts for showing proportions
  - **Polar**: Polar area charts
  - **Radar**: Radar/spider charts for multivariate data

  ### Usage Examples
  \`\`\`html
  <!-- Basic bar chart -->
  <org-chart [config]="barChartConfig" />

  <!-- Chart with loading state -->
  <org-chart [config]="chartConfig" [isLoading]="true" />

  <!-- Chart with custom container class -->
  <org-chart [config]="chartConfig" containerClass="max-w-4xl mx-auto" />
  \`\`\`

  ### Reactive Updates
  \`\`\`typescript
  // Update chart data reactively via signal
  protected chartConfig = signal<ChartConfiguration | null>(null);

  protected refresh(): void {
    this.chartConfig.set(buildNewConfig());
  }
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Chart>;

export const Default: Story = {
  args: {
    config: null,
    isLoading: false,
    containerClass: '',
  },
};

export const VerticalBarChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildVerticalBarConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildVerticalBarConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Vertical Bar Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart containerClass="self-stretch w-full" [config]="chartConfig()" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const HorizontalBarChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildHorizontalBarConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildHorizontalBarConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Horizontal Bar Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const StackedBarChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildStackedBarConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildStackedBarConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Stacked Bar Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const LineChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildLineConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildLineConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Line Chart with Fill">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const BubbleChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildBubbleConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildBubbleConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Bubble Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const PieChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildPieConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildPieConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Pie Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const PolarChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildPolarConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildPolarConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Polar Area Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const RadarChart: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildRadarConfig(getRandomInt(10, 30)));

    const onRefresh = () => {
      chartConfig.set(buildRadarConfig(getRandomInt(10, 30)));
    };

    return {
      props: { chartConfig, onRefresh },
      template: `
        <org-storybook-example-container title="Radar Chart">
          <org-storybook-example-container-section label="Example">
            <div>
              <org-button (clicked)="onRefresh()">Refresh Data</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const ChartTypeSwitch: Story = {
  render: () => {
    const chartConfig = signal<ChartConfiguration>(buildVerticalBarConfig(getRandomInt(10, 20)));

    const switchToBar = () => {
      chartConfig.set(buildVerticalBarConfig(getRandomInt(10, 20)));
    };

    const switchToLine = () => {
      chartConfig.set(buildLineConfig(getRandomInt(10, 20)));
    };

    const switchToRadar = () => {
      chartConfig.set(buildRadarConfig(getRandomInt(5, 10)));
    };

    return {
      props: { chartConfig, switchToBar, switchToLine, switchToRadar },
      template: `
        <org-storybook-example-container title="Chart Type Switch" currentState="Switching between chart types destroys and recreates the chart instance">
          <org-storybook-example-container-section label="Example">
            <div class="flex gap-2">
              <org-button (clicked)="switchToBar()">Bar</org-button>
              <org-button (clicked)="switchToLine()">Line</org-button>
              <org-button (clicked)="switchToRadar()">Radar</org-button>
            </div>
            <org-chart [config]="chartConfig()" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const LoadingState: Story = {
  render: () => {
    return {
      template: `
        <org-storybook-example-container title="Loading State">
          <org-storybook-example-container-section label="Example">
            <org-chart [config]="null" [isLoading]="true" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const EmptyState: Story = {
  render: () => {
    return {
      template: `
        <org-storybook-example-container title="Empty State">
          <org-storybook-example-container-section label="Example">
            <org-chart [config]="null" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Chart, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const ErrorState: Story = {
  render: () => {
    // passing an unregistered chart type forces chart.js to throw during render,
    // which exercises the internal error handling path
    const invalidConfig = {
      type: 'unknown-chart-type',
      data: { datasets: [] },
    } as unknown as ChartConfiguration;

    return {
      template: `
        <org-storybook-example-container title="Error State" currentState="An invalid chart type triggers the error display">
          <org-storybook-example-container-section label="Example">
            <org-chart [config]="invalidConfig" class="w-full" />
          </org-storybook-example-container-section>
        </org-storybook-example-container>
      `,
      props: { invalidConfig },
      moduleMetadata: {
        imports: [Chart, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

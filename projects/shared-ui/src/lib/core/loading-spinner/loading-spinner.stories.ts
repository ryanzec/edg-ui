import type { Meta, StoryObj } from '@storybook/angular';
import {
  LoadingSpinner,
  LOADING_SPINNER_SIZE_DEFAULT,
  LOADING_SPINNER_ICON_COLOR_DEFAULT,
  LOADING_SPINNER_LABEL_DEFAULT,
} from './loading-spinner';
import { allIconSizes, allIconColors } from '../icon/icon';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<LoadingSpinner> = {
  title: 'Core/Components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Loading Spinner Component

  A spinning indicator used to communicate that an operation is in progress.

  ### Features
  - Renders an animated spinning icon via the \`org-icon\` component
  - Supports all icon size and color variants
  - Accessible by default: exposes \`role="status"\` and a configurable \`aria-label\`

  ### Usage Examples
  \`\`\`html
  <!-- Default spinner -->
  <org-loading-spinner></org-loading-spinner>

  <!-- Large spinner with primary color -->
  <org-loading-spinner size="lg" iconColor="primary"></org-loading-spinner>

  <!-- Custom accessible label -->
  <org-loading-spinner label="Saving changes"></org-loading-spinner>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<LoadingSpinner>;

export const Default: Story = {
  args: {
    size: LOADING_SPINNER_SIZE_DEFAULT,
    iconColor: LOADING_SPINNER_ICON_COLOR_DEFAULT,
    label: LOADING_SPINNER_LABEL_DEFAULT,
  },
  argTypes: {
    size: {
      control: 'select',
      options: allIconSizes,
      description: 'The size of the spinner icon',
    },
    iconColor: {
      control: 'select',
      options: allIconColors,
      description: 'The color of the spinner icon',
    },
    label: {
      control: 'text',
      description: 'Accessible label announced by screen readers (role="status")',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default spinner with base size and inherited color. Use the controls below to interact with the component.',
      },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available size variants.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing 2xs, xs, sm, base, and lg sizes"
      >
        <org-storybook-example-container-section label="Double Extra Small (2xs)">
          <org-loading-spinner size="2xs"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extra Small (xs)">
          <org-loading-spinner size="xs"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small (sm)">
          <org-loading-spinner size="sm"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (default)">
          <org-loading-spinner></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (lg)">
          <org-loading-spinner size="lg"></org-loading-spinner>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingSpinner, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const IconColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available icon color variants.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Icon Color Variants"
        currentState="Comparing all icon color options"
      >
        <org-storybook-example-container-section label="Inherit (default)">
          <org-loading-spinner></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary">
          <org-loading-spinner iconColor="primary"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <org-loading-spinner iconColor="secondary"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <org-loading-spinner iconColor="neutral"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <org-loading-spinner iconColor="safe"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <org-loading-spinner iconColor="info"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <org-loading-spinner iconColor="caution"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <org-loading-spinner iconColor="warning"></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <org-loading-spinner iconColor="danger"></org-loading-spinner>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingSpinner, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Label: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the accessible label: the spinner always has role="status" and an aria-label that defaults to "Loading" but can be overridden for specific contexts.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Label (Accessibility)"
        currentState="Spinner with default and custom accessible labels"
      >
        <org-storybook-example-container-section label='Default label ("Loading")'>
          <org-loading-spinner></org-loading-spinner>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label='Custom label ("Saving changes")'>
          <org-loading-spinner label="Saving changes"></org-loading-spinner>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Spinner always has <strong>role="status"</strong> so screen readers announce it as a live region</li>
          <li>The <strong>aria-label</strong> defaults to "Loading" but should be overridden to describe the specific operation in progress</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingSpinner, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

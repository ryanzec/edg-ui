import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { LoadingSpinner, LOADING_SPINNER_SIZE_DEFAULT, LOADING_SPINNER_ICON_COLOR_DEFAULT } from './loading-spinner';
import {
  LoadingSpinnerBrainDirective,
  LOADING_SPINNER_LABEL_DEFAULT,
} from '../../brain/loading-spinner-brain/loading-spinner-brain';
import { allIconSizes, allIconColors, IconColor, IconSize } from '../icon/icon';
import { Button } from '../button/button';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { Card } from '../card/card';
import { LoadingBlocker } from '../loading-blocker/loading-blocker';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

const liveDemoSizeItems: ButtonToggleItem[] = allIconSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoIconColorItems: ButtonToggleItem[] = allIconColors.map((iconColor) => ({
  label: iconColor,
  value: iconColor,
  buttonColor: 'primary',
}));

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
type Story = StoryObj<LoadingSpinner & LoadingSpinnerBrainDirective>;

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

@Component({
  selector: 'story-loading-spinner-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LoadingSpinner,
    ButtonToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem; /* 12px */
        min-height: 6rem; /* 96px */
      }
      .label-hint {
        color: var(--color-fg-muted);
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-xs);
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description='Pick a size and color. Both are pass-throughs to the underlying Icon — they map to --sizing-icon-* and the semantic color tokens.'
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="iconColorItems" formControlName="iconColor" buttonSize="sm" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-loading-spinner
              [size]="liveDemoForm.controls.size.value"
              [iconColor]="liveDemoForm.controls.iconColor.value"
            />
            <span class="label-hint">aria-label="Loading"</span>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class LoadingSpinnerLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly iconColorItems = liveDemoIconColorItems;

  protected readonly liveDemoForm = new FormGroup({
    size: new FormControl<IconSize>(LOADING_SPINNER_SIZE_DEFAULT, { nonNullable: true }),
    iconColor: new FormControl<IconColor>(LOADING_SPINNER_ICON_COLOR_DEFAULT, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Walk every combination of size and color and observe how the spinner inherits the icon system tokens.',
      },
    },
  },
  render: () => ({
    template: `<story-loading-spinner-live-demo />`,
    moduleMetadata: {
      imports: [LoadingSpinnerLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-loading-spinner-inherit-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }
      .surface-row {
        display: flex;
        gap: 1rem; /* 16px */
        align-items: stretch;
      }
      .surface {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem; /* 8px */
        padding: 1.25rem; /* 20px */
        border-radius: var(--radius-base);
        border: 1px solid var(--color-border);
        min-height: 6rem; /* 96px */
      }
      .surface-fg {
        color: var(--color-fg);
        background-color: var(--color-bg-surface);
      }
      .surface-fg-muted {
        color: var(--color-fg-muted);
        background-color: var(--color-bg-surface);
      }
      .surface-primary {
        color: var(--color-primary-on);
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }
      .surface-caption {
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-xs);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Inherit color in context"
        description='iconColor="inherit" means the spinner picks up currentColor. Drop it on different surfaces to see it adapt.'
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="surface-row">
          <div class="surface surface-fg">
            <org-loading-spinner size="lg" />
            <span class="surface-caption">on --color-fg</span>
          </div>
          <div class="surface surface-fg-muted">
            <org-loading-spinner size="lg" />
            <span class="surface-caption">on --color-fg-muted</span>
          </div>
          <div class="surface surface-primary">
            <org-loading-spinner size="lg" />
            <span class="surface-caption">on --color-primary fill</span>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingSpinnerInheritSection {}

@Component({
  selector: 'story-loading-spinner-inside-button-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }
      .row {
        display: grid;
        grid-template-columns: 7rem 1fr 1fr 1fr;
        align-items: center;
        gap: 1rem; /* 16px */
      }
      .row-label {
        color: var(--color-fg-muted);
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-xs);
        text-transform: uppercase;
      }
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Inside Button"
        description='When a Button is in data-loading="1", swap the leading icon for an org-loading-spinner wrapping data-icon="loader" data-context="button". The icon&apos;s button context already takes care of size and color.'
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="row">
          <span class="row-label">Filled · sm</span>
          <div class="cell">
            <org-button color="neutral" size="sm" label="Saving..." [loading]="true" />
          </div>
          <div class="cell">
            <org-button color="safe" size="sm" label="Publishing..." [loading]="true" />
          </div>
          <div class="cell">
            <org-button color="danger" size="sm" label="Deleting" preIcon="trash" [iconOnly]="true" ariaLabel="Deleting" [loading]="true" />
          </div>
        </div>
        <div class="row">
          <span class="row-label">Filled · base</span>
          <div class="cell">
            <org-button color="neutral" label="Saving..." [loading]="true" />
          </div>
          <div class="cell">
            <org-button color="info" variant="ghost" label="Loading..." [loading]="true" />
          </div>
          <div class="cell">
            <org-button color="primary" variant="text" label="Refreshing" [loading]="true" />
          </div>
        </div>
        <div class="row">
          <span class="row-label">Filled · lg</span>
          <div class="cell">
            <org-button color="neutral" size="lg" label="Submitting..." [loading]="true" />
          </div>
          <div class="cell">
            <org-button color="warning" size="lg" label="Working..." [loading]="true" />
          </div>
          <div class="cell">
            <org-button color="neutral" size="lg" label="Refreshing" preIcon="refresh-cw" [iconOnly]="true" ariaLabel="Refreshing" [loading]="true" />
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingSpinnerInsideButtonSection {}

@Component({
  selector: 'story-loading-spinner-loading-blocker-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }
      .pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem; /* 16px */
      }
      .blocked-region {
        position: relative;
        min-height: 11rem; /* 176px */
      }
      .blocked-region :first-child {
        height: 100%;
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }
      .body strong {
        font-size: var(--font-size-base);
      }
      .body p {
        margin: 0;
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Composed inside LoadingBlocker"
        description="The LoadingBlocker is a thin scrim that centers a real spinner over the region it blocks — these examples use the production org-loading-blocker component directly so what you see here matches the blocker page."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="pair">
          <div class="blocked-region">
            <org-card>
              <div class="body">
                <strong>Quarterly report</strong>
                <p>Revenue across all regions trended upward by 11.3% with the strongest gains in EMEA and APAC.</p>
                <p>Headcount grew by 12% while engineering margin expanded 3.6% over year-over-year.</p>
              </div>
            </org-card>
            <org-loading-blocker [isVisible]="true" />
          </div>
          <div class="blocked-region">
            <org-card>
              <div class="body">
                <strong>Live activity</strong>
                <p>Streaming events from the production cluster. Latency p99: 142ms. Errors window 5m: 0.</p>
              </div>
            </org-card>
            <org-loading-blocker [isVisible]="true" label="Loading data..." />
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingSpinnerLoadingBlockerSection {}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every loading-spinner axis — size scale, color, contextual color inheritance, inside-button composition, loading-blocker composition, inline-with-text usage, and the accessible label — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Size scale"
            description="All sizes from the shared icon scale. The smaller end is for inline-with-text use; the larger end is for standalone or hero loading regions."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap items-end justify-center gap-4">
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="2xs" />
                <span class="text-xs text-fg-muted">2xs</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="xs" />
                <span class="text-xs text-fg-muted">xs</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="sm" />
                <span class="text-xs text-fg-muted">sm</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="base" />
                <span class="text-xs text-fg-muted">base</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" />
                <span class="text-xs text-fg-muted">lg</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="xl" />
                <span class="text-xs text-fg-muted">xl</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="2xl" />
                <span class="text-xs text-fg-muted">2xl</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="3xl" />
                <span class="text-xs text-fg-muted">3xl</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="4xl" />
                <span class="text-xs text-fg-muted">4xl</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="5xl" />
                <span class="text-xs text-fg-muted">5xl</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Sizes mirror the shared icon scale — pick the spinner size that matches the surrounding text or button</li>
            <li>The wrapper has no intrinsic size; it hugs the inner icon, so layout never reserves extra space</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Color"
            description="Default is inherit — the spinner adopts the surrounding text color, which is what you want inside a Button or DataUpdaterIndicator. The eight semantic colors are explicit overrides."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap justify-center gap-6">
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="inherit" />
                <span class="text-xs text-fg-muted uppercase">inherit</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="muted" />
                <span class="text-xs text-fg-muted uppercase">muted</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="faint" />
                <span class="text-xs text-fg-muted uppercase">faint</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="primary" />
                <span class="text-xs text-fg-muted uppercase">primary</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="secondary" />
                <span class="text-xs text-fg-muted uppercase">secondary</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="neutral" />
                <span class="text-xs text-fg-muted uppercase">neutral</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="safe" />
                <span class="text-xs text-fg-muted uppercase">safe</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="info" />
                <span class="text-xs text-fg-muted uppercase">info</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="caution" />
                <span class="text-xs text-fg-muted uppercase">caution</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="warning" />
                <span class="text-xs text-fg-muted uppercase">warning</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" iconColor="danger" />
                <span class="text-xs text-fg-muted uppercase">danger</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>inherit</strong> (default): adopts <code>currentColor</code>, ideal inside buttons and inline copy</li>
            <li><strong>muted / faint</strong>: low-emphasis loading affordances on neutral surfaces</li>
            <li>Semantic colors map to the same tokens used by Button and Tag for cross-component consistency</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-spinner-inherit-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Default <code>iconColor="inherit"</code> resolves to the parent's <code>currentColor</code> at the spinner site</li>
            <li>Drop the spinner on a colored surface and it picks up the surface's text color automatically — no per-surface override needed</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-spinner-inside-button-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The Button swaps its leading slot for a spinner when <code>[loading]="true"</code> — the spinner inherits the button's color and size</li>
            <li>Icon-only buttons replace the icon with the spinner so the button keeps its width during loading</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-spinner-loading-blocker-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>org-loading-blocker</strong> centers a spinner over the region it blocks; pass an optional <code>label</code> to render copy beside the spinner</li>
            <li>The blocked region must be <code>position: relative</code> so the absolutely-positioned blocker overlays it</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Inline alongside text"
            description="At sm or xs, the spinner sits cleanly next to label text — useful for the org-label loading state and the DataUpdaterIndicator."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap items-center justify-center gap-4">
              <span class="flex items-center gap-2">
                <org-loading-spinner size="xs" iconColor="safe" />
                <span><strong>Active</strong> · last updated 14:02</span>
              </span>
              <span class="flex items-center gap-2">
                <org-loading-spinner size="xs" />
                <span><strong>Refreshing</strong> · 3,142 rows</span>
              </span>
              <span class="flex items-center gap-2">
                <org-loading-spinner size="xs" iconColor="muted" />
                <span><strong>Email address</strong> <span class="text-fg-muted">(loading suggestions)</span></span>
              </span>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Use <code>size="xs"</code> or <code>size="sm"</code> when the spinner sits next to inline copy so its diameter aligns with the cap-height</li>
            <li>Pair with semantic colors (<code>safe</code>, <code>muted</code>) to encode meaning beyond just "loading"</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Label (Accessibility)"
            description='The spinner always has role="status" and an aria-label that defaults to "Loading" but can be overridden for specific contexts.'
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap items-center justify-center gap-6">
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" />
                <span class="text-xs text-fg-muted">Default label ("Loading")</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <org-loading-spinner size="lg" label="Saving changes" />
                <span class="text-xs text-fg-muted">Custom label ("Saving changes")</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Spinner always has <strong>role="status"</strong> so screen readers announce it as a live region</li>
            <li>The <strong>aria-label</strong> defaults to "Loading" but should be overridden to describe the specific operation in progress</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        LoadingSpinner,
        LoadingSpinnerInheritSection,
        LoadingSpinnerInsideButtonSection,
        LoadingSpinnerLoadingBlockerSection,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

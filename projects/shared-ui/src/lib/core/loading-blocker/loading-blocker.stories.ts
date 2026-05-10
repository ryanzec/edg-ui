import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Card } from '../card/card';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { allComponentColors, ComponentColor } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  LoadingBlocker,
  LoadingBlockerIntensity,
  LoadingBlockerScope,
  LoadingBlockerSpinnerSize,
  LOADING_BLOCKER_INTENSITY_DEFAULT,
  LOADING_BLOCKER_SCOPE_DEFAULT,
  LOADING_BLOCKER_SPINNER_SIZE_DEFAULT,
  allLoadingBlockerColors,
  allLoadingBlockerIntensities,
  allLoadingBlockerScopes,
  allLoadingBlockerSpinnerSizes,
} from './loading-blocker';
import { LOADING_BLOCKER_LABEL_DEFAULT } from '../../brain/loading-blocker-brain/loading-blocker-brain';

type LiveDemoColorChoice = 'none' | ComponentColor;

const allLiveDemoColorChoices = ['none', ...allComponentColors] as const satisfies readonly LiveDemoColorChoice[];

const liveDemoIntensityItems: ButtonToggleItem[] = allLoadingBlockerIntensities.map((intensity) => ({
  label: intensity,
  value: intensity,
  buttonColor: 'primary',
}));

const liveDemoScopeItems: ButtonToggleItem[] = allLoadingBlockerScopes.map((scope) => ({
  label: scope,
  value: scope,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allLiveDemoColorChoices.map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

const liveDemoSpinnerSizeItems: ButtonToggleItem[] = allLoadingBlockerSpinnerSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const meta: Meta<LoadingBlocker> = {
  title: 'Core/Components/Loading Blocker',
  component: LoadingBlocker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Loading Blocker Component

  A modal-style overlay that blocks interaction with a region while loading. Centers a real org-loading-spinner and an optional text line. Inherits the parent's border-radius so it reads as a natural extension of the blocked surface, not a foreign rectangle.

  ### Features
  - Three intensity steps for the scrim (\`light\` / \`medium\` / \`heavy\`) with backdrop blur
  - Two scopes (\`region\` over the host, \`viewport\` covering the whole window)
  - Eight semantic color tints applied to the spinner and text
  - Forwards a spinner size to the inner org-loading-spinner
  - Inherits border-radius from the parent so it never pokes square corners out of a rounded card
  - Reveal motion via \`data-visible\` toggle (no remount), with \`prefers-reduced-motion\` removing only the fade
  - Focus trapping (only while visible) via Angular CDK
  - role="status" + aria-live="polite" + aria-busy + aria-label for assistive technology

  ### Usage Examples
  \`\`\`html
  <!-- Region blocker over a card -->
  <div class="relative">
    <org-card>...</org-card>
    <org-loading-blocker [isVisible]="isLoading()" label="Loading data..." />
  </div>

  <!-- Heavy intensity over a destructive action in flight -->
  <org-loading-blocker [isVisible]="true" intensity="heavy" color="danger" label="Deleting 3 files..." />

  <!-- Viewport-scoped blocker for route transitions -->
  <org-loading-blocker [isVisible]="isRouteLoading()" scope="viewport" label="Loading workspace..." />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<LoadingBlocker & { isVisible: boolean; label: string }>;

export const Default: Story = {
  args: {
    isVisible: true,
    label: '',
    intensity: LOADING_BLOCKER_INTENSITY_DEFAULT,
    scope: LOADING_BLOCKER_SCOPE_DEFAULT,
    color: undefined,
    spinnerSize: LOADING_BLOCKER_SPINNER_SIZE_DEFAULT,
  },
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Controls visibility of the loading blocker',
    },
    label: {
      control: 'text',
      description: 'Optional label rendered beside the spinner (also drives aria-label)',
    },
    intensity: {
      control: 'select',
      options: allLoadingBlockerIntensities,
      description: 'Scrim opacity + backdrop blur strength',
    },
    scope: {
      control: 'select',
      options: allLoadingBlockerScopes,
      description: 'Region scopes to the positioned parent; viewport covers the whole window',
    },
    color: {
      control: 'select',
      options: [undefined, ...allLoadingBlockerColors],
      description: 'Optional semantic color tint applied to the spinner + text',
    },
    spinnerSize: {
      control: 'select',
      options: allLoadingBlockerSpinnerSizes,
      description: 'Size variant forwarded to the inner org-loading-spinner',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="relative h-2xs border rounded-base p-4">
        <org-loading-blocker
          [isVisible]="isVisible"
          [label]="label"
          [intensity]="intensity"
          [scope]="scope"
          [color]="color"
          [spinnerSize]="spinnerSize"
        />
        <div class="flex flex-col gap-4">
          <h3 class="text-2xl font-bold">Sample Content</h3>
          <p>This is some content that would be blocked while loading.</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [LoadingBlocker],
    },
  }),
};

@Component({
  selector: 'story-loading-blocker-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LoadingBlocker,
    Card,
    ButtonToggle,
    CheckboxToggle,
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
        position: relative;
        min-height: 14rem; /* 224px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
        padding: 1rem; /* 16px */
      }

      .panel-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem; /* 16px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to see every variant in place over a real-looking panel. The blocker sits over the same content; only its data attributes change."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Intensity">
            <org-button-toggle [items]="intensityItems" formControlName="intensity" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Scope">
            <org-button-toggle [items]="scopeItems" formControlName="scope" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Spinner Size">
            <org-button-toggle [items]="spinnerSizeItems" formControlName="spinnerSize" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Visible">
            <org-checkbox-toggle name="live-demo-visible" value="visible" formControlName="isVisible">
              {{ liveDemoForm.controls.isVisible.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show text">
            <org-checkbox-toggle name="live-demo-show-text" value="show-text" formControlName="showText">
              {{ liveDemoForm.controls.showText.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-card>
              <div class="panel">
                <div class="panel-row">
                  <strong>Quarterly report</strong>
                  <span>3 rows</span>
                </div>
                <div class="panel-row">
                  <span>EMEA — revenue +14% YoY</span>
                  <span>$24.1M</span>
                </div>
                <div class="panel-row">
                  <span>APAC — revenue +9% YoY</span>
                  <span>$18.7M</span>
                </div>
                <div class="panel-row">
                  <span>Americas — revenue +6% YoY</span>
                  <span>$31.3M</span>
                </div>
              </div>
            </org-card>
            <org-loading-blocker
              [isVisible]="liveDemoForm.controls.isVisible.value"
              [label]="liveDemoForm.controls.showText.value ? 'Loading data...' : ''"
              [intensity]="liveDemoForm.controls.intensity.value"
              scope="region"
              [color]="resolvedColor()"
              [spinnerSize]="liveDemoForm.controls.spinnerSize.value"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class LoadingBlockerLiveDemoStory {
  protected readonly intensityItems = liveDemoIntensityItems;
  protected readonly scopeItems = liveDemoScopeItems;
  protected readonly colorItems = liveDemoColorItems;
  protected readonly spinnerSizeItems = liveDemoSpinnerSizeItems;

  protected readonly liveDemoForm = new FormGroup({
    intensity: new FormControl<LoadingBlockerIntensity>(LOADING_BLOCKER_INTENSITY_DEFAULT, { nonNullable: true }),
    scope: new FormControl<LoadingBlockerScope>(LOADING_BLOCKER_SCOPE_DEFAULT, { nonNullable: true }),
    color: new FormControl<LiveDemoColorChoice>('none', { nonNullable: true }),
    spinnerSize: new FormControl<LoadingBlockerSpinnerSize>(LOADING_BLOCKER_SPINNER_SIZE_DEFAULT, {
      nonNullable: true,
    }),
    isVisible: new FormControl<boolean>(true, { nonNullable: true }),
    showText: new FormControl<boolean>(true, { nonNullable: true }),
  });

  protected resolvedColor(): ComponentColor | undefined {
    const value = this.liveDemoForm.controls.color.value;

    return value === 'none' ? undefined : value;
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle intensity, scope, color, spinner size, visibility, and label to walk every visual axis of the blocker over a representative card surface.',
      },
    },
  },
  render: () => ({
    template: `<story-loading-blocker-live-demo />`,
    moduleMetadata: {
      imports: [LoadingBlockerLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-loading-blocker-visual-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 12rem; /* 192px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
        padding: 1rem; /* 16px */
      }

      .panel-row {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Visual states"
        description="The four canonical layouts the spec calls out — hidden, visible (spinner only), visible with text, and visible with a colored tint for state-aware loading (e.g. a destructive action in flight)."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">Hidden · isVisible=false</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Quarterly report</strong><span>3 rows</span></div>
                  <div class="panel-row"><span>EMEA — revenue +14% YoY</span><span>$24.1M</span></div>
                  <div class="panel-row"><span>APAC — revenue +9% YoY</span><span>$18.7M</span></div>
                  <div class="panel-row"><span>Americas — revenue +6% YoY</span><span>$31.3M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="false" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Visible · spinner only</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Quarterly report</strong><span>3 rows</span></div>
                  <div class="panel-row"><span>EMEA — revenue +14% YoY</span><span>$24.1M</span></div>
                  <div class="panel-row"><span>APAC — revenue +9% YoY</span><span>$18.7M</span></div>
                  <div class="panel-row"><span>Americas — revenue +6% YoY</span><span>$31.3M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Visible · spinner + text</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Quarterly report</strong><span>3 rows</span></div>
                  <div class="panel-row"><span>EMEA — revenue +14% YoY</span><span>$24.1M</span></div>
                  <div class="panel-row"><span>APAC — revenue +9% YoY</span><span>$18.7M</span></div>
                  <div class="panel-row"><span>Americas — revenue +6% YoY</span><span>$31.3M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" label="Loading data..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Visible · colored (danger)</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Pending deletion</strong><span>3 files</span></div>
                  <div class="panel-row"><span>aurora-landing.tar.gz</span><span>$42.1M</span></div>
                  <div class="panel-row"><span>internal-tooling.zip</span><span>$1.2.7M</span></div>
                  <div class="panel-row"><span>quarterly-review.pdf</span><span>$32.1M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="danger" label="Deleting 3 files..." />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerVisualStatesSection {}

@Component({
  selector: 'story-loading-blocker-intensity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 8rem; /* 128px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
        padding: 1rem; /* 16px */
      }

      .panel-row {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Intensity"
        description="Three opacity steps for the scrim. light still lets the user read the underlying content — appropriate when the load is short and informational. heavy blurs and obscures it — appropriate when the result will replace the surface entirely."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">Intensity · light</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Quarterly report · light</strong></div>
                  <div class="panel-row"><span>EMEA — revenue +14% YoY</span><span>$24.1M</span></div>
                  <div class="panel-row"><span>APAC — revenue +9% YoY</span><span>$18.7M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" intensity="light" label="Loading..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Intensity · medium</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Quarterly report · medium</strong></div>
                  <div class="panel-row"><span>EMEA — revenue +14% YoY</span><span>$24.1M</span></div>
                  <div class="panel-row"><span>APAC — revenue +9% YoY</span><span>$18.7M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" intensity="medium" label="Loading..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Intensity · heavy</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-row"><strong>Quarterly report · heavy</strong></div>
                  <div class="panel-row"><span>EMEA — revenue +14% YoY</span><span>$24.1M</span></div>
                  <div class="panel-row"><span>APAC — revenue +9% YoY</span><span>$18.7M</span></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" intensity="heavy" label="Loading..." />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerIntensitySection {}

@Component({
  selector: 'story-loading-blocker-color',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 9rem; /* 144px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.375rem; /* 6px */
        padding: 1rem; /* 16px */
      }

      .placeholder {
        height: 0.5rem; /* 8px */
        background-color: var(--color-bg-surface-2);
        border-radius: var(--radius-xs);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Color"
        description='Optional semantic tint applied to the spinner + text foreground. Default is the surrounding fg; the eight semantic colors mirror the rest of the system so the same data-color reads the same here as on a Button or Indicator.'
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">Color · none</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" label="Default" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · primary</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="primary" label="primary" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · secondary</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="secondary" label="secondary" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · neutral</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="neutral" label="neutral" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · safe</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="safe" label="safe" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · info</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="info" label="info" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · caution</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="caution" label="caution" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · warning</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="warning" label="warning" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Color · danger</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" color="danger" label="danger" />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerColorSection {}

@Component({
  selector: 'story-loading-blocker-scope',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 10rem; /* 160px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
        padding: 1rem; /* 16px */
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Scope"
        description="A region-scoped blocker covers the parent (position: absolute); a viewport-scoped blocker covers the whole window (position: fixed) for app-level transitions. Both examples here use scope=region so the viewport variant doesn't take over the storybook canvas."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">Scope: region · over a card</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <strong>Settings</strong>
                  <span>General · Notifications · Billing · Members</span>
                  <span>Loaded from a workspace-scoped store.</span>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" scope="region" label="Loading settings..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Scope: viewport · route transition (simulated)</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <strong>App-level loader</strong>
                  <span>For real route transitions use scope="viewport" so the blocker covers the whole window and uses the app background as the scrim.</span>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" scope="region" intensity="heavy" label="Loading workspace..." />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerScopeSection {}

@Component({
  selector: 'story-loading-blocker-spinner-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 8rem; /* 128px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.375rem; /* 6px */
        padding: 1rem; /* 16px */
      }

      .placeholder {
        height: 0.5rem; /* 8px */
        background-color: var(--color-bg-surface-2);
        border-radius: var(--radius-xs);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Spinner size"
        description="The blocker itself doesn't define a spinner size — it forwards the input through to the inner org-loading-spinner. Default is 2xl. Use a smaller one on tightly-packed regions and a larger one for full-viewport take-overs."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">Spinner Size · lg</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" spinnerSize="lg" label="Loading..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Spinner Size · xl</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" spinnerSize="xl" label="Loading..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Spinner Size · 2xl</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="placeholder"></div>
                  <div class="placeholder"></div>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" spinnerSize="2xl" label="Loading..." />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerSpinnerSizeSection {}

@Component({
  selector: 'story-loading-blocker-in-context-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingBlocker, Card, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 11rem; /* 176px */
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
        padding: 1rem; /* 16px */
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: var(--font-weight-semibold);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="In context · Card"
        description="Drop the blocker inside a Card body to block just the body while the header chrome stays interactive. Because the blocker inherits radius from its host, the scrim hugs the body shape rather than poking square corners out of the rounded card."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">Card · body blocked, header live</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-header"><span>Live activity</span><span>x</span></div>
                  <span>Streaming events from production.</span>
                  <span>Latency p99 · 142ms.</span>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" label="Refreshing activity..." />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">Card · whole card blocked (intensity: heavy)</span>
            <div class="surface">
              <org-card>
                <div class="panel">
                  <div class="panel-header"><span>Live activity</span><span>x</span></div>
                  <span>Streaming events from production.</span>
                  <span>Latency p99 · 142ms.</span>
                </div>
              </org-card>
              <org-loading-blocker [isVisible]="true" intensity="heavy" color="info" label="Saving changes..." />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerInContextCardSection {}

@Component({
  selector: 'story-loading-blocker-in-context-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingBlocker,
    Card,
    List,
    ListItem,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem; /* 16px */
      }

      .cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }

      .cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-wide);
      }

      .surface {
        position: relative;
        min-height: 12rem; /* 192px */
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="In context · List"
        description="A blocker over a List during refresh. Light intensity preserves the read of the rows underneath so the user knows what they're waiting for."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="grid">
          <div class="cell">
            <span class="cell-label">List · light intensity</span>
            <div class="surface">
              <org-card>
                <org-list>
                  <org-list-item label="Aurora landing page" />
                  <org-list-item label="Internal tooling rewrite" />
                  <org-list-item label="Quarterly review deck" />
                  <org-list-item label="Onboarding flow v3" />
                </org-list>
              </org-card>
              <org-loading-blocker [isVisible]="true" intensity="light" />
            </div>
          </div>
          <div class="cell">
            <span class="cell-label">List · medium intensity + label</span>
            <div class="surface">
              <org-card>
                <org-list>
                  <org-list-item label="Aurora landing page" />
                  <org-list-item label="Internal tooling rewrite" />
                  <org-list-item label="Quarterly review deck" />
                  <org-list-item label="Onboarding flow v3" />
                </org-list>
              </org-card>
              <org-loading-blocker [isVisible]="true" intensity="medium" label="Reordering items..." />
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class LoadingBlockerInContextListSection {}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every loading-blocker axis — visual states, intensity, color tints, scope, spinner size, and in-context Card / List integrations — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <story-loading-blocker-visual-states />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>When <code>isVisible=false</code>, the blocker is hidden but stays mounted — flipping <code>isVisible</code> fades it in/out without a remount</li>
            <li>The label is optional — the blocker still announces "Loading" via <code>aria-label</code> when no label is provided</li>
            <li>A semantic <code>color</code> tints the spinner + text foreground so destructive in-flight actions read as destructive</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-blocker-intensity />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>light</strong>: low scrim opacity, no blur — content stays readable underneath, ideal for short informational loads</li>
            <li><strong>medium</strong> (default): balanced scrim + soft backdrop blur — content readable but de-emphasised</li>
            <li><strong>heavy</strong>: near-opaque scrim + stronger blur — content barely visible, ideal when the result will replace the surface</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-blocker-color />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Default (no color) inherits <code>--color-fg</code> so the blocker reads neutral</li>
            <li>The eight semantic colors map to the same tokens used by Button / Tag / Indicator for cross-component consistency</li>
            <li>The spinner picks up the tint via <code>currentColor</code> — no inner-icon override needed</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-blocker-scope />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>region</strong> (default): <code>position: absolute</code> inside the host, inherits <code>border-radius</code> so it hugs cards</li>
            <li><strong>viewport</strong>: <code>position: fixed; inset: 0</code>, uses <code>--color-bg-app</code> as the scrim — for route transitions / app boot</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-blocker-spinner-size />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Spinner size is forwarded as-is to the inner <code>org-loading-spinner</code></li>
            <li>Default <strong>2xl</strong> — bump down to <code>lg</code>/<code>xl</code> for tight regions, up to <code>3xl</code> for hero/viewport take-overs</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-blocker-in-context-card />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Border-radius inheritance keeps the scrim flush with the card's rounded corners</li>
            <li>Place the blocker over only the section that's actually loading — don't block chrome the user can still interact with</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-loading-blocker-in-context-list />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Light intensity over a list keeps the row content legible so users still recognise what's refreshing</li>
            <li>Add a label when the operation duration is non-trivial so the user knows the blocker is intentional, not a hang</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        LoadingBlockerVisualStatesSection,
        LoadingBlockerIntensitySection,
        LoadingBlockerColorSection,
        LoadingBlockerScopeSection,
        LoadingBlockerSpinnerSizeSection,
        LoadingBlockerInContextCardSection,
        LoadingBlockerInContextListSection,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

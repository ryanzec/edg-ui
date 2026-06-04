import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Button } from '../button/button';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Tooltip,
  allTooltipPlacementValues,
  allTooltipPhaseValues,
  allTooltipTriggerTypes,
  type TooltipPhase,
  type TooltipPlacement,
  type TooltipTriggerType,
} from './tooltip';
import {
  TooltipContent,
  allTooltipLayoutValues,
  allTooltipSizeValues,
  type TooltipLayout,
  type TooltipSize,
} from './tooltip-content';
import { Kbd } from '../kbd/kbd';
import { TooltipTitle } from './tooltip-title';
import { TooltipBody } from './tooltip-body';
import { TooltipAction } from './tooltip-action';

const liveDemoPlacementItems: ButtonToggleItem[] = allTooltipPlacementValues.map((placement) => ({
  label: placement,
  value: placement,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allTooltipSizeValues.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoLayoutItems: ButtonToggleItem[] = allTooltipLayoutValues.map((layout) => ({
  label: layout,
  value: layout,
  buttonColor: 'primary',
}));

const liveDemoTriggerItems: ButtonToggleItem[] = allTooltipTriggerTypes.map((triggerType) => ({
  label: triggerType,
  value: triggerType,
  buttonColor: 'primary',
}));

const liveDemoDelayValues = ['0', '100', '200', '500'] as const;

type LiveDemoDelay = (typeof liveDemoDelayValues)[number];

const liveDemoDelayItems: ButtonToggleItem[] = liveDemoDelayValues.map((delay) => ({
  label: `${delay}ms`,
  value: delay,
  buttonColor: 'primary',
}));

const meta: Meta<Tooltip> = {
  title: 'Core/Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Tooltip Component

  A transient label attached to a trigger. Surface-only chrome (label / rich layouts × sm / base sizes × 12 placements with arrows × motion-keyed lifecycle states) wrapped by a brain-driven CDK Overlay positioning system that handles hover / click / focus, delays, keep-open-on-hover, click-outside and Escape dismissal, and auto-flip.

  ### Composition Parts
  - **org-tooltip** — wrapper component. Wraps the trigger via default content projection. Owns trigger interaction, overlay lifecycle, position, and a11y. Receives the surface template via a named &lt;ng-template tooltipContent&gt; child.
  - **org-tooltip-content** — the visible surface. Drives layout, size, placement (arrow direction), state, and arrow visibility via data-attributes.
  - **org-kbd** — inline keyboard-shortcut pill rendered after a label tooltip's text (promoted out of the tooltip folder for cross-component reuse).
  - **org-tooltip-title** / **org-tooltip-body** / **org-tooltip-action** — rich-layout slot components.

  ### Layouts
  - **label** (default) — one-line text, optionally with a post &lt;org-kbd&gt;. For icon-only buttons, truncated names, and brief affordances.
  - **rich** — title + body + optional action link. For click-mode tooltips that hold a small amount of contextual help.

  ### Placements
  Twelve placements (4 sides × 3 alignments): top / top-start / top-end, bottom / bottom-start / bottom-end, left / left-start / left-end, right / right-start / right-end. The arrow direction tracks the resolved placement (after auto-flip).

  ### Trigger Types
  - **hover** — opens on mouseenter / focusin, closes on mouseleave / focusout (with delays).
  - **click** — toggles on click; dismisses on click-outside or Escape.

  ### Usage Examples
  \`\`\`html
  <!-- Label tooltip on hover -->
  <org-tooltip placement="top">
    <org-button label="Save" />
    <ng-template #tooltipContent>
      <org-tooltip-content>Save changes</org-tooltip-content>
    </ng-template>
  </org-tooltip>

  <!-- Label tooltip with keyboard shortcut hint -->
  <org-tooltip placement="bottom">
    <org-button label="Search" />
    <ng-template #tooltipContent>
      <org-tooltip-content>
        Search
        <org-kbd>&#8984;K</org-kbd>
      </org-tooltip-content>
    </ng-template>
  </org-tooltip>

  <!-- Rich tooltip on click -->
  <org-tooltip placement="right" triggerType="click">
    <org-button label="2FA" />
    <ng-template #tooltipContent>
      <org-tooltip-content layout="rich">
        <org-tooltip-title>Two-factor auth</org-tooltip-title>
        <org-tooltip-body>Adds a second verification step every time you sign in.</org-tooltip-body>
        <org-tooltip-action href="#">Learn more</org-tooltip-action>
      </org-tooltip-content>
    </ng-template>
  </org-tooltip>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Tooltip>;

export const Default: Story = {
  args: {
    triggerType: 'hover',
    openDelay: 200,
    closeDelay: 0,
    keepOpenOnHover: false,
    placement: 'top',
    disabled: false,
  },
  argTypes: {
    triggerType: {
      control: 'select',
      options: allTooltipTriggerTypes,
      description: 'How the tooltip is triggered',
    },
    openDelay: {
      control: 'number',
      description: 'Delay in milliseconds before showing the tooltip',
    },
    closeDelay: {
      control: 'number',
      description: 'Delay in milliseconds before hiding the tooltip',
    },
    keepOpenOnHover: {
      control: 'boolean',
      description: 'Whether to keep the tooltip open when hovering over its overlay (rich-layout interactions)',
    },
    placement: {
      control: 'select',
      options: allTooltipPlacementValues,
      description: 'Placement of the tooltip relative to the trigger (one of 12 = 4 sides × 3 alignments)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled; when true the tooltip never opens',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default tooltip with hover trigger. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div class="flex items-center justify-center h-5xs">
        <org-tooltip
          [triggerType]="triggerType"
          [openDelay]="openDelay"
          [closeDelay]="closeDelay"
          [keepOpenOnHover]="keepOpenOnHover"
          [placement]="placement"
          [disabled]="disabled"
        >
          <org-button color="primary" label="Hover or click me" />
          <ng-template #tooltipContent>
            <org-tooltip-content>This is a tooltip</org-tooltip-content>
          </ng-template>
        </org-tooltip>
      </div>
    `,
    moduleMetadata: {
      imports: [Tooltip, TooltipContent, Button],
    },
  }),
};

@Component({
  selector: 'story-tooltip-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    TooltipContent,
    Kbd,
    TooltipTitle,
    TooltipBody,
    TooltipAction,
    Button,
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
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 12rem; /* 192px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="All tooltips below are real and interactive — hover, focus, click, or tab through them to see every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Placement">
            <org-button-toggle [items]="placementItems" formControlName="placement" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Layout">
            <org-button-toggle [items]="layoutItems" formControlName="layout" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Trigger">
            <org-button-toggle [items]="triggerItems" formControlName="triggerType" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Open delay">
            <org-button-toggle [items]="delayItems" formControlName="openDelay" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Close delay">
            <org-button-toggle [items]="delayItems" formControlName="closeDelay" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Keep open on hover">
            <org-checkbox-toggle name="live-demo-keep-open" value="keepOpenOnHover" formControlName="keepOpenOnHover">
              {{ liveDemoForm.controls.keepOpenOnHover.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Arrow">
            <org-checkbox-toggle name="live-demo-arrow" value="arrow" formControlName="arrow">
              {{ liveDemoForm.controls.arrow.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Show kbd hint (label only)">
            <org-checkbox-toggle name="live-demo-show-kbd" value="showKbd" formControlName="showKbd">
              {{ liveDemoForm.controls.showKbd.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-tooltip
              [placement]="liveDemoForm.controls.placement.value"
              [triggerType]="liveDemoForm.controls.triggerType.value"
              [openDelay]="toMs(liveDemoForm.controls.openDelay.value)"
              [closeDelay]="toMs(liveDemoForm.controls.closeDelay.value)"
              [keepOpenOnHover]="liveDemoForm.controls.keepOpenOnHover.value"
              [disabled]="liveDemoForm.controls.disabled.value"
            >
              <org-button color="primary" label="Hover or focus me" />
              <ng-template #tooltipContent>
                @switch (liveDemoForm.controls.layout.value) {
                  @case ('label') {
                    <org-tooltip-content
                      [size]="liveDemoForm.controls.size.value"
                      [arrow]="liveDemoForm.controls.arrow.value"
                    >
                      Save changes
                      @if (liveDemoForm.controls.showKbd.value) {
                        <org-kbd>&#8984;S</org-kbd>
                      }
                    </org-tooltip-content>
                  }
                  @case ('rich') {
                    <org-tooltip-content
                      layout="rich"
                      [size]="liveDemoForm.controls.size.value"
                      [arrow]="liveDemoForm.controls.arrow.value"
                    >
                      <org-tooltip-title>Token rotation</org-tooltip-title>
                      <org-tooltip-body>
                        Rotates the API key for this workspace. Existing sessions stay valid.
                      </org-tooltip-body>
                      <org-tooltip-action href="#">Learn more</org-tooltip-action>
                    </org-tooltip-content>
                  }
                }
              </ng-template>
            </org-tooltip>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TooltipLiveDemoStory {
  protected readonly placementItems = liveDemoPlacementItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly layoutItems = liveDemoLayoutItems;
  protected readonly triggerItems = liveDemoTriggerItems;
  protected readonly delayItems = liveDemoDelayItems;

  protected readonly liveDemoForm = new FormGroup({
    placement: new FormControl<TooltipPlacement>('top', { nonNullable: true }),
    size: new FormControl<TooltipSize>('base', { nonNullable: true }),
    layout: new FormControl<TooltipLayout>('label', { nonNullable: true }),
    triggerType: new FormControl<TooltipTriggerType>('hover', { nonNullable: true }),
    openDelay: new FormControl<LiveDemoDelay>('200', { nonNullable: true }),
    closeDelay: new FormControl<LiveDemoDelay>('0', { nonNullable: true }),
    keepOpenOnHover: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    arrow: new FormControl<boolean>(true, { nonNullable: true }),
    showKbd: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected toMs(value: LiveDemoDelay): number {
    return Number(value);
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Walk every input — placement, size, layout, trigger, open/close delays, keep-open-on-hover, disabled, arrow, kbd hint — and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-tooltip-live-demo />`,
    moduleMetadata: {
      imports: [TooltipLiveDemoStory],
    },
  }),
};

const showcaseStatePhases: readonly TooltipPhase[] = allTooltipPhaseValues;

@Component({
  selector: 'story-tooltip-states-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipContent, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }
      .states-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--spacing-3);
      }
      .state-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-2);
        min-height: 5rem; /* 80px */
        padding: var(--spacing-3);
        border: var(--border-width) dashed var(--color-border);
        border-radius: var(--radius-base);
      }
      .state-cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        font-family: var(--font-mono);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="States"
        description="Snapshots of data-state values. opening and closing are the in-between frames the brain toggles before open / closed so the tooltip always animates from the trigger."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="states-grid">
          @for (phase of phases; track phase) {
            <div class="state-cell">
              <org-tooltip-content [phase]="phase" [arrow]="false">Visible</org-tooltip-content>
              <span class="state-cell-label">{{ phase }}</span>
            </div>
          }
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class TooltipStatesPreviewSection {
  protected readonly phases = showcaseStatePhases;
}

@Component({
  selector: 'story-tooltip-placement-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipContent, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }
      .placement-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--spacing-4);
      }
      .placement-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        border: var(--border-width) dashed var(--color-border);
        border-radius: var(--radius-base);
      }
      .placement-cell-label {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
        font-family: var(--font-mono);
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Placement"
        description="Twelve placements — four sides × three alignments. The arrow and motion axis follow the placement automatically."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="placement-grid">
          @for (placement of placements; track placement) {
            <div class="placement-cell">
              <org-tooltip-content [placement]="placement">{{ placement }}</org-tooltip-content>
              <span class="placement-cell-label">{{ placement }}</span>
            </div>
          }
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class TooltipPlacementGridSection {
  protected readonly placements = allTooltipPlacementValues;
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every tooltip variant axis — common production patterns, sizes (with optional kbd), all 12 placements, auto-flip, and lifecycle state previews — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Auto-flip"
            description="When a tooltip would overflow the viewport on its preferred side, it flips to the opposite side. Hover the trigger near each container edge to see the flip behaviour."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex justify-between items-start gap-4">
              <org-tooltip placement="left">
                <org-button color="primary" label="Near left edge" />
                <ng-template #tooltipContent>
                  <org-tooltip-content>This tooltip prefers left but flips to right when there's no room</org-tooltip-content>
                </ng-template>
              </org-tooltip>
              <org-tooltip placement="right">
                <org-button color="primary" label="Near right edge" />
                <ng-template #tooltipContent>
                  <org-tooltip-content>This tooltip prefers right but flips to left when there's no room</org-tooltip-content>
                </ng-template>
              </org-tooltip>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Primary placement</strong>: requested via the placement input</li>
            <li><strong>Fallback chain</strong>: opposite side, then center — guarantees the tooltip always renders on screen</li>
            <li><strong>data-placement</strong>: brain writes the resolved value back so the arrow tracks the actually-rendered side</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Common patterns"
            description="The two most common production uses: labelling an icon-only button, explaining a disabled control via an enabled wrapper, abbreviating truncated text, and a wide rich tooltip."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 flex-wrap">
              <org-tooltip placement="top">
                <org-button color="primary" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" label="Settings" />
                <ng-template #tooltipContent>
                  <org-tooltip-content size="sm">Settings</org-tooltip-content>
                </ng-template>
              </org-tooltip>
              <span class="inline-flex">
                <org-tooltip placement="top">
                  <span class="inline-flex">
                    <org-button color="primary" label="Publish" [disabled]="true" />
                  </span>
                  <ng-template #tooltipContent>
                    <org-tooltip-content>Resolve all review comments to publish</org-tooltip-content>
                  </ng-template>
                </org-tooltip>
              </span>
              <org-tooltip placement="top">
                <span class="inline-block max-w-3xs overflow-hidden text-ellipsis whitespace-nowrap font-mono">
                  invoice-2026-q1-acme-corp-final-revised.pdf
                </span>
                <ng-template #tooltipContent>
                  <org-tooltip-content>invoice-2026-q1-acme-corp-final-revised.pdf</org-tooltip-content>
                </ng-template>
              </org-tooltip>
              <org-tooltip placement="right" triggerType="click" [keepOpenOnHover]="true">
                <org-button color="primary" label="Token rotation" />
                <ng-template #tooltipContent>
                  <org-tooltip-content layout="rich">
                    <org-tooltip-title>Token rotation</org-tooltip-title>
                    <org-tooltip-body>
                      Rotates the API key for this workspace. Existing sessions stay valid.
                    </org-tooltip-body>
                    <org-tooltip-action href="#">Learn more</org-tooltip-action>
                  </org-tooltip-content>
                </ng-template>
              </org-tooltip>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Icon-only button</strong>: Always pair with a tooltip that mirrors the ariaLabel — the visual label and the screen-reader name should agree</li>
            <li><strong>Disabled control</strong>: Wrap the disabled element in an enabled span so hover events still fire and the tooltip can explain why</li>
            <li><strong>Truncated text</strong>: Pair text-overflow ellipsis with a tooltip that contains the full content</li>
            <li><strong>Rich layout</strong>: Use click triggers and keep-open-on-hover when content includes an action link</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-tooltip-placement-grid />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Side</strong>: top / bottom / left / right control which side of the trigger the tooltip lands on</li>
            <li><strong>Alignment</strong>: -start anchors to the trigger's pre edge, -end to the post edge, no suffix centers</li>
            <li><strong>Arrow</strong>: tracks the resolved placement; if auto-flip changes the side, the arrow re-orients to keep pointing at the trigger</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Scroll tracking"
            description="Tests overlay reposition during page scroll — the tooltip should stay anchored to the right-center of the trigger as you scroll the page."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-tooltip placement="right">
              <div class="h-lg w-fit border border-dashed border-soft rounded-base p-4 flex items-center justify-center font-mono">
                Scroll me — 512px tall
              </div>
              <ng-template #tooltipContent>
                <org-tooltip-content>Right-center tooltip — watch me as you scroll</org-tooltip-content>
              </ng-template>
            </org-tooltip>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Anchor</strong>: overlay stays pinned to the right-center of the trigger as the page scrolls</li>
            <li><strong>Reposition strategy</strong>: CDK's reposition fires on scroll / viewport changes so the tooltip never visually detaches from the trigger</li>
            <li><strong>Auto-flip</strong>: still takes over if the trigger approaches the right viewport edge — flips to left</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sizes"
            description="Two sizes — sm for icon-button labels (tight rhythm, 12px type) and base for general use (13px type, slightly more breathing room)."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 flex-wrap items-center">
              <org-tooltip placement="top">
                <org-button color="primary" label="Save" />
                <ng-template #tooltipContent>
                  <org-tooltip-content size="sm">Save</org-tooltip-content>
                </ng-template>
              </org-tooltip>
              <org-tooltip placement="top">
                <org-button color="primary" label="Save changes" />
                <ng-template #tooltipContent>
                  <org-tooltip-content>Save changes</org-tooltip-content>
                </ng-template>
              </org-tooltip>
              <org-tooltip placement="top">
                <org-button color="primary" label="Search (sm + kbd)" />
                <ng-template #tooltipContent>
                  <org-tooltip-content size="sm">
                    Search
                    <org-kbd>&#8984;K</org-kbd>
                  </org-tooltip-content>
                </ng-template>
              </org-tooltip>
              <org-tooltip placement="top">
                <org-button color="primary" label="Open command palette (base + kbd)" />
                <ng-template #tooltipContent>
                  <org-tooltip-content>
                    Open command palette
                    <org-kbd>&#8984;K</org-kbd>
                  </org-tooltip-content>
                </ng-template>
              </org-tooltip>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: 12px text, tighter padding — fits iconbar tooltips and inline labels</li>
            <li><strong>base</strong>: 13px text, default padding (default)</li>
            <li><strong>kbd hint</strong>: Inline org-kbd reads as a quiet inset pill; never bright fill</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-tooltip-states-preview />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>closed</strong>: opacity 0, pointer-events none — fully hidden, no transitions running</li>
            <li><strong>opening</strong>: opacity 0, slide-in transform — the entry frame the brain toggles before open</li>
            <li><strong>open</strong>: opacity 1, transform reset — the visible state</li>
            <li><strong>closing</strong>: opacity 0, slide-out transform — the exit frame before the brain detaches the portal</li>
            <li><strong>Reduced motion</strong>: keeps the fade, drops the slide</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Tooltip,
        TooltipContent,
        Kbd,
        TooltipTitle,
        TooltipBody,
        TooltipAction,
        Button,
        TooltipPlacementGridSection,
        TooltipStatesPreviewSection,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

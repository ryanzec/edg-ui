import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Meta, StoryObj } from '@storybook/angular';
import { allComponentColors } from '../types/component-types';
import { Avatar } from '../avatar/avatar';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { Icon } from '../icon/icon';
import { IconName, allIconNames } from '../../brain/icon-brain/icon-brain';
import { Tag } from '../tag/tag';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Timeline } from './timeline';
import {
  TimelineItem,
  TIMELINE_ITEM_COLOR_DEFAULT,
  TIMELINE_ITEM_COLOR_MODE_DEFAULT,
  TimelineItemColor,
  TimelineItemColorMode,
  allTimelineItemColorModes,
} from './timeline-item';
import { TimelineTime } from './timeline-time';
import { TimelineHeader } from './timeline-header';
import { TimelineContent } from './timeline-content';

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoColorModeItems: ButtonToggleItem[] = allTimelineItemColorModes.map((mode) => ({
  label: mode,
  value: mode,
  buttonColor: 'primary',
}));

const allLiveDemoIconChoices = ['none', 'check', 'circle-check', 'triangle-alert', 'info', 'clock'] as const;

type LiveDemoIconChoice = (typeof allLiveDemoIconChoices)[number];

const liveDemoIconItems: ButtonToggleItem[] = allLiveDemoIconChoices.map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-timeline-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Timeline,
    TimelineItem,
    TimelineTime,
    TimelineHeader,
    TimelineContent,
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
        align-items: stretch;
        justify-content: center;
        min-height: 6rem; /* 96px */
      }
      .canvas-stage > org-timeline {
        width: 100%;
        max-width: 24rem; /* 384px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="All timeline items below are real and interactive — drive the color and dot icon to see how the dot, the connector below it, and the icon-on color all swap together."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color mode">
            <org-button-toggle [items]="colorModeItems" formControlName="colorMode" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Dot icon">
            <org-button-toggle [items]="iconItems" formControlName="icon" buttonSize="sm" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-timeline>
              <org-timeline-item
                [color]="liveDemoForm.controls.color.value"
                [colorMode]="liveDemoForm.controls.colorMode.value"
                [dotIcon]="dotIcon()"
              >
                <org-timeline-time>10:00 AM</org-timeline-time>
                <org-timeline-header>Order Placed</org-timeline-header>
                <org-timeline-content>Your order has been received.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item
                [color]="liveDemoForm.controls.color.value"
                [colorMode]="liveDemoForm.controls.colorMode.value"
                [dotIcon]="dotIcon()"
              >
                <org-timeline-time>11:30 AM</org-timeline-time>
                <org-timeline-header>Processing</org-timeline-header>
                <org-timeline-content>Your order is being prepared.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item
                [color]="liveDemoForm.controls.color.value"
                [colorMode]="liveDemoForm.controls.colorMode.value"
                [dotIcon]="dotIcon()"
              >
                <org-timeline-time>2:00 PM</org-timeline-time>
                <org-timeline-header>Shipped</org-timeline-header>
                <org-timeline-content>Your order is on its way.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TimelineLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly colorModeItems = liveDemoColorModeItems;
  protected readonly iconItems = liveDemoIconItems;

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<TimelineItemColor>('neutral', { nonNullable: true }),
    colorMode: new FormControl<TimelineItemColorMode>(TIMELINE_ITEM_COLOR_MODE_DEFAULT, { nonNullable: true }),
    icon: new FormControl<LiveDemoIconChoice>('none', { nonNullable: true }),
  });

  private readonly _formValue = toSignal(this.liveDemoForm.valueChanges, { initialValue: this.liveDemoForm.value });

  protected readonly dotIcon = computed<IconName | undefined>(() => {
    const choice = this._formValue()?.icon;

    if (!choice || choice === 'none') {
      return undefined;
    }

    return choice;
  });
}

const meta: Meta<TimelineItem> = {
  title: 'Core/Components/Timeline',
  component: TimelineItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Timeline Component

  A vertical timeline component for displaying a sequence of events. Each item carries a \`color\` (one of the shared semantic ramp) which drives BOTH the dot fill AND the connector segment running BELOW it down to the next item — so the line between two items reads as the color of the one ABOVE it ("the status of what just happened").

  ### Components
  - **Timeline**: The outer container that holds all timeline items
  - **TimelineItem**: Each individual event row; accepts a \`color\` input (drives dot + connector below), a \`colorMode\` input (\`line\` default, \`content\`, or \`both\`) that picks which surfaces the color paints, and an optional \`dotIcon\` input (renders an icon inside the dot, growing the dot to host it)
  - **TimelineTime**: Displays an uppercase eyebrow time label
  - **TimelineHeader**: Displays the event heading (the heading level is controlled via the brain directive)
  - **TimelineContent**: Displays the main body content for the event

  ### Color Modes
  - **line** (default): the dot and connector use the color; projected text has no explicit color and inherits from the surrounding context
  - **content**: projected text picks up the color; the dot and connector are forced to neutral regardless of the color input
  - **both**: both the marker and the projected text pick up the color

  ### Color Options
  - **neutral**: Default — neutral / quiet
  - **primary**: Primary brand color
  - **secondary**: Secondary accent color
  - **safe**: Success / positive (green)
  - **info**: Informational (blue)
  - **caution**: Caution (yellow)
  - **warning**: Warning (orange)
  - **danger**: Error / destructive (red)

  ### Usage Example
  \`\`\`html
  <org-timeline>
    <org-timeline-item color="safe" dotIcon="check">
      <org-timeline-time>10:00 AM</org-timeline-time>
      <org-timeline-header>Order Placed</org-timeline-header>
      <org-timeline-content>Your order has been received.</org-timeline-content>
    </org-timeline-item>
    <org-timeline-item color="info">
      <org-timeline-time>11:30 AM</org-timeline-time>
      <org-timeline-header>Processing</org-timeline-header>
      <org-timeline-content>Your order is being prepared.</org-timeline-content>
    </org-timeline-item>
  </org-timeline>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TimelineItem>;

export const Default: Story = {
  args: {
    color: TIMELINE_ITEM_COLOR_DEFAULT,
    colorMode: TIMELINE_ITEM_COLOR_MODE_DEFAULT,
    dotIcon: undefined,
  },
  argTypes: {
    color: {
      control: 'select',
      options: allComponentColors,
      description: 'the semantic color applied to the dot and the connector below it',
    },
    colorMode: {
      control: 'select',
      options: allTimelineItemColorModes,
      description:
        'which surfaces the color paints: `line` (dot/connector only), `content` (text only, marker forced neutral), or `both`',
    },
    dotIcon: {
      control: 'select',
      options: [undefined, ...allIconNames],
      description: 'when set, renders the named icon inside the dot and grows the dot to host it',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'default timeline with a single color applied to all items. use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-timeline>
        <org-timeline-item [color]="color" [colorMode]="colorMode" [dotIcon]="dotIcon">
          <org-timeline-time>10:00 AM</org-timeline-time>
          <org-timeline-header>Order Placed</org-timeline-header>
          <org-timeline-content>Your order has been received and is being processed.</org-timeline-content>
        </org-timeline-item>
        <org-timeline-item [color]="color" [colorMode]="colorMode" [dotIcon]="dotIcon">
          <org-timeline-time>11:30 AM</org-timeline-time>
          <org-timeline-header>Processing</org-timeline-header>
          <org-timeline-content>Your order is being prepared for shipment.</org-timeline-content>
        </org-timeline-item>
        <org-timeline-item [color]="color" [colorMode]="colorMode" [dotIcon]="dotIcon">
          <org-timeline-time>2:00 PM</org-timeline-time>
          <org-timeline-header>Shipped</org-timeline-header>
          <org-timeline-content>Your order has been shipped and is on its way.</org-timeline-content>
        </org-timeline-item>
      </org-timeline>
    `,
    moduleMetadata: {
      imports: [Timeline, TimelineItem, TimelineTime, TimelineHeader, TimelineContent],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the timeline item (color, dot icon) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-timeline-live-demo />`,
    moduleMetadata: {
      imports: [TimelineLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every timeline variant axis — color, mixed colors, dot icon variants — and the canonical recipes (activity feed, change history, shipment tracking, release notes, project milestones).',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="neutral">
                <org-timeline-time>data-color="neutral"</org-timeline-time>
                <org-timeline-header>Neutral</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="info">
                <org-timeline-time>data-color="info"</org-timeline-time>
                <org-timeline-header>Info</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="safe">
                <org-timeline-time>data-color="safe"</org-timeline-time>
                <org-timeline-header>Safe</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="caution">
                <org-timeline-time>data-color="caution"</org-timeline-time>
                <org-timeline-header>Caution</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="warning">
                <org-timeline-time>data-color="warning"</org-timeline-time>
                <org-timeline-header>Warning</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="danger">
                <org-timeline-time>data-color="danger"</org-timeline-time>
                <org-timeline-header>Danger</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="primary">
                <org-timeline-time>data-color="primary"</org-timeline-time>
                <org-timeline-header>Primary</org-timeline-header>
              </org-timeline-item>
              <org-timeline-item color="secondary">
                <org-timeline-time>data-color="secondary"</org-timeline-time>
                <org-timeline-header>Secondary</org-timeline-header>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Mixed Colors" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="safe">
                <org-timeline-time>9:00 AM</org-timeline-time>
                <org-timeline-header>Completed</org-timeline-header>
                <org-timeline-content>This step has been completed successfully.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="info">
                <org-timeline-time>10:30 AM</org-timeline-time>
                <org-timeline-header>In Progress</org-timeline-header>
                <org-timeline-content>This step is currently being processed.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="caution">
                <org-timeline-time>12:00 PM</org-timeline-time>
                <org-timeline-header>Pending Review</org-timeline-header>
                <org-timeline-content>This step is awaiting approval before continuing.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="danger">
                <org-timeline-time>2:00 PM</org-timeline-time>
                <org-timeline-header>Failed</org-timeline-header>
                <org-timeline-content>This step encountered an error and requires attention.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>4:00 PM</org-timeline-time>
                <org-timeline-header>Scheduled</org-timeline-header>
                <org-timeline-content>This step is scheduled to run later.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Dot Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="safe">
                <org-timeline-header>Plain dot — default</org-timeline-header>
                <org-timeline-content>No icon. Reads as a clean colored pip.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe" dotIcon="check">
                <org-timeline-header>With icon — check (delivered)</org-timeline-header>
                <org-timeline-content>Dot grows to host the glyph; rail stays centered.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="warning" dotIcon="triangle-alert">
                <org-timeline-header>With icon — alert (delayed)</org-timeline-header>
                <org-timeline-content>Glyph reads in the matching -on color of the row's ramp.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="info" dotIcon="info">
                <org-timeline-header>With icon — info (released)</org-timeline-header>
                <org-timeline-content>Mix and match — the dot variant is per-item, not per-list.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Modes" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="safe" colorMode="line" dotIcon="check">
                <org-timeline-time>colorMode="line" (default)</org-timeline-time>
                <org-timeline-header>Dot and connector carry the color</org-timeline-header>
                <org-timeline-content>Text has no explicit color — it inherits from the surrounding context.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe" colorMode="content" dotIcon="check">
                <org-timeline-time>colorMode="content"</org-timeline-time>
                <org-timeline-header>Content text carries the color</org-timeline-header>
                <org-timeline-content>The dot and connector stay neutral regardless of the color input.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe" colorMode="both" dotIcon="check">
                <org-timeline-time>colorMode="both"</org-timeline-time>
                <org-timeline-header>Marker and content both carry the color</org-timeline-header>
                <org-timeline-content>The colored body inherits via the host while the dot and connector also pick up the ramp.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="danger" colorMode="line">
                <org-timeline-time>colorMode="line" · danger</org-timeline-time>
                <org-timeline-header>Same axes, different ramp</org-timeline-header>
                <org-timeline-content>Use line when the body should read as normal text.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="danger" colorMode="content">
                <org-timeline-time>colorMode="content" · danger</org-timeline-time>
                <org-timeline-header>Body reads in the danger ramp</org-timeline-header>
                <org-timeline-content>The marker is forced neutral so the body color does the talking.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="danger" colorMode="both">
                <org-timeline-time>colorMode="both" · danger</org-timeline-time>
                <org-timeline-header>Full-bleed emphasis</org-timeline-header>
                <org-timeline-content>Reach for both when the row should feel saturated in the ramp top-to-bottom.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Recipe · Activity feed" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="info">
                <org-timeline-time>JUST NOW</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-avatar label="Maya Khan" size="sm" />
                    <span>Maya Khan is reviewing #4827</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>Pulled the branch, running the test suite locally.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe">
                <org-timeline-time>12 MIN AGO</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-avatar label="Jordan Reyes" size="sm" />
                    <span>Jordan Reyes merged</span>
                    <org-tag color="neutral" size="xs">#4825 · webhook retries</org-tag>
                  </span>
                </org-timeline-header>
                <org-timeline-content>5 commits, 142 lines changed across 8 files. CI green.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>38 MIN AGO</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-avatar label="Ava Singh" size="sm" />
                    <span>Ava Singh commented on</span>
                    <org-tag color="neutral" size="xs">#4827 · idempotency keys</org-tag>
                  </span>
                </org-timeline-header>
                <org-timeline-content>"Looks great — one nit on naming, otherwise ship it."</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="warning">
                <org-timeline-time>1 H AGO</org-timeline-time>
                <org-timeline-header>Alert — p99 latency exceeded threshold</org-timeline-header>
                <org-timeline-content>stripe-webhook · 1.2s → 2.4s over 5 min. Auto-acknowledged after recovery.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>TODAY, 9:02 AM</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-avatar label="Devon Tran" size="sm" />
                    <span>Devon Tran opened</span>
                    <org-tag color="neutral" size="xs">#4827 · idempotency keys</org-tag>
                  </span>
                </org-timeline-header>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Recipe · Change history" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="info">
                <org-timeline-time>OCT 3 · 4:48 PM</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-avatar label="Priya Lal" size="sm" />
                    <span>Priya Lal edited line items</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>
                  <pre class="text-xs">amount    <span class="text-danger line-through">$2,400</span> → <span class="text-safe">$2,640</span>
tax_rate  <span class="text-danger line-through">0.08</span> → <span class="text-safe">0.0875</span></pre>
                </org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>OCT 2 · 11:14 AM</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-avatar label="Sam Chen" size="sm" />
                    <span>Sam Chen set due date</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>
                  <pre class="text-xs">due_at  — → Oct 30, 2025
terms   — → net-30</pre>
                </org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>OCT 2 · 9:02 AM</org-timeline-time>
                <org-timeline-header>Created from template "Standard MSA"</org-timeline-header>
                <org-timeline-content>3 line items, total $2,400. Status set to <org-tag color="neutral" size="xs">draft</org-tag>.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Recipe · Shipment tracking" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="safe" dotIcon="check">
                <org-timeline-time>MON, OCT 7 · 9:14 AM</org-timeline-time>
                <org-timeline-header>Order placed</org-timeline-header>
                <org-timeline-content>Confirmation sent to priya@example.com.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe" dotIcon="package">
                <org-timeline-time>MON, OCT 7 · 4:02 PM</org-timeline-time>
                <org-timeline-header>Packed at warehouse</org-timeline-header>
                <org-timeline-content>Hawthorne, CA · pkg 2.1 lbs · 12 × 9 × 4 in</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe" dotIcon="send">
                <org-timeline-time>TUE, OCT 8 · 7:30 AM</org-timeline-time>
                <org-timeline-header>Shipped — UPS Ground</org-timeline-header>
                <org-timeline-content>Tracking 1Z 999 AA1 0123 4567 84</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="info" dotIcon="arrow-right">
                <org-timeline-time>TODAY · 6:48 AM</org-timeline-time>
                <org-timeline-header>Out for delivery</org-timeline-header>
                <org-timeline-content>San Francisco, CA — driver 14 stops away.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral" dotIcon="house">
                <org-timeline-time>EST. TODAY · BY 8:00 PM</org-timeline-time>
                <org-timeline-header>Delivery to 2412 Mission St</org-timeline-header>
                <org-timeline-content>Signature not required.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Recipe · Release notes" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="primary">
                <org-timeline-time>TODAY</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-tag color="neutral" size="xs">v2.6.0</org-tag>
                    <span>Streaming responses</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>client.complete() now accepts &#123; stream: true &#125; and yields tokens via async iterator. Adds the onDelta callback for non-iterator consumers.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>SEP 24</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-tag color="neutral" size="xs">v2.5.4</org-tag>
                    <span>Patch</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>Fixes a retry-loop on 504 when Retry-After is absent. Tightens TS types around ToolCall.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="warning">
                <org-timeline-time>SEP 12</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-tag color="neutral" size="xs">v2.5.0</org-tag>
                    <span>Breaking — auth header</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>Authorization: Token … → Authorization: Bearer …. The legacy form is rejected with 401. Migration: bump the SDK and rotate keys via the dashboard.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>AUG 30</org-timeline-time>
                <org-timeline-header>
                  <span class="inline-flex gap-2 items-center">
                    <org-tag color="neutral" size="xs">v2.4.0</org-tag>
                    <span>Webhook signing</span>
                  </span>
                </org-timeline-header>
                <org-timeline-content>Adds verifySignature(payload, header). Header format: t=…,v1=…</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Recipe · Project milestones" />
          <org-design-system-demo-canvas slot="canvas">
            <org-timeline>
              <org-timeline-item color="safe">
                <org-timeline-time>SEP 30 — SHIPPED</org-timeline-time>
                <org-timeline-header>M1 · API v2 GA</org-timeline-header>
                <org-timeline-content>Public docs published, legacy v1 deprecated, status badge live on the dashboard.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="safe">
                <org-timeline-time>OCT 14 — SHIPPED</org-timeline-time>
                <org-timeline-header>M2 · Multi-region failover</org-timeline-header>
                <org-timeline-content>us-west-2 + eu-central-1 active/active. RPO &lt; 30s validated in game-day.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="info">
                <org-timeline-time>OCT 28 — IN FLIGHT</org-timeline-time>
                <org-timeline-header>M3 · Workspace permissions</org-timeline-header>
                <org-timeline-content>Roles + scopes + audit log. PR-7 in review; rollout behind perms-v2 flag.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>NOV 18 — PLANNED</org-timeline-time>
                <org-timeline-header>M4 · Self-serve billing</org-timeline-header>
                <org-timeline-content>Stripe Tax + usage-based metering. Spec under review; no engineering started.</org-timeline-content>
              </org-timeline-item>
              <org-timeline-item color="neutral">
                <org-timeline-time>DEC 9 — PLANNED</org-timeline-time>
                <org-timeline-header>M5 · SSO &amp; SCIM</org-timeline-header>
                <org-timeline-content>Okta + Google Workspace via SAML; SCIM v2 for user provisioning.</org-timeline-content>
              </org-timeline-item>
            </org-timeline>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Timeline,
        TimelineItem,
        TimelineTime,
        TimelineHeader,
        TimelineContent,
        Avatar,
        Tag,
        Icon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
      ],
    },
  }),
};

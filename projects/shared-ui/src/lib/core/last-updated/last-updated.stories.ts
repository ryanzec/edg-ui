import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { allLastUpdatedStates, type LastUpdatedState } from '../last-updated/last-updated-brain';
import { LastUpdated } from './last-updated';

const liveDemoStateItems: ButtonToggleItem[] = allLastUpdatedStates.map((state) => ({
  label: state,
  value: state,
  buttonColor: 'primary',
}));

const liveDemoFormatItems: ButtonToggleItem[] = [
  { label: 'absolute', value: 'absolute', buttonColor: 'primary' },
  { label: 'relative', value: 'relative', buttonColor: 'primary' },
  { label: 'date only', value: 'yyyy-MM-dd', buttonColor: 'primary' },
  { label: 'time only', value: 'HH:mm', buttonColor: 'primary' },
  { label: 'datetime', value: 'MMM d, HH:mm', buttonColor: 'primary' },
];

@Component({
  selector: 'story-last-updated-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LastUpdated,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
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
        min-height: 6rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="The last-updated row below is real and interactive — toggle every property to walk the matrix. Pressing the refresh button simulates a one-second loading state that returns to fresh."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="State">
            <org-button-toggle [items]="stateItems" formControlName="state" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Format">
            <org-button-toggle [items]="formatItems" formControlName="format" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Refreshable">
            <org-checkbox-toggle name="live-demo-refreshable" value="refreshable" formControlName="refreshable">
              {{ liveDemoForm.controls.refreshable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-last-updated
              [state]="liveDemoForm.controls.state.value"
              [format]="liveDemoForm.controls.format.value"
              [refreshable]="liveDemoForm.controls.refreshable.value"
              [label]="labelForState(liveDemoForm.controls.state.value)"
              [dateTime]="dateTime()"
              (refresh)="onRefresh()"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class LastUpdatedLiveDemoStory {
  protected readonly stateItems = liveDemoStateItems;
  protected readonly formatItems = liveDemoFormatItems;

  protected readonly dateTime = signal<DateTime>(DateTime.now().minus({ minutes: 2 }));

  protected readonly liveDemoForm = new FormGroup({
    state: new FormControl<LastUpdatedState>('fresh', { nonNullable: true }),
    format: new FormControl<string>('relative', { nonNullable: true }),
    refreshable: new FormControl<boolean>(true, { nonNullable: true }),
  });

  protected labelForState(state: LastUpdatedState): string {
    if (state === 'loading') {
      return 'Refreshing…';
    }

    if (state === 'error') {
      return 'Failed';
    }

    return 'Last updated';
  }

  protected onRefresh(): void {
    this.liveDemoForm.controls.state.setValue('loading');

    setTimeout(() => {
      this.dateTime.set(DateTime.now());
      this.liveDemoForm.controls.state.setValue('fresh');
    }, 1000);
  }
}

const meta: Meta<LastUpdated> = {
  title: 'Core/Components/Last Updated',
  component: LastUpdated,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Last Updated Component

  A small "as of" line that pairs an indicator dot (or a refresh button, or a loading spinner) with a label + timestamp. Sits next to data — beside a chart title, in a table footer, on a dashboard card. Tightly subordinate; the data is the point, this just stamps it.

  ### Features
  - Four \`state\` values: \`fresh\` (safe dot), \`stale\` (caution), \`error\` (danger), \`loading\` (spinner replaces the pre slot).
  - Three \`format\` choices for the time string: \`absolute\` (built-in standard format), \`relative\` (from-now), or any luxon \`toFormat\` string for custom shapes.
  - Optional refresh affordance via \`refreshable\` — when on (and not loading), the pre slot becomes an icon-only button that emits \`(refresh)\`.
  - Optional \`tooltipText\` — wires \`org-tooltip\` to surface a hover hint (typically the absolute time when displaying a relative one).
  - Tabular-numeral time so a "1:09 → 1:10" tick doesn't shift the layout.
  - Accessible: \`role="status"\` with a derived \`aria-label\` summarizing state + label + time.

  ### Usage Examples
  \`\`\`html
  <!-- fresh, relative, default label -->
  <org-last-updated state="fresh" format="relative" [dateTime]="dateTime" />

  <!-- stale, custom label, refreshable -->
  <org-last-updated
    state="stale"
    format="relative"
    label="Last updated"
    [refreshable]="true"
    [dateTime]="dateTime"
    (refresh)="reload()"
  />

  <!-- error, custom format string -->
  <org-last-updated
    state="error"
    format="MMM d, HH:mm"
    label="Failed"
    [dateTime]="dateTime"
  />

  <!-- loading -->
  <org-last-updated state="loading" label="Refreshing…" [dateTime]="dateTime" />

  <!-- relative-with-tooltip showing the absolute time on hover -->
  <org-last-updated
    state="fresh"
    format="relative"
    [dateTime]="dateTime"
    [tooltipText]="dateTime.toFormat('MMM d, HH:mm')"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;

// the state, format, dateTime, label, refreshable, tooltipText inputs come from the host-directive forwarding on
// `LastUpdated`, which storybook's signal-input type extraction does not see, so they are augmented onto the args
// type here.
type Story = StoryObj<
  LastUpdated & {
    state: LastUpdatedState;
    format: string;
    label: string;
    refreshable: boolean;
    tooltipText: string | null;
    dateTime: DateTime;
  }
>;

export const Default: Story = {
  args: {
    state: 'fresh',
    format: 'relative',
    label: 'Last updated',
    refreshable: false,
    tooltipText: null,
    dateTime: DateTime.now().minus({ minutes: 2 }),
  },
  argTypes: {
    state: {
      control: 'select',
      options: [...allLastUpdatedStates],
      description: 'The current state — drives indicator color, label tone, and the pre slot',
    },
    format: {
      control: 'select',
      options: ['absolute', 'relative', 'yyyy-MM-dd', 'HH:mm', 'MMM d, HH:mm'],
      description: 'Format axis — `absolute` / `relative` are sentinels, anything else is a luxon `toFormat` string',
    },
    label: {
      control: 'text',
      description: 'The text label rendered before the time (e.g., "Last updated", "Failed", "Refreshing…")',
    },
    refreshable: {
      control: 'boolean',
      description: 'When true (and not loading), the pre slot becomes a refresh button',
    },
    tooltipText: {
      control: 'text',
      description: 'When set, surfaces an `org-tooltip` on hover with this text',
    },
    dateTime: {
      control: false,
      description: 'Luxon DateTime to render (required)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default last updated. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-last-updated
        [state]="state"
        [format]="format"
        [label]="label"
        [refreshable]="refreshable"
        [tooltipText]="tooltipText"
        [dateTime]="dateTime"
      />
    `,
    moduleMetadata: {
      imports: [LastUpdated],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle state, format, and refreshability to walk the entire matrix. The refresh button simulates a one-second loading state that returns to fresh.',
      },
    },
  },
  render: () => ({
    template: `<story-last-updated-live-demo />`,
    moduleMetadata: {
      imports: [LastUpdatedLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every last-updated axis — every state, every format choice, and a sample of in-context placements (dashboard toolbar, stat cards, sidebar caption).',
      },
    },
  },
  render: () => ({
    props: {
      twoMinAgo: DateTime.now().minus({ minutes: 2 }),
      fourteenMinAgo: DateTime.now().minus({ minutes: 14 }),
      now: DateTime.now(),
      may2: DateTime.fromISO('2026-05-02T14:02:00'),
      noopRefresh: () => undefined,
    },
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="States"
            description="Four state values. Fresh is the default — a safe dot next to the timestamp. Loading swaps the dot for a spinner. Stale uses caution — yellow dot and a softer tone. Error uses danger — red dot and tinted label."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-last-updated state="fresh" format="relative" label="Last updated" [dateTime]="twoMinAgo" />
            <org-last-updated state="loading" label="Refreshing…" [dateTime]="twoMinAgo" />
            <org-last-updated state="stale" format="relative" label="Last updated" [dateTime]="fourteenMinAgo" />
            <org-last-updated state="error" format="relative" label="Failed" [dateTime]="fourteenMinAgo" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Fresh</strong>: green safe dot, default tone</li>
            <li><strong>Loading</strong>: spinner replaces the dot; label switches to "Refreshing…"</li>
            <li><strong>Stale</strong>: caution dot; label tones down</li>
            <li><strong>Error</strong>: danger dot; label and time tint to danger</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Format"
            description="The format input controls what the time reads. Absolute uses the built-in standard datetime format. Relative uses from-now. Any other string is passed through to luxon's toFormat — date only / time only / datetime are simply different toFormat patterns."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-last-updated state="fresh" format="absolute" label="Last updated" [dateTime]="may2" />
            <org-last-updated state="fresh" format="relative" label="Last updated" [dateTime]="now" />
            <org-last-updated state="fresh" format="yyyy-MM-dd" label="Last updated" [dateTime]="may2" />
            <org-last-updated state="fresh" format="HH:mm" label="Last updated" [dateTime]="may2" />
            <org-last-updated state="fresh" format="MMM d, HH:mm" label="Last updated" [dateTime]="may2" />
            <org-last-updated
              state="fresh"
              format="relative"
              label="Last updated"
              [dateTime]="twoMinAgo"
              [tooltipText]="may2.toFormat('MMM d, HH:mm')"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>absolute</strong>: standard datetime format (e.g. "5/2/26 2:02 PM")</li>
            <li><strong>relative</strong>: from-now (e.g. "2 minutes ago")</li>
            <li><strong>yyyy-MM-dd</strong>: date only via toFormat</li>
            <li><strong>HH:mm</strong>: time only via toFormat</li>
            <li><strong>MMM d, HH:mm</strong>: compact datetime via toFormat</li>
            <li><strong>relative + tooltipText</strong>: visible label is relative; hover the row to see the absolute time via the wired tooltip</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="In context"
            description="Where the component lives in product. Always pinned to the data it describes — never floating on its own."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex items-center gap-4 p-3 rounded-base" style="border: 0.0625rem solid var(--color-border)">
              <strong>Active deployments</strong>
              <org-last-updated
                state="fresh"
                format="relative"
                label="Last updated"
                [refreshable]="true"
                [dateTime]="now"
                (refresh)="noopRefresh()"
              />
            </div>

            <div class="flex gap-4">
              <div class="flex flex-col gap-2 p-3 rounded-base" style="border: 0.0625rem solid var(--color-border); min-width: 16rem;">
                <span style="color: var(--color-fg-muted); font-size: var(--font-size-xs);">STAT CARD · STALE</span>
                <div class="flex items-center justify-between gap-2">
                  <strong>ACTIVE USERS</strong>
                  <org-last-updated
                    state="stale"
                    format="relative"
                    label="Last updated"
                    [dateTime]="fourteenMinAgo"
                  />
                </div>
                <span style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);">12,408</span>
              </div>

              <div class="flex flex-col gap-2 p-3 rounded-base" style="border: 0.0625rem solid var(--color-border); min-width: 16rem;">
                <span style="color: var(--color-fg-muted); font-size: var(--font-size-xs);">STAT CARD · ERROR</span>
                <div class="flex items-center justify-between gap-2">
                  <strong>REVENUE (TODAY)</strong>
                  <org-last-updated
                    state="error"
                    format="relative"
                    label="Failed"
                    [dateTime]="fourteenMinAgo"
                  />
                </div>
                <span style="color: var(--color-fg-muted);">Couldn't reach metrics service.</span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 p-3 rounded-base" style="border: 0.0625rem solid var(--color-border)">
              <strong>Notifications</strong>
              <org-last-updated state="loading" label="Refreshing…" [dateTime]="now" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Pinned to the data it describes — toolbar header, stat-card eyebrow, sidebar caption</li>
            <li>Subordinate by design: small font, no background, no border, no padding of its own</li>
            <li>State and format combine — try stale + relative for "stale data + 14 min ago" reading</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        LastUpdated,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

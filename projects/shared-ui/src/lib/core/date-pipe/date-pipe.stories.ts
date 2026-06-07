import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
import { DatePipe } from './date-pipe';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

const meta: Meta<DatePipe> = {
  title: 'Core/Pipes/Date Pipe',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Date Pipe

  A pure pipe for formatting Luxon DateTime values as human readable strings.

  ### Features
  - Formats dates using Luxon DateTime objects
  - Configurable date format
  - Optional time display with configurable format
  - Optional timezone display
  - Relative time output via \`dateUtils.fromNow()\`
  - Returns "----" for null, undefined, or invalid dates
  - Single options object signature

  ### Usage Examples
  \`\`\`html
  <!-- basic date format -->
  {{ myDate | orgDate }}

  <!-- date with time -->
  {{ myDate | orgDate: { timeFormat: TimeFormat.STANDARD } }}

  <!-- date with time and no timezone -->
  {{ myDate | orgDate: { timeFormat: TimeFormat.STANDARD, showTimezone: false } }}

  <!-- custom date format -->
  {{ myDate | orgDate: { dateFormat: DateFormat.MONTH_YEAR } }}

  <!-- relative time (overrides other formatting options) -->
  {{ myDate | orgDate: { relative: true } }}
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DatePipe>;

const sampleDate = DateTime.fromISO('2024-03-15T14:30:00', { zone: 'America/New_York' });

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default pipe usage with no options. Uses the standard date format, no time, and timezone enabled by default.',
      },
    },
  },
  render: () => ({
    props: {
      sampleDate,
    },
    template: `
      <div>{{ sampleDate | orgDate }}</div>
    `,
    moduleMetadata: {
      imports: [DatePipe],
    },
  }),
};

export const DateFormats: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different date format options.',
      },
    },
  },
  render: () => ({
    props: {
      sampleDate,
      DateFormat,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Date Formats" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Standard (M/d/yy)</div>
            {{ sampleDate | orgDate: { dateFormat: DateFormat.STANDARD } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Month Year (LLL yyyy)</div>
            {{ sampleDate | orgDate: { dateFormat: DateFormat.MONTH_YEAR } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">SQL Format (yyyy-MM-dd)</div>
            {{ sampleDate | orgDate: { dateFormat: DateFormat.SQL } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Day Only (d)</div>
            {{ sampleDate | orgDate: { dateFormat: DateFormat.DAY } }}
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Standard</strong>: Short date format (M/d/yy)</li>
          <li><strong>Month Year</strong>: Displays month name and year</li>
          <li><strong>SQL</strong>: Database-friendly format</li>
          <li><strong>Day</strong>: Shows only the day number</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DatePipe,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const TimeFormats: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of date output with different time format options.',
      },
    },
  },
  render: () => ({
    props: {
      sampleDate,
      TimeFormat,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Time Formats" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Date Only (no time)</div>
            {{ sampleDate | orgDate }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">With Standard Time (h:mm a)</div>
            {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">With Time and Seconds (h:mm:ss a)</div>
            {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD_WITH_SECONDS } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">SQL Time Format (HH:mm:ss)</div>
            {{ sampleDate | orgDate: { timeFormat: TimeFormat.SQL } }}
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Date Only</strong>: No time information displayed</li>
          <li><strong>Standard Time</strong>: 12-hour format with AM/PM</li>
          <li><strong>With Seconds</strong>: Includes seconds in the time</li>
          <li><strong>SQL Format</strong>: 24-hour format for databases</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DatePipe,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const TimezoneDisplay: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of date output with and without timezone information.',
      },
    },
  },
  render: () => ({
    props: {
      sampleDate,
      TimeFormat,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Timezone Display" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Date Only (timezone not applicable)</div>
            {{ sampleDate | orgDate }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">With Time, No Timezone</div>
            {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD, showTimezone: false } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">With Time and Timezone</div>
            {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD, showTimezone: true } }}
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Date Only</strong>: Timezone is not shown when time is not displayed</li>
          <li><strong>No Timezone</strong>: Time is shown without timezone information</li>
          <li><strong>With Timezone</strong>: Full date, time, and timezone (default)</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DatePipe,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const Relative: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Relative time output via `dateUtils.fromNow()`. When `relative` is true, all other formatting options are ignored.',
      },
    },
  },
  render: () => ({
    props: {
      pastMoments: DateTime.now().minus({ seconds: 30 }),
      pastMinutes: DateTime.now().minus({ minutes: 15 }),
      pastHours: DateTime.now().minus({ hours: 3 }),
      pastDays: DateTime.now().minus({ days: 5 }),
      futureMoments: DateTime.now().plus({ seconds: 30 }),
      futureDays: DateTime.now().plus({ days: 5 }),
      invalidDate: DateTime.invalid('test invalid'),
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Relative Time" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Past Moments (30s ago)</div>
            {{ pastMoments | orgDate: { relative: true } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Past Minutes (15 minutes ago)</div>
            {{ pastMinutes | orgDate: { relative: true } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Past Hours (3 hours ago)</div>
            {{ pastHours | orgDate: { relative: true } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Past Days (5 days ago)</div>
            {{ pastDays | orgDate: { relative: true } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Future Moments (30s ahead)</div>
            {{ futureMoments | orgDate: { relative: true } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Future Days (5 days ahead)</div>
            {{ futureDays | orgDate: { relative: true } }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Invalid Date</div>
            {{ invalidDate | orgDate: { relative: true } }}
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Past Moments</strong>: Displays "moments ago" when under one minute in the past</li>
          <li><strong>Past Minutes / Hours / Days</strong>: Luxon relative output (e.g. "15 minutes ago")</li>
          <li><strong>Future Moments</strong>: Displays "in moments" when under one minute in the future</li>
          <li><strong>Future Days</strong>: Luxon relative output (e.g. "in 5 days")</li>
          <li><strong>Invalid Date</strong>: Shows "----" placeholder</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DatePipe,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const InvalidDate: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Null, undefined, and invalid dates render the "----" placeholder.',
      },
    },
  },
  render: () => ({
    props: {
      validDate: sampleDate,
      invalidDate: DateTime.invalid('test invalid'),
      nullDate: null,
      undefinedDate: undefined,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Invalid Date Handling" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Valid Date</div>
            {{ validDate | orgDate }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Invalid Date</div>
            {{ invalidDate | orgDate }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Null Date</div>
            {{ nullDate | orgDate }}
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Undefined Date</div>
            {{ undefinedDate | orgDate }}
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Valid Date</strong>: Displays formatted date normally</li>
          <li><strong>Invalid / Null / Undefined</strong>: Shows "----" placeholder</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DatePipe,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

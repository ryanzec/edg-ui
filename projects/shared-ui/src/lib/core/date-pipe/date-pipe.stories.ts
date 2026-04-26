import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
import { DatePipe } from './date-pipe';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

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
      <org-storybook-example-container
        title="Date Formats"
        currentState="Comparing different date format options"
      >
        <org-storybook-example-container-section label="Standard (M/d/yy)">
          {{ sampleDate | orgDate: { dateFormat: DateFormat.STANDARD } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Month Year (LLL yyyy)">
          {{ sampleDate | orgDate: { dateFormat: DateFormat.MONTH_YEAR } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="SQL Format (yyyy-MM-dd)">
          {{ sampleDate | orgDate: { dateFormat: DateFormat.SQL } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Day Only (d)">
          {{ sampleDate | orgDate: { dateFormat: DateFormat.DAY } }}
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Standard</strong>: Short date format (M/d/yy)</li>
          <li><strong>Month Year</strong>: Displays month name and year</li>
          <li><strong>SQL</strong>: Database-friendly format</li>
          <li><strong>Day</strong>: Shows only the day number</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DatePipe, StorybookExampleContainer, StorybookExampleContainerSection],
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
      <org-storybook-example-container
        title="Time Formats"
        currentState="Comparing date output with and without time"
      >
        <org-storybook-example-container-section label="Date Only (no time)">
          {{ sampleDate | orgDate }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Standard Time (h:mm a)">
          {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Time and Seconds (h:mm:ss a)">
          {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD_WITH_SECONDS } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="SQL Time Format (HH:mm:ss)">
          {{ sampleDate | orgDate: { timeFormat: TimeFormat.SQL } }}
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Date Only</strong>: No time information displayed</li>
          <li><strong>Standard Time</strong>: 12-hour format with AM/PM</li>
          <li><strong>With Seconds</strong>: Includes seconds in the time</li>
          <li><strong>SQL Format</strong>: 24-hour format for databases</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DatePipe, StorybookExampleContainer, StorybookExampleContainerSection],
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
      <org-storybook-example-container
        title="Timezone Display"
        currentState="Comparing with and without timezone"
      >
        <org-storybook-example-container-section label="Date Only (timezone not applicable)">
          {{ sampleDate | orgDate }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Time, No Timezone">
          {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD, showTimezone: false } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Time and Timezone">
          {{ sampleDate | orgDate: { timeFormat: TimeFormat.STANDARD, showTimezone: true } }}
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Date Only</strong>: Timezone is not shown when time is not displayed</li>
          <li><strong>No Timezone</strong>: Time is shown without timezone information</li>
          <li><strong>With Timezone</strong>: Full date, time, and timezone (default)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DatePipe, StorybookExampleContainer, StorybookExampleContainerSection],
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
      <org-storybook-example-container
        title="Relative Time"
        currentState="Comparing relative time output across past, future, and invalid dates"
      >
        <org-storybook-example-container-section label="Past Moments (30s ago)">
          {{ pastMoments | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Past Minutes (15 minutes ago)">
          {{ pastMinutes | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Past Hours (3 hours ago)">
          {{ pastHours | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Past Days (5 days ago)">
          {{ pastDays | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Future Moments (30s ahead)">
          {{ futureMoments | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Future Days (5 days ahead)">
          {{ futureDays | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid Date">
          {{ invalidDate | orgDate: { relative: true } }}
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Past Moments</strong>: Displays "moments ago" when under one minute in the past</li>
          <li><strong>Past Minutes / Hours / Days</strong>: Luxon relative output (e.g. "15 minutes ago")</li>
          <li><strong>Future Moments</strong>: Displays "in moments" when under one minute in the future</li>
          <li><strong>Future Days</strong>: Luxon relative output (e.g. "in 5 days")</li>
          <li><strong>Invalid Date</strong>: Shows "----" placeholder</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DatePipe, StorybookExampleContainer, StorybookExampleContainerSection],
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
      <org-storybook-example-container
        title="Invalid Date Handling"
        currentState="Comparing valid, invalid, null, and undefined inputs"
      >
        <org-storybook-example-container-section label="Valid Date">
          {{ validDate | orgDate }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid Date">
          {{ invalidDate | orgDate }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Null Date">
          {{ nullDate | orgDate }}
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Undefined Date">
          {{ undefinedDate | orgDate }}
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Valid Date</strong>: Displays formatted date normally</li>
          <li><strong>Invalid / Null / Undefined</strong>: Shows "----" placeholder</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DatePipe, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

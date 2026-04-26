import type { Meta, StoryObj } from '@storybook/angular';
import { Calendar } from './calendar';
import { CalendarFooter } from './calendar-footer';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { DateTime } from 'luxon';
import { signal, Component, ChangeDetectionStrategy } from '@angular/core';

const meta: Meta<Calendar> = {
  title: 'Core/Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Calendar Component

  A comprehensive calendar component for date selection with support for single dates, date ranges, and various constraints.

  ### Features
  - Single date or date range selection
  - Partial range selection modes (on or before, on or after)
  - Year and month dropdowns for quick navigation
  - Previous/next month navigation arrows
  - Keyboard navigation support (arrow keys, Page Up/Down, Home/End, Enter)
  - Date constraints (disable before/after specific dates)
  - Allowed date range limits for range selection
  - Display dates from previous/next months
  - Accessible with full ARIA support
  - Customizable footer for additional content

  ### Sub-Components
  - **Calendar Header**: Contains year/month dropdowns and navigation arrows
  - **Calendar Dates**: Grid of dates with selection logic
  - **Calendar Footer**: Optional footer for custom content (e.g., action buttons)

  ### Usage Examples
  \`\`\`html
  <!-- Basic single date selection -->
  <org-calendar
    [defaultDisplayDate]="currentDate"
    (dateSelected)="onDateSelected($event)"
  />

  <!-- Date range selection -->
  <org-calendar
    [allowRangeSelection]="true"
    [selectedStartDate]="startDate"
    [selectedEndDate]="endDate"
    (dateSelected)="onDateSelected($event)"
  />

  <!-- Partial range selection -->
  <org-calendar
    [allowRangeSelection]="true"
    [allowPartialRangeSelection]="true"
    [partialRangeSelectionType]="rangeType"
    [selectedStartDate]="startDate"
    [selectedEndDate]="endDate"
    (dateSelected)="onDateSelected($event)"
    (partialRangeSelectionTypeChange)="onRangeTypeChange($event)"
  />

  <!-- With date constraints -->
  <org-calendar
    [disableBefore]="minDate"
    [disableAfter]="maxDate"
    [allowedDateRange]="14"
    (dateSelected)="onDateSelected($event)"
  />

  <!-- With custom footer -->
  <org-calendar (dateSelected)="onDateSelected($event)">
    <org-calendar-footer>
      <org-button color="primary">Apply</org-button>
    </org-calendar-footer>
  </org-calendar>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Calendar>;

export const Default: Story = {
  args: {
    defaultDisplayDate: DateTime.now(),
    startYear: DateTime.now().year - 100,
    endYear: DateTime.now().year + 20,
    selectedStartDate: null,
    selectedEndDate: null,
    allowRangeSelection: false,
    disableBefore: null,
    disableAfter: null,
    allowedDateRange: 0,
    enableDeselection: true,
    containerClass: '',
  },
  argTypes: {
    defaultDisplayDate: {
      control: false,
      description: 'Initial display date for the calendar',
    },
    startYear: {
      control: 'number',
      description: 'Earliest selectable year in dropdown',
    },
    endYear: {
      control: 'number',
      description: 'Latest selectable year in dropdown',
    },
    selectedStartDate: {
      control: false,
      description: 'Selected start date',
    },
    selectedEndDate: {
      control: false,
      description: 'Selected end date',
    },
    allowRangeSelection: {
      control: 'boolean',
      description: 'Enable date range selection mode',
    },
    disableBefore: {
      control: false,
      description: 'Disable all dates before this date',
    },
    disableAfter: {
      control: false,
      description: 'Disable all dates after this date',
    },
    allowedDateRange: {
      control: 'number',
      description: 'Maximum number of days allowed in range (0 = unlimited)',
    },
    enableDeselection: {
      control: 'boolean',
      description: 'Allow clicking selected dates to deselect them',
    },
    containerClass: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default calendar with basic configuration. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onDateSelected: (event: unknown) => console.log('Date selected:', event),
      onDisplayMonthChanged: (event: unknown) => console.log('Display month changed:', event),
    },
    template: `
      <org-calendar
        [defaultDisplayDate]="defaultDisplayDate"
        [startYear]="startYear"
        [endYear]="endYear"
        [selectedStartDate]="selectedStartDate"
        [selectedEndDate]="selectedEndDate"
        [allowRangeSelection]="allowRangeSelection"
        [disableBefore]="disableBefore"
        [disableAfter]="disableAfter"
        [allowedDateRange]="allowedDateRange"
        [enableDeselection]="enableDeselection"
        [containerClass]="containerClass"
        (dateSelected)="onDateSelected($event)"
        (displayMonthChanged)="onDisplayMonthChanged($event)"
      />
    `,
    moduleMetadata: {
      imports: [Calendar],
    },
  }),
};

export const SingleDateSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with single date selection. Click a date to select it, click again to deselect.',
      },
    },
  },
  render: () => {
    const selectedStart = signal<DateTime | null>(null);

    return {
      props: {
        selectedStart,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          console.log('Date selected:', event);
        },
      },
      template: `
        <org-storybook-example-container
          title="Single Date Selection"
          currentState="Click a date to select, click again to deselect"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [selectedStartDate]="selectedStart()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Selected Date">
            @if (selectedStart()) {
              <div>{{ selectedStart()!.toISO() }}</div>
            } @else {
              <div class="opacity-subtle">No date selected</div>
            }
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>Click any date to select it (stored as 00:00:00)</li>
            <li>Click the same date again to deselect it</li>
            <li>Click another date to change the selection</li>
            <li>Use arrow keys for keyboard navigation</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const RangeSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with date range selection enabled. Select start and end dates to define a range.',
      },
    },
  },
  render: () => {
    const selectedStart = signal<DateTime | null>(null);
    const selectedEnd = signal<DateTime | null>(null);

    return {
      props: {
        selectedStart,
        selectedEnd,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          selectedEnd.set(event.endDate);
          console.log('Date selected:', event);
        },
      },
      template: `
        <org-storybook-example-container
          title="Range Selection"
          currentState="Select start and end dates for a range"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [allowRangeSelection]="true"
              [selectedStartDate]="selectedStart()"
              [selectedEndDate]="selectedEnd()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Selected Range">
            @if (selectedStart() && selectedEnd()) {
              <div>Start: {{ selectedStart()!.toISO() }}</div>
              <div>End: {{ selectedEnd()!.toISO() }}</div>
            } @else if (selectedStart()) {
              <div>Start: {{ selectedStart()!.toISO() }}</div>
              <div class="opacity-subtle">End: Not selected</div>
            } @else {
              <div class="opacity-subtle">No range selected</div>
            }
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>First click selects start date (00:00:00)</li>
            <li>Second click selects end date (23:59:59)</li>
            <li>Clicking a date before start swaps them</li>
            <li>Clicking a date between range updates end date</li>
            <li>Clicking start or end date deselects only that date</li>
            <li>Dates in between are highlighted</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const DisabledDates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with date constraints using disableBefore and disableAfter.',
      },
    },
  },
  render: () => {
    const today = DateTime.now();
    const minDate = today.minus({ days: 7 });
    const maxDate = today.plus({ days: 14 });
    const selectedStart = signal<DateTime | null>(null);

    return {
      props: {
        minDate,
        maxDate,
        selectedStart,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          console.log('Date selected:', event);
        },
      },
      template: `
        <org-storybook-example-container
          title="Disabled Dates"
          currentState="Dates outside the allowed range are disabled"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [disableBefore]="minDate"
              [disableAfter]="maxDate"
              [selectedStartDate]="selectedStart()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Constraints">
            <div>Disable Before: {{ minDate.toISO() }}</div>
            <div>Disable After: {{ maxDate.toISO() }}</div>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>Dates before {{ minDate.toISO() }} are disabled</li>
            <li>Dates after {{ maxDate.toISO() }} are disabled</li>
            <li>Disabled dates have reduced opacity</li>
            <li>Disabled dates cannot be clicked</li>
            <li>Outside-month dates that are disabled show only disabled opacity</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const AllowedDateRange: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with range selection limited to a maximum number of days.',
      },
    },
  },
  render: () => {
    const selectedStart = signal<DateTime | null>(null);
    const selectedEnd = signal<DateTime | null>(null);
    const allowedRange = 14;

    return {
      props: {
        selectedStart,
        selectedEnd,
        allowedRange,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          selectedEnd.set(event.endDate);
          console.log('Date selected:', event);
        },
      },
      template: `
        <org-storybook-example-container
          title="Allowed Date Range"
          [currentState]="'Maximum range of ' + allowedRange + ' days'"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [allowRangeSelection]="true"
              [allowedDateRange]="allowedRange"
              [selectedStartDate]="selectedStart()"
              [selectedEndDate]="selectedEnd()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Selected Range">
            @if (selectedStart() && selectedEnd()) {
              <div>Start: {{ selectedStart()!.toISO() }}</div>
              <div>End: {{ selectedEnd()!.toISO() }}</div>
              <div>Days: {{ selectedEnd()!.diff(selectedStart()!, 'days').days + 1 | number:'1.0-0' }}</div>
            } @else if (selectedStart()) {
              <div>Start: {{ selectedStart()!.toISO() }}</div>
              <div class="opacity-subtle">Select an end date within {{ allowedRange }} days</div>
            } @else {
              <div class="opacity-subtle">No range selected</div>
            }
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>Select a start date first</li>
            <li>Dates beyond {{ allowedRange }} days from start are disabled</li>
            <li>Dates more than {{ allowedRange }} days before start are also disabled</li>
            <li>Once end date is selected, all dates become available again</li>
            <li>Range includes start date, so {{ allowedRange }} days total</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const WithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with custom footer content for action buttons or additional information.',
      },
    },
  },
  render: () => {
    const selectedStart = signal<DateTime | null>(null);
    const selectedEnd = signal<DateTime | null>(null);

    return {
      props: {
        selectedStart,
        selectedEnd,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          selectedEnd.set(event.endDate);
          console.log('Date selected:', event);
        },
        onClear: () => {
          selectedStart.set(null);
          selectedEnd.set(null);
          console.log('Cleared selection');
        },
        onToday: () => {
          selectedStart.set(DateTime.now());
          selectedEnd.set(null);
          console.log('Selected today');
        },
        onApply: () => {
          console.log('Apply clicked');
        },
      },
      template: `
        <org-storybook-example-container
          title="With Footer"
          currentState="Calendar with custom footer buttons"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [allowRangeSelection]="true"
              [selectedStartDate]="selectedStart()"
              [selectedEndDate]="selectedEnd()"
              (dateSelected)="onDateSelected($event)"
            >
              <org-calendar-footer>
                <div class="flex items-center justify-between gap-2">
                  <org-button
                    variant="ghost"
                    (clicked)="onToday()"
                  >
                    Today
                  </org-button>
                  <div class="flex items-center gap-2">
                    <org-button
                      variant="ghost"
                      (clicked)="onClear()"
                    >
                      Clear
                    </org-button>
                    <org-button
                      color="primary"
                      (clicked)="onApply()"
                    >
                      Apply
                    </org-button>
                  </div>
                </div>
              </org-calendar-footer>
            </org-calendar>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>Footer contains action buttons</li>
            <li>"Today" button sets selection to current date</li>
            <li>"Clear" button removes selection</li>
            <li>"Apply" button would typically close calendar and apply selection</li>
            <li>Footer content is completely customizable</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, CalendarFooter, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with full keyboard navigation support.',
      },
    },
  },
  render: () => {
    const selectedStart = signal<DateTime | null>(null);

    return {
      props: {
        selectedStart,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          console.log('Date selected:', event);
        },
      },
      template: `
        <org-storybook-example-container
          title="Keyboard Navigation"
          currentState="Click on the calendar to focus, then use keyboard to navigate"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [selectedStartDate]="selectedStart()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Keyboard Shortcuts">
            <div class="flex flex-col gap-1 text-sm">
              <div><strong>Arrow Keys:</strong> Navigate between dates</div>
              <div><strong>Page Up/Down:</strong> Navigate between months</div>
              <div><strong>Home:</strong> Jump to first day of month</div>
              <div><strong>End:</strong> Jump to last day of month</div>
              <div><strong>Enter/Space:</strong> Select focused date</div>
            </div>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>Click calendar to focus, then use keyboard</li>
            <li>Arrow keys move focus between dates</li>
            <li>Crossing month boundaries auto-updates display</li>
            <li>Page Up/Down moves one month at a time</li>
            <li>Home/End jumps to month boundaries</li>
            <li>Enter or Space selects the focused date</li>
            <li>Focused date has a ring indicator</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const DisplayMonthControl: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates programmatic control of the displayed month using the public API.',
      },
    },
  },
  render: () => {
    return {
      props: {
        getOffsetDate: (monthsOffset: number) => DateTime.now().plus({ months: monthsOffset }),
        onMonthChanged: (event: unknown) => console.log('Month changed:', event),
      },
      template: `
        <org-storybook-example-container
          title="Display Month Control"
          currentState="Use buttons to programmatically change the displayed month"
        >
          <org-storybook-example-container-section label="Controls">
            <div class="flex items-center gap-2">
              <org-button
                variant="ghost"
                (clicked)="calendar.setDisplayDate(getOffsetDate(-3))"
              >
                -3 Months
              </org-button>
              <org-button
                variant="ghost"
                (clicked)="calendar.setDisplayDate(getOffsetDate(-1))"
              >
                -1 Month
              </org-button>
              <org-button
                color="primary"
                (clicked)="calendar.setDisplayDate(getOffsetDate(0))"
              >
                Today
              </org-button>
              <org-button
                variant="ghost"
                (clicked)="calendar.setDisplayDate(getOffsetDate(1))"
              >
                +1 Month
              </org-button>
              <org-button
                variant="ghost"
                (clicked)="calendar.setDisplayDate(getOffsetDate(3))"
              >
                +3 Months
              </org-button>
            </div>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              #calendar
              (displayMonthChanged)="onMonthChanged($event)"
            />
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li>Use public API <code>setDisplayDate()</code> to change display</li>
            <li>Month change triggers <code>displayMonthChanged</code> event</li>
            <li>Buttons demonstrate programmatic navigation</li>
            <li>Event includes current and previous month/year</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const PartialRangeSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with partial range selection modes - allows selecting "on or before" or "on or after" a date.',
      },
    },
  },
  render: () => {
    const selectedStart = signal<DateTime | null>(null);
    const selectedEnd = signal<DateTime | null>(null);
    const partialRangeType = signal<'range' | 'onOrBefore' | 'onOrAfter'>('range');

    return {
      props: {
        selectedStart,
        selectedEnd,
        partialRangeType,
        onDateSelected: (event: { startDate: DateTime | null; endDate: DateTime | null }) => {
          selectedStart.set(event.startDate);
          selectedEnd.set(event.endDate);
          console.log('Date selected:', event);
        },
        onPartialRangeTypeChange: (type: 'range' | 'onOrBefore' | 'onOrAfter') => {
          partialRangeType.set(type);
          console.log('Partial range type changed:', type);
        },
      },
      template: `
        <org-storybook-example-container
          title="Partial Range Selection"
          currentState="Switch between range modes to change selection behavior"
        >
          <org-storybook-example-container-section label="Calendar">
            <org-calendar
              [allowRangeSelection]="true"
              [allowPartialRangeSelection]="true"
              [partialRangeSelectionType]="partialRangeType()"
              [selectedStartDate]="selectedStart()"
              [selectedEndDate]="selectedEnd()"
              (dateSelected)="onDateSelected($event)"
              (partialRangeSelectionTypeChange)="onPartialRangeTypeChange($event)"
            />
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Current Mode">
            <div class="flex flex-col gap-1">
              <div><strong>Mode:</strong> {{ partialRangeType() }}</div>
              @if (partialRangeType() === 'range') {
                <div class="text-sm opacity-subtle">
                  Standard range selection with start and end dates
                </div>
              }
              @if (partialRangeType() === 'onOrBefore') {
                <div class="text-sm opacity-subtle">
                  Selects all dates on or before the selected date (only end date)
                </div>
              }
              @if (partialRangeType() === 'onOrAfter') {
                <div class="text-sm opacity-subtle">
                  Selects all dates on or after the selected date (only start date)
                </div>
              }
            </div>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Selected Dates">
            @if (selectedStart() && selectedEnd()) {
              <div>Start: {{ selectedStart()!.toISO() }}</div>
              <div>End: {{ selectedEnd()!.toISO() }}</div>
            } @else if (selectedStart()) {
              <div>Start: {{ selectedStart()!.toISO() }}</div>
              <div class="opacity-subtle">End: Not selected</div>
            } @else if (selectedEnd()) {
              <div class="opacity-subtle">Start: Not selected</div>
              <div>End: {{ selectedEnd()!.toISO() }}</div>
            } @else {
              <div class="opacity-subtle">No dates selected</div>
            }
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Range Mode:</strong> Standard selection with both start (00:00:00) and end dates (23:59:59)</li>
            <li><strong>On or Before Mode:</strong> Clicking a date sets only the end date (23:59:59), no start date</li>
            <li><strong>On or After Mode:</strong> Clicking a date sets only the start date (00:00:00), no end date</li>
            <li>Radio buttons allow switching between modes</li>
            <li>Selection is cleared when switching between any modes</li>
            <li>Each mode represents a different type of date filter</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

@Component({
  selector: 'story-calendar-with-deselection-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="With Deselection (enableDeselection=true)"
      currentState="Click selected dates to deselect them"
    >
      <org-storybook-example-container-section label="Single Select Mode">
        <div class="flex flex-col gap-2">
          <org-calendar
            [selectedStartDate]="singleDate()"
            [enableDeselection]="true"
            (dateSelected)="onSingleDateSelected($event)"
          />
          <div class="text-sm">
            <strong>Selected:</strong>
            {{ singleDate() ? singleDate()!.toISO() : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Mode">
        <div class="flex flex-col gap-2">
          <org-calendar
            [selectedStartDate]="rangeStart()"
            [selectedEndDate]="rangeEnd()"
            [allowRangeSelection]="true"
            [enableDeselection]="true"
            (dateSelected)="onRangeSelected($event)"
          />
          <div class="text-sm flex flex-col gap-1">
            <div>
              <strong>Start:</strong>
              {{ rangeStart() ? rangeStart()!.toISO() : 'None' }}
            </div>
            <div>
              <strong>End:</strong>
              {{ rangeEnd() ? rangeEnd()!.toISO() : 'None' }}
            </div>
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Mode + Partial Allowed">
        <div class="flex flex-col gap-2">
          <org-calendar
            [selectedStartDate]="partialStart()"
            [selectedEndDate]="partialEnd()"
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [partialRangeSelectionType]="partialType()"
            [enableDeselection]="true"
            (dateSelected)="onPartialSelected($event)"
            (partialRangeSelectionTypeChange)="onPartialTypeChange($event)"
          />
          <div class="text-sm flex flex-col gap-1">
            <div><strong>Mode:</strong> {{ partialType() }}</div>
            <div>
              <strong>Start:</strong>
              {{ partialStart() ? partialStart()!.toISO() : 'None' }}
            </div>
            <div>
              <strong>End:</strong>
              {{ partialEnd() ? partialEnd()!.toISO() : 'None' }}
            </div>
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Clicking a selected date deselects it</li>
        <li>In single select mode, click selected date to clear selection</li>
        <li>In range mode, click start date to clear start, click end date to clear end</li>
        <li>Can selectively clear individual dates in a range</li>
        <li>All selection modes support deselection when enabled</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class CalendarWithDeselectionDemo {
  // single select
  protected singleDate = signal<DateTime | null>(null);

  protected onSingleDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleDate.set(dates.startDate);
  }

  // range mode
  protected rangeStart = signal<DateTime | null>(null);
  protected rangeEnd = signal<DateTime | null>(null);

  protected onRangeSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeStart.set(dates.startDate);
    this.rangeEnd.set(dates.endDate);
  }

  // partial range mode
  protected partialStart = signal<DateTime | null>(null);
  protected partialEnd = signal<DateTime | null>(null);
  protected partialType = signal<'range' | 'onOrBefore' | 'onOrAfter'>('range');

  protected onPartialSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.partialStart.set(dates.startDate);
    this.partialEnd.set(dates.endDate);
  }

  protected onPartialTypeChange(type: 'range' | 'onOrBefore' | 'onOrAfter'): void {
    this.partialType.set(type);
  }
}

export const WithDeselection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates deselection behavior (enableDeselection=true, default). Clicking already selected dates will deselect them, allowing users to easily clear their selections.',
      },
    },
  },
  render: () => ({
    template: '<story-calendar-with-deselection-demo />',
    moduleMetadata: {
      imports: [CalendarWithDeselectionDemo],
    },
  }),
};

@Component({
  selector: 'story-calendar-without-deselection-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Calendar, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Without Deselection (enableDeselection=false)"
      currentState="Clicking selected dates has no effect or selects new range"
    >
      <org-storybook-example-container-section label="Single Select Mode">
        <div class="flex flex-col gap-2">
          <org-calendar
            [selectedStartDate]="singleDate()"
            [enableDeselection]="false"
            (dateSelected)="onSingleDateSelected($event)"
          />
          <div class="text-sm">
            <strong>Selected:</strong>
            {{ singleDate() ? singleDate()!.toISO() : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Mode">
        <div class="flex flex-col gap-2">
          <org-calendar
            [selectedStartDate]="rangeStart()"
            [selectedEndDate]="rangeEnd()"
            [allowRangeSelection]="true"
            [enableDeselection]="false"
            (dateSelected)="onRangeSelected($event)"
          />
          <div class="text-sm flex flex-col gap-1">
            <div>
              <strong>Start:</strong>
              {{ rangeStart() ? rangeStart()!.toISO() : 'None' }}
            </div>
            <div>
              <strong>End:</strong>
              {{ rangeEnd() ? rangeEnd()!.toISO() : 'None' }}
            </div>
          </div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Mode + Partial Allowed">
        <div class="flex flex-col gap-2">
          <org-calendar
            [selectedStartDate]="partialStart()"
            [selectedEndDate]="partialEnd()"
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [partialRangeSelectionType]="partialType()"
            [enableDeselection]="false"
            (dateSelected)="onPartialSelected($event)"
            (partialRangeSelectionTypeChange)="onPartialTypeChange($event)"
          />
          <div class="text-sm flex flex-col gap-1">
            <div><strong>Mode:</strong> {{ partialType() }}</div>
            <div>
              <strong>Start:</strong>
              {{ partialStart() ? partialStart()!.toISO() : 'None' }}
            </div>
            <div>
              <strong>End:</strong>
              {{ partialEnd() ? partialEnd()!.toISO() : 'None' }}
            </div>
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Clicking a selected date does NOT deselect it</li>
        <li>In single select mode, clicking same date again keeps it selected</li>
        <li>In range mode, clicking same date as start creates same-day range</li>
        <li>Cannot clear selections by clicking, must use external controls</li>
        <li>Useful when auto-closing on selection (like in date picker input)</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class CalendarWithoutDeselectionDemo {
  // single select
  protected singleDate = signal<DateTime | null>(null);

  protected onSingleDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleDate.set(dates.startDate);
  }

  // range mode
  protected rangeStart = signal<DateTime | null>(null);
  protected rangeEnd = signal<DateTime | null>(null);

  protected onRangeSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeStart.set(dates.startDate);
    this.rangeEnd.set(dates.endDate);
  }

  // partial range mode
  protected partialStart = signal<DateTime | null>(null);
  protected partialEnd = signal<DateTime | null>(null);
  protected partialType = signal<'range' | 'onOrBefore' | 'onOrAfter'>('range');

  protected onPartialSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.partialStart.set(dates.startDate);
    this.partialEnd.set(dates.endDate);
  }

  protected onPartialTypeChange(type: 'range' | 'onOrBefore' | 'onOrAfter'): void {
    this.partialType.set(type);
  }
}

export const WithoutDeselection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates behavior with deselection disabled (enableDeselection=false). Clicking already selected dates will not deselect them. Useful for scenarios like date picker inputs where auto-close on selection is enabled.',
      },
    },
  },
  render: () => ({
    template: '<story-calendar-without-deselection-demo />',
    moduleMetadata: {
      imports: [CalendarWithoutDeselectionDemo],
    },
  }),
};

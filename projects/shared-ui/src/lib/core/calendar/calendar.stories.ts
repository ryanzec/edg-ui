import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { map } from 'rxjs';
import { Button } from '../button/button';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControlsGroup } from '../../example/design-system-demo/design-system-demo-controls-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { type CalendarPartialRangeSelectionType } from '../calendar/calendar-brain';
import { Calendar } from './calendar';
import { CalendarFooter } from './calendar-footer';
import { CalendarFooterLeftActions } from './calendar-footer-left-actions';
import { CalendarFooterRightActions } from './calendar-footer-right-actions';

const partialRangeTypeItems: ButtonToggleItem[] = [
  { value: 'range', label: 'Range', buttonColor: 'primary' },
  { value: 'onOrBefore', label: 'On or Before', buttonColor: 'primary' },
  { value: 'onOrAfter', label: 'On or After', buttonColor: 'primary' },
];

const allowedRangeItems: ButtonToggleItem[] = [
  { value: '0', label: '0 (off)', buttonColor: 'primary' },
  { value: '7', label: '7', buttonColor: 'primary' },
  { value: '14', label: '14', buttonColor: 'primary' },
  { value: '30', label: '30', buttonColor: 'primary' },
];

@Component({
  selector: 'story-calendar-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Calendar,
    CalendarFooter,
    CalendarFooterLeftActions,
    CalendarFooterRightActions,
    Button,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlsGroup,
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
        min-height: 6rem; /* 96px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="A working calendar — click cells to pick, switch modes to see how range build vs. partial mode behave. In range mode, a hovered cell after the start previews the range with an animated soft fill."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-controls-group label="Selection mode">
            <org-design-system-demo-control-input label="Allow range selection">
              <org-checkbox-toggle
                name="live-demo-allow-range"
                value="allowRangeSelection"
                formControlName="allowRangeSelection"
              >
                {{ liveDemoForm.controls.allowRangeSelection.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Allow partial range">
              <org-checkbox-toggle
                name="live-demo-allow-partial"
                value="allowPartialRangeSelection"
                formControlName="allowPartialRangeSelection"
              >
                {{ liveDemoForm.controls.allowPartialRangeSelection.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Partial range type">
              <org-button-toggle
                [items]="partialRangeTypeItems"
                formControlName="partialRangeSelectionType"
                buttonSize="sm"
              />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Constraints">
            <org-design-system-demo-control-input label="Allowed range (days)">
              <org-button-toggle [items]="allowedRangeItems" formControlName="allowedDateRange" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Enable deselection">
              <org-checkbox-toggle
                name="live-demo-deselect"
                value="enableDeselection"
                formControlName="enableDeselection"
              >
                {{ liveDemoForm.controls.enableDeselection.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="State">
            <org-design-system-demo-control-input label="Show footer">
              <org-checkbox-toggle name="live-demo-show-footer" value="showFooter" formControlName="showFooter">
                {{ liveDemoForm.controls.showFooter.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Disabled">
              <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
                {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-calendar
              #liveDemoCalendar
              [allowRangeSelection]="liveDemoForm.controls.allowRangeSelection.value"
              [allowPartialRangeSelection]="liveDemoForm.controls.allowPartialRangeSelection.value"
              [partialRangeSelectionType]="liveDemoForm.controls.partialRangeSelectionType.value"
              [allowedDateRange]="parseAllowedRange(liveDemoForm.controls.allowedDateRange.value)"
              [enableDeselection]="liveDemoForm.controls.enableDeselection.value"
              [disabled]="liveDemoForm.controls.disabled.value"
              [selectedStartDate]="selectedStart()"
              [selectedEndDate]="selectedEnd()"
              (dateSelected)="onDateSelected($event)"
              (partialRangeSelectionTypeChange)="onPartialTypeChange($event)"
            >
              @if (liveDemoForm.controls.showFooter.value) {
                <org-calendar-footer>
                  <org-calendar-footer-left-actions>
                    <org-button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      label="Today"
                      [disabled]="liveDemoForm.controls.disabled.value"
                      (clicked)="onTodayClicked(liveDemoCalendar)"
                    />
                  </org-calendar-footer-left-actions>
                  <org-calendar-footer-right-actions>
                    <org-button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      label="Cancel"
                      [disabled]="liveDemoForm.controls.disabled.value"
                      (clicked)="onCancelClicked()"
                    />
                    <org-button
                      variant="filled"
                      color="primary"
                      size="sm"
                      label="Apply"
                      [disabled]="liveDemoForm.controls.disabled.value"
                      (clicked)="onApplyClicked()"
                    />
                  </org-calendar-footer-right-actions>
                </org-calendar-footer>
              }
            </org-calendar>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class CalendarLiveDemoStory {
  protected readonly partialRangeTypeItems = partialRangeTypeItems;
  protected readonly allowedRangeItems = allowedRangeItems;

  protected readonly selectedStart = signal<DateTime | null>(null);
  protected readonly selectedEnd = signal<DateTime | null>(null);

  protected readonly liveDemoForm = new FormGroup({
    allowRangeSelection: new FormControl<boolean>(true, { nonNullable: true }),
    allowPartialRangeSelection: new FormControl<boolean>(false, { nonNullable: true }),
    partialRangeSelectionType: new FormControl<CalendarPartialRangeSelectionType>('range', { nonNullable: true }),
    allowedDateRange: new FormControl<string>('0', { nonNullable: true }),
    enableDeselection: new FormControl<boolean>(true, { nonNullable: true }),
    showFooter: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected parseAllowedRange(raw: string): number {
    const parsed = parseInt(raw, 10);

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  protected onDateSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.selectedStart.set(event.startDate);
    this.selectedEnd.set(event.endDate);
  }

  protected onPartialTypeChange(type: CalendarPartialRangeSelectionType): void {
    this.liveDemoForm.controls.partialRangeSelectionType.setValue(type);
  }

  protected onTodayClicked(calendar: Calendar): void {
    const today = DateTime.now();
    calendar.setDisplayDate(today);
    this.selectedStart.set(today.startOf('day'));
    this.selectedEnd.set(null);
  }

  protected onCancelClicked(): void {
    this.selectedStart.set(null);
    this.selectedEnd.set(null);
  }

  protected onApplyClicked(): void {
    console.log('Apply clicked', { start: this.selectedStart(), end: this.selectedEnd() });
  }
}

@Component({
  selector: 'story-calendar-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Calendar,
    CalendarFooter,
    CalendarFooterLeftActions,
    CalendarFooterRightActions,
    Button,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <!-- Single Date Selection -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Single date selection" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar [selectedStartDate]="singleSelectedStart()" (dateSelected)="onSingleDateSelected($event)" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Click any date to select it (stored as 00:00:00)</li>
          <li>Click the same date again to deselect it</li>
          <li>Use arrow keys for keyboard navigation</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Range Selection -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Range selection" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar
            [allowRangeSelection]="true"
            [selectedStartDate]="rangeSelectedStart()"
            [selectedEndDate]="rangeSelectedEnd()"
            (dateSelected)="onRangeSelected($event)"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>First click selects start date (00:00:00)</li>
          <li>Second click selects end date (23:59:59)</li>
          <li>Hovering after the start previews the range with an animated soft fill</li>
          <li>Clicking a date before start swaps them</li>
          <li>Dates between start and end are highlighted with a continuous band</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Partial Range Selection -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Partial range selection" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [partialRangeSelectionType]="partialType()"
            [selectedStartDate]="partialSelectedStart()"
            [selectedEndDate]="partialSelectedEnd()"
            (dateSelected)="onPartialSelected($event)"
            (partialRangeSelectionTypeChange)="onPartialTypeChange($event)"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Toggle between Range, On or Before, and On or After modes</li>
          <li>Range mode behaves like the standard range selection</li>
          <li>On or Before sets only an end date</li>
          <li>On or After sets only a start date</li>
          <li>The mode is rendered as a segmented button-toggle below the header</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Disabled Dates -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Disabled dates" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar
            [disableBefore]="disabledMinDate"
            [disableAfter]="disabledMaxDate"
            [selectedStartDate]="disabledSelectedStart()"
            (dateSelected)="onDisabledSelected($event)"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Dates before the minimum or after the maximum are disabled</li>
          <li>Disabled dates have a not-allowed cursor and faint colour</li>
          <li>Disabled dates cannot be clicked or selected</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Allowed Date Range -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Allowed date range" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar
            [allowRangeSelection]="true"
            [allowedDateRange]="14"
            [selectedStartDate]="allowedRangeSelectedStart()"
            [selectedEndDate]="allowedRangeSelectedEnd()"
            (dateSelected)="onAllowedRangeSelected($event)"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>After selecting a start date, dates more than 14 days away are disabled</li>
          <li>The cap applies in both directions</li>
          <li>Once the range is fully set, the cap is no longer enforced</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- With Footer -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="With footer" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar
            #footerCalendar
            [allowRangeSelection]="true"
            [selectedStartDate]="footerSelectedStart()"
            [selectedEndDate]="footerSelectedEnd()"
            (dateSelected)="onFooterSelected($event)"
          >
            <org-calendar-footer>
              <org-calendar-footer-left-actions>
                <org-button
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  label="Today"
                  (clicked)="onFooterToday(footerCalendar)"
                />
              </org-calendar-footer-left-actions>
              <org-calendar-footer-right-actions>
                <org-button variant="ghost" color="neutral" size="sm" label="Cancel" (clicked)="onFooterCancel()" />
                <org-button variant="filled" color="primary" size="sm" label="Apply" (clicked)="onFooterApply()" />
              </org-calendar-footer-right-actions>
            </org-calendar-footer>
          </org-calendar>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Footer renders the built-in Today, Cancel, and Apply actions</li>
          <li>Today jumps to today's month and selects today</li>
          <li>Cancel clears the current selection</li>
          <li>Apply emits the apply event for the consumer to handle</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Without Deselection -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Without deselection" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar
            [enableDeselection]="false"
            [selectedStartDate]="noDeselectSelectedStart()"
            (dateSelected)="onNoDeselectSelected($event)"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Clicking the currently selected date does not clear the selection</li>
          <li>Useful when consumers auto-close the calendar on selection (e.g. date picker inputs)</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Display Month Control -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Display month control" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar #displayCalendar />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>The header has previous / next nav buttons + month and year drop-downs for direct selection</li>
          <li>Clicking a day in the previous or next month nudges the calendar to that month</li>
          <li>Use the public <code>setDisplayDate()</code> method to change the displayed month programmatically</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- Keyboard Navigation -->
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Keyboard navigation" />
        <org-design-system-demo-canvas slot="canvas">
          <org-calendar />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Arrow keys</strong>: navigate between dates</li>
          <li><strong>Page Up / Down</strong>: previous / next month</li>
          <li><strong>Home / End</strong>: first / last day of the month</li>
          <li><strong>Enter / Space</strong>: select the focused date</li>
          <li>Crossing month boundaries auto-updates the display</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <!-- States -->
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="States"
          description="Every documented day-cell state, side by side. Cells carry data attributes for each — data-today, data-selected, data-range-pos, data-outside-month — plus the standard hover / disabled / focus-visible interactions."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-row gap-4 flex-wrap">
            <div class="flex flex-col gap-2">
              <span class="text-xs">Single · today selected</span>
              <org-calendar [selectedStartDate]="todayDate" [defaultDisplayDate]="todayDate" />
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-xs">Single · today not selected</span>
              <org-calendar [selectedStartDate]="todayDate.plus({ days: 4 })" [defaultDisplayDate]="todayDate" />
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-xs">Range · built</span>
              <org-calendar
                [allowRangeSelection]="true"
                [selectedStartDate]="todayDate.minus({ days: 6 })"
                [selectedEndDate]="todayDate.plus({ days: 1 })"
                [defaultDisplayDate]="todayDate"
              />
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-xs">Disabled · before today</span>
              <org-calendar [disableBefore]="todayDate" [defaultDisplayDate]="todayDate" />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>The today cell is shown with an inset ring on the chip</li>
          <li>The selected cell paints the chip with the primary fill</li>
          <li>A built range paints the band continuously across the middle cells with mid-cell insets at endpoints</li>
          <li>Outside-month cells use a faded foreground colour</li>
          <li>Disabled cells use the not-allowed cursor and faded colour and cannot be hovered</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CalendarShowcaseStory {
  protected readonly todayDate = DateTime.now();

  // single
  protected readonly singleSelectedStart = signal<DateTime | null>(null);

  protected onSingleDateSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleSelectedStart.set(event.startDate);
  }

  // range
  protected readonly rangeSelectedStart = signal<DateTime | null>(null);
  protected readonly rangeSelectedEnd = signal<DateTime | null>(null);

  protected onRangeSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeSelectedStart.set(event.startDate);
    this.rangeSelectedEnd.set(event.endDate);
  }

  // partial
  protected readonly partialSelectedStart = signal<DateTime | null>(null);
  protected readonly partialSelectedEnd = signal<DateTime | null>(null);
  protected readonly partialType = signal<CalendarPartialRangeSelectionType>('range');

  protected onPartialSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.partialSelectedStart.set(event.startDate);
    this.partialSelectedEnd.set(event.endDate);
  }

  protected onPartialTypeChange(type: CalendarPartialRangeSelectionType): void {
    this.partialType.set(type);
  }

  // disabled dates
  protected readonly disabledMinDate = DateTime.now().minus({ days: 7 });
  protected readonly disabledMaxDate = DateTime.now().plus({ days: 14 });
  protected readonly disabledSelectedStart = signal<DateTime | null>(null);

  protected onDisabledSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.disabledSelectedStart.set(event.startDate);
  }

  // allowed range
  protected readonly allowedRangeSelectedStart = signal<DateTime | null>(null);
  protected readonly allowedRangeSelectedEnd = signal<DateTime | null>(null);

  protected onAllowedRangeSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.allowedRangeSelectedStart.set(event.startDate);
    this.allowedRangeSelectedEnd.set(event.endDate);
  }

  // footer
  protected readonly footerSelectedStart = signal<DateTime | null>(null);
  protected readonly footerSelectedEnd = signal<DateTime | null>(null);

  protected onFooterSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.footerSelectedStart.set(event.startDate);
    this.footerSelectedEnd.set(event.endDate);
  }

  protected onFooterToday(calendar: Calendar): void {
    const today = DateTime.now();
    calendar.setDisplayDate(today);
    this.footerSelectedStart.set(today.startOf('day'));
    this.footerSelectedEnd.set(null);
  }

  protected onFooterCancel(): void {
    this.footerSelectedStart.set(null);
    this.footerSelectedEnd.set(null);
  }

  protected onFooterApply(): void {
    console.log('Apply', { start: this.footerSelectedStart(), end: this.footerSelectedEnd() });
  }

  // no deselection
  protected readonly noDeselectSelectedStart = signal<DateTime | null>(null);

  protected onNoDeselectSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.noDeselectSelectedStart.set(event.startDate);
  }
}

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

  A bordered date-grid surface for date selection with single, range, and partial-range modes. Composes the
  Button (header nav), DropDownSelector (month / year picker), and ButtonToggle (partial-range switcher) core
  components, and uses a three-layer cell structure — band / chip / num — so range bands paint continuously
  while keeping endpoint chips visible.

  ### Features
  - Single date or date range selection
  - Partial range modes — range, on or before, on or after — with a segmented switcher
  - Optional drop-down month and year navigation
  - Optional footer with built-in Today, Cancel, and Apply actions
  - Keyboard navigation (arrow keys, Page Up / Down, Home / End, Enter / Space)
  - Date constraints — disable before / after, allowed range cap
  - Outside-month cells nudge the visible month on click
  - Range hover preview with an animated soft fill
  - Accessible via grid roles, aria attributes, and a live announcement region

  ### Sub-components
  - **CalendarHeader** — month / year drop-down selectors and previous / next navigation
  - **CalendarPartialRangeSelector** — segmented Range / On or Before / On or After button-toggle
  - **CalendarDates** — weekday strip and day cells
  - **CalendarFooter** — built-in actions and / or projected content
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
    allowPartialRangeSelection: false,
    partialRangeSelectionType: 'range',
    disableBefore: null,
    disableAfter: null,
    allowedDateRange: 0,
    enableDeselection: true,
    disabled: false,
    containerClass: '',
  },
  argTypes: {
    defaultDisplayDate: {
      control: false,
      description: 'Initial display date for the calendar',
    },
    startYear: {
      control: 'number',
      description: 'Earliest selectable year in the year drop-down',
    },
    endYear: {
      control: 'number',
      description: 'Latest selectable year in the year drop-down',
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
    allowPartialRangeSelection: {
      control: 'boolean',
      description: 'Enable the partial-range-selection-type segmented switcher',
    },
    partialRangeSelectionType: {
      control: 'select',
      options: ['range', 'onOrBefore', 'onOrAfter'],
      description: 'Active partial-range-selection type',
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
    disabled: {
      control: 'boolean',
      description: 'Whether the entire calendar is disabled and non-interactive',
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
    props: args,
    template: `
      <org-calendar
        [defaultDisplayDate]="defaultDisplayDate"
        [startYear]="startYear"
        [endYear]="endYear"
        [selectedStartDate]="selectedStartDate"
        [selectedEndDate]="selectedEndDate"
        [allowRangeSelection]="allowRangeSelection"
        [allowPartialRangeSelection]="allowPartialRangeSelection"
        [partialRangeSelectionType]="partialRangeSelectionType"
        [disableBefore]="disableBefore"
        [disableAfter]="disableAfter"
        [allowedDateRange]="allowedDateRange"
        [enableDeselection]="enableDeselection"
        [disabled]="disabled"
        [containerClass]="containerClass"
      />
    `,
    moduleMetadata: {
      imports: [Calendar],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive live demo with controls for every visual / behavioural input.',
      },
    },
  },
  render: () => ({
    template: '<story-calendar-live-demo />',
    moduleMetadata: {
      imports: [CalendarLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every Calendar variant axis — single / range / partial-range modes, disabled dates, allowed-range cap, deselection, footer actions, keyboard navigation, display-month control, and the full set of cell states.',
      },
    },
  },
  render: () => ({
    template: '<story-calendar-showcase />',
    moduleMetadata: {
      imports: [CalendarShowcaseStory],
    },
  }),
};

@Component({
  selector: 'story-calendar-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Calendar,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Non-Form Usage"
          description="Drive the calendar with parent-owned signals using [selectedStartDate] / [selectedEndDate] inputs and the (dateSelected) output."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-row gap-4 flex-wrap">
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold">Single mode</span>
              <org-calendar [selectedStartDate]="singleSelected()" (dateSelected)="onSingleSelected($event)" />
              <p class="text-sm">
                Selected:
                <strong>{{ singleSelected() ? singleSelected()!.toISO() : 'None' }}</strong>
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold">Range mode</span>
              <org-calendar
                [allowRangeSelection]="true"
                [selectedStartDate]="rangeStart()"
                [selectedEndDate]="rangeEnd()"
                (dateSelected)="onRangeSelected($event)"
              />
              <div class="text-sm flex flex-col gap-1">
                <div>
                  Start: <strong>{{ rangeStart() ? rangeStart()!.toISO() : 'None' }}</strong>
                </div>
                <div>
                  End: <strong>{{ rangeEnd() ? rangeEnd()!.toISO() : 'None' }}</strong>
                </div>
              </div>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Parent owns the selected start / end signals</li>
          <li>
            The <code>(dateSelected)</code> output emits an object with both <code>startDate</code> and
            <code>endDate</code>
          </li>
          <li>The host writes the emitted values back to its signals to keep state in sync</li>
          <li>This pattern works for any selection mode — single, range, or partial range</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CalendarNonFormStory {
  // single
  protected readonly singleSelected = signal<DateTime | null>(null);

  protected onSingleSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleSelected.set(event.startDate);
  }

  // range
  protected readonly rangeStart = signal<DateTime | null>(null);
  protected readonly rangeEnd = signal<DateTime | null>(null);

  protected onRangeSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeStart.set(event.startDate);
    this.rangeEnd.set(event.endDate);
  }
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Driving the calendar outside of a reactive form using [selectedStartDate] / [selectedEndDate] inputs and the (dateSelected) output. Shown for both single and range selection modes.',
      },
    },
  },
  render: () => ({
    template: '<story-calendar-non-form />',
    moduleMetadata: {
      imports: [CalendarNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-calendar-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Calendar,
    Button,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    ReactiveFormsModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive Form Integration"
          [description]="
            'Single form valid: ' +
            singleForm.valid +
            ', value: ' +
            singleFormValueDisplay() +
            ' · Range form valid: ' +
            rangeForm.valid +
            ', value: ' +
            rangeFormValueDisplay()
          "
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-row gap-4 flex-wrap">
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold">Single mode</span>
              <org-calendar
                [selectedStartDate]="singleStartDate()"
                [disabled]="singleForm.disabled"
                (dateSelected)="onSingleFormDateSelected($event)"
              />
              <div class="flex flex-row gap-2">
                <org-button
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  label="Disable"
                  (clicked)="singleForm.disable()"
                />
                <org-button variant="ghost" color="neutral" size="sm" label="Enable" (clicked)="singleForm.enable()" />
                <org-button variant="ghost" color="neutral" size="sm" label="Reset" (clicked)="singleForm.reset()" />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold">Range mode (with partial)</span>
              <org-calendar
                [allowRangeSelection]="true"
                [allowPartialRangeSelection]="true"
                [partialRangeSelectionType]="rangePartialType()"
                [selectedStartDate]="rangeStartDate()"
                [selectedEndDate]="rangeEndDate()"
                [disabled]="rangeForm.disabled"
                (dateSelected)="onRangeFormDateSelected($event)"
                (partialRangeSelectionTypeChange)="onRangePartialTypeChanged($event)"
              />
              <div class="flex flex-row gap-2">
                <org-button variant="ghost" color="neutral" size="sm" label="Disable" (clicked)="rangeForm.disable()" />
                <org-button variant="ghost" color="neutral" size="sm" label="Enable" (clicked)="rangeForm.enable()" />
                <org-button variant="ghost" color="neutral" size="sm" label="Reset" (clicked)="rangeForm.reset()" />
              </div>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            The calendar is not a <code>ControlValueAccessor</code>; the host bridges its inputs and outputs to a
            <code>FormGroup</code>
          </li>
          <li>
            Form value drives the calendar via <code>[selectedStartDate]</code> / <code>[selectedEndDate]</code> /
            <code>[partialRangeSelectionType]</code>
          </li>
          <li>
            Calendar's <code>(dateSelected)</code> and <code>(partialRangeSelectionTypeChange)</code> patch the form via
            signals derived from <code>valueChanges</code>
          </li>
          <li>
            Programmatic <code>form.disable()</code> reflects in the calendar via the <code>[disabled]</code> input —
            interaction is suppressed and the surface is dimmed
          </li>
          <li>Form values are stored as ISO strings so the form serialises cleanly for transport</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CalendarReactiveFormStory {
  // single mode form
  protected readonly singleForm = new FormGroup({
    start: new FormControl<string | null>(null),
    end: new FormControl<string | null>(null),
    partialRangeSelectionType: new FormControl<CalendarPartialRangeSelectionType>('range', { nonNullable: true }),
  });

  /** signal driven by valueChanges; subscribed to so the UI reacts to form mutations */
  private readonly _singleFormChange = toSignal(this.singleForm.valueChanges, { initialValue: null });

  protected readonly singleFormValueDisplay = toSignal(
    this.singleForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.singleForm.getRawValue()) }
  );

  protected readonly singleStartDate = computed<DateTime | null>(() => {
    // re-read when the form changes
    this._singleFormChange();

    const raw = this.singleForm.controls.start.value;

    return raw ? DateTime.fromISO(raw) : null;
  });

  // range mode form
  protected readonly rangeForm = new FormGroup({
    start: new FormControl<string | null>(null),
    end: new FormControl<string | null>(null),
    partialRangeSelectionType: new FormControl<CalendarPartialRangeSelectionType>('range', { nonNullable: true }),
  });

  /** signal driven by valueChanges; subscribed to so the UI reacts to form mutations */
  private readonly _rangeFormChange = toSignal(this.rangeForm.valueChanges, { initialValue: null });

  protected readonly rangeFormValueDisplay = toSignal(
    this.rangeForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.rangeForm.getRawValue()) }
  );

  protected readonly rangeStartDate = computed<DateTime | null>(() => {
    this._rangeFormChange();

    const raw = this.rangeForm.controls.start.value;

    return raw ? DateTime.fromISO(raw) : null;
  });

  protected readonly rangeEndDate = computed<DateTime | null>(() => {
    this._rangeFormChange();

    const raw = this.rangeForm.controls.end.value;

    return raw ? DateTime.fromISO(raw) : null;
  });

  protected readonly rangePartialType = computed<CalendarPartialRangeSelectionType>(() => {
    this._rangeFormChange();

    return this.rangeForm.controls.partialRangeSelectionType.value;
  });

  protected onSingleFormDateSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleForm.patchValue({
      start: event.startDate?.toISO() ?? null,
      end: event.endDate?.toISO() ?? null,
    });
  }

  protected onRangeFormDateSelected(event: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeForm.patchValue({
      start: event.startDate?.toISO() ?? null,
      end: event.endDate?.toISO() ?? null,
    });
  }

  protected onRangePartialTypeChanged(type: CalendarPartialRangeSelectionType): void {
    this.rangeForm.patchValue({ partialRangeSelectionType: type });
  }
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Bridging the calendar to Angular reactive forms. The calendar is not itself a ControlValueAccessor (it has multiple value axes — start, end, partial-range type), so the host pattern is: form value drives the calendar inputs, the calendar outputs patch the form. The example also demonstrates that programmatic form.disable() reflects in the calendar via the [disabled] input.',
      },
    },
  },
  render: () => ({
    template: '<story-calendar-reactive-form />',
    moduleMetadata: {
      imports: [CalendarReactiveFormStory],
    },
  }),
};

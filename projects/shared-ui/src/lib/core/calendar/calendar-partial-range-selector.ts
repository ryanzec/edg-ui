import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { Calendar } from './calendar';

/**
 * the items rendered in the partial-range-selection-type button toggle; values match
 * `CalendarPartialRangeSelectionType` exactly
 */
const PARTIAL_RANGE_SELECTOR_ITEMS: ButtonToggleItem[] = [
  { value: 'range', label: 'Range', buttonColor: 'primary' },
  { value: 'onOrBefore', label: 'On or Before', buttonColor: 'primary' },
  { value: 'onOrAfter', label: 'On or After', buttonColor: 'primary' },
];

/**
 * partial range selection type segmented control for the calendar component
 */
@Component({
  selector: 'org-calendar-partial-range-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonToggle],
  templateUrl: './calendar-partial-range-selector.html',
  styleUrl: './calendar-partial-range-selector.css',
})
export class CalendarPartialRangeSelector {
  /**
   * reference to the parent calendar for shared state and handlers
   */
  protected readonly calendarComponent = inject(Calendar);

  /** the items rendered as buttons in the partial-range-selection-type toggle */
  protected readonly items = PARTIAL_RANGE_SELECTOR_ITEMS;
}

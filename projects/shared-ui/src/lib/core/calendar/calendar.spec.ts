import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { Calendar } from './calendar';
import { CalendarFooter } from './calendar-footer';
import { CalendarFooterLeftActions } from './calendar-footer-left-actions';
import { CalendarFooterRightActions } from './calendar-footer-right-actions';
import { CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT, type CalendarPartialRangeSelectionType } from './calendar-brain';

// the brain reads its initial state from its own default input value because signal-based inputs are not bound
// at construction time. anchoring assertions to that default keeps every assertion stable.
const ANCHOR = CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT.set({ day: 15 });

describe('Calendar', () => {
  describe('default host attributes', () => {
    @Component({
      selector: 'test-calendar-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Calendar],
      template: `<org-calendar data-testid="calendar" />`,
    })
    class CalendarDefaultsHost {}

    let fixture: ComponentFixture<CalendarDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default partial-range-selection-type host attribute', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-partial-range-selection-type')).toBe('range');
    });

    it('omits the boolean host attributes by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-allow-range-selection')).toBeNull();
      expect(host.getAttribute('data-allow-partial-range-selection')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects enableDeselection as an empty-string attribute by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-enable-deselection')).toBe('');
    });

    it('uses tabindex 0 on the container by default', () => {
      const container = fixture.nativeElement.querySelector('.container') as HTMLDivElement;

      expect(container.getAttribute('tabindex')).toBe('0');
    });

    it('renders the live announcement region', () => {
      const live = fixture.nativeElement.querySelector('[aria-live="polite"]');

      expect(live).not.toBeNull();
      expect(live?.getAttribute('aria-atomic')).toBe('true');
    });
  });

  describe('host attributes driven by inputs', () => {
    @Component({
      selector: 'test-calendar-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Calendar],
      template: `
        <org-calendar
          [allowRangeSelection]="allowRangeSelection()"
          [allowPartialRangeSelection]="allowPartialRangeSelection()"
          [partialRangeSelectionType]="partialRangeSelectionType()"
          [enableDeselection]="enableDeselection()"
          [disabled]="disabled()"
          [containerClass]="containerClass()"
          data-testid="calendar"
        />
      `,
    })
    class CalendarAttrsHost {
      public readonly allowRangeSelection = signal<boolean>(true);
      public readonly allowPartialRangeSelection = signal<boolean>(true);
      public readonly partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('onOrAfter');
      public readonly enableDeselection = signal<boolean>(false);
      public readonly disabled = signal<boolean>(false);
      public readonly containerClass = signal<string>('');
    }

    let fixture: ComponentFixture<CalendarAttrsHost>;
    let component: CalendarAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects allowRangeSelection and allowPartialRangeSelection as empty-string attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-allow-range-selection')).toBe('');
      expect(host.getAttribute('data-allow-partial-range-selection')).toBe('');
    });

    it('reflects partialRangeSelectionType verbatim', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-partial-range-selection-type')).toBe('onOrAfter');
    });

    it('omits data-enable-deselection when the input is false', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-enable-deselection')).toBeNull();
    });

    it('applies data-disabled and aria-disabled when disabled becomes true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="calendar"]') as HTMLElement;

      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets the container tabindex to -1 when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const container = fixture.nativeElement.querySelector('.container') as HTMLDivElement;

      expect(container.getAttribute('tabindex')).toBe('-1');
    });

    it('applies the containerClass to the container element', async () => {
      component.containerClass.set('custom-container');
      fixture.detectChanges();
      await fixture.whenStable();

      const container = fixture.nativeElement.querySelector('.container') as HTMLDivElement;

      expect(container.classList.contains('custom-container')).toBe(true);
    });
  });

  describe('dateSelected output', () => {
    @Component({
      selector: 'test-calendar-output-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Calendar],
      template: `<org-calendar (dateSelected)="onDateSelected($event)" data-testid="calendar" />`,
    })
    class CalendarOutputHost {
      public onDateSelected = vi.fn();
    }

    let fixture: ComponentFixture<CalendarOutputHost>;
    let component: CalendarOutputHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarOutputHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarOutputHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits dateSelected to the parent listener when a date cell is clicked', () => {
      const dayCells = fixture.nativeElement.querySelectorAll(
        '[data-testid="calendar"] .day'
      ) as NodeListOf<HTMLButtonElement>;
      const inMonthCell = Array.from(dayCells).find((cell) => cell.getAttribute('data-outside-month') === null);
      inMonthCell?.click();

      expect(component.onDateSelected).toHaveBeenCalledTimes(1);
      const payload = component.onDateSelected.mock.calls[0][0];
      expect(payload.startDate).toBeTruthy();
    });
  });

  describe('public api delegation', () => {
    @Component({
      selector: 'test-calendar-api-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Calendar],
      template: `<org-calendar data-testid="calendar" />`,
    })
    class CalendarApiHost {}

    let fixture: ComponentFixture<CalendarApiHost>;
    let calendar: Calendar;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarApiHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarApiHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const debug = fixture.debugElement.query((node) => node.componentInstance instanceof Calendar);
      calendar = debug.componentInstance as Calendar;
    });

    it('exposes brain state via proxied computed signals', () => {
      expect(calendar.displayYear()).toBe(ANCHOR.year);
      expect(calendar.displayMonth()).toBe(ANCHOR.month);
      expect(calendar.focusedDate()).not.toBeNull();
    });

    it('delegates setDisplayDate to the brain', () => {
      calendar.setDisplayDate(DateTime.local(2025, 11, 1));

      expect(calendar.displayYear()).toBe(2025);
      expect(calendar.displayMonth()).toBe(11);
    });

    it('delegates onNextMonth to the brain', () => {
      const expected = DateTime.local(calendar.displayYear(), calendar.displayMonth(), 1).plus({ months: 1 });

      calendar.onNextMonth();

      expect(calendar.displayMonth()).toBe(expected.month);
      expect(calendar.displayYear()).toBe(expected.year);
    });

    it('delegates onPreviousMonth to the brain', () => {
      const expected = DateTime.local(calendar.displayYear(), calendar.displayMonth(), 1).minus({ months: 1 });

      calendar.onPreviousMonth();

      expect(calendar.displayMonth()).toBe(expected.month);
      expect(calendar.displayYear()).toBe(expected.year);
    });

    it('delegates onYearChange to the brain', () => {
      calendar.onYearChange(2027);

      expect(calendar.displayYear()).toBe(2027);
    });

    it('delegates onMonthChange to the brain', () => {
      const targetMonth = calendar.displayMonth() === 1 ? 12 : 1;

      calendar.onMonthChange(targetMonth);

      expect(calendar.displayMonth()).toBe(targetMonth);
    });

    it('refocuses the container when the brain requests it', async () => {
      const container = fixture.nativeElement.querySelector('.container') as HTMLDivElement;
      const focusSpy = vi.spyOn(container, 'focus');

      // place focus on the first day of the visible month so ArrowLeft crosses the month boundary
      const firstOfMonth = DateTime.local(calendar.displayYear(), calendar.displayMonth(), 1);
      const firstCell = calendar
        .calendarDates()
        .flat()
        .find((cell) => cell.date.hasSame(firstOfMonth, 'day'));

      expect(firstCell).toBeDefined();
      calendar.onDateHover(firstCell!);
      fixture.detectChanges();
      await fixture.whenStable();

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(focusSpy).toHaveBeenCalled();
    });
  });
});

describe('CalendarDates', () => {
  @Component({
    selector: 'test-calendar-dates-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Calendar],
    template: `
      <org-calendar
        [selectedStartDate]="selectedStartDate()"
        [disabled]="disabled()"
        (dateSelected)="onDateSelected($event)"
        data-testid="calendar"
      />
    `,
  })
  class CalendarDatesHost {
    public readonly selectedStartDate = signal<DateTime | null | undefined>(undefined);
    public readonly disabled = signal<boolean>(false);
    public onDateSelected = vi.fn();
  }

  let fixture: ComponentFixture<CalendarDatesHost>;
  let component: CalendarDatesHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDatesHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarDatesHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the weekday label strip with 7 entries', () => {
    const weekdays = fixture.nativeElement.querySelectorAll(
      '[data-testid="calendar"] .weekdays .weekday'
    ) as NodeListOf<HTMLElement>;

    expect(weekdays.length).toBe(7);
  });

  it('renders an sr-only row with full accessible weekday names', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '[data-testid="calendar"] [role="row"].sr-only [role="columnheader"]'
    ) as NodeListOf<HTMLElement>;

    expect(headers.length).toBe(7);
    expect(headers[0].textContent?.trim()).toBe('Sunday');
    expect(headers[6].textContent?.trim()).toBe('Saturday');
  });

  it('renders one button per date cell with day number content', () => {
    const cells = fixture.nativeElement.querySelectorAll(
      '[data-testid="calendar"] .day'
    ) as NodeListOf<HTMLButtonElement>;

    expect(cells.length).toBeGreaterThanOrEqual(28);
    cells.forEach((cell) => {
      const num = cell.querySelector('.day-num') as HTMLSpanElement;
      expect(num.textContent?.trim()).toMatch(/^\d+$/);
    });
  });

  it("applies aria-current=date to today's cell only", () => {
    const todayCell = fixture.nativeElement.querySelector(
      '[data-testid="calendar"] [data-today]'
    ) as HTMLButtonElement | null;
    const otherCell = fixture.nativeElement.querySelector(
      '[data-testid="calendar"] .day:not([data-today])'
    ) as HTMLButtonElement;

    if (todayCell) {
      expect(todayCell.getAttribute('aria-current')).toBe('date');
    }

    expect(otherCell.getAttribute('aria-current')).toBeNull();
  });

  it('marks spillover dates with data-outside-month', () => {
    const outsideCell = fixture.nativeElement.querySelector(
      '[data-testid="calendar"] .day[data-outside-month]'
    ) as HTMLButtonElement;

    expect(outsideCell).not.toBeNull();
  });

  it('emits dateSelected when a date cell is clicked', () => {
    const dayCells = fixture.nativeElement.querySelectorAll(
      '[data-testid="calendar"] .day'
    ) as NodeListOf<HTMLButtonElement>;
    const inMonthCell = Array.from(dayCells).find((cell) => cell.getAttribute('data-outside-month') === null);

    inMonthCell?.click();

    expect(component.onDateSelected).toHaveBeenCalledTimes(1);
  });

  it('does not emit dateSelected when the calendar is disabled', async () => {
    component.disabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const dayCells = fixture.nativeElement.querySelectorAll(
      '[data-testid="calendar"] .day'
    ) as NodeListOf<HTMLButtonElement>;
    const inMonthCell = Array.from(dayCells).find((cell) => cell.getAttribute('data-outside-month') === null);
    inMonthCell?.click();

    expect(component.onDateSelected).not.toHaveBeenCalled();
  });

  it('reflects aria-selected and data-selected on the cell matching selectedStartDate', async () => {
    component.selectedStartDate.set(ANCHOR.set({ day: 10 }));
    fixture.detectChanges();
    await fixture.whenStable();

    const dayCells = fixture.nativeElement.querySelectorAll(
      '[data-testid="calendar"] .day'
    ) as NodeListOf<HTMLButtonElement>;
    const matching = Array.from(dayCells).find((cell) => cell.getAttribute('aria-selected') === 'true');

    expect(matching).toBeDefined();
    expect(matching!.getAttribute('data-selected')).toBe('');
  });
});

describe('CalendarHeader', () => {
  @Component({
    selector: 'test-calendar-header-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Calendar],
    template: `<org-calendar (displayMonthChanged)="onDisplayMonthChanged($event)" data-testid="calendar" />`,
  })
  class CalendarHeaderHost {
    public onDisplayMonthChanged = vi.fn();
  }

  let fixture: ComponentFixture<CalendarHeaderHost>;
  let component: CalendarHeaderHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHeaderHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarHeaderHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders a previous and next button with accessible labels', () => {
    const previous = fixture.nativeElement.querySelector('org-calendar-header org-button[ariaLabel="Previous month"]');
    const next = fixture.nativeElement.querySelector('org-calendar-header org-button[ariaLabel="Next month"]');

    expect(previous).not.toBeNull();
    expect(next).not.toBeNull();
  });

  it('renders month and year drop-down selectors', () => {
    const selectors = fixture.nativeElement.querySelectorAll('org-calendar-header org-drop-down-selector');

    expect(selectors.length).toBe(2);
  });

  it('emits displayMonthChanged when the previous-month button is clicked', () => {
    const expected = ANCHOR.startOf('month').minus({ months: 1 });
    const previousButton = fixture.nativeElement.querySelector(
      'org-calendar-header org-button[ariaLabel="Previous month"] button'
    ) as HTMLButtonElement;

    previousButton.click();

    expect(component.onDisplayMonthChanged).toHaveBeenCalledWith(
      expect.objectContaining({ currentMonth: expected.month, previousMonth: ANCHOR.month })
    );
  });

  it('emits displayMonthChanged when the next-month button is clicked', () => {
    const expected = ANCHOR.startOf('month').plus({ months: 1 });
    const nextButton = fixture.nativeElement.querySelector(
      'org-calendar-header org-button[ariaLabel="Next month"] button'
    ) as HTMLButtonElement;

    nextButton.click();

    expect(component.onDisplayMonthChanged).toHaveBeenCalledWith(
      expect.objectContaining({ currentMonth: expected.month, previousMonth: ANCHOR.month })
    );
  });
});

describe('CalendarPartialRangeSelector', () => {
  @Component({
    selector: 'test-calendar-partial-range-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Calendar],
    template: `
      <org-calendar
        [allowRangeSelection]="allowRangeSelection()"
        [allowPartialRangeSelection]="allowPartialRangeSelection()"
        data-testid="calendar"
      />
    `,
  })
  class CalendarPartialRangeHost {
    public readonly allowRangeSelection = signal<boolean>(false);
    public readonly allowPartialRangeSelection = signal<boolean>(false);
  }

  let fixture: ComponentFixture<CalendarPartialRangeHost>;
  let component: CalendarPartialRangeHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPartialRangeHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPartialRangeHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('does not render the button toggle when range selection is disabled', () => {
    const toggle = fixture.nativeElement.querySelector('org-calendar-partial-range-selector org-button-toggle');

    expect(toggle).toBeNull();
  });

  it('does not render the button toggle when only partial-range is enabled', async () => {
    component.allowPartialRangeSelection.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector('org-calendar-partial-range-selector org-button-toggle');

    expect(toggle).toBeNull();
  });

  it('renders the button toggle when both range and partial-range are enabled', async () => {
    component.allowRangeSelection.set(true);
    component.allowPartialRangeSelection.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector('org-calendar-partial-range-selector org-button-toggle');

    expect(toggle).not.toBeNull();
  });
});

describe('CalendarFooter', () => {
  describe('container class', () => {
    @Component({
      selector: 'test-calendar-footer-class-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CalendarFooter],
      template: `<org-calendar-footer [containerClass]="containerClass()" data-testid="footer" />`,
    })
    class CalendarFooterClassHost {
      public readonly containerClass = signal<string>('extra-class');
    }

    it('applies the containerClass to the footer element', async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarFooterClassHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(CalendarFooterClassHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const footer = fixture.nativeElement.querySelector('[data-testid="footer"] .footer') as HTMLElement;

      expect(footer.classList.contains('extra-class')).toBe(true);
    });
  });

  describe('projection slots', () => {
    @Component({
      selector: 'test-calendar-footer-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CalendarFooter, CalendarFooterLeftActions, CalendarFooterRightActions],
      template: `
        <org-calendar-footer data-testid="footer">
          <org-calendar-footer-left-actions>
            <span data-testid="left-projected">left</span>
          </org-calendar-footer-left-actions>
          <org-calendar-footer-right-actions>
            <span data-testid="right-projected">right</span>
          </org-calendar-footer-right-actions>
        </org-calendar-footer>
      `,
    })
    class CalendarFooterProjectionHost {}

    let fixture: ComponentFixture<CalendarFooterProjectionHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarFooterProjectionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarFooterProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('projects the left actions content into the left slot', () => {
      const leftSlot = fixture.nativeElement.querySelector('[data-testid="footer"] .actions-left') as HTMLElement;

      expect(leftSlot.querySelector('[data-testid="left-projected"]')).not.toBeNull();
    });

    it('projects the right actions content into the right slot', () => {
      const rightSlot = fixture.nativeElement.querySelector('[data-testid="footer"] .actions-right') as HTMLElement;

      expect(rightSlot.querySelector('[data-testid="right-projected"]')).not.toBeNull();
    });
  });
});

describe('CalendarFooterLeftActions', () => {
  @Component({
    selector: 'test-calendar-footer-left-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CalendarFooterLeftActions],
    template: `
      <org-calendar-footer-left-actions data-testid="left-actions">
        <span data-testid="projected">projected</span>
      </org-calendar-footer-left-actions>
    `,
  })
  class CalendarFooterLeftHost {}

  it('projects child content via <ng-content />', async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarFooterLeftHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(CalendarFooterLeftHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="left-actions"]') as HTMLElement;

    expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
  });
});

describe('CalendarFooterRightActions', () => {
  @Component({
    selector: 'test-calendar-footer-right-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CalendarFooterRightActions],
    template: `
      <org-calendar-footer-right-actions data-testid="right-actions">
        <span data-testid="projected">projected</span>
      </org-calendar-footer-right-actions>
    `,
  })
  class CalendarFooterRightHost {}

  it('projects child content via <ng-content />', async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarFooterRightHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(CalendarFooterRightHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="right-actions"]') as HTMLElement;

    expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
  });
});

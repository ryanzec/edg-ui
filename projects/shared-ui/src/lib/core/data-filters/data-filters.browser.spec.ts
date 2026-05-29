import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { DataFilters } from './data-filters';
import type { DataFilter, DataFiltersValue } from './data-filters-types';

const MIXED_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: '' },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: false },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: [],
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
    ],
  },
];

const SEARCH_ONLY_FILTERS: DataFilter[] = [{ type: 'text', name: 'search', label: 'Search', defaultValue: '' }];

const MIXED_PLUS_EMAIL_FILTERS: DataFilter[] = [
  ...MIXED_FILTERS,
  { type: 'text', name: 'email', label: 'Email', defaultValue: '' },
];

const ALL_BASE_FILTER_NAMES = MIXED_FILTERS.map((filter) => filter.name);

@Component({
  selector: 'test-data-filters-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataFilters],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .filters-wrapper {
        width: 32rem;
      }
    `,
  ],
  template: `
    <div class="filters-wrapper">
      <org-data-filters
        data-testid="data-filters"
        [availableFilters]="availableFilters()"
        [(activeFilters)]="activeFilters"
        (filtersChanged)="onFiltersChanged($event)"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-available-mixed" (click)="setAvailableMixed()">available-mixed</button>
      <button type="button" data-testid="ctl-available-search-only" (click)="setAvailableSearchOnly()">
        available-search-only
      </button>
      <button type="button" data-testid="ctl-available-mixed-plus-email" (click)="setAvailableMixedPlusEmail()">
        available-mixed-plus-email
      </button>
      <button type="button" data-testid="ctl-active-all" (click)="setActiveAll()">active-all</button>
      <button type="button" data-testid="ctl-active-search-only" (click)="setActiveSearchOnly()">
        active-search-only
      </button>
      <button type="button" data-testid="ctl-active-empty" (click)="setActiveEmpty()">active-empty</button>
      <button type="button" data-testid="ctl-active-reversed" (click)="setActiveReversed()">active-reversed</button>
      <button type="button" data-testid="ctl-active-search-isactive" (click)="setActiveSearchAndIsActive()">
        active-search-isactive
      </button>
      <button type="button" data-testid="ctl-active-search-with-email" (click)="setActiveSearchWithEmail()">
        active-search-with-email
      </button>
      <button type="button" data-testid="ctl-clear-events" (click)="clearEvents()">clear-events</button>
    </div>
  `,
})
class DataFiltersHost {
  public readonly availableFilters = signal<DataFilter[]>(MIXED_FILTERS);
  public readonly activeFilters = signal<string[]>(ALL_BASE_FILTER_NAMES);

  private readonly _events = signal<DataFiltersValue[]>([]);

  protected readout(): string {
    const events = this._events();
    const lastEvent = events[events.length - 1] ?? null;

    return [
      `eventCount=${events.length}`,
      `lastPayload=${lastEvent ? JSON.stringify(lastEvent) : 'none'}`,
      `active=${JSON.stringify(this.activeFilters())}`,
    ].join(' ');
  }

  protected onFiltersChanged(value: DataFiltersValue): void {
    this._events.update((current) => [...current, value]);
  }

  protected setAvailableMixed(): void {
    this.availableFilters.set(MIXED_FILTERS);
  }

  protected setAvailableSearchOnly(): void {
    this.availableFilters.set(SEARCH_ONLY_FILTERS);
  }

  protected setAvailableMixedPlusEmail(): void {
    this.availableFilters.set(MIXED_PLUS_EMAIL_FILTERS);
  }

  protected setActiveAll(): void {
    this.activeFilters.set(ALL_BASE_FILTER_NAMES);
  }

  protected setActiveSearchOnly(): void {
    this.activeFilters.set(['search']);
  }

  protected setActiveEmpty(): void {
    this.activeFilters.set([]);
  }

  protected setActiveReversed(): void {
    this.activeFilters.set(['role', 'search', 'isActive']);
  }

  protected setActiveSearchAndIsActive(): void {
    this.activeFilters.set(['search', 'isActive']);
  }

  protected setActiveSearchWithEmail(): void {
    this.activeFilters.set(['search', 'email']);
  }

  protected clearEvents(): void {
    this._events.set([]);
  }
}

/** queries the open overlay menu rendered to document.body when the Add Filter trigger is clicked. */
const queryAddFilterMenu = (): HTMLElement | null => document.body.querySelector('org-overlay-menu');

/** returns the labels for the items currently rendered in the open Add Filter overlay menu. */
const getAddFilterMenuLabels = (panel: HTMLElement): string[] => {
  const buttons = panel.querySelectorAll('button.menu-item-button');

  return Array.from(buttons).map((button) => button.textContent?.trim() ?? '');
};

describe('DataFilters (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createDataFilters = (): ComponentFixture<DataFiltersHost> => createFixture(DataFiltersHost);

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    document.querySelectorAll('org-overlay-menu').forEach((el) => el.remove());
    document.querySelectorAll('.org-combobox-overlay').forEach((el) => el.remove());
  });

  describe('rendering by filter type', () => {
    it('renders a text input for a text filter', async () => {
      const fixture = createDataFilters();
      const dataFilters = queryByTestId(fixture, 'data-filters');

      await waitFor(() => {
        const textHosts = dataFilters.querySelectorAll('[data-testid="data-filter-text"]');

        expect(textHosts.length).toBe(1);
        expect(textHosts[0].querySelector('input.native')).not.toBeNull();
      });
    });

    it('renders a checkbox toggle for a toggle filter', async () => {
      const fixture = createDataFilters();
      const dataFilters = queryByTestId(fixture, 'data-filters');

      await waitFor(() => {
        const toggleHosts = dataFilters.querySelectorAll('[data-testid="data-filter-toggle"]');

        expect(toggleHosts.length).toBe(1);
        expect(toggleHosts[0].querySelector('input[type="checkbox"]')).not.toBeNull();
      });
    });

    it('renders a combobox for an array filter', async () => {
      const fixture = createDataFilters();
      const dataFilters = queryByTestId(fixture, 'data-filters');

      await waitFor(() => {
        const arrayHosts = dataFilters.querySelectorAll('[data-testid="data-filter-array"]');

        expect(arrayHosts.length).toBe(1);
        expect(arrayHosts[0].querySelector('input.native')).not.toBeNull();
      });
    });
  });

  describe('activeFilters-driven rendering', () => {
    it('only renders filters in the active filters set', async () => {
      const fixture = createDataFilters();

      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-only'));

      await waitFor(() => {
        const host = fixture.nativeElement as HTMLElement;

        expect(host.querySelectorAll('[data-testid="data-filter-text"]').length).toBe(1);
        expect(host.querySelectorAll('[data-testid="data-filter-toggle"]').length).toBe(0);
        expect(host.querySelectorAll('[data-testid="data-filter-array"]').length).toBe(0);
      });
    });

    it('renders nothing when activeFilters is empty', async () => {
      const fixture = createDataFilters();

      await userEvent.click(queryByTestId(fixture, 'ctl-active-empty'));

      await waitFor(() => {
        const host = fixture.nativeElement as HTMLElement;

        expect(host.querySelectorAll('[data-testid="data-filter-text"]').length).toBe(0);
        expect(host.querySelectorAll('[data-testid="data-filter-toggle"]').length).toBe(0);
        expect(host.querySelectorAll('[data-testid="data-filter-array"]').length).toBe(0);
      });
    });

    it('renders in available-filters order regardless of active-filters order', async () => {
      const fixture = createDataFilters();

      await userEvent.click(queryByTestId(fixture, 'ctl-active-reversed'));

      await waitFor(() => {
        const dataFiltersHost = queryByTestId(fixture, 'data-filters');
        const rows = dataFiltersHost.querySelectorAll('.filter-row');

        expect(rows.length).toBe(3);
        expect(rows[0].querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
        expect(rows[1].querySelector('[data-testid="data-filter-toggle"]')).not.toBeNull();
        expect(rows[2].querySelector('[data-testid="data-filter-array"]')).not.toBeNull();
      });
    });
  });

  describe('initial emission', () => {
    it('does not emit filtersChanged on initial render', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      // wait for the component to fully render so any latent emission would have surfaced
      await waitFor(() => {
        const host = fixture.nativeElement as HTMLElement;

        expect(host.querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
        expect(host.querySelector('[data-testid="data-filter-toggle"]')).not.toBeNull();
        expect(host.querySelector('[data-testid="data-filter-array"]')).not.toBeNull();
      });

      expect(readout.textContent).toContain('eventCount=0');
    });
  });

  describe('text debounce', () => {
    it('debounces text filter emission by 250ms', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      const textHost = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="data-filter-text"]'
      ) as HTMLElement;
      const textInput = textHost.querySelector('input.native') as HTMLInputElement;

      await userEvent.type(textInput, 'alice');

      // immediately after typing the debounce has not elapsed yet
      expect(readout.textContent).toContain('eventCount=0');

      // within the debounce window it fires once with the typed value
      await waitFor(() => {
        expect(readout.textContent).toContain('eventCount=1');
        expect(readout.textContent).toContain('"search":"alice"');
      });
    });
  });

  describe('immediate emission', () => {
    it('emits synchronously when toggle changes', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-toggle"]')
        ).not.toBeNull();
      });

      const toggleHost = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="data-filter-toggle"]'
      ) as HTMLElement;
      const toggleLabel = toggleHost.querySelector('.checkbox-toggle-label') as HTMLElement;

      await userEvent.click(toggleLabel);

      await waitFor(() => {
        expect(readout.textContent).toContain('eventCount=1');
        expect(readout.textContent).toContain('"isActive":true');
      });
    });

    it('emits synchronously when array selection changes', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-array"]')
        ).not.toBeNull();
      });

      const arrayHost = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="data-filter-array"]'
      ) as HTMLElement;

      // park the cursor before opening so a stray mouseenter does not corrupt option focus
      await vitestBrowserUtils.focusInput(arrayHost, 'input.native');

      await waitFor(() => expect(document.body.querySelector('.org-combobox-overlay')).not.toBeNull());

      const overlay = document.body.querySelector('.org-combobox-overlay') as HTMLElement;
      const adminOption = overlay.querySelector('[data-option-value="admin"]') as HTMLElement;

      await userEvent.click(adminOption);

      await waitFor(() => {
        expect(readout.textContent).toContain('eventCount=1');
        expect(readout.textContent).toContain('"role":["admin"]');
      });
    });
  });

  describe('distinct emission', () => {
    it('does not emit twice for the same value', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      const searchHost = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="data-filter-text"]'
      ) as HTMLElement;
      const searchInput = searchHost.querySelector('input.native') as HTMLInputElement;

      // type 'a' and let the debounce settle → emission #1 with search='a'
      await userEvent.type(searchInput, 'a');
      await waitFor(() => expect(readout.textContent).toContain('eventCount=1'));

      // type 'b' then immediately delete it so the post-debounce value is 'a' again — identical to
      // the previous emission; distinctUntilChanged must suppress a second event even though
      // valueChanges fired twice
      await userEvent.type(searchInput, 'b{Backspace}');

      // wait past the 250ms debounce window and verify eventCount stays at 1
      await new Promise((resolve) => setTimeout(resolve, 400));
      expect(readout.textContent).toContain('eventCount=1');
    });
  });

  describe('dynamic availableFilters', () => {
    it('removes the input when a filter is removed from availableFilters', async () => {
      const fixture = createDataFilters();

      await waitFor(() => {
        const host = fixture.nativeElement as HTMLElement;

        expect(host.querySelector('[data-testid="data-filter-toggle"]')).not.toBeNull();
        expect(host.querySelector('[data-testid="data-filter-array"]')).not.toBeNull();
      });

      await userEvent.click(queryByTestId(fixture, 'ctl-available-search-only'));
      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-only'));

      await waitFor(() => {
        const host = fixture.nativeElement as HTMLElement;

        expect(host.querySelectorAll('[data-testid="data-filter-text"]').length).toBe(1);
        expect(host.querySelectorAll('[data-testid="data-filter-toggle"]').length).toBe(0);
        expect(host.querySelectorAll('[data-testid="data-filter-array"]').length).toBe(0);
      });
    });

    it('renders an interactive input when a filter is added to availableFilters and activeFilters', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(queryByTestId(fixture, 'ctl-available-mixed-plus-email'));
      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-with-email'));

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-text"]').length).toBe(
          2
        );
      });

      await userEvent.click(queryByTestId(fixture, 'ctl-clear-events'));

      const textHosts = (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-text"]');
      const emailHost = textHosts[1] as HTMLElement;
      const emailInput = emailHost.querySelector('input.native') as HTMLInputElement;

      await userEvent.type(emailInput, 'a@b');

      await waitFor(() => {
        expect(readout.textContent).toContain('eventCount=1');
        expect(readout.textContent).toContain('"email":"a@b"');
      });
    });
  });

  describe('remove via X button', () => {
    it('removes a filter from the active set when X is clicked', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      const removeSearchButton = (fixture.nativeElement as HTMLElement).querySelector(
        '[aria-label="Remove Search filter"]'
      ) as HTMLElement;

      await userEvent.click(removeSearchButton);

      await waitFor(() => {
        const host = fixture.nativeElement as HTMLElement;

        expect(host.querySelectorAll('[data-testid="data-filter-text"]').length).toBe(0);
        expect(readout.textContent).toContain('active=["isActive","role"]');
      });
    });
  });

  describe('Add Filter menu', () => {
    it('shows only inactive filters in the menu', async () => {
      const fixture = createDataFilters();

      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-only'));

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filters-add-filter-trigger"]')
        ).not.toBeNull();
      });

      await userEvent.click(queryByTestId(fixture, 'data-filters-add-filter-trigger'));

      await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

      const panel = queryAddFilterMenu() as HTMLElement;

      await waitFor(() => {
        expect(getAddFilterMenuLabels(panel)).toEqual(['Active only', 'Role']);
      });
    });

    it('hides the add filter button when every filter is active', async () => {
      const fixture = createDataFilters();

      // defaults to all three active — add filter button must not render
      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      await flush(fixture);

      expect(
        (fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filters-add-filter-trigger"]')
      ).toBeNull();
    });

    it('shows the add filter button when at least one filter is inactive', async () => {
      const fixture = createDataFilters();

      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-only'));

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filters-add-filter-trigger"]')
        ).not.toBeNull();
      });
    });

    it('renders the filter input when a filter is added via the menu', async () => {
      const fixture = createDataFilters();

      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-only'));

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-toggle"]').length
        ).toBe(0);
      });

      await userEvent.click(queryByTestId(fixture, 'data-filters-add-filter-trigger'));

      await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

      const panel = queryAddFilterMenu() as HTMLElement;
      const activeOnlyItem = Array.from(panel.querySelectorAll('button.menu-item-button')).find(
        (button) => button.textContent?.trim() === 'Active only'
      ) as HTMLElement;

      await userEvent.click(activeOnlyItem);

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-toggle"]').length
        ).toBe(1);
      });
    });
  });

  describe('filtersChanged on activeFilters change', () => {
    it('emits payload with only active filter values when activeFilters change', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      await userEvent.click(queryByTestId(fixture, 'ctl-clear-events'));
      await userEvent.click(queryByTestId(fixture, 'ctl-active-search-only'));

      await waitFor(() => {
        expect(readout.textContent).toContain('eventCount=1');
        expect(readout.textContent).toContain('lastPayload={"search":""}');
      });
    });

    it('resets a removed filter to its default when re-added', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      const searchHost = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="data-filter-text"]'
      ) as HTMLElement;
      const searchInput = searchHost.querySelector('input.native') as HTMLInputElement;

      await userEvent.type(searchInput, 'alice');
      await waitFor(() => expect(readout.textContent).toContain('"search":"alice"'));

      const removeSearchButton = (fixture.nativeElement as HTMLElement).querySelector(
        '[aria-label="Remove Search filter"]'
      ) as HTMLElement;

      await userEvent.click(removeSearchButton);

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-text"]').length).toBe(
          0
        );
      });

      await userEvent.click(queryByTestId(fixture, 'data-filters-add-filter-trigger'));

      await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

      const panel = queryAddFilterMenu() as HTMLElement;
      const searchMenuItem = Array.from(panel.querySelectorAll('button.menu-item-button')).find(
        (button) => button.textContent?.trim() === 'Search'
      ) as HTMLElement;

      await userEvent.click(searchMenuItem);

      await waitFor(() => {
        const reRenderedSearchHost = (fixture.nativeElement as HTMLElement).querySelector(
          '[data-testid="data-filter-text"]'
        );

        expect(reRenderedSearchHost).not.toBeNull();

        const reRenderedSearchInput = reRenderedSearchHost?.querySelector('input.native') as HTMLInputElement;

        expect(reRenderedSearchInput.value).toBe('');
      });
    });

    it('preserves other filter values when a sibling filter is added', async () => {
      const fixture = createDataFilters();
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      });

      const searchHost = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="data-filter-text"]'
      ) as HTMLElement;
      const searchInput = searchHost.querySelector('input.native') as HTMLInputElement;

      await userEvent.type(searchInput, 'alice');
      await waitFor(() => expect(readout.textContent).toContain('"search":"alice"'));

      const removeRoleButton = (fixture.nativeElement as HTMLElement).querySelector(
        '[aria-label="Remove Role filter"]'
      ) as HTMLElement;

      await userEvent.click(removeRoleButton);

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-array"]').length
        ).toBe(0);
      });

      await userEvent.click(queryByTestId(fixture, 'data-filters-add-filter-trigger'));

      await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

      const panel = queryAddFilterMenu() as HTMLElement;
      const roleMenuItem = Array.from(panel.querySelectorAll('button.menu-item-button')).find(
        (button) => button.textContent?.trim() === 'Role'
      ) as HTMLElement;

      await userEvent.click(roleMenuItem);

      await waitFor(() => {
        expect(
          (fixture.nativeElement as HTMLElement).querySelectorAll('[data-testid="data-filter-array"]').length
        ).toBe(1);
      });

      // the search input keeps its typed value even after re-adding role
      const preservedSearchInput = (fixture.nativeElement as HTMLElement)
        .querySelector('[data-testid="data-filter-text"]')
        ?.querySelector('input.native') as HTMLInputElement;

      expect(preservedSearchInput.value).toBe('alice');
    });
  });
});

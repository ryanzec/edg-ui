import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
  selector: 'story-data-filters-tests-shell',
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
class StoryDataFiltersTestsShell {
  protected readonly availableFilters = signal<DataFilter[]>(MIXED_FILTERS);

  protected readonly activeFilters = signal<string[]>(ALL_BASE_FILTER_NAMES);

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

const meta: Meta = {
  title: 'Core/Components/DataFilters/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-data-filters-tests-shell />`,
  moduleMetadata: { imports: [StoryDataFiltersTestsShell] },
});

/** queries the open overlay menu rendered to document.body when the Add Filter trigger is clicked. */
const queryAddFilterMenu = (): HTMLElement | null => document.body.querySelector('org-overlay-menu');

/** returns the labels for the items currently rendered in the open Add Filter overlay menu. */
const getAddFilterMenuLabels = (panel: HTMLElement): string[] => {
  const buttons = panel.querySelectorAll('button.menu-item-button');

  return Array.from(buttons).map((button) => button.textContent?.trim() ?? '');
};

// rendering by filter type

export const RendersTextInputForTextFilter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textHosts = await canvas.findAllByTestId('data-filter-text');

    await expect(textHosts.length).toBe(1);
    await expect(textHosts[0].querySelector('input.native')).not.toBeNull();
  },
};

export const RendersCheckboxToggleForToggleFilter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleHosts = await canvas.findAllByTestId('data-filter-toggle');

    await expect(toggleHosts.length).toBe(1);
    await expect(toggleHosts[0].querySelector('input[type="checkbox"]')).not.toBeNull();
  },
};

export const RendersComboboxForArrayFilter: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arrayHosts = await canvas.findAllByTestId('data-filter-array');

    await expect(arrayHosts.length).toBe(1);
    await expect(arrayHosts[0].querySelector('input.native')).not.toBeNull();
  },
};

// activeFilters-driven rendering

export const OnlyRendersFiltersInActiveFiltersSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-active-search-only'));

    await waitFor(() => {
      expect(canvas.queryAllByTestId('data-filter-text').length).toBe(1);
      expect(canvas.queryAllByTestId('data-filter-toggle').length).toBe(0);
      expect(canvas.queryAllByTestId('data-filter-array').length).toBe(0);
    });
  },
};

export const RendersNothingWhenActiveFiltersIsEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-active-empty'));

    await waitFor(() => {
      expect(canvas.queryAllByTestId('data-filter-text').length).toBe(0);
      expect(canvas.queryAllByTestId('data-filter-toggle').length).toBe(0);
      expect(canvas.queryAllByTestId('data-filter-array').length).toBe(0);
    });
  },
};

export const RendersInAvailableFiltersOrderRegardlessOfActiveFiltersOrder: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-active-reversed'));

    await waitFor(() => {
      const dataFiltersHost = canvas.getByTestId('data-filters');
      const rows = dataFiltersHost.querySelectorAll('.filter-row');

      expect(rows.length).toBe(3);
      expect(rows[0].querySelector('[data-testid="data-filter-text"]')).not.toBeNull();
      expect(rows[1].querySelector('[data-testid="data-filter-toggle"]')).not.toBeNull();
      expect(rows[2].querySelector('[data-testid="data-filter-array"]')).not.toBeNull();
    });
  },
};

// initial emission

export const DoesNotEmitFiltersChangedOnInitialRender: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    // wait for the component to fully render so any latent emission would have surfaced
    await canvas.findByTestId('data-filter-text');
    await canvas.findByTestId('data-filter-toggle');
    await canvas.findByTestId('data-filter-array');

    await expect(readout.textContent).toContain('eventCount=0');
  },
};

// text debounce

export const DebouncesTextFilterEmissionByTwoFiftyMilliseconds: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const textHost = await canvas.findByTestId('data-filter-text');
    const textInput = textHost.querySelector('input.native') as HTMLInputElement;

    await userEvent.type(textInput, 'alice');

    // immediately after typing the debounce has not elapsed yet
    await expect(readout.textContent).toContain('eventCount=0');

    // and within the debounce window (default waitFor timeout of 1000ms) it fires once with the typed value
    await waitFor(() => {
      expect(readout.textContent).toContain('eventCount=1');
      expect(readout.textContent).toContain('"search":"alice"');
    });
  },
};

// immediate emission

export const EmitsSynchronouslyWhenToggleChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const toggleHost = await canvas.findByTestId('data-filter-toggle');
    const toggleLabel = toggleHost.querySelector('.checkbox-toggle-label') as HTMLElement;

    await userEvent.click(toggleLabel);

    await waitFor(() => {
      expect(readout.textContent).toContain('eventCount=1');
      expect(readout.textContent).toContain('"isActive":true');
    });
  },
};

export const EmitsSynchronouslyWhenArraySelectionChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const arrayHost = await canvas.findByTestId('data-filter-array');
    const comboboxInput = arrayHost.querySelector('input.native') as HTMLInputElement;

    comboboxInput.focus();

    await waitFor(() => expect(document.body.querySelector('.org-combobox-overlay')).not.toBeNull());

    const overlay = document.body.querySelector('.org-combobox-overlay') as HTMLElement;
    const adminOption = overlay.querySelector('[data-option-value="admin"]') as HTMLElement;
    await userEvent.click(adminOption);

    await waitFor(() => {
      expect(readout.textContent).toContain('eventCount=1');
      expect(readout.textContent).toContain('"role":["admin"]');
    });
  },
};

// distinct emission

export const DoesNotEmitTwiceForTheSameValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const searchHost = await canvas.findByTestId('data-filter-text');
    const searchInput = searchHost.querySelector('input.native') as HTMLInputElement;

    // type 'a' and let the debounce settle → emission #1 with search='a'
    await userEvent.type(searchInput, 'a');
    await waitFor(() => expect(readout.textContent).toContain('eventCount=1'));

    // type 'b' then immediately delete it so the post-debounce value is 'a' again — identical to the previous
    // emission. distinctUntilChanged must suppress a second emission even though valueChanges fired twice.
    await userEvent.type(searchInput, 'b{Backspace}');

    // wait past the 250ms debounce window and verify eventCount stays at 1
    await new Promise((resolve) => setTimeout(resolve, 400));
    await expect(readout.textContent).toContain('eventCount=1');
  },
};

// dynamic availableFilters

export const RemovesInputWhenFilterRemovedFromAvailableFilters: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // verify the toggle + array inputs render to begin with
    await canvas.findByTestId('data-filter-toggle');
    await canvas.findByTestId('data-filter-array');

    await userEvent.click(canvas.getByTestId('ctl-available-search-only'));
    await userEvent.click(canvas.getByTestId('ctl-active-search-only'));

    await waitFor(() => {
      expect(canvas.queryAllByTestId('data-filter-text').length).toBe(1);
      expect(canvas.queryAllByTestId('data-filter-toggle').length).toBe(0);
      expect(canvas.queryAllByTestId('data-filter-array').length).toBe(0);
    });
  },
};

export const RendersInteractiveInputWhenFilterAddedToAvailableFiltersAndActiveFilters: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-available-mixed-plus-email'));
    await userEvent.click(canvas.getByTestId('ctl-active-search-with-email'));

    // ensure both text inputs render (search + email) and the email input is wired up
    await waitFor(() => expect(canvas.queryAllByTestId('data-filter-text').length).toBe(2));

    await userEvent.click(canvas.getByTestId('ctl-clear-events'));

    const textHosts = canvas.queryAllByTestId('data-filter-text');
    const emailHost = textHosts[1];
    const emailInput = emailHost.querySelector('input.native') as HTMLInputElement;

    await userEvent.type(emailInput, 'a@b');

    await waitFor(() => {
      expect(readout.textContent).toContain('eventCount=1');
      expect(readout.textContent).toContain('"email":"a@b"');
    });
  },
};

// remove via the per-row X button

export const RemovesFilterFromActiveSetWhenXClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    const removeSearchButton = await canvas.findByRole('button', { name: 'Remove Search filter' });
    await userEvent.click(removeSearchButton);

    await waitFor(() => {
      expect(canvas.queryAllByTestId('data-filter-text').length).toBe(0);
      expect(readout.textContent).toContain('active=["isActive","role"]');
    });
  },
};

// Add Filter menu

export const AddFilterMenuShowsOnlyInactiveFilters: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-active-search-only'));

    const addFilterButton = await canvas.findByTestId('data-filters-add-filter-trigger');
    await userEvent.click(addFilterButton);

    await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

    const panel = queryAddFilterMenu() as HTMLElement;

    await waitFor(() => {
      const labels = getAddFilterMenuLabels(panel);

      expect(labels).toEqual(['Active only', 'Role']);
    });
  },
};

export const HidesAddFilterButtonWhenEveryFilterIsActive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // shell defaults to all three filters active — the Add Filter button should not render
    await canvas.findByTestId('data-filter-text');

    await expect(canvas.queryByTestId('data-filters-add-filter-trigger')).toBeNull();
  },
};

export const ShowsAddFilterButtonWhenAtLeastOneFilterIsInactive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-active-search-only'));

    await waitFor(() => expect(canvas.queryByTestId('data-filters-add-filter-trigger')).not.toBeNull());
  },
};

export const AddingFilterViaMenuRendersItsInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-active-search-only'));

    await waitFor(() => expect(canvas.queryAllByTestId('data-filter-toggle').length).toBe(0));

    const addFilterButton = await canvas.findByTestId('data-filters-add-filter-trigger');
    await userEvent.click(addFilterButton);

    await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

    const panel = queryAddFilterMenu() as HTMLElement;
    const activeOnlyItem = Array.from(panel.querySelectorAll('button.menu-item-button')).find(
      (button) => button.textContent?.trim() === 'Active only'
    ) as HTMLElement;

    await userEvent.click(activeOnlyItem);

    await waitFor(() => expect(canvas.queryAllByTestId('data-filter-toggle').length).toBe(1));
  },
};

// filtersChanged on activeFilters change

export const EmitsPayloadWithOnlyActiveFilterValuesWhenActiveFiltersChange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await canvas.findByTestId('data-filter-text');
    await userEvent.click(canvas.getByTestId('ctl-clear-events'));

    await userEvent.click(canvas.getByTestId('ctl-active-search-only'));

    await waitFor(() => {
      expect(readout.textContent).toContain('eventCount=1');
      // payload key set is exactly { search } and the value is the text default ''
      expect(readout.textContent).toContain('lastPayload={"search":""}');
    });
  },
};

export const ResetsRemovedFilterToDefaultWhenReAdded: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    const searchHost = await canvas.findByTestId('data-filter-text');
    const searchInput = searchHost.querySelector('input.native') as HTMLInputElement;

    await userEvent.type(searchInput, 'alice');
    await waitFor(() => expect(readout.textContent).toContain('"search":"alice"'));

    const removeSearchButton = await canvas.findByRole('button', { name: 'Remove Search filter' });
    await userEvent.click(removeSearchButton);

    await waitFor(() => expect(canvas.queryAllByTestId('data-filter-text').length).toBe(0));

    const addFilterButton = await canvas.findByTestId('data-filters-add-filter-trigger');
    await userEvent.click(addFilterButton);

    await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

    const panel = queryAddFilterMenu() as HTMLElement;
    const searchMenuItem = Array.from(panel.querySelectorAll('button.menu-item-button')).find(
      (button) => button.textContent?.trim() === 'Search'
    ) as HTMLElement;
    await userEvent.click(searchMenuItem);

    await waitFor(() => {
      const reRenderedSearchHost = canvas.queryByTestId('data-filter-text');

      expect(reRenderedSearchHost).not.toBeNull();

      const reRenderedSearchInput = reRenderedSearchHost?.querySelector('input.native') as HTMLInputElement;

      expect(reRenderedSearchInput.value).toBe('');
    });
  },
};

export const PreservesOtherFiltersValuesWhenSiblingFilterAdded: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    const searchHost = await canvas.findByTestId('data-filter-text');
    const searchInput = searchHost.querySelector('input.native') as HTMLInputElement;

    await userEvent.type(searchInput, 'alice');
    await waitFor(() => expect(readout.textContent).toContain('"search":"alice"'));

    // remove the role filter so we can re-add it as a sibling without touching search
    const removeRoleButton = await canvas.findByRole('button', { name: 'Remove Role filter' });
    await userEvent.click(removeRoleButton);
    await waitFor(() => expect(canvas.queryAllByTestId('data-filter-array').length).toBe(0));

    const addFilterButton = await canvas.findByTestId('data-filters-add-filter-trigger');
    await userEvent.click(addFilterButton);
    await waitFor(() => expect(queryAddFilterMenu()).not.toBeNull());

    const panel = queryAddFilterMenu() as HTMLElement;
    const roleMenuItem = Array.from(panel.querySelectorAll('button.menu-item-button')).find(
      (button) => button.textContent?.trim() === 'Role'
    ) as HTMLElement;
    await userEvent.click(roleMenuItem);

    await waitFor(() => expect(canvas.queryAllByTestId('data-filter-array').length).toBe(1));

    // the search input keeps its typed value even after re-adding role
    const preservedSearchInput = canvas
      .getByTestId('data-filter-text')
      .querySelector('input.native') as HTMLInputElement;

    await expect(preservedSearchInput.value).toBe('alice');
  },
};

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { SortableDirective } from './sortable-directive';
import { SortingStore } from '../sorting-store/sorting-store';

@Component({
  selector: 'test-sortable-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SortableDirective],
  providers: [SortingStore],
  host: { class: 'block' },
  template: `
    <div class="flex gap-4">
      <span data-testid="sortable-name" [orgSortableKey]="'name'" [sortableEnabled]="enabledName()">Name</span>
      <span data-testid="sortable-email" [orgSortableKey]="'email'" [sortableEnabled]="enabledEmail()">Email</span>
      <span data-testid="sortable-status" [orgSortableKey]="'status'">Status</span>
    </div>
  `,
})
class SortableHost {
  public readonly sortingStore = inject(SortingStore);
  public readonly enabledName = signal<boolean>(true);
  public readonly enabledEmail = signal<boolean>(true);
}

describe('SortableDirective (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  const createSortable = (): ComponentFixture<SortableHost> => createFixture(SortableHost);

  describe('brain a11y / host attribute behavior', () => {
    it('renders the button role on the enabled host', () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      expect(host.getAttribute('role')).toBe('button');
    });

    it('renders a zero tabindex on the enabled host', () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      expect(host.getAttribute('tabindex')).toBe('0');
    });

    it('renders the data-sortable-enabled attribute on the enabled host', () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      expect(host.getAttribute('data-sortable-enabled')).toBe('');
    });

    it('removes role, tabindex, and data-sortable-enabled when disabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-sortable-enabled')).toBeNull();
    });
  });

  describe('click interaction / sort cycling', () => {
    it('sets sort to asc when not previously active', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      await userEvent.click(host);

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
        expect(store.isSorting()).toBe(true);
      });
    });

    it('cycles asc to desc on a second click', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      await userEvent.click(host);
      await userEvent.click(host);

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('desc');
        expect(store.isSorting()).toBe(true);
      });
    });

    it('cycles desc to cleared on a third click', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      await userEvent.click(host);
      await userEvent.click(host);
      await userEvent.click(host);

      await waitFor(() => {
        expect(store.direction()).toBeNull();
        expect(store.isSorting()).toBe(false);
      });
    });

    it('resets to asc when clicking a different key', async () => {
      const fixture = createSortable();
      const nameHost = queryByTestId(fixture, 'sortable-name');
      const emailHost = queryByTestId(fixture, 'sortable-email');
      const store = fixture.componentInstance.sortingStore;

      await userEvent.click(nameHost);
      await userEvent.click(nameHost);

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('desc');
      });

      await userEvent.click(emailHost);

      await waitFor(() => {
        expect(store.key()).toBe('email');
        expect(store.direction()).toBe('asc');
        expect(store.isSorting()).toBe(true);
      });
    });
  });

  describe('keyboard interaction', () => {
    it('toggles sort with the enter key', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      host.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
      });
    });

    it('toggles sort with the space key', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      host.focus();
      await userEvent.keyboard(' ');

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
      });
    });
  });

  describe('disabled interaction blocking', () => {
    it('ignores clicks when disabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      // warm up the click listener while enabled to avoid the first-listener stale-input artifact
      await userEvent.click(host);

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
      });

      store.clearSort();
      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      expect(host.getAttribute('role')).toBeNull();

      await userEvent.click(host);

      expect(store.key()).toBeNull();
      expect(store.direction()).toBeNull();
      expect(store.isSorting()).toBe(false);
    });

    it('ignores the enter key when disabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      // warm up the keyboard listener while enabled to avoid the first-listener stale-input artifact
      host.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
      });

      store.clearSort();
      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      expect(host.getAttribute('role')).toBeNull();

      host.focus();
      await userEvent.keyboard('{Enter}');

      expect(store.key()).toBeNull();
      expect(store.direction()).toBeNull();
      expect(store.isSorting()).toBe(false);
    });

    it('ignores the space key when disabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      // warm up the keyboard listener while enabled to avoid the first-listener stale-input artifact
      host.focus();
      await userEvent.keyboard(' ');

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
      });

      store.clearSort();
      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      expect(host.getAttribute('role')).toBeNull();

      host.focus();
      await userEvent.keyboard(' ');

      expect(store.key()).toBeNull();
      expect(store.direction()).toBeNull();
      expect(store.isSorting()).toBe(false);
    });

    it('preserves the active sort in the store when the directive is disabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');
      const store = fixture.componentInstance.sortingStore;

      await userEvent.click(host);

      await waitFor(() => {
        expect(store.key()).toBe('name');
        expect(store.direction()).toBe('asc');
      });

      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      await waitFor(() => expect(host.querySelector('org-icon')).toBeNull());

      expect(store.key()).toBe('name');
      expect(store.direction()).toBe('asc');
      expect(store.isSorting()).toBe(true);
    });

    it('restores the icon reflecting the active sort when re-enabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      await userEvent.click(host);
      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      await waitFor(() => expect(host.querySelector('org-icon')).toBeNull());

      fixture.componentInstance.enabledName.set(true);
      await flush(fixture);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon).not.toBeNull();
        expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
        expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
      });
    });
  });

  describe('icon rendering / state', () => {
    it('renders an org-icon when enabled', () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      expect(host.querySelector('org-icon')).not.toBeNull();
    });

    it('does not render an org-icon when disabled', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      fixture.componentInstance.enabledName.set(false);
      await flush(fixture);

      await waitFor(() => expect(host.querySelector('org-icon')).toBeNull());
    });

    it('shows the arrow-down-up icon when not the active sort key', () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-down-up');
    });

    it('shows the arrow-up icon when ascending', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      await userEvent.click(host);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
      });
    });

    it('shows the arrow-down icon when descending', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      await userEvent.click(host);
      await userEvent.click(host);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-icon')).toBe('arrow-down');
      });
    });

    it('has the data-sortable-inactive attribute when not actively sorting', () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-sortable-inactive')).toBe('');
    });

    it('removes the data-sortable-inactive attribute when actively sorting', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      await userEvent.click(host);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
      });
    });
  });

  describe('multi-directive coordination via shared store', () => {
    it('leaves other icons inactive when sorting one key', async () => {
      const fixture = createSortable();
      const nameHost = queryByTestId(fixture, 'sortable-name');
      const emailHost = queryByTestId(fixture, 'sortable-email');
      const statusHost = queryByTestId(fixture, 'sortable-status');

      await userEvent.click(nameHost);

      await waitFor(() => {
        const nameIcon = nameHost.querySelector('org-icon');
        const emailIcon = emailHost.querySelector('org-icon');
        const statusIcon = statusHost.querySelector('org-icon');

        expect(nameIcon?.getAttribute('data-icon')).toBe('arrow-up');
        expect(nameIcon?.getAttribute('data-sortable-inactive')).toBeNull();

        expect(emailIcon?.getAttribute('data-icon')).toBe('arrow-down-up');
        expect(emailIcon?.getAttribute('data-sortable-inactive')).toBe('');

        expect(statusIcon?.getAttribute('data-icon')).toBe('arrow-down-up');
        expect(statusIcon?.getAttribute('data-sortable-inactive')).toBe('');
      });
    });

    it('resets the previous key icon to inactive when switching the active key', async () => {
      const fixture = createSortable();
      const nameHost = queryByTestId(fixture, 'sortable-name');
      const emailHost = queryByTestId(fixture, 'sortable-email');

      await userEvent.click(nameHost);
      await userEvent.click(emailHost);

      await waitFor(() => {
        const nameIcon = nameHost.querySelector('org-icon');
        const emailIcon = emailHost.querySelector('org-icon');

        expect(nameIcon?.getAttribute('data-icon')).toBe('arrow-down-up');
        expect(nameIcon?.getAttribute('data-sortable-inactive')).toBe('');

        expect(emailIcon?.getAttribute('data-icon')).toBe('arrow-up');
        expect(emailIcon?.getAttribute('data-sortable-inactive')).toBeNull();
      });
    });
  });

  describe('preset sort state via the store', () => {
    it('renders the arrow-up icon for a preset asc sort', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      fixture.componentInstance.sortingStore.setSort('name', 'asc');
      await flush(fixture);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
        expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
      });
    });

    it('renders the arrow-down icon for a preset desc sort', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      fixture.componentInstance.sortingStore.setSort('name', 'desc');
      await flush(fixture);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-icon')).toBe('arrow-down');
        expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
      });
    });

    it('resets all icons to inactive when clearing the sort', async () => {
      const fixture = createSortable();
      const host = queryByTestId(fixture, 'sortable-name');

      await userEvent.click(host);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
      });

      fixture.componentInstance.sortingStore.clearSort();
      await flush(fixture);

      await waitFor(() => {
        const icon = host.querySelector('org-icon');

        expect(icon?.getAttribute('data-icon')).toBe('arrow-down-up');
        expect(icon?.getAttribute('data-sortable-inactive')).toBe('');
      });
    });
  });
});

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { SortableDirective } from './sortable-directive';
import { SortingStore } from '../sorting-store/sorting-store';

@Component({
  selector: 'story-sortable-tests-shell',
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
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-disable-name" (click)="enabledName.set(false)">disable-name</button>
      <button type="button" data-testid="ctl-enable-name" (click)="enabledName.set(true)">enable-name</button>
      <button type="button" data-testid="ctl-disable-email" (click)="enabledEmail.set(false)">disable-email</button>
      <button type="button" data-testid="ctl-preset-name-asc" (click)="sortingStore.setSort('name', 'asc')">
        preset-name-asc
      </button>
      <button type="button" data-testid="ctl-preset-name-desc" (click)="sortingStore.setSort('name', 'desc')">
        preset-name-desc
      </button>
      <button type="button" data-testid="ctl-clear-sort" (click)="sortingStore.clearSort()">clear-sort</button>
    </div>
  `,
})
class StorySortableTestsShell {
  protected readonly sortingStore = inject(SortingStore);
  protected readonly enabledName = signal<boolean>(true);
  protected readonly enabledEmail = signal<boolean>(true);

  protected readout(): string {
    return `key=${this.sortingStore.key() ?? 'null'}; direction=${this.sortingStore.direction() ?? 'null'}; isSorting=${this.sortingStore.isSorting()}`;
  }
}

const meta: Meta = {
  title: 'Core/Directives/Sortable/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-sortable-tests-shell />`,
  moduleMetadata: { imports: [StorySortableTestsShell] },
});

// brain a11y / host attribute behavior

export const EnabledHostHasButtonRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await expect(host.getAttribute('role')).toBe('button');
  },
};

export const EnabledHostHasZeroTabindex: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await expect(host.getAttribute('tabindex')).toBe('0');
  },
};

export const EnabledHostHasSortableEnabledAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await expect(host.getAttribute('data-sortable-enabled')).toBe('');
  },
};

export const DisabledHostRemovesRoleTabindexAndSortableEnabledAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => {
      expect(host.getAttribute('role')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
      expect(host.getAttribute('data-sortable-enabled')).toBeNull();
    });
  },
};

// click interaction / sort cycling

export const ClickSetsSortToAscWhenNotPreviouslyActive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(host);

    await waitFor(() => expect(readout.textContent).toContain('key=name; direction=asc; isSorting=true'));
  },
};

export const ClickCyclesAscToDescOnSecondClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(host);
    await userEvent.click(host);

    await waitFor(() => expect(readout.textContent).toContain('key=name; direction=desc; isSorting=true'));
  },
};

export const ClickCyclesDescToClearedOnThirdClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(host);
    await userEvent.click(host);
    await userEvent.click(host);

    await waitFor(() => expect(readout.textContent).toContain('direction=null; isSorting=false'));
  },
};

export const ClickingDifferentKeyResetsToAscOnNewKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHost = await canvas.findByTestId('sortable-name');
    const emailHost = await canvas.findByTestId('sortable-email');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(nameHost);
    await userEvent.click(nameHost);

    await waitFor(() => expect(readout.textContent).toContain('key=name; direction=desc'));

    await userEvent.click(emailHost);

    await waitFor(() => expect(readout.textContent).toContain('key=email; direction=asc; isSorting=true'));
  },
};

// keyboard interaction

export const EnterKeyTogglesSort: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    host.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('key=name; direction=asc'));
  },
};

export const SpaceKeyTogglesSort: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    host.focus();
    await userEvent.keyboard(' ');

    await waitFor(() => expect(readout.textContent).toContain('key=name; direction=asc'));
  },
};

// disabled interaction blocking

export const ClickDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => expect(host.getAttribute('role')).toBeNull());

    await userEvent.click(host);

    await expect(readout.textContent).toContain('key=null; direction=null; isSorting=false');
  },
};

export const EnterKeyDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => expect(host.getAttribute('role')).toBeNull());

    host.focus();
    await userEvent.keyboard('{Enter}');

    await expect(readout.textContent).toContain('key=null; direction=null; isSorting=false');
  },
};

export const SpaceKeyDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => expect(host.getAttribute('role')).toBeNull());

    host.focus();
    await userEvent.keyboard(' ');

    await expect(readout.textContent).toContain('key=null; direction=null; isSorting=false');
  },
};

export const StorePreservesActiveSortWhenDirectiveDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(host);

    await waitFor(() => expect(readout.textContent).toContain('key=name; direction=asc'));

    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => expect(host.querySelector('org-icon')).toBeNull());

    // sort state in the store remains intact after disabling
    await expect(readout.textContent).toContain('key=name; direction=asc; isSorting=true');
  },
};

export const ReEnablingRestoresIconReflectingActiveSort: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(host);
    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => expect(host.querySelector('org-icon')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-enable-name'));

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon).not.toBeNull();
      expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
      expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
    });
  },
};

// icon rendering / state

export const RendersOrgIconWhenEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await expect(host.querySelector('org-icon')).not.toBeNull();
  },
};

export const DoesNotRenderOrgIconWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(canvas.getByTestId('ctl-disable-name'));

    await waitFor(() => expect(host.querySelector('org-icon')).toBeNull());
  },
};

export const IconIsArrowDownUpWhenNotActiveSortKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    const icon = host.querySelector('org-icon');

    await expect(icon?.getAttribute('data-icon')).toBe('arrow-down-up');
  },
};

export const IconIsArrowUpWhenAscending: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(host);

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
    });
  },
};

export const IconIsArrowDownWhenDescending: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(host);
    await userEvent.click(host);

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-down');
    });
  },
};

export const IconHasSortableInactiveAttributeWhenNotActivelySorting: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    const icon = host.querySelector('org-icon');

    await expect(icon?.getAttribute('data-sortable-inactive')).toBe('');
  },
};

export const IconRemovesSortableInactiveAttributeWhenActivelySorting: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(host);

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
    });
  },
};

// multi-directive coordination via shared store

export const SortingOneKeyLeavesOtherIconsInactive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHost = await canvas.findByTestId('sortable-name');
    const emailHost = await canvas.findByTestId('sortable-email');
    const statusHost = await canvas.findByTestId('sortable-status');

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
  },
};

export const SwitchingActiveKeyResetsPreviousKeyIconToInactive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHost = await canvas.findByTestId('sortable-name');
    const emailHost = await canvas.findByTestId('sortable-email');

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
  },
};

// preset sort state via the store

export const PresetAscSortRendersArrowUpIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(canvas.getByTestId('ctl-preset-name-asc'));

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
      expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
    });
  },
};

export const PresetDescSortRendersArrowDownIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(canvas.getByTestId('ctl-preset-name-desc'));

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-down');
      expect(icon?.getAttribute('data-sortable-inactive')).toBeNull();
    });
  },
};

export const ClearingSortResetsAllIconsToInactive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('sortable-name');

    await userEvent.click(host);

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-up');
    });

    await userEvent.click(canvas.getByTestId('ctl-clear-sort'));

    await waitFor(() => {
      const icon = host.querySelector('org-icon');

      expect(icon?.getAttribute('data-icon')).toBe('arrow-down-up');
      expect(icon?.getAttribute('data-sortable-inactive')).toBe('');
    });
  },
};

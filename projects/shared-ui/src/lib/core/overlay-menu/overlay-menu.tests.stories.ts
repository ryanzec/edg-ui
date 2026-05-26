import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  OverlayMenu,
  type OverlayMenuItem,
  type OverlayMenuItemEntry,
  type OverlayMenuEntryValueChange,
  type OverlayMenuListSize,
  type OverlayMenuState,
} from './overlay-menu';
import { OverlayMenuTriggerDirective, type OverlayMenuTriggerPosition } from './overlay-menu-trigger';
import { Button } from '../button/button';

/** preset item shapes used across the standalone-menu shell to exercise each rendering path */
const itemPresets = {
  basic: [
    { id: 'edit', label: 'Edit', icon: 'pencil' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { id: 'archive', label: 'Archive', icon: 'inbox' },
  ] satisfies OverlayMenuItem[],
  withDisabled: [
    { id: 'edit', label: 'Edit', icon: 'pencil' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy', disabled: true },
    { id: 'archive', label: 'Archive', icon: 'inbox' },
  ] satisfies OverlayMenuItem[],
  withDivider: [
    { id: 'edit', label: 'Edit', icon: 'pencil' },
    { id: 'd1', type: 'divider' },
    { id: 'archive', label: 'Archive', icon: 'inbox' },
  ] satisfies OverlayMenuItem[],
  withButtonToggle: [
    {
      id: 'appearance',
      type: 'button-toggle',
      value: 'dark',
      items: [
        { label: 'Light', value: 'light', buttonColor: 'neutral' },
        { label: 'Dark', value: 'dark', buttonColor: 'neutral' },
        { label: 'System', value: 'system', buttonColor: 'neutral' },
      ],
    },
  ] satisfies OverlayMenuItem[],
  withColor: [
    { id: 'edit', label: 'Edit', icon: 'pencil' },
    { id: 'delete', label: 'Delete', icon: 'trash', color: 'danger' },
  ] satisfies OverlayMenuItem[],
  withShortcut: [{ id: 'undo', label: 'Undo', icon: null, shortcut: '⌘ Z' }] satisfies OverlayMenuItem[],
  withPostIcon: [
    { id: 'filter', label: 'Filter by', icon: null, postIcon: 'chevron-right' },
  ] satisfies OverlayMenuItem[],
  withTag: [
    { id: 'board', label: 'Board', icon: null, tag: { label: 'Beta', color: 'info' } },
  ] satisfies OverlayMenuItem[],
  withIndicator: [{ id: 'active', label: 'Active', icon: null, indicator: 12 }] satisfies OverlayMenuItem[],
  withoutMeta: [{ id: 'plain', label: 'Plain', icon: null }] satisfies OverlayMenuItem[],
  withoutIcon: [{ id: 'plain', label: 'Plain', icon: null }] satisfies OverlayMenuItem[],
  withIcon: [{ id: 'edit', label: 'Edit', icon: 'pencil' }] satisfies OverlayMenuItem[],
};

@Component({
  selector: 'story-overlay-menu-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenu],
  host: { class: 'block' },
  template: `
    <org-overlay-menu
      data-testid="menu"
      [items]="items()"
      [listSize]="listSize()"
      [state]="state()"
      [label]="label()"
      [header]="header()"
      (itemClicked)="onItemClicked($event)"
      (entryValueChanged)="onEntryValueChanged($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-items-basic" (click)="items.set(presets.basic)">items-basic</button>
      <button type="button" data-testid="ctl-items-disabled" (click)="items.set(presets.withDisabled)">
        items-disabled
      </button>
      <button type="button" data-testid="ctl-items-divider" (click)="items.set(presets.withDivider)">
        items-divider
      </button>
      <button type="button" data-testid="ctl-items-button-toggle" (click)="items.set(presets.withButtonToggle)">
        items-button-toggle
      </button>
      <button type="button" data-testid="ctl-items-color" (click)="items.set(presets.withColor)">items-color</button>
      <button type="button" data-testid="ctl-items-shortcut" (click)="items.set(presets.withShortcut)">
        items-shortcut
      </button>
      <button type="button" data-testid="ctl-items-post-icon" (click)="items.set(presets.withPostIcon)">
        items-post-icon
      </button>
      <button type="button" data-testid="ctl-items-tag" (click)="items.set(presets.withTag)">items-tag</button>
      <button type="button" data-testid="ctl-items-indicator" (click)="items.set(presets.withIndicator)">
        items-indicator
      </button>
      <button type="button" data-testid="ctl-items-no-meta" (click)="items.set(presets.withoutMeta)">
        items-no-meta
      </button>
      <button type="button" data-testid="ctl-items-no-icon" (click)="items.set(presets.withoutIcon)">
        items-no-icon
      </button>
      <button type="button" data-testid="ctl-items-icon" (click)="items.set(presets.withIcon)">items-icon</button>
      <button type="button" data-testid="ctl-list-size-base" (click)="listSize.set('base')">list-size-base</button>
      <button type="button" data-testid="ctl-state-open" (click)="state.set('open')">state-open</button>
      <button type="button" data-testid="ctl-state-closed" (click)="state.set('closed')">state-closed</button>
      <button type="button" data-testid="ctl-state-clear" (click)="state.set(undefined)">state-clear</button>
      <button type="button" data-testid="ctl-label-custom" (click)="label.set('Account actions')">label-custom</button>
      <button type="button" data-testid="ctl-header-set" (click)="header.set('PROJECTS')">header-set</button>
      <button type="button" data-testid="ctl-header-clear" (click)="header.set(undefined)">header-clear</button>
    </div>
  `,
})
class StoryOverlayMenuTestsShell {
  protected readonly presets = itemPresets;

  protected readonly items = signal<OverlayMenuItem[]>(itemPresets.basic);
  protected readonly listSize = signal<OverlayMenuListSize>('sm');
  protected readonly state = signal<OverlayMenuState | undefined>(undefined);
  protected readonly label = signal<string>('Menu');
  protected readonly header = signal<string | undefined>(undefined);

  protected readonly itemClickedCount = signal<number>(0);
  protected readonly lastClickedId = signal<string>('');
  protected readonly lastClickedLabel = signal<string>('');
  protected readonly entryValueChangedCount = signal<number>(0);
  protected readonly lastEntryId = signal<string>('');
  protected readonly lastEntryValue = signal<string>('');

  protected readout(): string {
    return [
      `itemClickedCount=${this.itemClickedCount()}`,
      `lastClickedId=${this.lastClickedId()}`,
      `lastClickedLabel=${this.lastClickedLabel()}`,
      `entryValueChangedCount=${this.entryValueChangedCount()}`,
      `lastEntryId=${this.lastEntryId()}`,
      `lastEntryValue=${this.lastEntryValue()}`,
    ].join(' ');
  }

  protected onItemClicked(item: OverlayMenuItemEntry): void {
    this.itemClickedCount.update((value) => value + 1);
    this.lastClickedId.set(item.id);
    this.lastClickedLabel.set(item.label);
  }

  protected onEntryValueChanged(event: OverlayMenuEntryValueChange): void {
    this.entryValueChangedCount.update((value) => value + 1);
    this.lastEntryId.set(event.entryId);
    this.lastEntryValue.set(event.value);
  }
}

@Component({
  selector: 'story-overlay-menu-trigger-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenu, OverlayMenuTriggerDirective, Button],
  host: { class: 'block' },
  template: `
    <org-button
      data-testid="trigger"
      [orgOverlayMenuTrigger]="menu"
      [overlayMenuTriggerPosition]="position()"
      [overlayMenuTriggerCloseOnEscape]="closeOnEscape()"
      color="primary"
      label="Open Menu"
    />
    <div data-testid="outside-target" class="m-3 p-3">outside</div>
    <ng-template #menu>
      <org-overlay-menu
        data-testid="overlay-menu"
        [items]="[
          { id: '1', label: 'Edit', icon: 'pencil' },
          { id: '2', label: 'Duplicate', icon: 'copy' },
        ]"
        (itemClicked)="onItemClicked($event)"
      />
    </ng-template>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-position-above" (click)="position.set('above')">position-above</button>
      <button type="button" data-testid="ctl-position-below" (click)="position.set('below')">position-below</button>
      <button type="button" data-testid="ctl-close-on-escape-off" (click)="closeOnEscape.set(false)">
        close-on-escape-off
      </button>
      <button type="button" data-testid="ctl-close-on-escape-on" (click)="closeOnEscape.set(true)">
        close-on-escape-on
      </button>
    </div>
  `,
})
class StoryOverlayMenuTriggerShell {
  protected readonly position = signal<OverlayMenuTriggerPosition>('below');
  protected readonly closeOnEscape = signal<boolean>(true);

  protected readonly itemClickedCount = signal<number>(0);
  protected readonly lastClickedId = signal<string>('');

  protected readout(): string {
    return [`itemClickedCount=${this.itemClickedCount()}`, `lastClickedId=${this.lastClickedId()}`].join(' ');
  }

  protected onItemClicked(item: OverlayMenuItemEntry): void {
    this.itemClickedCount.update((value) => value + 1);
    this.lastClickedId.set(item.id);
  }
}

const meta: Meta = {
  title: 'Core/Components/Overlay Menu/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-overlay-menu-tests-shell />`,
  moduleMetadata: { imports: [StoryOverlayMenuTestsShell] },
});

const renderTriggerShell: Story['render'] = () => ({
  template: `<story-overlay-menu-trigger-shell />`,
  moduleMetadata: { imports: [StoryOverlayMenuTriggerShell] },
});

/** queries the open cdk overlay panel hosting an org-overlay-menu; overlays render into document.body */
const queryOverlayMenuInDocument = (): HTMLElement | null => document.body.querySelector('org-overlay-menu');

// host attributes / roles

export const DataStateAttributeIsNullByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await expect(host.getAttribute('data-state')).toBeNull();
  },
};

export const ReflectsDataStateAttributeWhenStateIsOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-state-open'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const ReflectsDataStateAttributeWhenStateIsClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-state-closed'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

export const ClearingStateRemovesDataStateAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-state-open'));
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));

    await userEvent.click(canvas.getByTestId('ctl-state-clear'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBeNull());
  },
};

export const HostCarriesMenuRoleFromCdk: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await expect(host.getAttribute('role')).toBe('menu');
  },
};

export const HostCarriesDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await expect(host.getAttribute('aria-label')).toBe('Menu');
  },
};

export const HostReflectsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-label-custom'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Account actions'));
  },
};

// header rendering

export const NoHeaderRenderedByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await expect(host.querySelector('.header')).toBeNull();
  },
};

export const RendersHeaderTextWhenHeaderProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-header-set'));

    await waitFor(() => {
      const header = host.querySelector('.header');

      expect(header?.textContent?.trim()).toBe('PROJECTS');
    });
  },
};

export const RemovesHeaderWhenHeaderCleared: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-header-set'));
    await waitFor(() => expect(host.querySelector('.header')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-header-clear'));

    await waitFor(() => expect(host.querySelector('.header')).toBeNull());
  },
};

// item entry rendering

export const RendersOneMenuItemButtonPerItemEntry: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    const itemButtons = host.querySelectorAll('button.menu-item-button');

    await expect(itemButtons.length).toBe(3);
  },
};

export const MenuItemButtonCarriesMenuItemRoleFromCdk: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;

    await expect(firstItem.getAttribute('role')).toBe('menuitem');
  },
};

export const RendersDividerElementForDividerEntries: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-divider'));

    await waitFor(() => {
      const divider = host.querySelector('org-overlay-menu-divider');

      expect(divider).not.toBeNull();
      expect(divider?.querySelector('org-divider')).not.toBeNull();
    });
  },
};

export const RendersButtonToggleElementForButtonToggleEntries: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-button-toggle'));

    await waitFor(() => expect(host.querySelector('org-button-toggle')).not.toBeNull());
  },
};

export const RendersPreIconWhenItemIconProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-icon'));

    await waitFor(() => {
      const item = host.querySelector('button.menu-item-button') as HTMLButtonElement;

      expect(item.querySelector('org-list-item-icon[pre]')).not.toBeNull();
    });
  },
};

export const OmitsPreIconWhenItemIconIsNull: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-no-icon'));

    await waitFor(() => {
      const item = host.querySelector('button.menu-item-button') as HTMLButtonElement;

      expect(item.querySelector('org-list-item-icon[pre]')).toBeNull();
    });
  },
};

export const RendersShortcutKbdInsideMeta: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-shortcut'));

    await waitFor(() => {
      const meta = host.querySelector('org-overlay-menu-item-meta');

      expect(meta).not.toBeNull();
      expect(meta?.querySelector('org-kbd')?.textContent?.trim()).toBe('⌘ Z');
    });
  },
};

export const RendersPostIconInsideMeta: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-post-icon'));

    await waitFor(() => {
      const meta = host.querySelector('org-overlay-menu-item-meta');

      expect(meta).not.toBeNull();
      expect(meta?.querySelector('org-list-item-icon')).not.toBeNull();
    });
  },
};

export const RendersTagInsideMeta: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-tag'));

    await waitFor(() => {
      const meta = host.querySelector('org-overlay-menu-item-meta');

      expect(meta).not.toBeNull();
      expect(meta?.querySelector('org-tag')?.textContent?.trim()).toBe('Beta');
    });
  },
};

export const RendersIndicatorInsideMeta: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-indicator'));

    await waitFor(() => {
      const meta = host.querySelector('org-overlay-menu-item-meta');

      expect(meta).not.toBeNull();
      expect(meta?.querySelector('org-indicator')).not.toBeNull();
    });
  },
};

export const OmitsMetaWrapperWhenNoMetaTokensProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-no-meta'));

    await waitFor(() => expect(host.querySelector('org-overlay-menu-item-meta')).toBeNull());
  },
};

export const ReflectsItemColorAsDataColorAttributeOnMenuItemButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-color'));

    await waitFor(() => {
      const danger = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;

      expect(danger.getAttribute('data-color')).toBe('danger');
    });
  },
};

export const OmitsDataColorAttributeWhenItemHasNoColor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;

    await expect(firstItem.getAttribute('data-color')).toBeNull();
  },
};

// disabled item behavior

export const DisablesInnerButtonWhenItemDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-disabled'));

    await waitFor(() => {
      const disabledItem = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;

      expect(disabledItem.disabled).toBe(true);
    });
  },
};

// itemClicked output

export const EmitsItemClickedWhenMenuItemActivated: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');
    const readout = await canvas.findByTestId('readout');

    const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;

    await expect(readout.textContent).toContain('itemClickedCount=0');

    await userEvent.click(firstItem);

    await waitFor(() => {
      expect(readout.textContent).toContain('itemClickedCount=1');
      expect(readout.textContent).toContain('lastClickedId=edit');
      expect(readout.textContent).toContain('lastClickedLabel=Edit');
    });
  },
};

export const DoesNotEmitItemClickedWhenDisabledItemActivated: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-items-disabled'));

    await waitFor(() => {
      const disabledItem = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;

      expect(disabledItem.disabled).toBe(true);
    });

    const disabledItem = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;
    disabledItem.click();

    await expect(readout.textContent).toContain('itemClickedCount=0');
  },
};

export const EmitsItemClickedOnEnterKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');
    const readout = await canvas.findByTestId('readout');

    const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;
    firstItem.focus();

    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(readout.textContent).toContain('itemClickedCount=1');
      expect(readout.textContent).toContain('lastClickedId=edit');
    });
  },
};

// entryValueChanged output (button-toggle)

export const EmitsEntryValueChangedWhenButtonToggleSelectionChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-items-button-toggle'));

    await waitFor(() => expect(host.querySelector('org-button-toggle')).not.toBeNull());

    const lightButton = Array.from(host.querySelectorAll('org-button-toggle org-button button')).find(
      (button) => button.textContent?.trim() === 'Light'
    ) as HTMLButtonElement;

    await userEvent.click(lightButton);

    await waitFor(() => {
      expect(readout.textContent).toContain('entryValueChangedCount=1');
      expect(readout.textContent).toContain('lastEntryId=appearance');
      expect(readout.textContent).toContain('lastEntryValue=light');
    });
  },
};

// keyboard navigation through CDK menu

export const ArrowDownMovesKeyboardCursorAndSkipsDisabledItems: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('menu');

    await userEvent.click(canvas.getByTestId('ctl-items-disabled'));

    await waitFor(() => {
      const items = host.querySelectorAll('button.menu-item-button');

      expect(items.length).toBe(3);
    });

    const items = host.querySelectorAll('button.menu-item-button');
    const firstItem = items[0] as HTMLButtonElement;
    const disabledItem = items[1] as HTMLButtonElement;
    const lastItem = items[2] as HTMLButtonElement;

    firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');

    // the overlay menu brain's keyboard handler skips disabled items; focus jumps directly to the third item
    await waitFor(() => {
      expect(document.activeElement).toBe(lastItem);
      expect(document.activeElement).not.toBe(disabledItem);
    });
  },
};

// trigger directive — open / close behavior

export const ClickingTriggerOpensOverlay: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await expect(queryOverlayMenuInDocument()).toBeNull();

    await userEvent.click(trigger);

    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());
  },
};

export const ClickingTriggerAgainClosesOverlay: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

    await userEvent.click(trigger);

    await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
  },
};

export const EscapeClosesOverlayWhenCloseOnEscapeIsTrue: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
  },
};

export const EscapeDoesNotCloseOverlayWhenCloseOnEscapeIsFalse: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(canvas.getByTestId('ctl-close-on-escape-off'));
    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

    await userEvent.keyboard('{Escape}');

    // overlay should remain open after Escape when escape handling is disabled
    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(queryOverlayMenuInDocument()).not.toBeNull();
  },
};

export const ClickingOutsideClosesOverlay: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');
    const outside = await canvas.findByTestId('outside-target');

    await userEvent.click(trigger);
    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

    await userEvent.click(outside);

    await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
  },
};

export const PositionBelowPlacesPanelUnderTrigger: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');

    await userEvent.click(trigger);

    await waitFor(() => {
      const panel = queryOverlayMenuInDocument();

      expect(panel).not.toBeNull();

      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = (panel as HTMLElement).getBoundingClientRect();

      // "below" means the panel's top edge sits at or beneath the trigger's bottom edge
      expect(panelRect.top).toBeGreaterThanOrEqual(triggerRect.bottom - 1);
    });
  },
};

export const ClickingMenuItemInOverlayEmitsItemClicked: Story = {
  render: renderTriggerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByTestId('trigger');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(trigger);

    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

    const panel = queryOverlayMenuInDocument() as HTMLElement;
    const firstItem = panel.querySelector('button.menu-item-button') as HTMLButtonElement;

    await userEvent.click(firstItem);

    await waitFor(() => {
      expect(readout.textContent).toContain('itemClickedCount=1');
      expect(readout.textContent).toContain('lastClickedId=1');
    });
  },
};

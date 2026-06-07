import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
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

/** preset item shapes used across the standalone-menu host to exercise each rendering path */
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
  selector: 'test-overlay-menu-host',
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
  `,
})
class OverlayMenuHost {
  public readonly items = signal<OverlayMenuItem[]>(itemPresets.basic);
  public readonly listSize = signal<OverlayMenuListSize>('sm');
  public readonly state = signal<OverlayMenuState | undefined>(undefined);
  public readonly label = signal<string>('Menu');
  public readonly header = signal<string | undefined>(undefined);

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
  selector: 'test-overlay-menu-trigger-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenu, OverlayMenuTriggerDirective, Button],
  host: { class: 'block' },
  template: `
    <org-button
      data-testid="trigger"
      [orgOverlayMenuTrigger]="menu"
      [overlayMenuTriggerPosition]="position()"
      [overlayMenuTriggerCloseOnEscape]="closeOnEscape()"
      [overlayMenuTriggerHover]="hover()"
      [overlayMenuTriggerOpenDelay]="openDelay()"
      [overlayMenuTriggerCloseDelay]="closeDelay()"
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
  `,
})
class OverlayMenuTriggerHost {
  public readonly position = signal<OverlayMenuTriggerPosition>('below');
  public readonly closeOnEscape = signal<boolean>(true);
  public readonly hover = signal<boolean>(false);
  public readonly openDelay = signal<number>(200);
  public readonly closeDelay = signal<number>(150);

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

type OverlayMenuHostConfig = {
  items?: OverlayMenuItem[];
  listSize?: OverlayMenuListSize;
  state?: OverlayMenuState | undefined;
  label?: string;
  header?: string | undefined;
};

type OverlayMenuTriggerHostConfig = {
  position?: OverlayMenuTriggerPosition;
  closeOnEscape?: boolean;
  hover?: boolean;
  openDelay?: number;
  closeDelay?: number;
};

describe('Overlay Menu (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createMenu = (config: OverlayMenuHostConfig = {}): ComponentFixture<OverlayMenuHost> =>
    createFixture(OverlayMenuHost, (instance) => {
      if (config.items !== undefined) {
        instance.items.set(config.items);
      }

      if (config.listSize !== undefined) {
        instance.listSize.set(config.listSize);
      }

      if (config.state !== undefined) {
        instance.state.set(config.state);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.header !== undefined) {
        instance.header.set(config.header);
      }
    });

  const createTriggerMenu = (config: OverlayMenuTriggerHostConfig = {}): ComponentFixture<OverlayMenuTriggerHost> =>
    createFixture(OverlayMenuTriggerHost, (instance) => {
      if (config.position !== undefined) {
        instance.position.set(config.position);
      }

      if (config.closeOnEscape !== undefined) {
        instance.closeOnEscape.set(config.closeOnEscape);
      }

      if (config.hover !== undefined) {
        instance.hover.set(config.hover);
      }

      if (config.openDelay !== undefined) {
        instance.openDelay.set(config.openDelay);
      }

      if (config.closeDelay !== undefined) {
        instance.closeDelay.set(config.closeDelay);
      }
    });

  // the cdk overlay panel hosting the overlay menu renders outside the fixture, attached to document.body
  const queryOverlayMenuInDocument = (): HTMLElement | null => document.body.querySelector('org-overlay-menu');

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes left in the body so a stale panel can't leak into the next test
    document.querySelectorAll('.cdk-overlay-pane').forEach((pane) => pane.remove());
    document.querySelectorAll('.cdk-overlay-backdrop').forEach((backdrop) => backdrop.remove());
  });

  describe('host attributes / roles', () => {
    it('leaves data-state null by default', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      expect(host.getAttribute('data-state')).toBeNull();
    });

    it('reflects data-state when state is open', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.state.set('open');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('reflects data-state when state is closed', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.state.set('closed');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });

    it('removes data-state when state is cleared', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.state.set('open');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));

      fixture.componentInstance.state.set(undefined);

      await waitFor(() => expect(host.getAttribute('data-state')).toBeNull());
    });

    it('carries the menu role from cdk', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      expect(host.getAttribute('role')).toBe('menu');
    });

    it('carries the default aria-label', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBe('Menu');
    });

    it('reflects a custom aria-label', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.label.set('Account actions');

      await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Account actions'));
    });
  });

  describe('header rendering', () => {
    it('renders no header by default', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      expect(host.querySelector('.header')).toBeNull();
    });

    it('renders header text when header provided', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.header.set('PROJECTS');

      await waitFor(() => {
        const header = host.querySelector('.header');

        expect(header?.textContent?.trim()).toBe('PROJECTS');
      });
    });

    it('removes the header when header cleared', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.header.set('PROJECTS');
      await waitFor(() => expect(host.querySelector('.header')).not.toBeNull());

      fixture.componentInstance.header.set(undefined);

      await waitFor(() => expect(host.querySelector('.header')).toBeNull());
    });
  });

  describe('item entry rendering', () => {
    it('renders one menu-item button per item entry', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      const itemButtons = host.querySelectorAll('button.menu-item-button');

      expect(itemButtons.length).toBe(3);
    });

    it('carries the menuitem role from cdk', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;

      expect(firstItem.getAttribute('role')).toBe('menuitem');
    });

    it('renders a divider element for divider entries', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withDivider);

      await waitFor(() => {
        const divider = host.querySelector('org-overlay-menu-divider');

        expect(divider).not.toBeNull();
        expect(divider?.querySelector('org-divider')).not.toBeNull();
      });
    });

    it('renders a button-toggle element for button-toggle entries', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withButtonToggle);

      await waitFor(() => expect(host.querySelector('org-button-toggle')).not.toBeNull());
    });

    it('renders the pre-icon when item icon provided', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withIcon);

      await waitFor(() => {
        const item = host.querySelector('button.menu-item-button') as HTMLButtonElement;

        expect(item.querySelector('org-list-item-icon[pre]')).not.toBeNull();
      });
    });

    it('omits the pre-icon when item icon is null', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withoutIcon);

      await waitFor(() => {
        const item = host.querySelector('button.menu-item-button') as HTMLButtonElement;

        expect(item.querySelector('org-list-item-icon[pre]')).toBeNull();
      });
    });

    it('renders the shortcut kbd inside the meta', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withShortcut);

      await waitFor(() => {
        const meta = host.querySelector('org-overlay-menu-item-meta');

        expect(meta).not.toBeNull();
        expect(meta?.querySelector('org-kbd')?.textContent?.trim()).toBe('⌘ Z');
      });
    });

    it('renders the post-icon inside the meta', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withPostIcon);

      await waitFor(() => {
        const meta = host.querySelector('org-overlay-menu-item-meta');

        expect(meta).not.toBeNull();
        expect(meta?.querySelector('org-list-item-icon')).not.toBeNull();
      });
    });

    it('renders the tag inside the meta', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withTag);

      await waitFor(() => {
        const meta = host.querySelector('org-overlay-menu-item-meta');

        expect(meta).not.toBeNull();
        expect(meta?.querySelector('org-tag')?.textContent?.trim()).toBe('Beta');
      });
    });

    it('renders the indicator inside the meta', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withIndicator);

      await waitFor(() => {
        const meta = host.querySelector('org-overlay-menu-item-meta');

        expect(meta).not.toBeNull();
        expect(meta?.querySelector('org-indicator')).not.toBeNull();
      });
    });

    it('omits the meta wrapper when no meta tokens provided', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withoutMeta);

      await waitFor(() => expect(host.querySelector('org-overlay-menu-item-meta')).toBeNull());
    });

    it('reflects item color as data-color on the menu-item button', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withColor);

      await waitFor(() => {
        const danger = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;

        expect(danger.getAttribute('data-color')).toBe('danger');
      });
    });

    it('omits data-color when item has no color', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      await flush(fixture);

      const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;

      expect(firstItem.getAttribute('data-color')).toBeNull();
    });
  });

  describe('disabled item behavior', () => {
    it('disables the inner button when item disabled', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withDisabled);

      await waitFor(() => {
        const disabledItem = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;

        expect(disabledItem.disabled).toBe(true);
      });
    });
  });

  describe('itemClicked output', () => {
    it('emits itemClicked when a menu item is activated', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;

      expect(readout.textContent).toContain('itemClickedCount=0');

      await userEvent.click(firstItem);

      await waitFor(() => {
        expect(readout.textContent).toContain('itemClickedCount=1');
        expect(readout.textContent).toContain('lastClickedId=edit');
        expect(readout.textContent).toContain('lastClickedLabel=Edit');
      });
    });

    it('does not emit itemClicked when a disabled item is activated', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.items.set(itemPresets.withDisabled);

      await waitFor(() => {
        const disabledItem = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;

        expect(disabledItem.disabled).toBe(true);
      });

      const disabledItem = host.querySelectorAll('button.menu-item-button')[1] as HTMLButtonElement;
      disabledItem.click();

      await flush(fixture);

      expect(readout.textContent).toContain('itemClickedCount=0');
    });

    it('emits itemClicked on the Enter key', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const firstItem = host.querySelector('button.menu-item-button') as HTMLButtonElement;
      firstItem.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(readout.textContent).toContain('itemClickedCount=1');
        expect(readout.textContent).toContain('lastClickedId=edit');
      });
    });
  });

  describe('entryValueChanged output (button-toggle)', () => {
    it('emits entryValueChanged when the button-toggle selection changes', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.items.set(itemPresets.withButtonToggle);

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
    });
  });

  describe('keyboard navigation through cdk menu', () => {
    it('moves the keyboard cursor on ArrowDown and skips disabled items', async () => {
      const fixture = createMenu();
      const host = queryByTestId(fixture, 'menu');

      fixture.componentInstance.items.set(itemPresets.withDisabled);

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
    });
  });

  describe('trigger directive — open / close behavior', () => {
    it('opens the overlay when the trigger is clicked', async () => {
      const fixture = createTriggerMenu();
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      expect(queryOverlayMenuInDocument()).toBeNull();

      await userEvent.click(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());
    });

    it('closes the overlay when the trigger is clicked again', async () => {
      const fixture = createTriggerMenu();
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      await userEvent.click(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
    });

    it('closes the overlay on Escape when close-on-escape is true', async () => {
      const fixture = createTriggerMenu();
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
    });

    it('keeps the overlay open on Escape when close-on-escape is false', async () => {
      const fixture = createTriggerMenu({ closeOnEscape: false });
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      await userEvent.keyboard('{Escape}');

      // overlay should remain open after Escape when escape handling is disabled
      await flush(fixture);
      expect(queryOverlayMenuInDocument()).not.toBeNull();
    });

    it('closes the overlay when clicking outside', async () => {
      const fixture = createTriggerMenu();
      const trigger = queryByTestId(fixture, 'trigger');
      const outside = queryByTestId(fixture, 'outside-target');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await userEvent.click(trigger);
      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      await userEvent.click(outside);

      await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
    });

    it('places the panel under the trigger when position is below', async () => {
      const fixture = createTriggerMenu({ position: 'below' });
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await userEvent.click(trigger);

      await waitFor(() => {
        const panel = queryOverlayMenuInDocument();

        expect(panel).not.toBeNull();

        const triggerRect = trigger.getBoundingClientRect();
        const panelRect = (panel as HTMLElement).getBoundingClientRect();

        // "below" means the panel's top edge sits at or beneath the trigger's bottom edge
        expect(panelRect.top).toBeGreaterThanOrEqual(triggerRect.bottom - 1);
      });
    });

    it('emits itemClicked when a menu item in the overlay is clicked', async () => {
      const fixture = createTriggerMenu();
      const trigger = queryByTestId(fixture, 'trigger');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await userEvent.click(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      const panel = queryOverlayMenuInDocument() as HTMLElement;
      const firstItem = panel.querySelector('button.menu-item-button') as HTMLButtonElement;

      await userEvent.click(firstItem);

      await waitFor(() => {
        expect(readout.textContent).toContain('itemClickedCount=1');
        expect(readout.textContent).toContain('lastClickedId=1');
      });
    });
  });

  describe('trigger directive — hover behavior', () => {
    it('does not open on hover when hover is disabled (default)', async () => {
      const fixture = createTriggerMenu();
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      // wait beyond the open delay to be confident hover did not schedule an open
      await vitestBrowserUtils.sleep(250);

      expect(queryOverlayMenuInDocument()).toBeNull();
    });

    it('opens on hover when hover is enabled', async () => {
      const fixture = createTriggerMenu({ hover: true, openDelay: 50, closeDelay: 80 });
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());
    });

    it('keeps the menu open while moving from the trigger to the panel, then closes after leaving both', async () => {
      const fixture = createTriggerMenu({ hover: true, openDelay: 50, closeDelay: 80 });
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      const panel = queryOverlayMenuInDocument() as HTMLElement;

      // moving onto the panel fires mouseleave on the trigger (scheduling a close) and mouseenter on the
      // panel (which must cancel that close) — the menu must stay open across the trigger→panel gap
      await userEvent.hover(panel);

      // wait well past the close grace period to prove the panel hover cancelled the pending close
      await vitestBrowserUtils.sleep(200);

      expect(queryOverlayMenuInDocument()).not.toBeNull();

      // leaving the panel (now over neither trigger nor panel) must close the menu after the grace period
      await userEvent.unhover(panel);

      await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
    });

    it('closes after leaving the trigger without entering the panel', async () => {
      const fixture = createTriggerMenu({ hover: true, openDelay: 50, closeDelay: 80 });
      const trigger = queryByTestId(fixture, 'trigger');
      const outside = queryByTestId(fixture, 'outside-target');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);
      await userEvent.hover(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());

      // move the pointer away to an element that is neither the trigger nor the panel
      await userEvent.hover(outside);

      await waitFor(() => expect(queryOverlayMenuInDocument()).toBeNull());
    });

    it('still opens on click when hover is enabled (additive)', async () => {
      const fixture = createTriggerMenu({ hover: true, openDelay: 50, closeDelay: 80 });
      const trigger = queryByTestId(fixture, 'trigger');

      await flush(fixture);
      vitestBrowserUtils.stubPointerCapture(trigger);

      await userEvent.click(trigger);

      await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());
    });
  });
});

import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { DropDownSelector, type DropDownSelectorPosition, type DropDownSelectorSize } from './drop-down-selector';
import { type DropDownSelectorSelectionMode, type SelectionValue } from './drop-down-selector-brain';
import { type IconName } from '../icon/icon-brain';

const FRUIT_ITEMS: SelectionValue<string>[] = [
  { value: 'apple', display: 'Apple' },
  { value: 'banana', display: 'Banana' },
  { value: 'cherry', display: 'Cherry' },
];

const SEARCH_ITEMS: SelectionValue<string>[] = [
  { value: 'active', display: 'Active only' },
  { value: 'deleted', display: 'Deleted only' },
  { value: 'all', display: 'Show all' },
  { value: 'archived', display: 'Archived' },
];

@Component({
  selector: 'test-drop-down-selector-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownSelector],
  host: { class: 'block' },
  template: `
    <org-drop-down-selector
      data-testid="selector"
      [items]="items()"
      [label]="label()"
      [selectionMode]="selectionMode()"
      [disabled]="disabled()"
      [size]="size()"
      [position]="position()"
      [iconName]="iconName()"
      [showLabelWithValue]="showLabelWithValue()"
      [hasSearch]="hasSearch()"
      [(selectedItems)]="selectedItems"
      (selectedItemsChange)="onSelectedItemsChange($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class DropDownSelectorHost {
  public readonly selectorComponent = viewChild.required(DropDownSelector);

  public readonly items = signal<SelectionValue<string>[]>(FRUIT_ITEMS);
  public readonly label = signal<string>('Fruit');
  public readonly selectionMode = signal<DropDownSelectorSelectionMode>('single');
  public readonly disabled = signal<boolean>(false);
  public readonly size = signal<DropDownSelectorSize>('base');
  public readonly position = signal<DropDownSelectorPosition>('below');
  public readonly iconName = signal<IconName | undefined>(undefined);
  public readonly showLabelWithValue = signal<boolean>(false);
  public readonly hasSearch = signal<boolean>(false);

  public readonly selectedItems = signal<SelectionValue<string>[]>([]);

  private readonly _selectedChangeCount = signal<number>(0);

  protected readout(): string {
    return [
      `selectedValues=[${this.selectedItems()
        .map((item) => item.value)
        .join(',')}]`,
      `selectedCount=${this.selectedItems().length}`,
      `selectedChangeCount=${this._selectedChangeCount()}`,
    ].join(' ');
  }

  protected onSelectedItemsChange(items: SelectionValue<string>[]): void {
    this.selectedItems.set(items);
    this._selectedChangeCount.update((value) => value + 1);
  }
}

type DropDownSelectorHostConfig = {
  items?: SelectionValue<string>[];
  label?: string;
  selectionMode?: DropDownSelectorSelectionMode;
  disabled?: boolean;
  size?: DropDownSelectorSize;
  position?: DropDownSelectorPosition;
  iconName?: IconName | undefined;
  showLabelWithValue?: boolean;
  hasSearch?: boolean;
  selectedItems?: SelectionValue<string>[];
};

describe('DropDownSelector (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createSelector = (config: DropDownSelectorHostConfig = {}): ComponentFixture<DropDownSelectorHost> =>
    createFixture(DropDownSelectorHost, (instance) => {
      if (config.items !== undefined) {
        instance.items.set(config.items);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.selectionMode !== undefined) {
        instance.selectionMode.set(config.selectionMode);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.position !== undefined) {
        instance.position.set(config.position);
      }

      if (config.iconName !== undefined) {
        instance.iconName.set(config.iconName);
      }

      if (config.showLabelWithValue !== undefined) {
        instance.showLabelWithValue.set(config.showLabelWithValue);
      }

      if (config.hasSearch !== undefined) {
        instance.hasSearch.set(config.hasSearch);
      }

      if (config.selectedItems !== undefined) {
        instance.selectedItems.set(config.selectedItems);
      }
    });

  // the cdk overlay panel renders outside the fixture, attached to document.body
  const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-drop-down-selector-overlay');

  const waitForOverlayPanel = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

    return queryOverlayPanel() as HTMLElement;
  };

  const getTriggerButton = (host: HTMLElement): HTMLButtonElement => host.querySelector('button') as HTMLButtonElement;

  const getSearchInput = (panel: HTMLElement): HTMLInputElement =>
    panel.querySelector('.menu-search input.native') as HTMLInputElement;

  const getOptionButtons = (panel: HTMLElement): HTMLButtonElement[] =>
    Array.from(panel.querySelectorAll<HTMLButtonElement>('button[role="option"]'));

  // parks the virtual cursor on the trigger before opening so the overlay never mounts under the cursor
  const focusTrigger = async (host: HTMLElement): Promise<HTMLButtonElement> => {
    const trigger = getTriggerButton(host);

    await userEvent.hover(trigger);
    trigger.focus();

    return trigger;
  };

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes / backdrops left in the body so a stale panel can't leak forward
    document.querySelectorAll('.org-drop-down-selector-overlay').forEach((panel) => panel.remove());
    document.querySelectorAll('.cdk-overlay-backdrop').forEach((backdrop) => backdrop.remove());
  });

  describe('host data attributes', () => {
    it('renders the default host data attributes', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await flush(fixture);

      expect(host.getAttribute('data-selection-mode')).toBe('single');
      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-state')).toBe('closed');
      expect(host.getAttribute('data-has-value')).toBeNull();
      expect(host.getAttribute('data-has-search')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects the selection-mode host attribute', async () => {
      const fixture = createSelector({ selectionMode: 'multiple' });
      const host = queryByTestId(fixture, 'selector');

      await waitFor(() => expect(host.getAttribute('data-selection-mode')).toBe('multiple'));
    });

    it('reflects the size host attribute', async () => {
      const fixture = createSelector({ size: 'lg' });
      const host = queryByTestId(fixture, 'selector');

      await waitFor(() => expect(host.getAttribute('data-size')).toBe('lg'));
    });

    it('reflects the has-search host attribute', async () => {
      const fixture = createSelector({ hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await waitFor(() => expect(host.getAttribute('data-has-search')).toBe(''));
    });

    it('reflects the aria-disabled host attribute', async () => {
      const fixture = createSelector({ disabled: true });
      const host = queryByTestId(fixture, 'selector');

      await waitFor(() => expect(host.getAttribute('aria-disabled')).toBe('true'));
    });

    it('reflects the has-value host attribute when a selection exists', async () => {
      const fixture = createSelector({ selectedItems: [FRUIT_ITEMS[2]] });
      const host = queryByTestId(fixture, 'selector');

      await waitFor(() => expect(host.getAttribute('data-has-value')).toBe(''));
    });
  });

  describe('trigger open and close', () => {
    it('opens the menu when clicking the trigger', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('closes the menu when clicking the trigger again', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await userEvent.click(trigger);
      await waitForOverlayPanel();

      // the transparent backdrop sits over the trigger once open, so dispatch the click directly to exercise
      // the trigger's toggle-closed path instead of letting playwright hit-test into the backdrop
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
      await waitFor(() => expect(queryOverlayPanel()).toBeNull());
    });

    it('closes the menu when clicking the backdrop', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      await waitForOverlayPanel();

      const backdrop = document.body.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      await userEvent.click(backdrop);

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });
  });

  describe('trigger keyboard', () => {
    it('opens the menu on ArrowDown when closed', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await focusTrigger(host);
      await userEvent.keyboard('{ArrowDown}');

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('opens the menu on ArrowUp when closed', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await focusTrigger(host);
      await userEvent.keyboard('{ArrowUp}');

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('closes the menu on Escape when open', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await userEvent.click(trigger);
      await waitForOverlayPanel();

      trigger.focus();
      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });
  });

  describe('active descendant navigation', () => {
    it('seeds the active descendant to the first item when opening', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await focusTrigger(host);
      await userEvent.click(getTriggerButton(host));

      const panel = await waitForOverlayPanel();

      await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
    });

    it('seeds the active descendant to the first selected item when opening', async () => {
      const fixture = createSelector({ selectedItems: [FRUIT_ITEMS[2]] });
      const host = queryByTestId(fixture, 'selector');

      await focusTrigger(host);
      await userEvent.click(getTriggerButton(host));

      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const options = getOptionButtons(panel);

        // cherry is the third item — index 2
        expect(options[2].getAttribute('data-active')).toBe('');
        expect(options[0].getAttribute('data-active')).toBeNull();
      });
    });

    it('advances the active descendant on ArrowDown with wrap', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBe(''));

      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

      // wraps back to first item
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
    });

    it('retreats the active descendant on ArrowUp with wrap', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      // wraps from first item back to last
      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBe(''));
    });

    it('jumps the active descendant to the first item on Home', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('{End}');
      await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

      await userEvent.keyboard('{Home}');
      await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
    });

    it('jumps the active descendant to the last item on End', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('{End}');

      await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));
    });
  });

  describe('keyboard selection', () => {
    it('selects the active item on Enter', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[banana]'));
    });

    it('selects the active item on Space', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard(' ');

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple]'));
    });
  });

  describe('type-ahead', () => {
    it('jumps the active descendant by display prefix', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('c');

      // c → "Cherry" (index 2)
      await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));
    });

    it('resets the type-ahead buffer after the idle delay', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('c');
      await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

      // wait past the 500ms idle reset so the buffer clears before the next keypress
      await new Promise((resolve) => setTimeout(resolve, 600));

      await userEvent.keyboard('a');

      // if the buffer had persisted as "ca" no item would match; with the reset, "a" matches Apple (index 0)
      await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
    });
  });

  describe('mouse selection', () => {
    it('selects and closes the menu when clicking an option in single mode', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await userEvent.click(getOptionButtons(panel)[0]);

      await waitFor(() => {
        expect(readout.textContent).toContain('selectedValues=[apple]');
        expect(host.getAttribute('data-state')).toBe('closed');
      });
    });

    it('toggles selection and keeps the menu open when clicking options in multi mode', async () => {
      const fixture = createSelector({ selectionMode: 'multiple' });
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await userEvent.click(getOptionButtons(panel)[0]);
      await waitFor(() => {
        expect(readout.textContent).toContain('selectedValues=[apple]');
        expect(host.getAttribute('data-state')).toBe('open');
      });

      await userEvent.click(getOptionButtons(panel)[1]);
      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple,banana]'));

      // clicking apple again deselects it
      await userEvent.click(getOptionButtons(panel)[0]);
      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[banana]'));
    });
  });

  describe('clear selection footer', () => {
    it('appears in multi mode with a selection', async () => {
      const fixture = createSelector({ selectionMode: 'multiple', selectedItems: [FRUIT_ITEMS[0], FRUIT_ITEMS[1]] });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const clearButton = panel.querySelector('.menu-item-clear');

        expect(clearButton).not.toBeNull();
        expect(clearButton?.textContent?.includes('Clear selection')).toBe(true);
      });
    });

    it('is hidden in single mode', async () => {
      const fixture = createSelector({ selectedItems: [FRUIT_ITEMS[2]] });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      expect(panel.querySelector('.menu-item-clear')).toBeNull();
    });

    it('clears the selection and closes the menu when clicked', async () => {
      const fixture = createSelector({ selectionMode: 'multiple', selectedItems: [FRUIT_ITEMS[0], FRUIT_ITEMS[1]] });
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      const clearButton = panel.querySelector('.menu-item-clear') as HTMLButtonElement;
      await userEvent.click(clearButton);

      await waitFor(() => {
        expect(readout.textContent).toContain('selectedValues=[]');
        expect(host.getAttribute('data-state')).toBe('closed');
      });
    });
  });

  describe('trigger display', () => {
    it('shows only the label when there is no selection', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await waitFor(() => expect(trigger.querySelector('.trigger-label')?.textContent?.trim()).toBe('Fruit'));
      expect(trigger.querySelector('.trigger-value')).toBeNull();
      expect(trigger.querySelector('.trigger-count')).toBeNull();
      expect(trigger.querySelector('.trigger-separator')).toBeNull();
    });

    it('shows the value and hides the label in single mode by default', async () => {
      const fixture = createSelector({ selectedItems: [FRUIT_ITEMS[2]] });
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await waitFor(() => {
        expect(trigger.querySelector('.trigger-value')?.textContent?.trim()).toBe('Cherry');
        expect(trigger.querySelector('.trigger-label')).toBeNull();
        expect(trigger.querySelector('.trigger-separator')).toBeNull();
      });
    });

    it('shows the label and value when showLabelWithValue is on', async () => {
      const fixture = createSelector({ showLabelWithValue: true, selectedItems: [FRUIT_ITEMS[2]] });
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await waitFor(() => {
        expect(trigger.querySelector('.trigger-label')?.textContent?.trim()).toBe('Fruit');
        expect(trigger.querySelector('.trigger-separator')).not.toBeNull();
        expect(trigger.querySelector('.trigger-value')?.textContent?.trim()).toBe('Cherry');
      });
    });

    it('shows the count chip in multi mode when two or more are selected', async () => {
      const fixture = createSelector({ selectionMode: 'multiple', selectedItems: [FRUIT_ITEMS[0], FRUIT_ITEMS[1]] });
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await waitFor(() => {
        const chip = trigger.querySelector('.trigger-count');

        expect(chip).not.toBeNull();
        expect(chip?.textContent?.trim()).toBe('2 selected');
        expect(trigger.querySelector('.trigger-value')).toBeNull();
      });
    });

    it('renders the pre icon when iconName is set', async () => {
      const fixture = createSelector({ iconName: 'settings' });
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await waitFor(() => {
        const preIcon = trigger.querySelector('.pre-icon');

        expect(preIcon).not.toBeNull();
        expect(preIcon?.getAttribute('data-icon')).toBe('settings');
      });
    });
  });

  describe('disabled', () => {
    it('does not open on trigger click when disabled', async () => {
      const fixture = createSelector({ disabled: true });
      const host = queryByTestId(fixture, 'selector');

      // the native trigger is disabled, so playwright refuses to click it; dispatch the click directly to
      // verify the brain's disabled guard keeps the menu closed
      getTriggerButton(host).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      await flush(fixture);
      expect(host.getAttribute('data-state')).toBe('closed');
      expect(queryOverlayPanel()).toBeNull();
    });

    it('does not open on keyboard ArrowDown when disabled', async () => {
      const fixture = createSelector({ disabled: true });
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      // flip-then-flush already applied via config; warm up the listener so the first dispatch does not
      // read a stale signal-input snapshot. the inner native button is disabled, so we dispatch the keydown
      // directly to verify the brain's disabled guard rather than relying on focus
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await flush(fixture);
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await flush(fixture);

      expect(host.getAttribute('data-state')).toBe('closed');
    });
  });

  describe('inline search', () => {
    it('renders the search input inside the panel', async () => {
      const fixture = createSelector({ hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await waitFor(() => expect(getSearchInput(panel)).not.toBeNull());
    });

    it('auto-focuses the search input when the menu opens', async () => {
      const fixture = createSelector({ hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const searchInput = getSearchInput(panel);

        expect(document.activeElement).toBe(searchInput);
      });
    });

    it('filters options case-insensitively while typing in the search', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      await userEvent.type(searchInput, 'ONLY');

      await waitFor(() => {
        const values = getOptionButtons(panel).map((option) => option.textContent?.trim());

        expect(values).toEqual(['Active only', 'Deleted only']);
      });
    });

    it('renders the empty state when the query matches nothing', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      await userEvent.type(searchInput, 'zzz-no-match');

      await waitFor(() => {
        expect(getOptionButtons(panel)).toHaveLength(0);

        const emptyState = panel.querySelector('.menu-empty');

        expect(emptyState?.textContent?.trim()).toBe('No results');
      });
    });

    it('resets the active descendant to the first filtered item while typing', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      // jump active descendant to the last item before typing
      searchInput.focus();
      await userEvent.keyboard('{End}');
      await waitFor(() => {
        const options = getOptionButtons(panel);

        expect(options[options.length - 1].getAttribute('data-active')).toBe('');
      });

      await userEvent.type(searchInput, 'only');

      await waitFor(() => {
        const options = getOptionButtons(panel);

        // filtered to "Active only", "Deleted only" — active descendant should reset to first (Active only)
        expect(options[0].getAttribute('data-active')).toBe('');
      });
    });

    it('advances the active descendant on ArrowDown in the search', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      await userEvent.type(searchInput, 'only');
      await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));

      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBe(''));
    });

    it('selects the active item on Enter in the search', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      await userEvent.type(searchInput, 'only');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toContain('selectedValues=[active]'));
    });

    it('closes the menu on Escape in the search', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      searchInput.focus();
      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });

    it('clears the search query on close so reopening shows the full list', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const firstPanel = await waitForOverlayPanel();
      const firstSearchInput = getSearchInput(firstPanel);

      await userEvent.type(firstSearchInput, 'only');
      await waitFor(() => expect(getOptionButtons(firstPanel)).toHaveLength(2));

      // close via Escape
      firstSearchInput.focus();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));

      // reopen
      await userEvent.click(getTriggerButton(host));
      const secondPanel = await waitForOverlayPanel();
      const secondSearchInput = getSearchInput(secondPanel);

      await waitFor(() => {
        expect(getOptionButtons(secondPanel)).toHaveLength(SEARCH_ITEMS.length);
        expect(secondSearchInput.value).toBe('');
      });
    });

    it('skips trigger type-ahead while the inline search query is active', async () => {
      const fixture = createSelector({ items: SEARCH_ITEMS, hasSearch: true });
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await userEvent.click(trigger);
      const panel = await waitForOverlayPanel();
      const searchInput = getSearchInput(panel);

      await userEvent.type(searchInput, 'only');

      // filter narrows to ["Active only", "Deleted only"] and resets active descendant to index 0
      await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));

      // dispatch a printable keydown to the trigger; with a search query active, the trigger handler must
      // skip type-ahead — without the gate, 'd' would advance the active descendant to "Deleted only" (index 1)
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));
      await flush(fixture);

      expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe('');
      expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBeNull();
    });
  });

  describe('aria attributes', () => {
    it('reflects the open state in the trigger aria-expanded', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await flush(fixture);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      await userEvent.click(trigger);
      await waitForOverlayPanel();

      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
    });

    it('points the trigger aria-controls at the panel when open', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const trigger = getTriggerButton(host);

      await userEvent.click(trigger);
      const panel = await waitForOverlayPanel();
      const menuPanel = panel.querySelector('.menu-panel') as HTMLElement;

      await waitFor(() => expect(trigger.getAttribute('aria-controls')).toBe(menuPanel.id));
    });

    it('tracks the active option in the trigger aria-activedescendant', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      // the opening click already parked the cursor on the trigger, so just route keyboard to it; hovering
      // again would be intercepted by the transparent overlay backdrop
      const trigger = getTriggerButton(host);
      trigger.focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => {
        const activeOption = getOptionButtons(panel)[1];

        expect(trigger.getAttribute('aria-activedescendant')).toBe(activeOption.id);
      });
    });

    it('gives the panel a listbox role and aria-multiselectable reflecting the mode', async () => {
      const fixture = createSelector({ selectionMode: 'multiple' });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();
      const menuPanel = panel.querySelector('.menu-panel') as HTMLElement;

      expect(menuPanel.getAttribute('role')).toBe('listbox');
      expect(menuPanel.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('reflects the selection in the option aria-selected', async () => {
      const fixture = createSelector({ selectedItems: [FRUIT_ITEMS[2]] });
      const host = queryByTestId(fixture, 'selector');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const options = getOptionButtons(panel);

        expect(options[0].getAttribute('aria-selected')).toBe('false');
        expect(options[2].getAttribute('aria-selected')).toBe('true');
      });
    });
  });

  describe('output events', () => {
    it('emits selectedItemsChange on selection', async () => {
      const fixture = createSelector();
      const host = queryByTestId(fixture, 'selector');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getTriggerButton(host));
      const panel = await waitForOverlayPanel();

      await userEvent.click(getOptionButtons(panel)[0]);

      await waitFor(() => expect(readout.textContent).toContain('selectedChangeCount=1'));
    });
  });
});

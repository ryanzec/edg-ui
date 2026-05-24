import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { DropDownSelector, type DropDownSelectorPosition, type DropDownSelectorSize } from './drop-down-selector';
import {
  type DropDownSelectorSelectionMode,
  type SelectionValue,
} from '../drop-down-selector/drop-down-selector-brain';
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

/** queries the cdk overlay panel for the drop-down selector; overlays render outside the canvas. */
const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-drop-down-selector-overlay');

/** waits for the overlay panel to mount and returns its root element. */
const waitForOverlayPanel = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

  return queryOverlayPanel() as HTMLElement;
};

/** returns the native trigger button rendered inside the drop-down selector host. */
const getTriggerButton = (host: HTMLElement): HTMLButtonElement => host.querySelector('button') as HTMLButtonElement;

/** returns the inline-search native input rendered inside the panel when hasSearch is enabled. */
const getSearchInput = (panel: HTMLElement): HTMLInputElement =>
  panel.querySelector('.menu-search input.native') as HTMLInputElement;

/** returns the menu option buttons in render order. */
const getOptionButtons = (panel: HTMLElement): HTMLButtonElement[] =>
  Array.from(panel.querySelectorAll<HTMLButtonElement>('button[role="option"]'));

@Component({
  selector: 'story-drop-down-selector-tests-shell',
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
      [selectedItems]="selectedItems()"
      (selectedItemsChange)="onSelectedItemsChange($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-mode-multiple" (click)="selectionMode.set('multiple')">
        mode-multiple
      </button>
      <button type="button" data-testid="ctl-mode-single" (click)="selectionMode.set('single')">mode-single</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-show-label-on" (click)="showLabelWithValue.set(true)">
        show-label-on
      </button>
      <button type="button" data-testid="ctl-has-search-on" (click)="hasSearch.set(true)">has-search-on</button>
      <button type="button" data-testid="ctl-icon-settings" (click)="iconName.set('settings')">icon-settings</button>
      <button type="button" data-testid="ctl-items-search" (click)="items.set(searchItems)">items-search</button>
      <button type="button" data-testid="ctl-preselect-cherry" (click)="preselectCherry()">preselect-cherry</button>
      <button type="button" data-testid="ctl-preselect-apple-banana" (click)="preselectAppleBanana()">
        preselect-apple-banana
      </button>
    </div>
  `,
})
class StoryDropDownSelectorTestsShell {
  protected readonly searchItems = SEARCH_ITEMS;

  protected readonly items = signal<SelectionValue<string>[]>(FRUIT_ITEMS);
  protected readonly label = signal<string>('Fruit');
  protected readonly selectionMode = signal<DropDownSelectorSelectionMode>('single');
  protected readonly disabled = signal<boolean>(false);
  protected readonly size = signal<DropDownSelectorSize>('base');
  protected readonly position = signal<DropDownSelectorPosition>('below');
  protected readonly iconName = signal<IconName | undefined>(undefined);
  protected readonly showLabelWithValue = signal<boolean>(false);
  protected readonly hasSearch = signal<boolean>(false);

  protected readonly selectedItems = signal<SelectionValue<string>[]>([]);

  protected readonly selectedChangeCount = signal<number>(0);

  protected readout(): string {
    return [
      `selectedValues=[${this.selectedItems()
        .map((item) => item.value)
        .join(',')}]`,
      `selectedCount=${this.selectedItems().length}`,
      `selectedChangeCount=${this.selectedChangeCount()}`,
    ].join(' ');
  }

  protected onSelectedItemsChange(items: SelectionValue<string>[]): void {
    this.selectedItems.set(items);
    this.selectedChangeCount.update((value) => value + 1);
  }

  protected preselectCherry(): void {
    this.selectedItems.set([FRUIT_ITEMS[2]]);
  }

  protected preselectAppleBanana(): void {
    this.selectedItems.set([FRUIT_ITEMS[0], FRUIT_ITEMS[1]]);
  }
}

const meta: Meta = {
  title: 'Core/Components/Drop Down Selector/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-drop-down-selector-tests-shell />`,
  moduleMetadata: { imports: [StoryDropDownSelectorTestsShell] },
});

// host data-attributes

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await expect(host.getAttribute('data-selection-mode')).toBe('single');
    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-state')).toBe('closed');
    await expect(host.getAttribute('data-has-value')).toBeNull();
    await expect(host.getAttribute('data-has-search')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsSelectionModeHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-mode-multiple'));

    await waitFor(() => expect(host.getAttribute('data-selection-mode')).toBe('multiple'));
  },
};

export const ReflectsSizeHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    await waitFor(() => expect(host.getAttribute('data-size')).toBe('lg'));
  },
};

export const ReflectsHasSearchHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));

    await waitFor(() => expect(host.getAttribute('data-has-search')).toBe(''));
  },
};

export const ReflectsAriaDisabledHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(host.getAttribute('aria-disabled')).toBe('true'));
  },
};

export const ReflectsHasValueHostAttributeWhenSelectionExists: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-preselect-cherry'));

    await waitFor(() => expect(host.getAttribute('data-has-value')).toBe(''));
  },
};

// trigger open / close

export const ClickingTriggerOpensMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(getTriggerButton(host));

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const ClickingTriggerAgainClosesMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    await waitForOverlayPanel();

    await userEvent.click(trigger);

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    await waitFor(() => expect(queryOverlayPanel()).toBeNull());
  },
};

export const BackdropClickClosesMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(getTriggerButton(host));
    await waitForOverlayPanel();

    const backdrop = document.body.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    await userEvent.click(backdrop);

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

// trigger keyboard

export const ArrowDownOnClosedTriggerOpensMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const ArrowUpOnClosedTriggerOpensMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const EscapeOnOpenTriggerClosesMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

export const OpeningMenuSeedsActiveDescendantToFirstItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = getOptionButtons(panel);

      expect(options[0].getAttribute('data-active')).toBe('');
    });
  },
};

export const OpeningMenuSeedsActiveDescendantToFirstSelectedItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-preselect-cherry'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = getOptionButtons(panel);

      // cherry is the third item — index 2
      expect(options[2].getAttribute('data-active')).toBe('');
      expect(options[0].getAttribute('data-active')).toBeNull();
    });
  },
};

export const ArrowDownAdvancesActiveDescendantWithWrap: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBe(''));

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

    // wraps back to first item
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
  },
};

export const ArrowUpRetreatsActiveDescendantWithWrap: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    // wraps from first item back to last
    await userEvent.keyboard('{ArrowUp}');

    await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBe(''));
  },
};

export const HomeKeyJumpsActiveDescendantToFirst: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
  },
};

export const EndKeyJumpsActiveDescendantToLast: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('{End}');

    await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));
  },
};

export const EnterOnTriggerSelectsActiveItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[banana]'));
  },
};

export const SpaceOnTriggerSelectsActiveItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard(' ');

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[apple]'));
  },
};

export const TypeAheadJumpsActiveDescendantByDisplayPrefix: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('c');

    // c → "Cherry" (index 2)
    await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));
  },
};

export const TypeAheadBufferResetsAfterIdleDelay: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('c');
    await waitFor(() => expect(getOptionButtons(panel)[2].getAttribute('data-active')).toBe(''));

    // wait past the 500ms idle reset so the buffer clears before the next keypress
    await new Promise((resolve) => setTimeout(resolve, 600));

    await userEvent.keyboard('a');

    // if the buffer had persisted as "ca" no item would match; with the reset, "a" matches Apple (index 0)
    await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));
  },
};

// selection (mouse)

export const ClickingOptionInSingleModeSelectsAndClosesMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getTriggerButton(host));
    const panel = await waitForOverlayPanel();

    await userEvent.click(getOptionButtons(panel)[0]);

    await waitFor(() => {
      expect(readout.textContent).toContain('selectedValues=[apple]');
      expect(host.getAttribute('data-state')).toBe('closed');
    });
  },
};

export const ClickingOptionInMultiModeTogglesSelectionAndKeepsMenuOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-mode-multiple'));
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
  },
};

export const ClearSelectionFooterAppearsInMultiModeWithSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-mode-multiple'));
    await userEvent.click(canvas.getByTestId('ctl-preselect-apple-banana'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const clearButton = panel.querySelector('.menu-item-clear');

      expect(clearButton).not.toBeNull();
      expect(clearButton?.textContent?.includes('Clear selection')).toBe(true);
    });
  },
};

export const ClearSelectionFooterIsHiddenInSingleMode: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-preselect-cherry'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await expect(panel.querySelector('.menu-item-clear')).toBeNull();
  },
};

export const ClearSelectionFooterClearsSelectionAndClosesMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-mode-multiple'));
    await userEvent.click(canvas.getByTestId('ctl-preselect-apple-banana'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    const clearButton = panel.querySelector('.menu-item-clear') as HTMLButtonElement;
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(readout.textContent).toContain('selectedValues=[]');
      expect(host.getAttribute('data-state')).toBe('closed');
    });
  },
};

// trigger display

export const ShowsOnlyLabelWhenNoSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    const trigger = getTriggerButton(host);

    await waitFor(() => expect(trigger.querySelector('.trigger-label')?.textContent?.trim()).toBe('Fruit'));
    await expect(trigger.querySelector('.trigger-value')).toBeNull();
    await expect(trigger.querySelector('.trigger-count')).toBeNull();
    await expect(trigger.querySelector('.trigger-separator')).toBeNull();
  },
};

export const ShowsValueAndHidesLabelInSingleModeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-preselect-cherry'));

    const trigger = getTriggerButton(host);

    await waitFor(() => {
      expect(trigger.querySelector('.trigger-value')?.textContent?.trim()).toBe('Cherry');
      expect(trigger.querySelector('.trigger-label')).toBeNull();
      expect(trigger.querySelector('.trigger-separator')).toBeNull();
    });
  },
};

export const ShowsLabelAndValueWhenShowLabelWithValueIsOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-show-label-on'));
    await userEvent.click(canvas.getByTestId('ctl-preselect-cherry'));

    const trigger = getTriggerButton(host);

    await waitFor(() => {
      expect(trigger.querySelector('.trigger-label')?.textContent?.trim()).toBe('Fruit');
      expect(trigger.querySelector('.trigger-separator')).not.toBeNull();
      expect(trigger.querySelector('.trigger-value')?.textContent?.trim()).toBe('Cherry');
    });
  },
};

export const ShowsCountChipInMultiModeWhenTwoOrMoreSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-mode-multiple'));
    await userEvent.click(canvas.getByTestId('ctl-preselect-apple-banana'));

    const trigger = getTriggerButton(host);

    await waitFor(() => {
      const chip = trigger.querySelector('.trigger-count');

      expect(chip).not.toBeNull();
      expect(chip?.textContent?.trim()).toBe('2 selected');
      expect(trigger.querySelector('.trigger-value')).toBeNull();
    });
  },
};

export const RendersPreIconWhenIconNameIsSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-icon-settings'));

    const trigger = getTriggerButton(host);

    await waitFor(() => {
      const preIcon = trigger.querySelector('.pre-icon');

      expect(preIcon).not.toBeNull();
      expect(preIcon?.getAttribute('data-icon')).toBe('settings');
    });
  },
};

// disabled

export const DisabledSelectorDoesNotOpenOnTriggerClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await userEvent.click(getTriggerButton(host));

    await expect(host.getAttribute('data-state')).toBe('closed');
    await expect(queryOverlayPanel()).toBeNull();
  },
};

export const DisabledSelectorDoesNotOpenOnKeyboardArrowDown: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const trigger = getTriggerButton(host);
    // the inner native button has the `disabled` attribute set, so we dispatch the keydown
    // directly to verify the brain's disabled guard rather than relying on focus
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    await expect(host.getAttribute('data-state')).toBe('closed');
  },
};

// inline search

export const HasSearchRendersSearchInputInsidePanel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await waitFor(() => expect(getSearchInput(panel)).not.toBeNull());
  },
};

export const SearchInputAutoFocusesWhenMenuOpens: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const searchInput = getSearchInput(panel);

      expect(document.activeElement).toBe(searchInput);
    });
  },
};

export const TypingInSearchFiltersOptionsCaseInsensitively: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();
    const searchInput = getSearchInput(panel);

    await userEvent.type(searchInput, 'ONLY');

    await waitFor(() => {
      const values = getOptionButtons(panel).map((option) => option.textContent?.trim());

      expect(values).toEqual(['Active only', 'Deleted only']);
    });
  },
};

export const TypingNonMatchingQueryRendersEmptyState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();
    const searchInput = getSearchInput(panel);

    await userEvent.type(searchInput, 'zzz-no-match');

    await waitFor(() => {
      expect(getOptionButtons(panel)).toHaveLength(0);

      const emptyState = panel.querySelector('.menu-empty');

      expect(emptyState?.textContent?.trim()).toBe('No results');
    });
  },
};

export const TypingResetsActiveDescendantToFirstFilteredItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(trigger);

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
  },
};

export const SearchArrowDownAdvancesActiveDescendant: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();
    const searchInput = getSearchInput(panel);

    await userEvent.type(searchInput, 'only');

    await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));

    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBe(''));
  },
};

export const SearchEnterSelectsActiveItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();
    const searchInput = getSearchInput(panel);

    await userEvent.type(searchInput, 'only');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('selectedValues=[active]'));
  },
};

export const SearchEscapeClosesMenu: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();
    const searchInput = getSearchInput(panel);

    searchInput.focus();
    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

export const ClosingMenuClearsSearchQuerySoReopeningShowsFullList: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
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
  },
};

export const TriggerTypeAheadIsSkippedWhileInlineSearchQueryIsActive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(canvas.getByTestId('ctl-items-search'));
    await userEvent.click(canvas.getByTestId('ctl-has-search-on'));
    await userEvent.click(trigger);

    const panel = await waitForOverlayPanel();
    const searchInput = getSearchInput(panel);

    await userEvent.type(searchInput, 'only');

    // filter narrows to ["Active only", "Deleted only"] and resets active descendant to index 0
    await waitFor(() => expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe(''));

    // dispatch a printable keydown to the trigger; with a search query active, the trigger
    // handler must skip type-ahead — without the gate, 'd' would advance the active descendant
    // to "Deleted only" (index 1)
    fireEvent.keyDown(trigger, { key: 'd' });

    await expect(getOptionButtons(panel)[0].getAttribute('data-active')).toBe('');
    await expect(getOptionButtons(panel)[1].getAttribute('data-active')).toBeNull();
  },
};

// aria attributes

export const TriggerAriaExpandedReflectsOpenState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(trigger);
    await waitForOverlayPanel();

    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
  },
};

export const TriggerAriaControlsPointsAtPanelWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();
    const menuPanel = panel.querySelector('.menu-panel') as HTMLElement;

    await waitFor(() => expect(trigger.getAttribute('aria-controls')).toBe(menuPanel.id));
  },
};

export const TriggerAriaActivedescendantTracksActiveOption: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const trigger = getTriggerButton(host);

    await userEvent.click(trigger);
    const panel = await waitForOverlayPanel();

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => {
      const activeOption = getOptionButtons(panel)[1];

      expect(trigger.getAttribute('aria-activedescendant')).toBe(activeOption.id);
    });
  },
};

export const PanelHasListboxRoleAndAriaMultiselectableReflectingMode: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-mode-multiple'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();
    const menuPanel = panel.querySelector('.menu-panel') as HTMLElement;

    await expect(menuPanel.getAttribute('role')).toBe('listbox');
    await expect(menuPanel.getAttribute('aria-multiselectable')).toBe('true');
  },
};

export const OptionAriaSelectedReflectsSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');

    await userEvent.click(canvas.getByTestId('ctl-preselect-cherry'));
    await userEvent.click(getTriggerButton(host));

    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const options = getOptionButtons(panel);

      expect(options[0].getAttribute('aria-selected')).toBe('false');
      expect(options[2].getAttribute('aria-selected')).toBe('true');
    });
  },
};

// output events

export const EmitsSelectedItemsChangeOnSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('selector');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getTriggerButton(host));
    const panel = await waitForOverlayPanel();

    await userEvent.click(getOptionButtons(panel)[0]);

    await waitFor(() => expect(readout.textContent).toContain('selectedChangeCount=1'));
  },
};

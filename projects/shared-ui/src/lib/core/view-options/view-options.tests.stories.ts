import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ViewOptions, type ViewField } from './view-options';

const buildFields = (): ViewField[] => [
  { name: 'name', label: 'Name', enabled: true, locked: true, iconName: 'at-sign' },
  { name: 'email', label: 'Email', enabled: true, iconName: 'at-sign' },
  { name: 'role', label: 'Role', enabled: true, iconName: 'shield' },
  { name: 'status', label: 'Status', enabled: false, iconName: 'circle' },
];

@Component({
  selector: 'story-view-options-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
        max-width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <org-view-options [(fields)]="fields" />
    <pre class="text-xs pt-2" data-testid="view-options-readout">{{ readout() }}</pre>
  `,
})
class StoryViewOptionsTestsShell {
  protected readonly fields = signal<ViewField[]>(buildFields());

  protected readonly readout = (): string =>
    this.fields()
      .map((field) => `${field.name}:${field.enabled ? '1' : '0'}${field.locked ? '!' : ''}`)
      .join(',');
}

@Component({
  selector: 'story-view-options-labels-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
        max-width: 22rem; /* 352px */
      }
    `,
  ],
  template: ` <org-view-options [(fields)]="fields" [panelLabel]="panelLabel()" [sectionLabel]="sectionLabel()" /> `,
})
class StoryViewOptionsLabelsTestsShell {
  protected readonly fields = signal<ViewField[]>(buildFields());
  protected readonly panelLabel = signal<string>('Customize view');
  protected readonly sectionLabel = signal<string>('Columns');
}

@Component({
  selector: 'story-view-options-closed-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
        max-width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <org-view-options [(fields)]="fields" (closed)="onClose()" />
    <pre class="text-xs pt-2" data-testid="view-options-closed-readout">{{ readout() }}</pre>
  `,
})
class StoryViewOptionsClosedTestsShell {
  protected readonly fields = signal<ViewField[]>(buildFields());
  protected readonly closeCount = signal<number>(0);

  protected readonly readout = (): string => `closeCount=${this.closeCount()}`;

  protected onClose(): void {
    this.closeCount.update((value) => value + 1);
  }
}

const meta: Meta = {
  title: 'Core/Components/ViewOptions/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderDefaultShell: Story['render'] = () => ({
  template: `<story-view-options-tests-shell />`,
  moduleMetadata: { imports: [StoryViewOptionsTestsShell] },
});

const renderLabelsShell: Story['render'] = () => ({
  template: `<story-view-options-labels-tests-shell />`,
  moduleMetadata: { imports: [StoryViewOptionsLabelsTestsShell] },
});

const renderClosedShell: Story['render'] = () => ({
  template: `<story-view-options-closed-tests-shell />`,
  moduleMetadata: { imports: [StoryViewOptionsClosedTestsShell] },
});

// === panel host a11y ===

export const HostHasRegionRole: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('org-view-options') as HTMLElement;

    await expect(host.getAttribute('role')).toBe('region');
  },
};

export const RendersDefaultPanelLabel: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvasElement.querySelector('org-view-options') as HTMLElement;

    await expect(host.getAttribute('aria-label')).toBe('View options');
    // visible header reflects the same label
    await expect(canvas.getByText('View options')).not.toBeNull();
  },
};

export const AppliesCustomPanelLabel: Story = {
  render: renderLabelsShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvasElement.querySelector('org-view-options') as HTMLElement;

    await expect(host.getAttribute('aria-label')).toBe('Customize view');
    await expect(canvas.getByText('Customize view')).not.toBeNull();
  },
};

// === field-selection section a11y ===

export const SectionHasGroupRole: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('org-view-options-field-selection') as HTMLElement;

    await expect(section.getAttribute('role')).toBe('group');
  },
};

export const RendersDefaultSectionLabel: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvasElement.querySelector('org-view-options-field-selection') as HTMLElement;

    await expect(section.getAttribute('aria-label')).toBe('Fields');
    await expect(canvas.getByText('Fields')).not.toBeNull();
  },
};

export const AppliesCustomSectionLabel: Story = {
  render: renderLabelsShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvasElement.querySelector('org-view-options-field-selection') as HTMLElement;

    await expect(section.getAttribute('aria-label')).toBe('Columns');
    await expect(canvas.getByText('Columns')).not.toBeNull();
  },
};

// === close button ===

export const CloseButtonHiddenWithoutListener: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByTestId('view-options-close-button')).toBeNull();
  },
};

export const CloseButtonShownWhenListenerBound: Story = {
  render: renderClosedShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByTestId('view-options-close-button')).not.toBeNull();
  },
};

export const CloseButtonEmitsClosedOnClick: Story = {
  render: renderClosedShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = await canvas.findByTestId('view-options-close-button');
    const readout = await canvas.findByTestId('view-options-closed-readout');

    await expect(readout.textContent).toBe('closeCount=0');

    await userEvent.click(closeButton);
    await expect(readout.textContent).toBe('closeCount=1');

    await userEvent.click(closeButton);
    await expect(readout.textContent).toBe('closeCount=2');
  },
};

export const CloseButtonHasAriaLabel: Story = {
  render: renderClosedShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = await canvas.findByTestId('view-options-close-button');

    await expect(closeButton.getAttribute('aria-label')).toBe('Close view options');
  },
};

// === count tag & live announcement ===

export const CountTagShowsInitialEnabledOverTotal: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countTag = await canvas.findByTestId('view-options-field-selection-count');

    // default fixture: name(on,locked), email(on), role(on), status(off) → 3 of 4
    await expect(countTag.textContent?.trim()).toBe('3/4');
  },
};

export const CountTagUpdatesWhenToggleFlipped: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countTag = await canvas.findByTestId('view-options-field-selection-count');

    await expect(countTag.textContent?.trim()).toBe('3/4');

    // toggles render on unlocked rows: [email, role, status]; flip "status" on → 4 of 4
    const toggles = await canvas.findAllByTestId('view-options-field-row-toggle');
    const statusSwitch = within(toggles[2]).getByRole('switch');
    await userEvent.click(statusSwitch);

    await expect(countTag.textContent?.trim()).toBe('4/4');

    // flip "role" off → 3 of 4
    const roleSwitch = within(toggles[1]).getByRole('switch');
    await userEvent.click(roleSwitch);

    await expect(countTag.textContent?.trim()).toBe('3/4');
  },
};

export const CountLiveAnnouncementUpdatesWhenToggleFlipped: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const liveSpan = canvasElement.querySelector('[aria-live="polite"]') as HTMLElement;

    await expect(liveSpan.textContent?.trim()).toBe('3 of 4 fields shown');

    const toggles = await canvas.findAllByTestId('view-options-field-row-toggle');
    const statusSwitch = within(toggles[2]).getByRole('switch');
    await userEvent.click(statusSwitch);

    await expect(liveSpan.textContent?.trim()).toBe('4 of 4 fields shown');
  },
};

// === field row toggle (existing behavior) ===

export const TogglesFieldVisibility: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // toggles render on unlocked rows: [email, role, status]; the click handler lives on the inner
    // <label role="switch"> — userEvent dispatches events on the passed element rather than hit-testing,
    // so clicking the toggle host would never reach the handler.
    const toggles = await canvas.findAllByTestId('view-options-field-row-toggle');
    const statusSwitch = within(toggles[2]).getByRole('switch');
    await userEvent.click(statusSwitch);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:1');
  },
};

export const ClickingRowBodyTogglesField: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // bodies render on every row (including locked). order: name (locked), email, role, status
    const bodies = await canvas.findAllByTestId('view-options-field-row-body');
    await userEvent.click(bodies[3]);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:1');
  },
};

export const LockedRowCannotBeToggled: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // the locked "name" row renders a lock icon, not a toggle. clicking the lock icon must not flip enabled.
    const lockIcons = await canvas.findAllByTestId('view-options-field-row-lock-icon');
    await expect(lockIcons.length).toBe(1);

    await userEvent.click(lockIcons[0]);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // clicking the body of the locked row must also leave the enabled flag unchanged
    const bodies = await canvas.findAllByTestId('view-options-field-row-body');
    await userEvent.click(bodies[0]);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
  },
};

// === field row structure / a11y ===

export const LockedRowShowsLockIconAndHidesToggle: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('org-view-options-field-row');

    // only "name" is locked in the fixture
    const lockedRow = rows[0] as HTMLElement;
    await expect(lockedRow.getAttribute('data-locked')).toBe('');
    await expect(lockedRow.querySelector('[data-testid="view-options-field-row-lock-icon"]')).not.toBeNull();
    await expect(lockedRow.querySelector('[data-testid="view-options-field-row-toggle"]')).toBeNull();

    // unlocked rows show a toggle, no lock icon
    const unlockedRow = rows[1] as HTMLElement;
    await expect(unlockedRow.getAttribute('data-locked')).toBeNull();
    await expect(unlockedRow.querySelector('[data-testid="view-options-field-row-lock-icon"]')).toBeNull();
    await expect(unlockedRow.querySelector('[data-testid="view-options-field-row-toggle"]')).not.toBeNull();
  },
};

export const EveryRowHasFocusableDragHandle: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvasElement.querySelectorAll('org-view-options-field-row');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    // locked rows must also get a drag handle — lock only restricts visibility, not order
    await expect(dragHandles.length).toBe(rows.length);

    for (const handle of dragHandles) {
      await expect(handle.tagName).toBe('BUTTON');
    }
  },
};

export const DragHandleAriaLabelIncludesFieldLabel: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(dragHandles[0].getAttribute('aria-label')).toBe('Reorder Name');
    await expect(dragHandles[1].getAttribute('aria-label')).toBe('Reorder Email');
    await expect(dragHandles[2].getAttribute('aria-label')).toBe('Reorder Role');
    await expect(dragHandles[3].getAttribute('aria-label')).toBe('Reorder Status');
  },
};

// === keyboard reorder ===

export const ArrowDownOnDragHandleMovesRowDown: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // focus email's drag handle and press ArrowDown → email swaps with role
    (dragHandles[1] as HTMLButtonElement).focus();
    await userEvent.keyboard('{ArrowDown}');

    await expect(readout.textContent).toBe('name:1!,role:1,email:1,status:0');
  },
};

export const ArrowUpOnDragHandleMovesRowUp: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // focus role's drag handle and press ArrowUp → role swaps with email
    (dragHandles[2] as HTMLButtonElement).focus();
    await userEvent.keyboard('{ArrowUp}');

    await expect(readout.textContent).toBe('name:1!,role:1,email:1,status:0');
  },
};

export const LockedRowCanBeReorderedViaKeyboard: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // focus locked "name" row's drag handle; ArrowDown still reorders since lock only gates visibility
    (dragHandles[0] as HTMLButtonElement).focus();
    await userEvent.keyboard('{ArrowDown}');

    await expect(readout.textContent).toBe('email:1,name:1!,role:1,status:0');
  },
};

export const ArrowUpOnFirstRowIsNoOp: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    (dragHandles[0] as HTMLButtonElement).focus();
    await userEvent.keyboard('{ArrowUp}');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
  },
};

export const ArrowDownOnLastRowIsNoOp: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    (dragHandles[3] as HTMLButtonElement).focus();
    await userEvent.keyboard('{ArrowDown}');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
  },
};

export const NonArrowKeyOnDragHandleDoesNotReorder: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    (dragHandles[1] as HTMLButtonElement).focus();
    await userEvent.keyboard('{Enter}');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
  },
};

export const FocusReturnsToDragHandleAfterReorder: Story = {
  render: renderDefaultShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dragHandles = await canvas.findAllByTestId('view-options-field-row-drag-handle');

    // focus email's handle; @for may detach + re-attach the row's dom node when reconciling the reorder,
    // which drops focus. the row presentation restores focus via afterNextRender — verify it lands back
    // on email's drag handle (now in a different position).
    (dragHandles[1] as HTMLButtonElement).focus();
    await userEvent.keyboard('{ArrowDown}');

    await waitFor(() => {
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Reorder Email');
    });
  },
};

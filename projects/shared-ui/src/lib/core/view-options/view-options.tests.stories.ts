import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
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

const meta: Meta = {
  title: 'Core/Components/ViewOptions/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const TogglesFieldVisibility: Story = {
  render: () => ({
    template: `<story-view-options-tests-shell />`,
    moduleMetadata: { imports: [StoryViewOptionsTestsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // flip the "status" row toggle — the third unlocked toggle, fourth row overall
    const toggles = await canvas.findAllByTestId('view-options-field-row-toggle');

    // toggles render only on unlocked rows; the locked "name" row has none. order: email, role, status
    const statusToggle = toggles[2];
    await userEvent.click(statusToggle);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:1');
  },
};

export const ClickingRowBodyTogglesField: Story = {
  render: () => ({
    template: `<story-view-options-tests-shell />`,
    moduleMetadata: { imports: [StoryViewOptionsTestsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('view-options-readout');

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

    // clicking the row body (icon + label region) flips the enabled flag for unlocked rows
    const bodies = await canvas.findAllByTestId('view-options-field-row-body');

    // bodies render on every row (including locked). order: name (locked), email, role, status
    const statusBody = bodies[3];
    await userEvent.click(statusBody);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:1');
  },
};

export const LockedRowCannotBeToggled: Story = {
  render: () => ({
    template: `<story-view-options-tests-shell />`,
    moduleMetadata: { imports: [StoryViewOptionsTestsShell] },
  }),
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
    const nameBody = bodies[0];
    await userEvent.click(nameBody);

    await expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
  },
};

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FormDisabledDirective } from './form-disabled-directive';

@Component({
  selector: 'story-form-disabled-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormDisabledDirective],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <input formControlName="name" [orgFormDisabled]="isDisabled()" data-testid="name-input" />
    </form>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-disabled-on" (click)="isDisabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="isDisabled.set(false)">disabled-off</button>
    </div>
  `,
})
class StoryFormDisabledTestsShell {
  protected readonly form = new FormGroup({
    name: new FormControl<string>(''),
  });

  protected readonly isDisabled = signal<boolean>(false);
}

@Component({
  selector: 'story-form-disabled-mount-disabled-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormDisabledDirective],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <input formControlName="name" [orgFormDisabled]="true" data-testid="name-input" />
    </form>
  `,
})
class StoryFormDisabledMountDisabledShell {
  protected readonly form = new FormGroup({
    name: new FormControl<string>(''),
  });
}

const meta: Meta = {
  title: 'Core/Directives/FormDisabled/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-form-disabled-tests-shell />`,
  moduleMetadata: { imports: [StoryFormDisabledTestsShell] },
});

export const RendersInitialEnabledState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = (await canvas.findByTestId('name-input')) as HTMLInputElement;

    await expect(input.disabled).toBe(false);
    await expect(input.getAttribute('aria-disabled')).toBeNull();
  },
};

export const DisablesFormControlWhenInputIsTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = (await canvas.findByTestId('name-input')) as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(input.disabled).toBe(true));
    await expect(input.getAttribute('aria-disabled')).toBe('true');
  },
};

export const RestoresFormControlWhenInputTogglesBack: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = (await canvas.findByTestId('name-input')) as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(input.disabled).toBe(true));

    await userEvent.click(canvas.getByTestId('ctl-disabled-off'));
    await waitFor(() => expect(input.disabled).toBe(false));
    await expect(input.getAttribute('aria-disabled')).toBeNull();
  },
};

export const AppliesDisabledStateAtMount: Story = {
  render: () => ({
    template: `<story-form-disabled-mount-disabled-shell />`,
    moduleMetadata: { imports: [StoryFormDisabledMountDisabledShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = (await canvas.findByTestId('name-input')) as HTMLInputElement;

    await waitFor(() => expect(input.disabled).toBe(true));
    await expect(input.getAttribute('aria-disabled')).toBe('true');
  },
};

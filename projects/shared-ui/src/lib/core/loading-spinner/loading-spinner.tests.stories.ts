import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LoadingSpinner } from './loading-spinner';
import { type IconColor, type IconSize } from '../icon/icon';

@Component({
  selector: 'story-loading-spinner-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner],
  host: { class: 'block' },
  template: `
    <org-loading-spinner data-testid="spinner" [size]="size()" [iconColor]="iconColor()" [label]="label()" />
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-size-xs" (click)="size.set('xs')">size-xs</button>
      <button type="button" data-testid="ctl-icon-color-primary" (click)="iconColor.set('primary')">
        icon-color-primary
      </button>
      <button type="button" data-testid="ctl-icon-color-danger" (click)="iconColor.set('danger')">
        icon-color-danger
      </button>
      <button type="button" data-testid="ctl-label-saving" (click)="label.set('Saving changes')">label-saving</button>
    </div>
  `,
})
class StoryLoadingSpinnerTestsShell {
  protected readonly size = signal<IconSize>('base');
  protected readonly iconColor = signal<IconColor>('inherit');
  protected readonly label = signal<string>('Loading');
}

const meta: Meta = {
  title: 'Core/Components/LoadingSpinner/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-loading-spinner-tests-shell />`,
  moduleMetadata: { imports: [StoryLoadingSpinnerTestsShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-icon-color')).toBe('inherit');
  },
};

export const RendersDefaultAccessibilityAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await expect(host.getAttribute('role')).toBe('status');
    await expect(host.getAttribute('aria-label')).toBe('Loading');
  },
};

export const ReflectsSizeAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    await waitFor(() => expect(host.getAttribute('data-size')).toBe('lg'));
  },
};

export const ReflectsIconColorAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await userEvent.click(canvas.getByTestId('ctl-icon-color-primary'));

    await waitFor(() => expect(host.getAttribute('data-icon-color')).toBe('primary'));
  },
};

export const ReflectsLabelOnAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await userEvent.click(canvas.getByTestId('ctl-label-saving'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Saving changes'));
  },
};

export const RendersInnerLoaderIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');
    const icon = host.querySelector('org-icon') as HTMLElement | null;

    await expect(icon).not.toBeNull();
    await expect(icon?.getAttribute('data-icon')).toBe('loader');
  },
};

export const InnerIconReflectsSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await userEvent.click(canvas.getByTestId('ctl-size-xs'));

    await waitFor(() => {
      const icon = host.querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('xs');
    });
  },
};

export const InnerIconReflectsColor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('spinner');

    await userEvent.click(canvas.getByTestId('ctl-icon-color-danger'));

    await waitFor(() => {
      const icon = host.querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-color')).toBe('danger');
    });
  },
};

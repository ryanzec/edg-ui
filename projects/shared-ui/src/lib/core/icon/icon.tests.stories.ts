import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Icon, type IconColor, type IconSize } from './icon';
import { type IconName } from './icon-brain';

@Component({
  selector: 'story-icon-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'block' },
  template: `
    <org-icon data-testid="icon" [name]="name()" [size]="size()" [color]="color()" [label]="label()" />
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-name-x" (click)="name.set('x')">name-x</button>
      <button type="button" data-testid="ctl-name-plus" (click)="name.set('plus')">name-plus</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-size-2xl" (click)="size.set('2xl')">size-2xl</button>
      <button type="button" data-testid="ctl-color-primary" (click)="color.set('primary')">color-primary</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-label-set" (click)="label.set('Task completed')">label-set</button>
      <button type="button" data-testid="ctl-label-other" (click)="label.set('Another label')">label-other</button>
      <button type="button" data-testid="ctl-label-clear" (click)="label.set(undefined)">label-clear</button>
      <button type="button" data-testid="ctl-label-null" (click)="label.set(null)">label-null</button>
    </div>
  `,
})
class StoryIconTestsShell {
  protected readonly name = signal<IconName>('check');
  protected readonly size = signal<IconSize>('base');
  protected readonly color = signal<IconColor>('inherit');
  protected readonly label = signal<string | null | undefined>(undefined);
}

const meta: Meta = {
  title: 'Core/Components/Icon/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-icon-tests-shell />`,
  moduleMetadata: { imports: [StoryIconTestsShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await expect(host.getAttribute('data-icon')).toBe('check');
    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-color')).toBe('inherit');
  },
};

export const ReflectsSizeAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await waitFor(() => expect(host.getAttribute('data-size')).toBe('lg'));

    await userEvent.click(canvas.getByTestId('ctl-size-2xl'));
    await waitFor(() => expect(host.getAttribute('data-size')).toBe('2xl'));
  },
};

export const ReflectsColorAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));
    await waitFor(() => expect(host.getAttribute('data-color')).toBe('primary'));

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await waitFor(() => expect(host.getAttribute('data-color')).toBe('danger'));
  },
};

export const ReflectsNameAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-name-x'));
    await waitFor(() => expect(host.getAttribute('data-icon')).toBe('x'));

    await userEvent.click(canvas.getByTestId('ctl-name-plus'));
    await waitFor(() => expect(host.getAttribute('data-icon')).toBe('plus'));
  },
};

export const RendersSvgElement: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await expect(host.querySelector('svg')).not.toBeNull();
  },
};

export const SvgUpdatesWhenNameChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    const initialMarkup = (host.querySelector('svg') as SVGElement).innerHTML;

    await userEvent.click(canvas.getByTestId('ctl-name-x'));

    await waitFor(() => {
      const updatedMarkup = (host.querySelector('svg') as SVGElement).innerHTML;

      expect(updatedMarkup).not.toBe(initialMarkup);
    });
  },
};

export const DecorativeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');
    const svg = host.querySelector('svg') as SVGElement;

    await expect(svg.getAttribute('aria-hidden')).toBe('true');
    await expect(svg.getAttribute('aria-label')).toBeNull();
    await expect(svg.getAttribute('role')).toBeNull();
  },
};

export const MeaningfulWhenLabelProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-label-set'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.getAttribute('aria-label')).toBe('Task completed');
      expect(svg.getAttribute('aria-hidden')).toBeNull();
    });
  },
};

export const RevertsToDecorativeWhenLabelCleared: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-label-set'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('role')).toBe('img');
    });

    await userEvent.click(canvas.getByTestId('ctl-label-clear'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('role')).toBeNull();
      expect(svg.getAttribute('aria-label')).toBeNull();
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  },
};

export const NullLabelTransformsToDecorative: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-label-set'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('role')).toBe('img');
    });

    await userEvent.click(canvas.getByTestId('ctl-label-null'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('role')).toBeNull();
      expect(svg.getAttribute('aria-label')).toBeNull();
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  },
};

export const UpdatesAriaLabelWhenLabelChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('icon');

    await userEvent.click(canvas.getByTestId('ctl-label-set'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('aria-label')).toBe('Task completed');
    });

    await userEvent.click(canvas.getByTestId('ctl-label-other'));

    await waitFor(() => {
      const svg = host.querySelector('svg') as SVGElement;

      expect(svg.getAttribute('aria-label')).toBe('Another label');
    });
  },
};

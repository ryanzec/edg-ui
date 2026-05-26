import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Skeleton, type SkeletonVariant } from './skeleton';

@Component({
  selector: 'story-skeleton-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton],
  host: { class: 'block' },
  template: `
    <org-skeleton
      data-testid="skeleton"
      [variant]="variant()"
      [bordered]="bordered()"
      [rows]="rows()"
      [ariaLabel]="ariaLabel()"
    />
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-variant-card" (click)="variant.set('card')">variant-card</button>
      <button type="button" data-testid="ctl-variant-card-headless" (click)="variant.set('card-headless')">
        variant-card-headless
      </button>
      <button type="button" data-testid="ctl-variant-table" (click)="variant.set('table')">variant-table</button>
      <button type="button" data-testid="ctl-variant-table-varied" (click)="variant.set('table-varied')">
        variant-table-varied
      </button>
      <button type="button" data-testid="ctl-bordered-off" (click)="bordered.set(false)">bordered-off</button>
      <button type="button" data-testid="ctl-bordered-on" (click)="bordered.set(true)">bordered-on</button>
      <button type="button" data-testid="ctl-rows-3" (click)="rows.set(3)">rows-3</button>
      <button type="button" data-testid="ctl-rows-12" (click)="rows.set(12)">rows-12</button>
      <button type="button" data-testid="ctl-rows-13" (click)="rows.set(13)">rows-13</button>
      <button type="button" data-testid="ctl-rows-negative" (click)="rows.set(-3)">rows-negative</button>
      <button type="button" data-testid="ctl-aria-label-custom" (click)="ariaLabel.set('preparing your dashboard')">
        aria-label-custom
      </button>
    </div>
  `,
})
class StorySkeletonTestsShell {
  protected readonly variant = signal<SkeletonVariant>('card');
  protected readonly bordered = signal<boolean>(true);
  protected readonly rows = signal<number>(7);
  protected readonly ariaLabel = signal<string>('loading');
}

@Component({
  selector: 'story-skeleton-bare-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton],
  host: { class: 'block' },
  template: `<org-skeleton data-testid="skeleton" />`,
})
class StorySkeletonBareShell {}

const meta: Meta = {
  title: 'Core/Components/Skeleton/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-skeleton-tests-shell />`,
  moduleMetadata: { imports: [StorySkeletonTestsShell] },
});

const renderBareShell: Story['render'] = () => ({
  template: `<story-skeleton-bare-shell />`,
  moduleMetadata: { imports: [StorySkeletonBareShell] },
});

export const RendersStatusRoleAndAriaBusy: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await expect(host.getAttribute('role')).toBe('status');
    await expect(host.getAttribute('aria-busy')).toBe('true');
  },
};

export const RendersDefaultAriaLabel: Story = {
  render: renderBareShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await expect(host.getAttribute('aria-label')).toBe('loading');
  },
};

export const ReflectsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-custom'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('preparing your dashboard'));
  },
};

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await expect(host.getAttribute('data-variant')).toBe('card');
    await expect(host.getAttribute('data-bordered')).toBe('1');
  },
};

export const ReflectsVariantAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-table'));
    await waitFor(() => expect(host.getAttribute('data-variant')).toBe('table'));

    await userEvent.click(canvas.getByTestId('ctl-variant-table-varied'));
    await waitFor(() => expect(host.getAttribute('data-variant')).toBe('table-varied'));

    await userEvent.click(canvas.getByTestId('ctl-variant-card-headless'));
    await waitFor(() => expect(host.getAttribute('data-variant')).toBe('card-headless'));
  },
};

export const ReflectsBorderedAttributeWhenFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-bordered-off'));

    await waitFor(() => expect(host.getAttribute('data-bordered')).toBe('0'));
  },
};

export const CardVariantRendersBlockAndFourBars: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await expect(host.querySelector('.block')).not.toBeNull();
    await expect(host.querySelectorAll('.bar').length).toBe(4);
  },
};

export const CardHeadlessVariantOmitsBlockAndRendersThreeBars: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-card-headless'));

    await waitFor(() => {
      expect(host.querySelector('.block')).toBeNull();
      expect(host.querySelectorAll('.bar').length).toBe(3);
    });
  },
};

export const TableVariantRendersFullWidthBarsForGivenRows: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-table'));

    await waitFor(() => {
      const bars = host.querySelectorAll('.bar');

      expect(host.querySelector('.block')).toBeNull();
      expect(bars.length).toBe(7);

      bars.forEach((bar) => {
        expect(bar.getAttribute('data-width')).toBe('full');
      });
    });
  },
};

export const TableVariedVariantRendersBarsWithCyclingWidths: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-table-varied'));

    await waitFor(() => {
      const bars = host.querySelectorAll('.bar');

      expect(host.querySelector('.block')).toBeNull();
      expect(bars.length).toBe(7);

      // first 7 entries of the fixed table-varied width cycle
      const expectedWidths = ['full', '3/4', '2/3', '1/2', 'full', '3/4', '1/3'];

      bars.forEach((bar, index) => {
        expect(bar.getAttribute('data-width')).toBe(expectedWidths[index]);
      });
    });
  },
};

export const RowsInputControlsTableBarCount: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-table'));

    await userEvent.click(canvas.getByTestId('ctl-rows-3'));
    await waitFor(() => expect(host.querySelectorAll('.bar').length).toBe(3));

    await userEvent.click(canvas.getByTestId('ctl-rows-12'));
    await waitFor(() => expect(host.querySelectorAll('.bar').length).toBe(12));
  },
};

export const RowsIgnoredForCardVariants: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    // card variant — 4 bars regardless of rows
    await userEvent.click(canvas.getByTestId('ctl-rows-12'));
    await waitFor(() => expect(host.querySelectorAll('.bar').length).toBe(4));

    await userEvent.click(canvas.getByTestId('ctl-rows-3'));
    await waitFor(() => expect(host.querySelectorAll('.bar').length).toBe(4));

    // card-headless variant — 3 bars regardless of rows
    await userEvent.click(canvas.getByTestId('ctl-variant-card-headless'));
    await userEvent.click(canvas.getByTestId('ctl-rows-12'));
    await waitFor(() => expect(host.querySelectorAll('.bar').length).toBe(3));
  },
};

export const RowsClampedToZeroForNegativeValues: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-table'));
    await userEvent.click(canvas.getByTestId('ctl-rows-negative'));

    await waitFor(() => expect(host.querySelectorAll('.bar').length).toBe(0));
  },
};

export const TableVariedWidthCycleWrapsViaModulo: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('skeleton');

    await userEvent.click(canvas.getByTestId('ctl-variant-table-varied'));
    await userEvent.click(canvas.getByTestId('ctl-rows-13'));

    await waitFor(() => {
      const bars = host.querySelectorAll('.bar');

      expect(bars.length).toBe(13);
      // 12 % 12 === 0 → cycle[0] === 'full'
      expect(bars[12].getAttribute('data-width')).toBe('full');
    });
  },
};

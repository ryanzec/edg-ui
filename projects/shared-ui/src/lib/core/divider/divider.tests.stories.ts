import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Divider, type DividerDirection, type DividerPadding, type DividerStyle, type DividerWeight } from './divider';
import { DividerBrainDirective } from './divider-brain';
import type { ComponentColor } from '../types/component-types';

@Component({
  selector: 'story-divider-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Divider],
  host: { class: 'block' },
  template: `
    <org-divider
      data-testid="divider"
      [direction]="direction()"
      [lineStyle]="lineStyle()"
      [weight]="weight()"
      [padding]="padding()"
      [color]="color()"
    />
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-direction-vertical" (click)="direction.set('vertical')">
        direction-vertical
      </button>
      <button type="button" data-testid="ctl-direction-horizontal" (click)="direction.set('horizontal')">
        direction-horizontal
      </button>
      <button type="button" data-testid="ctl-line-style-dashed" (click)="lineStyle.set('dashed')">
        line-style-dashed
      </button>
      <button type="button" data-testid="ctl-line-style-dotted" (click)="lineStyle.set('dotted')">
        line-style-dotted
      </button>
      <button type="button" data-testid="ctl-weight-thick" (click)="weight.set('thick')">weight-thick</button>
      <button type="button" data-testid="ctl-padding-none" (click)="padding.set('none')">padding-none</button>
      <button type="button" data-testid="ctl-padding-base" (click)="padding.set('base')">padding-base</button>
      <button type="button" data-testid="ctl-padding-lg" (click)="padding.set('lg')">padding-lg</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-color-primary" (click)="color.set('primary')">color-primary</button>
      <button type="button" data-testid="ctl-color-null" (click)="color.set(null)">color-null</button>
      <button type="button" data-testid="ctl-color-undefined" (click)="color.set(undefined)">color-undefined</button>
    </div>
  `,
})
class StoryDividerTestsShell {
  protected readonly direction = signal<DividerDirection>('horizontal');
  protected readonly lineStyle = signal<DividerStyle>('solid');
  protected readonly weight = signal<DividerWeight>('thin');
  protected readonly padding = signal<DividerPadding>('sm');
  protected readonly color = signal<ComponentColor | null | undefined>(undefined);
}

@Component({
  selector: 'story-divider-brain-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerBrainDirective],
  host: { class: 'block' },
  template: `
    <div
      data-testid="brain"
      orgDividerBrain
      [direction]="direction()"
      [isResizable]="isResizable()"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [isInteractive]="isInteractive()"
      (pointerDown)="handlePointerDown($event)"
      (pointerMove)="handlePointerMove($event)"
      (pointerUp)="handlePointerUp($event)"
      (pointerCancel)="handlePointerCancel($event)"
      (keyDown)="handleKeyDown($event)"
    ></div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-resizable-on" (click)="isResizable.set(true)">resizable-on</button>
      <button type="button" data-testid="ctl-resizable-off" (click)="isResizable.set(false)">resizable-off</button>
      <button type="button" data-testid="ctl-interactive-off" (click)="isInteractive.set(false)">
        interactive-off
      </button>
      <button type="button" data-testid="ctl-interactive-on" (click)="isInteractive.set(true)">interactive-on</button>
      <button type="button" data-testid="ctl-direction-vertical" (click)="direction.set('vertical')">
        direction-vertical
      </button>
      <button type="button" data-testid="ctl-value-42" (click)="value.set(42)">value-42</button>
      <button type="button" data-testid="ctl-value-null" (click)="value.set(null)">value-null</button>
      <button type="button" data-testid="ctl-min-10" (click)="min.set(10)">min-10</button>
      <button type="button" data-testid="ctl-max-90" (click)="max.set(90)">max-90</button>
    </div>
  `,
})
class StoryDividerBrainTestsShell {
  protected readonly direction = signal<DividerDirection>('horizontal');
  protected readonly isResizable = signal<boolean>(false);
  protected readonly value = signal<number | null | undefined>(undefined);
  protected readonly min = signal<number>(0);
  protected readonly max = signal<number>(100);
  protected readonly isInteractive = signal<boolean>(true);

  protected readonly pointerDownCount = signal<number>(0);
  protected readonly pointerMoveCount = signal<number>(0);
  protected readonly pointerUpCount = signal<number>(0);
  protected readonly pointerCancelCount = signal<number>(0);
  protected readonly keyDownCount = signal<number>(0);
  protected readonly lastKey = signal<string>('');

  protected readout(): string {
    return (
      `pointerDown=${this.pointerDownCount()} ` +
      `pointerMove=${this.pointerMoveCount()} ` +
      `pointerUp=${this.pointerUpCount()} ` +
      `pointerCancel=${this.pointerCancelCount()} ` +
      `keyDown=${this.keyDownCount()} ` +
      `lastKey=${this.lastKey()}`
    );
  }

  protected handlePointerDown(_event: PointerEvent): void {
    this.pointerDownCount.update((value) => value + 1);
  }

  protected handlePointerMove(_event: PointerEvent): void {
    this.pointerMoveCount.update((value) => value + 1);
  }

  protected handlePointerUp(_event: PointerEvent): void {
    this.pointerUpCount.update((value) => value + 1);
  }

  protected handlePointerCancel(_event: PointerEvent): void {
    this.pointerCancelCount.update((value) => value + 1);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDownCount.update((value) => value + 1);
    this.lastKey.set(event.key);
  }
}

const meta: Meta = {
  title: 'Core/Components/Divider/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-divider-tests-shell />`,
  moduleMetadata: { imports: [StoryDividerTestsShell] },
});

const renderBrainShell: Story['render'] = () => ({
  template: `<story-divider-brain-tests-shell />`,
  moduleMetadata: { imports: [StoryDividerBrainTestsShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-style')).toBe('solid');
    await expect(host.getAttribute('data-weight')).toBe('thin');
    await expect(host.getAttribute('data-padding')).toBe('sm');
    await expect(host.getAttribute('data-direction')).toBe('horizontal');
  },
};

export const OmitsDataColorByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-color')).toBeNull();
  },
};

export const AlwaysAppliesSeparatorRoleFromBrain: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('role')).toBe('separator');
  },
};

export const ReflectsHorizontalDirection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-direction')).toBe('horizontal');
    await expect(host.getAttribute('aria-orientation')).toBe('horizontal');
  },
};

export const ReflectsVerticalDirection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-direction')).toBe('vertical');
    await expect(host.getAttribute('aria-orientation')).toBe('vertical');
  },
};

export const ReflectsDashedLineStyle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-line-style-dashed'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-style')).toBe('dashed');
  },
};

export const ReflectsDottedLineStyle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-line-style-dotted'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-style')).toBe('dotted');
  },
};

export const ReflectsThickWeight: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-weight-thick'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-weight')).toBe('thick');
  },
};

export const ReflectsNonePadding: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-padding-none'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-padding')).toBe('none');
  },
};

export const ReflectsBasePadding: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-padding-base'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-padding')).toBe('base');
  },
};

export const ReflectsLgPadding: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-padding-lg'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-padding')).toBe('lg');
  },
};

export const AppliesDataColorWhenSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-color')).toBe('danger');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));

    await expect(host.getAttribute('data-color')).toBe('primary');
  },
};

export const TransformsNullColorToOmittedDataColor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-color')).toBe('primary');

    await userEvent.click(canvas.getByTestId('ctl-color-null'));

    await expect(host.getAttribute('data-color')).toBeNull();
  },
};

export const OmitsDataColorWhenColorIsUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));

    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('data-color')).toBe('primary');

    await userEvent.click(canvas.getByTestId('ctl-color-undefined'));

    await expect(host.getAttribute('data-color')).toBeNull();
  },
};

export const NonResizableHasNoAriaValueAttributesOrTabindex: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('divider');

    await expect(host.getAttribute('aria-valuenow')).toBeNull();
    await expect(host.getAttribute('aria-valuemin')).toBeNull();
    await expect(host.getAttribute('aria-valuemax')).toBeNull();
    await expect(host.getAttribute('tabindex')).toBeNull();
  },
};

export const BrainDefaultsToNonResizableAttributes: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('brain');

    await expect(host.getAttribute('role')).toBe('separator');
    await expect(host.getAttribute('aria-orientation')).toBe('horizontal');
    await expect(host.getAttribute('data-direction')).toBe('horizontal');
    await expect(host.getAttribute('aria-valuenow')).toBeNull();
    await expect(host.getAttribute('aria-valuemin')).toBeNull();
    await expect(host.getAttribute('aria-valuemax')).toBeNull();
    await expect(host.getAttribute('tabindex')).toBeNull();
  },
};

export const BrainResizableAppliesAriaValueAttributes: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));
    await userEvent.click(canvas.getByTestId('ctl-value-42'));
    await userEvent.click(canvas.getByTestId('ctl-min-10'));
    await userEvent.click(canvas.getByTestId('ctl-max-90'));

    const host = await canvas.findByTestId('brain');

    await expect(host.getAttribute('aria-valuenow')).toBe('42');
    await expect(host.getAttribute('aria-valuemin')).toBe('10');
    await expect(host.getAttribute('aria-valuemax')).toBe('90');
  },
};

export const BrainResizableOmitsAriaValuenowWhenValueNull: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));
    await userEvent.click(canvas.getByTestId('ctl-value-42'));

    const host = await canvas.findByTestId('brain');

    await expect(host.getAttribute('aria-valuenow')).toBe('42');

    await userEvent.click(canvas.getByTestId('ctl-value-null'));

    await expect(host.getAttribute('aria-valuenow')).toBeNull();
  },
};

export const BrainResizableInteractiveSetsTabindexZero: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));

    const host = await canvas.findByTestId('brain');

    await expect(host.getAttribute('tabindex')).toBe('0');
  },
};

export const BrainResizableNonInteractiveSetsTabindexNegativeOne: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));
    await userEvent.click(canvas.getByTestId('ctl-interactive-off'));

    const host = await canvas.findByTestId('brain');

    await expect(host.getAttribute('tabindex')).toBe('-1');
  },
};

export const BrainReflectsVerticalDirection: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    const host = await canvas.findByTestId('brain');

    await expect(host.getAttribute('data-direction')).toBe('vertical');
    await expect(host.getAttribute('aria-orientation')).toBe('vertical');
  },
};

export const BrainForwardsPointerEventsWhenResizable: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));

    const host = await canvas.findByTestId('brain');
    const readout = await canvas.findByTestId('readout');

    fireEvent.pointerDown(host);
    fireEvent.pointerMove(host);
    fireEvent.pointerUp(host);
    fireEvent.pointerCancel(host);

    await waitFor(() => expect(readout.textContent).toContain('pointerDown=1'));
    await waitFor(() => expect(readout.textContent).toContain('pointerMove=1'));
    await waitFor(() => expect(readout.textContent).toContain('pointerUp=1'));
    await waitFor(() => expect(readout.textContent).toContain('pointerCancel=1'));
  },
};

export const BrainForwardsKeyDownWhenResizable: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));

    const host = await canvas.findByTestId('brain');
    const readout = await canvas.findByTestId('readout');

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(readout.textContent).toContain('keyDown=1'));
    await waitFor(() => expect(readout.textContent).toContain('lastKey=ArrowRight'));
  },
};

export const BrainDoesNotForwardPointerEventsWhenNotResizable: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('brain');
    const readout = await canvas.findByTestId('readout');

    fireEvent.pointerDown(host);
    fireEvent.pointerMove(host);
    fireEvent.pointerUp(host);
    fireEvent.pointerCancel(host);

    await expect(readout.textContent).toContain('pointerDown=0');
    await expect(readout.textContent).toContain('pointerMove=0');
    await expect(readout.textContent).toContain('pointerUp=0');
    await expect(readout.textContent).toContain('pointerCancel=0');
  },
};

export const BrainDoesNotForwardKeyDownWhenNotResizable: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('brain');
    const readout = await canvas.findByTestId('readout');

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await expect(readout.textContent).toContain('keyDown=0');
  },
};

export const BrainStopsForwardingWhenResizableTurnedOff: Story = {
  render: renderBrainShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-resizable-on'));

    const host = await canvas.findByTestId('brain');
    const readout = await canvas.findByTestId('readout');

    fireEvent.pointerDown(host);

    await waitFor(() => expect(readout.textContent).toContain('pointerDown=1'));

    await userEvent.click(canvas.getByTestId('ctl-resizable-off'));

    fireEvent.pointerDown(host);
    fireEvent.keyDown(host, { key: 'ArrowDown' });

    await waitFor(() => expect(readout.textContent).toContain('pointerDown=1'));
    await waitFor(() => expect(readout.textContent).toContain('keyDown=0'));
  },
};

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Splitter, type SplitterCollapsedSide, type SplitterDirection } from './splitter';

@Component({
  selector: 'story-splitter-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter],
  host: { class: 'block' },
  styles: [
    `
      .splitter-container {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <div class="splitter-container">
      <org-splitter
        data-testid="splitter"
        [direction]="direction()"
        [minimumSize]="minimumSize()"
        [size]="size()"
        [isEnabled]="isEnabled()"
        [collapsedSide]="collapsedSide()"
        [animateResize]="animateResize()"
        (sizeChanged)="handleSizeChanged($event)"
        (dragStarted)="handleDragStarted()"
        (dragCompleted)="handleDragCompleted()"
      >
        <ng-template #section><div data-testid="first-content">first-content</div></ng-template>
        <ng-template #section><div data-testid="second-content">second-content</div></ng-template>
      </org-splitter>
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-direction-vertical" (click)="direction.set('vertical')">
        direction-vertical
      </button>
      <button type="button" data-testid="ctl-direction-horizontal" (click)="direction.set('horizontal')">
        direction-horizontal
      </button>
      <button type="button" data-testid="ctl-minimum-single-50" (click)="minimumSize.set([50])">
        minimum-single-50
      </button>
      <button type="button" data-testid="ctl-minimum-tuple-50-100" (click)="minimumSize.set([50, 100])">
        minimum-tuple-50-100
      </button>
      <button type="button" data-testid="ctl-size-single-20" (click)="size.set([20])">size-single-20</button>
      <button type="button" data-testid="ctl-size-tuple-30-70" (click)="size.set([30, 70])">size-tuple-30-70</button>
      <button type="button" data-testid="ctl-size-default" (click)="size.set([50])">size-default</button>
      <button type="button" data-testid="ctl-enabled-off" (click)="isEnabled.set(false)">enabled-off</button>
      <button type="button" data-testid="ctl-enabled-on" (click)="isEnabled.set(true)">enabled-on</button>
      <button type="button" data-testid="ctl-collapsed-first" (click)="collapsedSide.set('first')">
        collapsed-first
      </button>
      <button type="button" data-testid="ctl-collapsed-second" (click)="collapsedSide.set('second')">
        collapsed-second
      </button>
      <button type="button" data-testid="ctl-collapsed-null" (click)="collapsedSide.set(null)">collapsed-null</button>
      <button type="button" data-testid="ctl-animate-off" (click)="animateResize.set(false)">animate-off</button>
      <button type="button" data-testid="ctl-animate-on" (click)="animateResize.set(true)">animate-on</button>
    </div>
  `,
})
class StorySplitterTestsShell {
  protected readonly direction = signal<SplitterDirection>('horizontal');
  protected readonly minimumSize = signal<number[]>([0]);
  protected readonly size = signal<number[]>([50]);
  protected readonly isEnabled = signal<boolean>(true);
  protected readonly collapsedSide = signal<SplitterCollapsedSide | null>(null);
  protected readonly animateResize = signal<boolean>(true);

  protected readonly sizeChangedCount = signal<number>(0);
  protected readonly dragStartedCount = signal<number>(0);
  protected readonly dragCompletedCount = signal<number>(0);
  protected readonly lastSize = signal<number[]>([50]);

  protected readout(): string {
    const last = this.lastSize();

    return (
      `sizeChanged=${this.sizeChangedCount()} ` +
      `dragStarted=${this.dragStartedCount()} ` +
      `dragCompleted=${this.dragCompletedCount()} ` +
      `lastSize=[${last[0]},${last[1]}] ` +
      `currentSize=[${this.size()[0]},${this.size()[1] ?? ''}]`
    );
  }

  protected handleSizeChanged(value: number[]): void {
    this.sizeChangedCount.update((count) => count + 1);
    this.lastSize.set(value);
    this.size.set(value);
  }

  protected handleDragStarted(): void {
    this.dragStartedCount.update((count) => count + 1);
  }

  protected handleDragCompleted(): void {
    this.dragCompletedCount.update((count) => count + 1);
  }
}

@Component({
  selector: 'story-splitter-too-many-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter],
  host: { class: 'block' },
  styles: [
    `
      .splitter-container {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <div class="splitter-container">
      <org-splitter data-testid="splitter" direction="horizontal">
        <ng-template #section><div data-testid="first-content">first-content</div></ng-template>
        <ng-template #section><div data-testid="second-content">second-content</div></ng-template>
        <ng-template #section><div data-testid="third-content">third-content</div></ng-template>
      </org-splitter>
    </div>
  `,
})
class StorySplitterTooManyShell {}

const meta: Meta = {
  title: 'Core/Components/Splitter/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-splitter-tests-shell />`,
  moduleMetadata: { imports: [StorySplitterTestsShell] },
});

const renderTooManyShell: Story['render'] = () => ({
  template: `<story-splitter-too-many-shell />`,
  moduleMetadata: { imports: [StorySplitterTooManyShell] },
});

const getDivider = (host: HTMLElement): HTMLElement => host.querySelector('.splitter-divider') as HTMLElement;

const getFirstSection = (host: HTMLElement): HTMLElement => host.querySelector('.first-section') as HTMLElement;

/** computes a viewport clientX/clientY for a target percentage inside the splitter host */
const pointAtPercent = (
  host: HTMLElement,
  percent: number,
  direction: 'horizontal' | 'vertical'
): { x: number; y: number } => {
  const rect = host.getBoundingClientRect();

  if (direction === 'horizontal') {
    return { x: rect.left + (percent / 100) * rect.width, y: rect.top + rect.height / 2 };
  }

  return { x: rect.left + rect.width / 2, y: rect.top + (percent / 100) * rect.height };
};

export const ReflectsDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');

    await expect(host.getAttribute('data-direction')).toBe('horizontal');
    await expect(host.getAttribute('data-enabled')).toBe('');
    await expect(host.getAttribute('data-collapsed-side')).toBeNull();
    await expect(host.getAttribute('data-dragging')).toBeNull();
    await expect(host.getAttribute('data-animate-resize')).toBe('');
  },
};

export const ReflectsVerticalDirection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));
  },
};

export const ReflectsDisabledAttributeWhenIsEnabledFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));

    await waitFor(() => expect(host.getAttribute('data-enabled')).toBeNull());
  },
};

export const ReflectsCollapsedSideAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');

    await userEvent.click(canvas.getByTestId('ctl-collapsed-first'));

    await waitFor(() => expect(host.getAttribute('data-collapsed-side')).toBe('first'));

    await userEvent.click(canvas.getByTestId('ctl-collapsed-second'));

    await waitFor(() => expect(host.getAttribute('data-collapsed-side')).toBe('second'));

    await userEvent.click(canvas.getByTestId('ctl-collapsed-null'));

    await waitFor(() => expect(host.getAttribute('data-collapsed-side')).toBeNull());
  },
};

export const RemovesAnimateResizeAttributeWhenAnimateResizeFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');

    await userEvent.click(canvas.getByTestId('ctl-animate-off'));

    await waitFor(() => expect(host.getAttribute('data-animate-resize')).toBeNull());
  },
};

export const DividerHasSeparatorRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    await expect(divider.getAttribute('role')).toBe('separator');
  },
};

export const DividerAriaOrientationIsPerpendicularToSplitterDirection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    // horizontal splitter → vertical divider line
    await expect(divider.getAttribute('aria-orientation')).toBe('vertical');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    // vertical splitter → horizontal divider line
    await waitFor(() => expect(divider.getAttribute('aria-orientation')).toBe('horizontal'));
  },
};

export const DividerAriaValueAttributesReflectFirstSectionSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    await expect(divider.getAttribute('aria-valuenow')).toBe('50');
    await expect(divider.getAttribute('aria-valuemin')).toBe('0');
    await expect(divider.getAttribute('aria-valuemax')).toBe('100');

    await userEvent.click(canvas.getByTestId('ctl-size-tuple-30-70'));

    await waitFor(() => expect(divider.getAttribute('aria-valuenow')).toBe('30'));
  },
};

export const DividerTabindexIsZeroWhenDraggable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    await expect(divider.getAttribute('tabindex')).toBe('0');
  },
};

export const DividerTabindexIsNegativeOneWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));

    await waitFor(() => expect(divider.getAttribute('tabindex')).toBe('-1'));
  },
};

export const DividerTabindexIsNegativeOneWhenCollapsed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    await userEvent.click(canvas.getByTestId('ctl-collapsed-first'));

    await waitFor(() => expect(divider.getAttribute('tabindex')).toBe('-1'));
  },
};

export const DefaultFirstSectionFlexBasisIsFiftyPercent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const firstSection = getFirstSection(host);

    await expect(firstSection.style.flexBasis).toBe('50%');
  },
};

export const SingleValueSizeAppliesToFirstSection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const firstSection = getFirstSection(host);

    await userEvent.click(canvas.getByTestId('ctl-size-single-20'));

    await waitFor(() => expect(firstSection.style.flexBasis).toBe('20%'));
  },
};

export const TupleSizeAppliesFirstValueToFirstSection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const firstSection = getFirstSection(host);

    await userEvent.click(canvas.getByTestId('ctl-size-tuple-30-70'));

    await waitFor(() => expect(firstSection.style.flexBasis).toBe('30%'));
  },
};

export const CollapsedFirstSetsFirstSectionToZeroPercent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const firstSection = getFirstSection(host);

    await userEvent.click(canvas.getByTestId('ctl-collapsed-first'));

    await waitFor(() => expect(firstSection.style.flexBasis).toBe('0%'));
  },
};

export const CollapsedSecondSetsFirstSectionToOneHundredPercent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const firstSection = getFirstSection(host);

    await userEvent.click(canvas.getByTestId('ctl-collapsed-second'));

    await waitFor(() => expect(firstSection.style.flexBasis).toBe('100%'));
  },
};

export const HorizontalArrowRightIncreasesFirstSectionSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    divider.focus();
    fireEvent.keyDown(divider, { key: 'ArrowRight' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[55,45]'));
  },
};

export const HorizontalArrowLeftDecreasesFirstSectionSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    divider.focus();
    fireEvent.keyDown(divider, { key: 'ArrowLeft' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[45,55]'));
  },
};

export const VerticalArrowDownIncreasesFirstSectionSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    const divider = getDivider(host);

    divider.focus();
    fireEvent.keyDown(divider, { key: 'ArrowDown' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[55,45]'));
  },
};

export const VerticalArrowUpDecreasesFirstSectionSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    const divider = getDivider(host);

    divider.focus();
    fireEvent.keyDown(divider, { key: 'ArrowUp' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[45,55]'));
  },
};

export const HomeKeyJumpsToMinimumFirstPercent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    divider.focus();
    fireEvent.keyDown(divider, { key: 'Home' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[0,100]'));
  },
};

export const EndKeyJumpsToMaximumFirstPercent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    divider.focus();
    fireEvent.keyDown(divider, { key: 'End' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[100,0]'));
  },
};

export const KeyboardDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));

    const divider = getDivider(host);

    fireEvent.keyDown(divider, { key: 'ArrowRight' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(readout.textContent).toContain('sizeChanged=0');
  },
};

export const KeyboardDoesNothingWhenCollapsed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-collapsed-first'));

    const divider = getDivider(host);

    fireEvent.keyDown(divider, { key: 'ArrowRight' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(readout.textContent).toContain('sizeChanged=0');
  },
};

export const UnrelatedKeyDoesNotChangeSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    divider.focus();
    fireEvent.keyDown(divider, { key: 'Tab' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(readout.textContent).toContain('sizeChanged=0');
  },
};

export const ArrowKeyPreventsDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);

    divider.focus();

    const wasPrevented = !fireEvent.keyDown(divider, { key: 'ArrowRight' });

    await expect(wasPrevented).toBe(true);
  },
};

export const MinimumSizeSingleValueAppliesToBothSides: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    // container is 500px; minimum 50px = 10%
    await userEvent.click(canvas.getByTestId('ctl-minimum-single-50'));

    const divider = getDivider(host);

    divider.focus();
    fireEvent.keyDown(divider, { key: 'Home' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[10,90]'));

    fireEvent.keyDown(divider, { key: 'End' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[90,10]'));
  },
};

export const MinimumSizeTupleAppliesIndividuallyPerSide: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    // container is 500px; first minimum 50px = 10%; second minimum 100px = 20%
    await userEvent.click(canvas.getByTestId('ctl-minimum-tuple-50-100'));

    const divider = getDivider(host);

    divider.focus();
    fireEvent.keyDown(divider, { key: 'Home' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[10,90]'));

    fireEvent.keyDown(divider, { key: 'End' });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[80,20]'));
  },
};

export const PointerDownStartsDragAndSetsDataDragging: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    const point = pointAtPercent(host, 50, 'horizontal');

    fireEvent.pointerDown(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await waitFor(() => expect(readout.textContent).toContain('dragStarted=1'));
    await waitFor(() => expect(host.getAttribute('data-dragging')).toBe(''));
  },
};

export const PointerMoveDuringDragUpdatesSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    const start = pointAtPercent(host, 50, 'horizontal');
    const target = pointAtPercent(host, 20, 'horizontal');

    fireEvent.pointerDown(divider, { pointerId: 1, clientX: start.x, clientY: start.y });
    fireEvent.pointerMove(divider, { pointerId: 1, clientX: target.x, clientY: target.y });

    await waitFor(() => expect(readout.textContent).toContain('lastSize=[20,80]'));

    fireEvent.pointerUp(divider, { pointerId: 1, clientX: target.x, clientY: target.y });
  },
};

export const PointerUpEndsDragAndEmitsDragCompleted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    const point = pointAtPercent(host, 50, 'horizontal');

    fireEvent.pointerDown(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await waitFor(() => expect(host.getAttribute('data-dragging')).toBe(''));

    fireEvent.pointerUp(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await waitFor(() => expect(host.getAttribute('data-dragging')).toBeNull());
    await waitFor(() => expect(readout.textContent).toContain('dragCompleted=1'));
  },
};

export const PointerMoveWithoutPriorDownDoesNothing: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    const target = pointAtPercent(host, 25, 'horizontal');

    fireEvent.pointerMove(divider, { pointerId: 1, clientX: target.x, clientY: target.y });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(readout.textContent).toContain('sizeChanged=0');
    await expect(readout.textContent).toContain('dragStarted=0');
  },
};

export const PointerCancelEndsDragAndEmitsDragCompleted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const readout = await canvas.findByTestId('readout');

    const point = pointAtPercent(host, 50, 'horizontal');

    fireEvent.pointerDown(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await waitFor(() => expect(host.getAttribute('data-dragging')).toBe(''));

    fireEvent.pointerCancel(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await waitFor(() => expect(host.getAttribute('data-dragging')).toBeNull());
    await waitFor(() => expect(readout.textContent).toContain('dragCompleted=1'));
  },
};

export const PointerDownDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-enabled-off'));

    const divider = getDivider(host);
    const point = pointAtPercent(host, 50, 'horizontal');

    fireEvent.pointerDown(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(readout.textContent).toContain('dragStarted=0');
    await expect(host.getAttribute('data-dragging')).toBeNull();
  },
};

export const PointerDownDoesNothingWhenCollapsed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-collapsed-first'));

    const divider = getDivider(host);
    const point = pointAtPercent(host, 50, 'horizontal');

    fireEvent.pointerDown(divider, { pointerId: 1, clientX: point.x, clientY: point.y });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await expect(readout.textContent).toContain('dragStarted=0');
    await expect(host.getAttribute('data-dragging')).toBeNull();
  },
};

export const ProjectsFirstAndSecondSectionTemplates: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByTestId('first-content')).toBeTruthy();
    await expect(await canvas.findByTestId('second-content')).toBeTruthy();
  },
};

export const IgnoresAdditionalSectionsBeyondTwo: Story = {
  render: renderTooManyShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByTestId('first-content')).toBeTruthy();
    await expect(await canvas.findByTestId('second-content')).toBeTruthy();
    await expect(canvas.queryByTestId('third-content')).toBeNull();
  },
};

export const ProgrammaticSizeUpdatePropagatesToDividerAriaAndFirstSection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('splitter');
    const divider = getDivider(host);
    const firstSection = getFirstSection(host);

    await userEvent.click(canvas.getByTestId('ctl-size-tuple-30-70'));

    await waitFor(() => {
      expect(firstSection.style.flexBasis).toBe('30%');
      expect(divider.getAttribute('aria-valuenow')).toBe('30');
    });
  },
};

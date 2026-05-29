import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Splitter, type SplitterCollapsedSide, type SplitterDirection } from './splitter';

@Component({
  selector: 'test-splitter-interactive-host',
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
  `,
})
class SplitterInteractiveHost {
  public readonly direction = signal<SplitterDirection>('horizontal');
  public readonly minimumSize = signal<number[]>([0]);
  public readonly size = signal<number[]>([50]);
  public readonly isEnabled = signal<boolean>(true);
  public readonly collapsedSide = signal<SplitterCollapsedSide | null>(null);
  public readonly animateResize = signal<boolean>(true);

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
  selector: 'test-splitter-too-many-host',
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
class SplitterTooManyHost {}

type SplitterHostConfig = {
  direction?: SplitterDirection;
  minimumSize?: number[];
  size?: number[];
  isEnabled?: boolean;
  collapsedSide?: SplitterCollapsedSide | null;
  animateResize?: boolean;
};

const getDivider = (host: HTMLElement): HTMLElement => host.querySelector('.splitter-divider') as HTMLElement;

const getFirstSection = (host: HTMLElement): HTMLElement => host.querySelector('.first-section') as HTMLElement;

/** computes a viewport clientX/clientY for a target percentage inside the splitter host */
const pointAtPercent = (host: HTMLElement, percent: number, direction: SplitterDirection): { x: number; y: number } => {
  const rect = host.getBoundingClientRect();

  if (direction === 'horizontal') {
    return { x: rect.left + (percent / 100) * rect.width, y: rect.top + rect.height / 2 };
  }

  return { x: rect.left + rect.width / 2, y: rect.top + (percent / 100) * rect.height };
};

/** dispatches a synthetic pointer event of the given type on the divider, returning the event for inspection */
const dispatchPointer = (
  divider: HTMLElement,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  point: { x: number; y: number }
): PointerEvent => {
  const event = new PointerEvent(type, {
    pointerId: 1,
    clientX: point.x,
    clientY: point.y,
    bubbles: true,
    cancelable: true,
  });

  divider.dispatchEvent(event);

  return event;
};

/** dispatches a synthetic keydown on the divider, returning the event so defaultPrevented can be asserted */
const dispatchKeyDown = (divider: HTMLElement, key: string): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

  divider.dispatchEvent(event);

  return event;
};

describe('Splitter (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveSplitter = (config: SplitterHostConfig = {}): ComponentFixture<SplitterInteractiveHost> =>
    createFixture(SplitterInteractiveHost, (instance) => {
      if (config.direction !== undefined) {
        instance.direction.set(config.direction);
      }

      if (config.minimumSize !== undefined) {
        instance.minimumSize.set(config.minimumSize);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.isEnabled !== undefined) {
        instance.isEnabled.set(config.isEnabled);
      }

      if (config.collapsedSide !== undefined) {
        instance.collapsedSide.set(config.collapsedSide);
      }

      if (config.animateResize !== undefined) {
        instance.animateResize.set(config.animateResize);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default host attributes', () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');

      expect(host.getAttribute('data-direction')).toBe('horizontal');
      expect(host.getAttribute('data-enabled')).toBe('');
      expect(host.getAttribute('data-collapsed-side')).toBeNull();
      expect(host.getAttribute('data-dragging')).toBeNull();
      expect(host.getAttribute('data-animate-resize')).toBe('');
    });

    it('reflects the vertical direction on the host', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');

      fixture.componentInstance.direction.set('vertical');
      await flush(fixture);

      expect(host.getAttribute('data-direction')).toBe('vertical');
    });

    it('removes the data-enabled attribute when isEnabled is false', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');

      fixture.componentInstance.isEnabled.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-enabled')).toBeNull();
    });

    it('reflects the collapsed side attribute for each side and clears it', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');

      fixture.componentInstance.collapsedSide.set('first');
      await flush(fixture);
      expect(host.getAttribute('data-collapsed-side')).toBe('first');

      fixture.componentInstance.collapsedSide.set('second');
      await flush(fixture);
      expect(host.getAttribute('data-collapsed-side')).toBe('second');

      fixture.componentInstance.collapsedSide.set(null);
      await flush(fixture);
      expect(host.getAttribute('data-collapsed-side')).toBeNull();
    });

    it('removes the animate-resize attribute when animateResize is false', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');

      fixture.componentInstance.animateResize.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-animate-resize')).toBeNull();
    });
  });

  describe('divider semantics', () => {
    it('exposes the separator role on the divider', () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      expect(divider.getAttribute('role')).toBe('separator');
    });

    it('sets the divider aria-orientation perpendicular to the splitter direction', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      expect(divider.getAttribute('aria-orientation')).toBe('vertical');

      fixture.componentInstance.direction.set('vertical');
      await flush(fixture);

      expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('reflects the first section size in the divider aria-value attributes', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      expect(divider.getAttribute('aria-valuenow')).toBe('50');
      expect(divider.getAttribute('aria-valuemin')).toBe('0');
      expect(divider.getAttribute('aria-valuemax')).toBe('100');

      fixture.componentInstance.size.set([30, 70]);
      await flush(fixture);

      expect(divider.getAttribute('aria-valuenow')).toBe('30');
    });

    it('uses a tabindex of 0 when the divider is draggable', () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      expect(divider.getAttribute('tabindex')).toBe('0');
    });

    it('uses a tabindex of -1 when disabled', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      fixture.componentInstance.isEnabled.set(false);
      await flush(fixture);

      expect(divider.getAttribute('tabindex')).toBe('-1');
    });

    it('uses a tabindex of -1 when collapsed', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      fixture.componentInstance.collapsedSide.set('first');
      await flush(fixture);

      expect(divider.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('first section sizing', () => {
    it('defaults the first section flex-basis to 50%', () => {
      const fixture = createInteractiveSplitter();
      const firstSection = getFirstSection(queryByTestId(fixture, 'splitter'));

      expect(firstSection.style.flexBasis).toBe('50%');
    });

    it('applies a single value size to the first section', async () => {
      const fixture = createInteractiveSplitter();
      const firstSection = getFirstSection(queryByTestId(fixture, 'splitter'));

      fixture.componentInstance.size.set([20]);
      await flush(fixture);

      expect(firstSection.style.flexBasis).toBe('20%');
    });

    it('applies the first value of a tuple size to the first section', async () => {
      const fixture = createInteractiveSplitter();
      const firstSection = getFirstSection(queryByTestId(fixture, 'splitter'));

      fixture.componentInstance.size.set([30, 70]);
      await flush(fixture);

      expect(firstSection.style.flexBasis).toBe('30%');
    });

    it('sets the first section to 0% when the first side is collapsed', async () => {
      const fixture = createInteractiveSplitter();
      const firstSection = getFirstSection(queryByTestId(fixture, 'splitter'));

      fixture.componentInstance.collapsedSide.set('first');
      await flush(fixture);

      expect(firstSection.style.flexBasis).toBe('0%');
    });

    it('sets the first section to 100% when the second side is collapsed', async () => {
      const fixture = createInteractiveSplitter();
      const firstSection = getFirstSection(queryByTestId(fixture, 'splitter'));

      fixture.componentInstance.collapsedSide.set('second');
      await flush(fixture);

      expect(firstSection.style.flexBasis).toBe('100%');
    });

    it('propagates a programmatic size update to both the divider aria and first section', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const firstSection = getFirstSection(host);

      fixture.componentInstance.size.set([30, 70]);
      await flush(fixture);

      expect(firstSection.style.flexBasis).toBe('30%');
      expect(divider.getAttribute('aria-valuenow')).toBe('30');
    });
  });

  describe('keyboard resize', () => {
    it('increases the first section size on ArrowRight for a horizontal splitter', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'ArrowRight');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[55,45]'));
    });

    it('decreases the first section size on ArrowLeft for a horizontal splitter', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'ArrowLeft');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[45,55]'));
    });

    it('increases the first section size on ArrowDown for a vertical splitter', async () => {
      const fixture = createInteractiveSplitter({ direction: 'vertical' });
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'ArrowDown');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[55,45]'));
    });

    it('decreases the first section size on ArrowUp for a vertical splitter', async () => {
      const fixture = createInteractiveSplitter({ direction: 'vertical' });
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'ArrowUp');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[45,55]'));
    });

    it('jumps to the minimum first percent on Home', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'Home');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[0,100]'));
    });

    it('jumps to the maximum first percent on End', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'End');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[100,0]'));
    });

    it('prevents default on a handled arrow key', () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));

      divider.focus();
      const event = dispatchKeyDown(divider, 'ArrowRight');

      expect(event.defaultPrevented).toBe(true);
    });

    it('applies a single minimum size value to both sides', async () => {
      // container is 500px; minimum 50px = 10%
      const fixture = createInteractiveSplitter({ minimumSize: [50] });
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'Home');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[10,90]'));

      dispatchKeyDown(divider, 'End');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[90,10]'));
    });

    it('applies a tuple minimum size individually per side', async () => {
      // container is 500px; first minimum 50px = 10%; second minimum 100px = 20%
      const fixture = createInteractiveSplitter({ minimumSize: [50, 100] });
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'Home');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[10,90]'));

      dispatchKeyDown(divider, 'End');

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[80,20]'));
    });
  });

  describe('keyboard gating', () => {
    it('does nothing on a key press when disabled', async () => {
      const fixture = createInteractiveSplitter({ isEnabled: false });
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      dispatchKeyDown(divider, 'ArrowRight');
      await flush(fixture);

      expect(readout.textContent).toContain('sizeChanged=0');
    });

    it('does nothing on a key press when collapsed', async () => {
      const fixture = createInteractiveSplitter({ collapsedSide: 'first' });
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      dispatchKeyDown(divider, 'ArrowRight');
      await flush(fixture);

      expect(readout.textContent).toContain('sizeChanged=0');
    });

    it('does not change the size for an unrelated key', async () => {
      const fixture = createInteractiveSplitter();
      const divider = getDivider(queryByTestId(fixture, 'splitter'));
      const readout = queryByTestId(fixture, 'readout');

      divider.focus();
      dispatchKeyDown(divider, 'Tab');
      await flush(fixture);

      expect(readout.textContent).toContain('sizeChanged=0');
    });
  });

  describe('pointer drag', () => {
    it('starts a drag and sets data-dragging on pointer down', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      dispatchPointer(divider, 'pointerdown', pointAtPercent(host, 50, 'horizontal'));

      await waitFor(() => expect(readout.textContent).toContain('dragStarted=1'));
      await waitFor(() => expect(host.getAttribute('data-dragging')).toBe(''));
    });

    it('updates the size as the pointer moves during a drag', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      dispatchPointer(divider, 'pointerdown', pointAtPercent(host, 50, 'horizontal'));
      dispatchPointer(divider, 'pointermove', pointAtPercent(host, 20, 'horizontal'));

      await waitFor(() => expect(readout.textContent).toContain('lastSize=[20,80]'));

      dispatchPointer(divider, 'pointerup', pointAtPercent(host, 20, 'horizontal'));
    });

    it('ends the drag and emits dragCompleted on pointer up', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      const point = pointAtPercent(host, 50, 'horizontal');

      dispatchPointer(divider, 'pointerdown', point);
      await waitFor(() => expect(host.getAttribute('data-dragging')).toBe(''));

      dispatchPointer(divider, 'pointerup', point);

      await waitFor(() => expect(host.getAttribute('data-dragging')).toBeNull());
      await waitFor(() => expect(readout.textContent).toContain('dragCompleted=1'));
    });

    it('does nothing on a pointer move without a prior pointer down', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      dispatchPointer(divider, 'pointermove', pointAtPercent(host, 25, 'horizontal'));
      await flush(fixture);

      expect(readout.textContent).toContain('sizeChanged=0');
      expect(readout.textContent).toContain('dragStarted=0');
    });

    it('ends the drag and emits dragCompleted on pointer cancel', async () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      const point = pointAtPercent(host, 50, 'horizontal');

      dispatchPointer(divider, 'pointerdown', point);
      await waitFor(() => expect(host.getAttribute('data-dragging')).toBe(''));

      dispatchPointer(divider, 'pointercancel', point);

      await waitFor(() => expect(host.getAttribute('data-dragging')).toBeNull());
      await waitFor(() => expect(readout.textContent).toContain('dragCompleted=1'));
    });

    it('does nothing on pointer down when disabled', async () => {
      const fixture = createInteractiveSplitter({ isEnabled: false });
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      dispatchPointer(divider, 'pointerdown', pointAtPercent(host, 50, 'horizontal'));
      await flush(fixture);

      expect(readout.textContent).toContain('dragStarted=0');
      expect(host.getAttribute('data-dragging')).toBeNull();
    });

    it('does nothing on pointer down when collapsed', async () => {
      const fixture = createInteractiveSplitter({ collapsedSide: 'first' });
      const host = queryByTestId(fixture, 'splitter');
      const divider = getDivider(host);
      const readout = queryByTestId(fixture, 'readout');

      vitestBrowserUtils.stubPointerCapture(divider);
      dispatchPointer(divider, 'pointerdown', pointAtPercent(host, 50, 'horizontal'));
      await flush(fixture);

      expect(readout.textContent).toContain('dragStarted=0');
      expect(host.getAttribute('data-dragging')).toBeNull();
    });
  });

  describe('content projection', () => {
    it('projects the first and second section templates', () => {
      const fixture = createInteractiveSplitter();
      const host = queryByTestId(fixture, 'splitter');

      expect(host.querySelector('[data-testid="first-content"]')).not.toBeNull();
      expect(host.querySelector('[data-testid="second-content"]')).not.toBeNull();
    });

    it('ignores additional sections beyond the first two', () => {
      const fixture = createFixture(SplitterTooManyHost);
      const host = queryByTestId(fixture, 'splitter');

      expect(host.querySelector('[data-testid="first-content"]')).not.toBeNull();
      expect(host.querySelector('[data-testid="second-content"]')).not.toBeNull();
      expect(host.querySelector('[data-testid="third-content"]')).toBeNull();
    });
  });
});

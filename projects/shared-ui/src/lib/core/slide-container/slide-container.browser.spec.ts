import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Box } from '../box/box';
import { SlideContainer, type SlideContainerOrientation, type SlideContainerSize } from './slide-container';
import { SlideContainerItem } from './slide-container-item';

@Component({
  selector: 'test-slide-container-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box],
  host: { class: 'block' },
  template: `
    <org-slide-container
      data-testid="container"
      [orientation]="orientation()"
      [size]="size()"
      [allowLooping]="allowLooping()"
      [(activeIndex)]="activeIndex"
      [ariaLabel]="ariaLabel()"
    >
      <org-slide-container-item data-testid="item-0">
        <org-box color="primary" padding="lg">Slide 1</org-box>
      </org-slide-container-item>
      <org-slide-container-item data-testid="item-1">
        <org-box color="safe" padding="lg">Slide 2</org-box>
      </org-slide-container-item>
      <org-slide-container-item data-testid="item-2">
        <org-box color="caution" padding="lg">Slide 3</org-box>
      </org-slide-container-item>
    </org-slide-container>
  `,
})
class SlideContainerHost {
  public readonly orientation = signal<SlideContainerOrientation>('horizontal');
  public readonly size = signal<SlideContainerSize>('stable');
  public readonly allowLooping = signal<boolean>(false);
  public readonly activeIndex = signal<number>(0);
  public readonly ariaLabel = signal<string>('Slide container');
}

@Component({
  selector: 'test-slide-container-dynamic-count-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box],
  host: { class: 'block' },
  template: `
    <org-slide-container data-testid="container">
      @for (idx of itemIndices(); track idx) {
        <org-slide-container-item [attr.data-testid]="'item-' + idx">
          <org-box color="primary" padding="lg">Slide {{ idx + 1 }}</org-box>
        </org-slide-container-item>
      }
    </org-slide-container>
  `,
})
class SlideContainerDynamicCountHost {
  public readonly itemIndices = signal<number[]>([0, 1, 2]);

  public addSlide(): void {
    this.itemIndices.update((items) => [...items, items.length]);
  }

  public removeSlide(): void {
    this.itemIndices.update((items) => items.slice(0, -1));
  }
}

describe('SlideContainer (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  type SlideContainerHostConfig = {
    orientation?: SlideContainerOrientation;
    size?: SlideContainerSize;
    allowLooping?: boolean;
    activeIndex?: number;
    ariaLabel?: string;
  };

  const createSlideContainer = (config: SlideContainerHostConfig = {}): ComponentFixture<SlideContainerHost> =>
    createFixture(SlideContainerHost, (instance) => {
      if (config.orientation !== undefined) {
        instance.orientation.set(config.orientation);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.allowLooping !== undefined) {
        instance.allowLooping.set(config.allowLooping);
      }

      if (config.activeIndex !== undefined) {
        instance.activeIndex.set(config.activeIndex);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }
    });

  describe('container a11y and host attributes', () => {
    it('renders the carousel region with default attributes', () => {
      const fixture = createSlideContainer();
      const host = queryByTestId(fixture, 'container');

      expect(host.getAttribute('role')).toBe('region');
      expect(host.getAttribute('aria-live')).toBe('polite');
      expect(host.getAttribute('aria-roledescription')).toBe('carousel');
      expect(host.getAttribute('aria-label')).toBe('Slide container');
      expect(host.getAttribute('data-orientation')).toBe('horizontal');
      expect(host.getAttribute('data-size')).toBe('stable');
      expect(host.getAttribute('data-allow-looping')).toBeNull();
    });

    it('reflects the aria-label input', async () => {
      const fixture = createSlideContainer();
      const host = queryByTestId(fixture, 'container');

      fixture.componentInstance.ariaLabel.set('My carousel');
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('aria-label')).toBe('My carousel'));
    });

    it('reflects the orientation data attribute', async () => {
      const fixture = createSlideContainer();
      const host = queryByTestId(fixture, 'container');

      fixture.componentInstance.orientation.set('vertical');
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-orientation')).toBe('vertical'));
    });

    it('reflects the size data attribute', async () => {
      const fixture = createSlideContainer();
      const host = queryByTestId(fixture, 'container');

      fixture.componentInstance.size.set('dynamic');
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-size')).toBe('dynamic'));
    });

    it('reflects the allow-looping data attribute', async () => {
      const fixture = createSlideContainer();
      const host = queryByTestId(fixture, 'container');

      expect(host.getAttribute('data-allow-looping')).toBeNull();

      fixture.componentInstance.allowLooping.set(true);
      await flush(fixture);
      await waitFor(() => expect(host.getAttribute('data-allow-looping')).toBe(''));

      fixture.componentInstance.allowLooping.set(false);
      await flush(fixture);
      await waitFor(() => expect(host.getAttribute('data-allow-looping')).toBeNull());
    });
  });

  describe('slide item a11y', () => {
    it('gives each slide item the slide role and roledescription', () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');
      const item1 = queryByTestId(fixture, 'item-1');
      const item2 = queryByTestId(fixture, 'item-2');

      for (const item of [item0, item1, item2]) {
        expect(item.getAttribute('role')).toBe('group');
        expect(item.getAttribute('aria-roledescription')).toBe('slide');
      }
    });

    it('reports each slide aria-label as position and count', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');
      const item1 = queryByTestId(fixture, 'item-1');
      const item2 = queryByTestId(fixture, 'item-2');

      await waitFor(() => {
        expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 3');
        expect(item1.getAttribute('aria-label')).toBe('Slide 2 of 3');
        expect(item2.getAttribute('aria-label')).toBe('Slide 3 of 3');
      });
    });

    it('hides inactive slides from assistive technology but not the active one', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');
      const item1 = queryByTestId(fixture, 'item-1');
      const item2 = queryByTestId(fixture, 'item-2');

      await waitFor(() => {
        expect(item0.getAttribute('aria-hidden')).toBeNull();
        expect(item1.getAttribute('aria-hidden')).toBe('true');
        expect(item2.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('slide item positioning', () => {
    it('marks the active slide with the active data position', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');
      const item1 = queryByTestId(fixture, 'item-1');
      const item2 = queryByTestId(fixture, 'item-2');

      await waitFor(() => {
        expect(item0.getAttribute('data-position')).toBe('active');
        expect(item1.getAttribute('data-position')).toBe('after');
        expect(item2.getAttribute('data-position')).toBe('after');
      });
    });

    it('sets the before position for the previous slide when navigating forward', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');
      const item1 = queryByTestId(fixture, 'item-1');
      const item2 = queryByTestId(fixture, 'item-2');

      fixture.componentInstance.activeIndex.set(1);
      await flush(fixture);

      await waitFor(() => {
        expect(item0.getAttribute('data-position')).toBe('before');
        expect(item1.getAttribute('data-position')).toBe('active');
        expect(item2.getAttribute('data-position')).toBe('after');
      });
    });

    it('sets the after position for the previous slide when navigating backward', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');
      const item1 = queryByTestId(fixture, 'item-1');

      fixture.componentInstance.activeIndex.set(1);
      await flush(fixture);
      await waitFor(() => expect(item1.getAttribute('data-position')).toBe('active'));

      fixture.componentInstance.activeIndex.set(0);
      await flush(fixture);

      await waitFor(() => {
        expect(item0.getAttribute('data-position')).toBe('active');
        expect(item1.getAttribute('data-position')).toBe('after');
      });
    });
  });

  describe('slide item inherited styling hooks', () => {
    it('reflects the orientation from the container', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');

      expect(item0.getAttribute('data-orientation')).toBe('horizontal');

      fixture.componentInstance.orientation.set('vertical');
      await flush(fixture);

      await waitFor(() => expect(item0.getAttribute('data-orientation')).toBe('vertical'));
    });

    it('reflects the size from the container', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');

      expect(item0.getAttribute('data-size')).toBe('stable');

      fixture.componentInstance.size.set('dynamic');
      await flush(fixture);

      await waitFor(() => expect(item0.getAttribute('data-size')).toBe('dynamic'));
    });
  });

  describe('looping navigation', () => {
    it('chooses the shorter forward path when looping', async () => {
      const fixture = createSlideContainer();
      const item2 = queryByTestId(fixture, 'item-2');

      fixture.componentInstance.allowLooping.set(true);
      await flush(fixture);
      fixture.componentInstance.activeIndex.set(2);
      await flush(fixture);
      await waitFor(() => expect(item2.getAttribute('data-position')).toBe('active'));

      // 2 -> 0 with 3 slides looping: forward distance (1) < backward distance (2), so the
      // previously-active item 2 must exit as 'before' to animate in the forward direction
      fixture.componentInstance.activeIndex.set(0);
      await flush(fixture);

      await waitFor(() => expect(item2.getAttribute('data-position')).toBe('before'));
    });

    it('chooses the shorter backward path when looping', async () => {
      const fixture = createSlideContainer();
      const item0 = queryByTestId(fixture, 'item-0');

      fixture.componentInstance.allowLooping.set(true);
      await flush(fixture);

      // 0 -> 2 with 3 slides looping: backward distance (1) < forward distance (2), so the
      // previously-active item 0 must exit as 'after' to animate in the backward direction
      fixture.componentInstance.activeIndex.set(2);
      await flush(fixture);

      await waitFor(() => expect(item0.getAttribute('data-position')).toBe('after'));
    });
  });

  describe('dynamic slide count', () => {
    it('reflects projected items when slides are added', async () => {
      const fixture = createFixture(SlideContainerDynamicCountHost);
      const item0 = queryByTestId(fixture, 'item-0');

      await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 3'));

      fixture.componentInstance.addSlide();
      await flush(fixture);

      await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 4'));

      const item3 = queryByTestId(fixture, 'item-3');

      await waitFor(() => expect(item3.getAttribute('aria-label')).toBe('Slide 4 of 4'));
    });

    it('reflects projected items when slides are removed', async () => {
      const fixture = createFixture(SlideContainerDynamicCountHost);
      const item0 = queryByTestId(fixture, 'item-0');

      await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 3'));

      fixture.componentInstance.addSlide();
      await flush(fixture);
      await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 4'));

      fixture.componentInstance.removeSlide();
      await flush(fixture);
      fixture.componentInstance.removeSlide();
      await flush(fixture);

      await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 2'));
    });
  });
});

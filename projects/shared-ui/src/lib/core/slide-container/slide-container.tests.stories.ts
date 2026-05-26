import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Box } from '../box/box';
import { SlideContainer, type SlideContainerOrientation, type SlideContainerSize } from './slide-container';
import { SlideContainerItem } from './slide-container-item';

@Component({
  selector: 'story-slide-container-tests-shell',
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
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-orientation-vertical" (click)="orientation.set('vertical')">
        orientation-vertical
      </button>
      <button type="button" data-testid="ctl-orientation-horizontal" (click)="orientation.set('horizontal')">
        orientation-horizontal
      </button>
      <button type="button" data-testid="ctl-size-dynamic" (click)="size.set('dynamic')">size-dynamic</button>
      <button type="button" data-testid="ctl-size-stable" (click)="size.set('stable')">size-stable</button>
      <button type="button" data-testid="ctl-allow-looping-on" (click)="allowLooping.set(true)">
        allow-looping-on
      </button>
      <button type="button" data-testid="ctl-allow-looping-off" (click)="allowLooping.set(false)">
        allow-looping-off
      </button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('My carousel')">
        aria-label-set
      </button>
      <button type="button" data-testid="ctl-active-index-0" (click)="activeIndex.set(0)">active-index-0</button>
      <button type="button" data-testid="ctl-active-index-1" (click)="activeIndex.set(1)">active-index-1</button>
      <button type="button" data-testid="ctl-active-index-2" (click)="activeIndex.set(2)">active-index-2</button>
    </div>
  `,
})
class StorySlideContainerTestsShell {
  protected readonly orientation = signal<SlideContainerOrientation>('horizontal');
  protected readonly size = signal<SlideContainerSize>('stable');
  protected readonly allowLooping = signal<boolean>(false);
  protected readonly activeIndex = signal<number>(0);
  protected readonly ariaLabel = signal<string>('Slide container');

  protected readout(): string {
    return `activeIndex=${this.activeIndex()}`;
  }
}

@Component({
  selector: 'story-slide-container-dynamic-count-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-add-slide" (click)="addSlide()">add-slide</button>
      <button type="button" data-testid="ctl-remove-slide" (click)="removeSlide()">remove-slide</button>
    </div>
  `,
})
class StorySlideContainerDynamicCountShell {
  protected readonly itemIndices = signal<number[]>([0, 1, 2]);

  protected addSlide(): void {
    this.itemIndices.update((items) => [...items, items.length]);
  }

  protected removeSlide(): void {
    this.itemIndices.update((items) => items.slice(0, -1));
  }
}

const meta: Meta = {
  title: 'Core/Components/Slide Container/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-slide-container-tests-shell />`,
  moduleMetadata: { imports: [StorySlideContainerTestsShell] },
});

const renderDynamicCountShell: Story['render'] = () => ({
  template: `<story-slide-container-dynamic-count-shell />`,
  moduleMetadata: { imports: [StorySlideContainerDynamicCountShell] },
});

export const RendersCarouselRegionWithDefaults: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('container');

    await expect(host.getAttribute('role')).toBe('region');
    await expect(host.getAttribute('aria-live')).toBe('polite');
    await expect(host.getAttribute('aria-roledescription')).toBe('carousel');
    await expect(host.getAttribute('aria-label')).toBe('Slide container');
    await expect(host.getAttribute('data-orientation')).toBe('horizontal');
    await expect(host.getAttribute('data-size')).toBe('stable');
    await expect(host.getAttribute('data-allow-looping')).toBeNull();
  },
};

export const ReflectsAriaLabelInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('container');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('My carousel'));
  },
};

export const ReflectsOrientationDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('container');

    await userEvent.click(canvas.getByTestId('ctl-orientation-vertical'));

    await waitFor(() => expect(host.getAttribute('data-orientation')).toBe('vertical'));
  },
};

export const ReflectsSizeDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('container');

    await userEvent.click(canvas.getByTestId('ctl-size-dynamic'));

    await waitFor(() => expect(host.getAttribute('data-size')).toBe('dynamic'));
  },
};

export const ReflectsAllowLoopingDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('container');

    await expect(host.getAttribute('data-allow-looping')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-allow-looping-on'));
    await waitFor(() => expect(host.getAttribute('data-allow-looping')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-allow-looping-off'));
    await waitFor(() => expect(host.getAttribute('data-allow-looping')).toBeNull());
  },
};

export const SlideItemsHaveSlideRoleAndRoledescription: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');
    const item1 = await canvas.findByTestId('item-1');
    const item2 = await canvas.findByTestId('item-2');

    for (const item of [item0, item1, item2]) {
      await expect(item.getAttribute('role')).toBe('group');
      await expect(item.getAttribute('aria-roledescription')).toBe('slide');
    }
  },
};

export const SlideItemAriaLabelReportsPositionAndCount: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');
    const item1 = await canvas.findByTestId('item-1');
    const item2 = await canvas.findByTestId('item-2');

    await waitFor(() => {
      expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 3');
      expect(item1.getAttribute('aria-label')).toBe('Slide 2 of 3');
      expect(item2.getAttribute('aria-label')).toBe('Slide 3 of 3');
    });
  },
};

export const ActiveSlideHasActiveDataPosition: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');
    const item1 = await canvas.findByTestId('item-1');
    const item2 = await canvas.findByTestId('item-2');

    await waitFor(() => {
      expect(item0.getAttribute('data-position')).toBe('active');
      expect(item1.getAttribute('data-position')).toBe('after');
      expect(item2.getAttribute('data-position')).toBe('after');
    });
  },
};

export const InactiveSlidesAreAriaHiddenActiveIsNot: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');
    const item1 = await canvas.findByTestId('item-1');
    const item2 = await canvas.findByTestId('item-2');

    await waitFor(() => {
      expect(item0.getAttribute('aria-hidden')).toBeNull();
      expect(item1.getAttribute('aria-hidden')).toBe('true');
      expect(item2.getAttribute('aria-hidden')).toBe('true');
    });
  },
};

export const SlideItemReflectsOrientationFromContainer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');

    await expect(item0.getAttribute('data-orientation')).toBe('horizontal');

    await userEvent.click(canvas.getByTestId('ctl-orientation-vertical'));

    await waitFor(() => expect(item0.getAttribute('data-orientation')).toBe('vertical'));
  },
};

export const SlideItemReflectsSizeFromContainer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');

    await expect(item0.getAttribute('data-size')).toBe('stable');

    await userEvent.click(canvas.getByTestId('ctl-size-dynamic'));

    await waitFor(() => expect(item0.getAttribute('data-size')).toBe('dynamic'));
  },
};

export const NavigatingForwardSetsBeforePositionForPreviousSlide: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');
    const item1 = await canvas.findByTestId('item-1');
    const item2 = await canvas.findByTestId('item-2');

    await userEvent.click(canvas.getByTestId('ctl-active-index-1'));

    await waitFor(() => {
      expect(item0.getAttribute('data-position')).toBe('before');
      expect(item1.getAttribute('data-position')).toBe('active');
      expect(item2.getAttribute('data-position')).toBe('after');
    });
  },
};

export const NavigatingBackwardSetsAfterPositionForPreviousSlide: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');
    const item1 = await canvas.findByTestId('item-1');

    await userEvent.click(canvas.getByTestId('ctl-active-index-1'));
    await waitFor(() => expect(item1.getAttribute('data-position')).toBe('active'));

    await userEvent.click(canvas.getByTestId('ctl-active-index-0'));

    await waitFor(() => {
      expect(item0.getAttribute('data-position')).toBe('active');
      expect(item1.getAttribute('data-position')).toBe('after');
    });
  },
};

export const LoopingChoosesShorterForwardPath: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item2 = await canvas.findByTestId('item-2');

    await userEvent.click(canvas.getByTestId('ctl-allow-looping-on'));
    await userEvent.click(canvas.getByTestId('ctl-active-index-2'));
    await waitFor(() => expect(item2.getAttribute('data-position')).toBe('active'));

    // 2 -> 0 with 3 slides looping: forward distance (1) < backward distance (2), so the
    // previously-active item 2 must exit as 'before' to animate in the forward direction
    await userEvent.click(canvas.getByTestId('ctl-active-index-0'));

    await waitFor(() => expect(item2.getAttribute('data-position')).toBe('before'));
  },
};

export const LoopingChoosesShorterBackwardPath: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');

    await userEvent.click(canvas.getByTestId('ctl-allow-looping-on'));

    // 0 -> 2 with 3 slides looping: backward distance (1) < forward distance (2), so the
    // previously-active item 0 must exit as 'after' to animate in the backward direction
    await userEvent.click(canvas.getByTestId('ctl-active-index-2'));

    await waitFor(() => expect(item0.getAttribute('data-position')).toBe('after'));
  },
};

export const SlideCountReflectsProjectedItems: Story = {
  render: renderDynamicCountShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item0 = await canvas.findByTestId('item-0');

    await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 3'));

    await userEvent.click(canvas.getByTestId('ctl-add-slide'));

    await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 4'));

    const item3 = await canvas.findByTestId('item-3');

    await waitFor(() => expect(item3.getAttribute('aria-label')).toBe('Slide 4 of 4'));

    await userEvent.click(canvas.getByTestId('ctl-remove-slide'));
    await userEvent.click(canvas.getByTestId('ctl-remove-slide'));

    await waitFor(() => expect(item0.getAttribute('aria-label')).toBe('Slide 1 of 2'));
  },
};

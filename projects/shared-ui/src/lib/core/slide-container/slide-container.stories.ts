import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../button/button';
import { Box } from '../box/box';
import { SlideContainer, allSlideContainerOrientations, allSlideContainerSizes } from './slide-container';
import { SlideContainerItem } from './slide-container-item';

const meta: Meta<SlideContainer> = {
  title: 'Core/Components/Slide Container',
  component: SlideContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## SlideContainer Component

  A container for animating between blocks of arbitrary HTML content with a CSS-driven slide animation.
  Supports horizontal and vertical orientations.

  ### Features
  - Horizontal or vertical slide animation
  - Direction-aware animation (forward vs. backward based on index)
  - **stable** size: container stays fixed at the largest slide (no layout shift)
  - **dynamic** size: container resizes to fit the active slide's content
  - Accessible WAI-ARIA carousel pattern
  - Two-way binding for the active slide index

  ### Sub-components
  - **org-slide-container-item**: Wraps each individual slide's content

  ### Usage Example
  \`\`\`html
  <org-slide-container [(activeIndex)]="activeSlide">
    <org-slide-container-item>First slide content</org-slide-container-item>
    <org-slide-container-item>Second slide content</org-slide-container-item>
    <org-slide-container-item>Third slide content</org-slide-container-item>
  </org-slide-container>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SlideContainer>;

export const Default: Story = {
  args: {
    activeIndex: 0,
    orientation: 'horizontal',
    size: 'stable',
    ariaLabel: 'Example slide container',
    allowLooping: false,
  },
  argTypes: {
    activeIndex: {
      control: { type: 'number', min: 0, max: 2 },
      description: 'Index of the currently active slide (zero-based)',
    },
    orientation: {
      control: 'select',
      options: allSlideContainerOrientations,
      description: 'Slide direction — horizontal or vertical',
    },
    size: {
      control: 'select',
      options: allSlideContainerSizes,
      description: 'stable keeps the container at the largest slide size; dynamic resizes to the active slide',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the carousel region',
    },
    allowLooping: {
      control: 'boolean',
      description: 'Whether the carousel wraps from the last slide back to the first',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default slide container with full controls. Use the controls below to change the active slide index and orientation.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-slide-container
        [orientation]="orientation"
        [size]="size"
        [activeIndex]="activeIndex"
        [ariaLabel]="ariaLabel"
        [allowLooping]="allowLooping"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">Slide 1 — primary</org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">Slide 2 — safe</org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="danger" padding="lg">Slide 3 — danger</org-box>
        </org-slide-container-item>
      </org-slide-container>
    `,
    moduleMetadata: {
      imports: [SlideContainer, SlideContainerItem, Box],
    },
  }),
};

@Component({
  selector: 'story-slide-container-stable-horizontal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        orientation="horizontal"
        [(activeIndex)]="activeIndex"
        ariaLabel="Stable horizontal slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1</p>
            <p>Horizontal — first slide</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">
            <p class="text-xl font-semibold">Slide 2</p>
            <p>Horizontal — second slide</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="caution" padding="lg">
            <p class="text-xl font-semibold">Slide 3</p>
            <p>Horizontal — third slide with more content to show stable sizing</p>
            <p>Extra line here</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button [disabled]="activeIndex() === 0" label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button [disabled]="activeIndex() === containerComponent.slideCount() - 1" label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerStableHorizontalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    this.activeIndex.update((i) => Math.max(0, i - 1));
  }

  protected onNext(): void {
    this.activeIndex.update((i) => Math.min(this.containerComponent().slideCount() - 1, i + 1));
  }
}

@Component({
  selector: 'story-slide-container-stable-vertical-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        orientation="vertical"
        [(activeIndex)]="activeIndex"
        ariaLabel="Stable vertical slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1</p>
            <p>Vertical — first slide</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">
            <p class="text-xl font-semibold">Slide 2</p>
            <p>Vertical — second slide</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="info" padding="lg">
            <p class="text-xl font-semibold">Slide 3</p>
            <p>Vertical — third slide with more content to show stable sizing</p>
            <p>Extra line here</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button [disabled]="activeIndex() === 0" label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button [disabled]="activeIndex() === containerComponent.slideCount() - 1" label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerStableVerticalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    this.activeIndex.update((i) => Math.max(0, i - 1));
  }

  protected onNext(): void {
    this.activeIndex.update((i) => Math.min(this.containerComponent().slideCount() - 1, i + 1));
  }
}

export const Stable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Stable size mode — the container stays fixed at the height of the tallest slide regardless of which slide is active. Supports both horizontal and vertical orientations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Stable"
        currentState="Container size stays fixed at the largest slide"
      >
        <org-storybook-example-container-section label="Horizontal">
          <story-slide-container-stable-horizontal-demo />
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Vertical">
          <story-slide-container-stable-vertical-demo />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        SlideContainerStableHorizontalDemo,
        SlideContainerStableVerticalDemo,
      ],
    },
  }),
};

@Component({
  selector: 'story-slide-container-dynamic-horizontal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        size="dynamic"
        orientation="horizontal"
        [(activeIndex)]="activeIndex"
        ariaLabel="Dynamic horizontal slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1 — short</p>
            <p>This slide has minimal content.</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">
            <p class="text-xl font-semibold">Slide 2 — tall</p>
            <p>This slide has more content.</p>
            <p>Second line of content.</p>
            <p>Third line of content.</p>
            <p>Fourth line of content.</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="caution" padding="lg">
            <p class="text-xl font-semibold">Slide 3 — medium</p>
            <p>This slide has a moderate amount of content.</p>
            <p>Second line of content.</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button [disabled]="activeIndex() === 0" label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button [disabled]="activeIndex() === containerComponent.slideCount() - 1" label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerDynamicHorizontalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    this.activeIndex.update((i) => Math.max(0, i - 1));
  }

  protected onNext(): void {
    this.activeIndex.update((i) => Math.min(this.containerComponent().slideCount() - 1, i + 1));
  }
}

@Component({
  selector: 'story-slide-container-dynamic-vertical-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        size="dynamic"
        orientation="vertical"
        [(activeIndex)]="activeIndex"
        ariaLabel="Dynamic vertical slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1 — short</p>
            <p>This slide has minimal content.</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">
            <p class="text-xl font-semibold">Slide 2 — tall</p>
            <p>This slide has more content.</p>
            <p>Second line of content.</p>
            <p>Third line of content.</p>
            <p>Fourth line of content.</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="info" padding="lg">
            <p class="text-xl font-semibold">Slide 3 — medium</p>
            <p>This slide has a moderate amount of content.</p>
            <p>Second line of content.</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button [disabled]="activeIndex() === 0" label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button [disabled]="activeIndex() === containerComponent.slideCount() - 1" label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerDynamicVerticalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    this.activeIndex.update((i) => Math.max(0, i - 1));
  }

  protected onNext(): void {
    this.activeIndex.update((i) => Math.min(this.containerComponent().slideCount() - 1, i + 1));
  }
}

@Component({
  selector: 'story-slide-container-looping-horizontal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        [allowLooping]="true"
        orientation="horizontal"
        [(activeIndex)]="activeIndex"
        ariaLabel="Looping horizontal slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1</p>
            <p>Horizontal — wraps from last back to first</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">
            <p class="text-xl font-semibold">Slide 2</p>
            <p>Horizontal — second slide</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="caution" padding="lg">
            <p class="text-xl font-semibold">Slide 3</p>
            <p>Horizontal — wraps from here back to slide 1</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerLoopingHorizontalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i - 1 + count) % count);
  }

  protected onNext(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i + 1) % count);
  }
}

@Component({
  selector: 'story-slide-container-looping-vertical-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        [allowLooping]="true"
        orientation="vertical"
        [(activeIndex)]="activeIndex"
        ariaLabel="Looping vertical slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1</p>
            <p>Vertical — wraps from last back to first</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="info" padding="lg">
            <p class="text-xl font-semibold">Slide 2</p>
            <p>Vertical — second slide</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="danger" padding="lg">
            <p class="text-xl font-semibold">Slide 3</p>
            <p>Vertical — wraps from here back to slide 1</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerLoopingVerticalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i - 1 + count) % count);
  }

  protected onNext(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i + 1) % count);
  }
}

export const Looping: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Looping mode — navigation wraps around from the last slide back to the first (and vice versa) while preserving the correct animation direction. The consumer is responsible for wrapping the index value.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Looping"
        currentState="Slides wrap around with correct animation direction"
      >
        <org-storybook-example-container-section label="Horizontal">
          <story-slide-container-looping-horizontal-demo />
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Vertical">
          <story-slide-container-looping-vertical-demo />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        SlideContainerLoopingHorizontalDemo,
        SlideContainerLoopingVerticalDemo,
      ],
    },
  }),
};

export const Dynamic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dynamic size mode — the container resizes to fit the active slide. Notice the container height changes as you navigate between slides of different heights.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dynamic"
        currentState="Container resizes to fit the active slide content"
      >
        <org-storybook-example-container-section label="Horizontal">
          <story-slide-container-dynamic-horizontal-demo />
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Vertical">
          <story-slide-container-dynamic-vertical-demo />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        SlideContainerDynamicHorizontalDemo,
        SlideContainerDynamicVerticalDemo,
      ],
    },
  }),
};

@Component({
  selector: 'story-slide-container-looping-dynamic-horizontal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        [allowLooping]="true"
        size="dynamic"
        orientation="horizontal"
        [(activeIndex)]="activeIndex"
        ariaLabel="Looping dynamic horizontal slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1 — short</p>
            <p>Horizontal — wraps from last back to first</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="safe" padding="lg">
            <p class="text-xl font-semibold">Slide 2 — tall</p>
            <p>Horizontal — second slide</p>
            <p>Second line of content.</p>
            <p>Third line of content.</p>
            <p>Fourth line of content.</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="caution" padding="lg">
            <p class="text-xl font-semibold">Slide 3 — medium</p>
            <p>Horizontal — wraps from here back to slide 1</p>
            <p>Second line of content.</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerLoopingDynamicHorizontalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i - 1 + count) % count);
  }

  protected onNext(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i + 1) % count);
  }
}

@Component({
  selector: 'story-slide-container-looping-dynamic-vertical-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlideContainer, SlideContainerItem, Box, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-slide-container
        #containerComponent
        [allowLooping]="true"
        size="dynamic"
        orientation="vertical"
        [(activeIndex)]="activeIndex"
        ariaLabel="Looping dynamic vertical slide demo"
      >
        <org-slide-container-item>
          <org-box color="primary" padding="lg">
            <p class="text-xl font-semibold">Slide 1 — short</p>
            <p>Vertical — wraps from last back to first</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="info" padding="lg">
            <p class="text-xl font-semibold">Slide 2 — tall</p>
            <p>Vertical — second slide</p>
            <p>Second line of content.</p>
            <p>Third line of content.</p>
            <p>Fourth line of content.</p>
          </org-box>
        </org-slide-container-item>
        <org-slide-container-item>
          <org-box color="danger" padding="lg">
            <p class="text-xl font-semibold">Slide 3 — medium</p>
            <p>Vertical — wraps from here back to slide 1</p>
            <p>Second line of content.</p>
          </org-box>
        </org-slide-container-item>
      </org-slide-container>
      <div class="flex gap-2 items-center">
        <org-button label="Previous" (clicked)="onPrev()" />
        <span>{{ activeIndex() + 1 }} / {{ containerComponent.slideCount() }}</span>
        <org-button label="Next" (clicked)="onNext()" />
      </div>
    </div>
  `,
})
class SlideContainerLoopingDynamicVerticalDemo {
  protected readonly activeIndex = signal(0);
  protected readonly containerComponent = viewChild.required<SlideContainer>('containerComponent');

  protected onPrev(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i - 1 + count) % count);
  }

  protected onNext(): void {
    const count = this.containerComponent().slideCount();
    this.activeIndex.update((i) => (i + 1) % count);
  }
}

export const LoopingDynamic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Looping combined with dynamic size mode — the container resizes to the active slide height while wrap-around navigation preserves the correct animation direction.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Looping Dynamic"
        currentState="Container resizes to active slide and wraps around with correct animation direction"
      >
        <org-storybook-example-container-section label="Horizontal">
          <story-slide-container-looping-dynamic-horizontal-demo />
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Vertical">
          <story-slide-container-looping-dynamic-vertical-demo />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        SlideContainerLoopingDynamicHorizontalDemo,
        SlideContainerLoopingDynamicVerticalDemo,
      ],
    },
  }),
};

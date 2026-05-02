import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Splitter, type SplitterCollapsedSide } from './splitter';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-splitter-direction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter, StorybookExampleContainer, StorybookExampleContainerSection],
  styles: [
    `
      .splitter-demo {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <org-storybook-example-container title="Direction" currentState="Comparing horizontal and vertical split layouts">
      <org-storybook-example-container-section label="Horizontal">
        <div class="splitter-demo">
          <org-splitter direction="horizontal">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Vertical">
        <div class="splitter-demo">
          <org-splitter direction="vertical">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>horizontal</strong>: left/right split; drag the divider left or right to resize</li>
        <li><strong>vertical</strong>: top/bottom split; drag the divider up or down to resize</li>
        <li>keyboard: focus the divider and use arrow keys; Home/End jump to extremes</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class SplitterDirectionStory {}

@Component({
  selector: 'story-splitter-minimum-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter, StorybookExampleContainer, StorybookExampleContainerSection],
  styles: [
    `
      .splitter-demo {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <org-storybook-example-container
      title="Minimum Size"
      currentState="Drag the divider to the edge to see minimum sizes enforced"
    >
      <org-storybook-example-container-section label="Horizontal">
        <div class="splitter-demo">
          <org-splitter direction="horizontal" [minimumSize]="minimumSize()">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Vertical">
        <div class="splitter-demo">
          <org-splitter direction="vertical" [minimumSize]="minimumSize()">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <div class="flex flex-col gap-2 mt-2">
        <label class="flex gap-2 items-center">
          <input type="checkbox" [checked]="useSeparateMinimums()" (change)="onUseSeparateMinimumsChange($event)" />
          Use separate minimums for each section
        </label>

        <label class="flex gap-2 items-center">
          First section minimum (px):
          <input type="number" [value]="firstMinimum()" min="0" (change)="onFirstMinimumChange($event)" />
        </label>

        <label class="flex gap-2 items-center">
          Second section minimum (px):
          <input
            type="number"
            [value]="secondMinimum()"
            [attr.disabled]="!useSeparateMinimums() ? '' : null"
            min="0"
            (change)="onSecondMinimumChange($event)"
          />
        </label>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>drag the divider past the minimum to see it snap back to the minimum boundary</li>
        <li>with separate minimums unchecked, a single value applies to both sections</li>
        <li>with separate minimums checked, each section can have its own minimum</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class SplitterMinimumSizeStory {
  protected readonly useSeparateMinimums = signal<boolean>(false);
  protected readonly firstMinimum = signal<number>(0);
  protected readonly secondMinimum = signal<number>(0);

  protected readonly minimumSize = computed<number[]>(() => {
    if (this.useSeparateMinimums()) {
      return [this.firstMinimum(), this.secondMinimum()];
    }

    return [this.firstMinimum()];
  });

  protected onUseSeparateMinimumsChange(event: Event): void {
    this.useSeparateMinimums.set((event.target as HTMLInputElement).checked);
  }

  protected onFirstMinimumChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.firstMinimum.set(isNaN(value) ? 0 : value);
  }

  protected onSecondMinimumChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.secondMinimum.set(isNaN(value) ? 0 : value);
  }
}

@Component({
  selector: 'story-splitter-is-enabled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter, StorybookExampleContainer, StorybookExampleContainerSection],
  styles: [
    `
      .splitter-demo {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <org-storybook-example-container
      title="Is Enabled"
      currentState="Toggle the checkbox to enable or disable the divider"
    >
      <org-storybook-example-container-section label="Horizontal">
        <div class="splitter-demo">
          <org-splitter direction="horizontal" [isEnabled]="isEnabled()">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Vertical">
        <div class="splitter-demo">
          <org-splitter direction="vertical" [isEnabled]="isEnabled()">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <div class="flex flex-col gap-2 mt-2">
        <label class="flex gap-2 items-center">
          <input type="checkbox" [checked]="isEnabled()" (change)="onIsEnabledChange($event)" />
          Enabled
        </label>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>enabled</strong>: 2px divider with hover highlight; drag or use keyboard to resize</li>
        <li><strong>disabled</strong>: 1px static border; no hover effect; sections cannot be resized</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class SplitterIsEnabledStory {
  protected readonly isEnabled = signal<boolean>(true);

  protected onIsEnabledChange(event: Event): void {
    this.isEnabled.set((event.target as HTMLInputElement).checked);
  }
}

@Component({
  selector: 'story-splitter-collapsed-side',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter, StorybookExampleContainer, StorybookExampleContainerSection],
  styles: [
    `
      .splitter-demo {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <org-storybook-example-container title="Collapsed Side" currentState="Select a radio option to collapse a section">
      <org-storybook-example-container-section label="Horizontal">
        <div class="splitter-demo">
          <org-splitter direction="horizontal" [collapsedSide]="collapsedSide()">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Vertical">
        <div class="splitter-demo">
          <org-splitter direction="vertical" [collapsedSide]="collapsedSide()">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <div class="flex gap-4 mt-2">
        <label class="flex gap-2 items-center">
          <input
            type="radio"
            name="collapsed-side"
            value="none"
            [checked]="collapsedSideValue() === 'none'"
            (change)="onCollapsedSideChange('none')"
          />
          None
        </label>
        <label class="flex gap-2 items-center">
          <input
            type="radio"
            name="collapsed-side"
            value="first"
            [checked]="collapsedSideValue() === 'first'"
            (change)="onCollapsedSideChange('first')"
          />
          First
        </label>
        <label class="flex gap-2 items-center">
          <input
            type="radio"
            name="collapsed-side"
            value="second"
            [checked]="collapsedSideValue() === 'second'"
            (change)="onCollapsedSideChange('second')"
          />
          Second
        </label>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>none</strong>: both sections visible; divider is draggable</li>
        <li><strong>first</strong>: first section (green) takes all available space; second (red) is hidden</li>
        <li><strong>second</strong>: second section (red) takes all available space; first (green) is hidden</li>
        <li>resize is disabled when any section is collapsed</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class SplitterCollapsedSideStory {
  protected readonly collapsedSideValue = signal<'none' | SplitterCollapsedSide>('none');

  protected readonly collapsedSide = computed<SplitterCollapsedSide | null>(() => {
    const value = this.collapsedSideValue();

    return value === 'none' ? null : value;
  });

  protected onCollapsedSideChange(value: 'none' | SplitterCollapsedSide): void {
    this.collapsedSideValue.set(value);
  }
}

@Component({
  selector: 'story-splitter-programmatic-resize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Splitter, Button, StorybookExampleContainer, StorybookExampleContainerSection],
  styles: [
    `
      .splitter-demo {
        width: 31.25rem; /* 500px */
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <org-storybook-example-container
      title="Programmatic Resize"
      currentState="Click the button to swap the current section sizes"
    >
      <org-storybook-example-container-section label="Horizontal">
        <div class="splitter-demo">
          <org-splitter direction="horizontal" [size]="size()" (sizeChanged)="onSizeChanged($event)">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Vertical">
        <div class="splitter-demo">
          <org-splitter direction="vertical" [size]="size()" (sizeChanged)="onSizeChanged($event)">
            <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
            <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
          </org-splitter>
        </div>
      </org-storybook-example-container-section>

      <div class="flex gap-2 items-center mt-2">
        <org-button (clicked)="flip()">Flip Sizes</org-button>
        <span>Current sizes: [{{ size()[0] }}, {{ size()[1] }}]</span>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>starts with first section at 20% and second section at 80%</li>
        <li>clicking <strong>Flip Sizes</strong> reverses the current values regardless of what they are</li>
        <li>both horizontal and vertical splitters update together since they share the same input</li>
        <li>the swap animates smoothly over 200ms; dragging the divider remains instant</li>
        <li>
          dragging either divider updates the shared <code>size</code> via <code>sizeChanged</code>, so the button keeps
          working after a drag
        </li>
      </ul>
    </org-storybook-example-container>
  `,
})
class SplitterProgrammaticResizeStory {
  private readonly _size = signal<number[]>([20, 80]);

  protected readonly size = this._size.asReadonly();

  protected flip(): void {
    this._size.update((current) => [current[1], current[0]]);
  }

  protected onSizeChanged(value: number[]): void {
    this._size.set(value);
  }
}

const meta: Meta<Splitter> = {
  title: 'Core/Components/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Splitter Component

  A layout component that divides a container into two resizable sections separated by a draggable divider.

  ### Features
  - Horizontal (left/right) and vertical (top/bottom) split orientations
  - Drag the divider to resize sections
  - Keyboard accessible: focus the divider and use arrow keys; Home/End jump to extremes
  - Minimum size constraints (in pixels) per section
  - Configurable default split position (percentage)
  - Enable/disable the divider for static layouts
  - Collapse either section to give the other all available space

  ### Usage
  Project exactly two \`<ng-template #section>\` elements as content:

  \`\`\`html
  <org-splitter direction="horizontal">
    <ng-template #section>
      <div>Left content</div>
    </ng-template>
    <ng-template #section>
      <div>Right content</div>
    </ng-template>
  </org-splitter>
  \`\`\`

  ### Inputs
  - **direction** (required): \`"horizontal"\` or \`"vertical"\`
  - **minimumSize**: pixel minimum per section; single value applies to both, two values apply individually
  - **size**: percentage size as a tuple; single value sets first with remainder for second; updated by drag and keyboard interactions
  - **isEnabled**: when false, divider is a static 1px border; when true, 2px with hover effect
  - **collapsedSide**: \`null\`, \`"first"\`, or \`"second"\`; collapses one section and disables resizing
  - **animateResize**: when true (default), section size changes (programmatic resize and collapse / expand) animate over 200ms; dragging stays instant; respects \`prefers-reduced-motion\`

  ### Outputs
  - **sizeChanged**: emitted whenever the size changes (drag, keyboard, or programmatic) with the new \`[first, second]\` tuple
  - **dragStarted**: emitted when a drag interaction begins on the divider
  - **dragCompleted**: emitted when a drag interaction ends on the divider, including pointer cancel
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Splitter>;

export const Default: Story = {
  args: {
    direction: 'horizontal',
    minimumSize: [0],
    size: [50],
    isEnabled: true,
    collapsedSide: null,
    animateResize: true,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'the orientation of the split layout',
    },
    minimumSize: {
      control: 'object',
      description: 'minimum size in pixels per section; single value applies to both sides',
    },
    size: {
      control: 'object',
      description:
        'size as a percentage for each section; single value sets first with remainder for second; updated by drag and keyboard',
    },
    isEnabled: {
      control: 'boolean',
      description: 'whether the divider is interactive and draggable',
    },
    collapsedSide: {
      control: 'select',
      options: [null, 'first', 'second'],
      description: 'which section is collapsed; null means neither section is collapsed',
    },
    animateResize: {
      control: 'boolean',
      description: 'whether section size changes animate; dragging is never animated; respects prefers-reduced-motion',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default splitter configuration. Use the controls below to interact with all inputs.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 31.25rem; height: 31.25rem;">
        <org-splitter
          [direction]="direction"
          [minimumSize]="minimumSize"
          [size]="size"
          [isEnabled]="isEnabled"
          [collapsedSide]="collapsedSide"
          [animateResize]="animateResize"
        >
          <ng-template #section><div class="bg-safe-subtle w-full h-full"></div></ng-template>
          <ng-template #section><div class="bg-danger-subtle w-full h-full"></div></ng-template>
        </org-splitter>
      </div>
    `,
    moduleMetadata: {
      imports: [Splitter],
    },
  }),
};

export const Direction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of horizontal and vertical split orientations.',
      },
    },
  },
  render: () => ({
    template: '<story-splitter-direction />',
    moduleMetadata: {
      imports: [SplitterDirectionStory],
    },
  }),
};

export const MinimumSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates minimum size constraints. Use the checkbox to apply a single or separate minimums, then drag the divider to the edge to see it snap.',
      },
    },
  },
  render: () => ({
    template: '<story-splitter-minimum-size />',
    moduleMetadata: {
      imports: [SplitterMinimumSizeStory],
    },
  }),
};

export const IsEnabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Toggle the enabled state to switch between a draggable divider (2px, hover effect) and a static border (1px).',
      },
    },
  },
  render: () => ({
    template: '<story-splitter-is-enabled />',
    moduleMetadata: {
      imports: [SplitterIsEnabledStory],
    },
  }),
};

export const CollapsedSide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Collapse either section so the other takes all available space. Resizing is disabled while a section is collapsed.',
      },
    },
  },
  render: () => ({
    template: '<story-splitter-collapsed-side />',
    moduleMetadata: {
      imports: [SplitterCollapsedSideStory],
    },
  }),
};

export const ProgrammaticResize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates programmatically swapping the section sizes. Starts at [20, 80]; clicking the button reverses the current values, regardless of what they are.',
      },
    },
  },
  render: () => ({
    template: '<story-splitter-programmatic-resize />',
    moduleMetadata: {
      imports: [SplitterProgrammaticResizeStory],
    },
  }),
};

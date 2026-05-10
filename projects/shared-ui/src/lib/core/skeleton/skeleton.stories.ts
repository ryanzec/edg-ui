import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Skeleton, SkeletonVariant, allSkeletonVariants } from './skeleton';

const liveDemoVariantItems: ButtonToggleItem[] = allSkeletonVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoRowsItems: ButtonToggleItem[] = ['3', '7', '12'].map((rows) => ({
  label: rows,
  value: rows,
  buttonColor: 'primary',
}));

const meta: Meta<Skeleton> = {
  title: 'Core/Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Skeleton Component

  A loading placeholder that mimics the shape of the content being loaded. Four variant presets cover the most common layouts.

  ### Features
  - 4 variant presets (card, card-headless, table, table-varied)
  - Bordered surface frame matching the Card component's surface tokens (toggleable)
  - Configurable row count for table variants
  - Calm pulse animation that respects \`prefers-reduced-motion\`
  - \`role="status"\` + \`aria-busy="true"\` + configurable \`ariaLabel\` via the host brain directive

  ### Variant Options
  - **card**: 16:9 media block on top, then a title bar, two body bars, and a footer/meta bar
  - **card-headless**: Same as \`card\` but without the media block — for text-only stand-ins
  - **table**: Equal-width horizontal bars stacked tightly to stand in for table rows
  - **table-varied**: Same row layout as \`table\` but each bar takes a different width from a fixed cycle

  ### Usage Examples
  \`\`\`html
  <!-- Card preset -->
  <org-skeleton variant="card" />

  <!-- Card without the media block -->
  <org-skeleton variant="card-headless" />

  <!-- Table preset with 12 rows -->
  <org-skeleton variant="table" [rows]="12" />

  <!-- Drop the bordered frame when sitting inside a container that already provides it -->
  <org-skeleton variant="table-varied" [bordered]="false" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Skeleton>;

export const Default: Story = {
  args: {
    variant: 'card',
    bordered: true,
    rows: 7,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'card-headless', 'table', 'table-varied'],
      description: 'The layout variant of the skeleton',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether the skeleton renders its bordered surface frame',
    },
    rows: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Number of rows rendered for the table and table-varied variants; ignored for card variants',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default skeleton with card variant. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-skeleton
        [variant]="variant"
        [bordered]="bordered"
        [rows]="rows"
      />
    `,
    moduleMetadata: {
      imports: [Skeleton],
    },
  }),
};

@Component({
  selector: 'story-skeleton-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Skeleton,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .canvas-stage {
        display: block;
        width: 100%;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the variant, the bordered framing, and the table row count to see every preset."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Bordered">
            <org-checkbox-toggle name="live-demo-bordered" value="bordered" formControlName="bordered">
              {{ liveDemoForm.controls.bordered.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Rows">
            <org-button-toggle [items]="rowsItems" formControlName="rows" buttonSize="sm" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-skeleton
              [variant]="liveDemoForm.controls.variant.value"
              [bordered]="liveDemoForm.controls.bordered.value"
              [rows]="+liveDemoForm.controls.rows.value"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class SkeletonLiveDemoStory {
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly rowsItems = liveDemoRowsItems;

  protected readonly liveDemoForm = new FormGroup({
    variant: new FormControl<SkeletonVariant>('card', { nonNullable: true }),
    bordered: new FormControl<boolean>(true, { nonNullable: true }),
    rows: new FormControl<string>('7', { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive the variant, bordered framing, and row count and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-skeleton-live-demo />`,
    moduleMetadata: {
      imports: [SkeletonLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every skeleton variant axis — card, card-headless, table, table-varied, bordered framing, and reduced motion.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Variant · card"
            description="A card-shaped placeholder: 16:9 media block on top, then a title bar, two body bars, and a footer/meta bar."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="w-2xs">
              <org-skeleton variant="card" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Block</strong>: 16:9 media silhouette sits flush against the host edges, using the stronger bar tint</li>
            <li><strong>Stack</strong>: Title (lg height) + two body bars + footer (sm height) below the block</li>
            <li><strong>Bordered by default</strong>: Renders the surrounding card-like surface frame</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Variant · card-headless"
            description="Same as card but without the 16:9 media block on top. Use it when the placeholder stands in for text-only content."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="w-2xs">
              <org-skeleton variant="card-headless" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>No media block</strong>: A title bar plus two body bars only</li>
            <li><strong>Same framing</strong>: Bordered surface matches the card variant</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Variant · table"
            description="Horizontal bars stacked tightly to stand in for table rows. Configurable row count via the rows input."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start">
              <org-skeleton variant="table" [rows]="3" />
              <org-skeleton variant="table" [rows]="7" />
              <org-skeleton variant="table" [rows]="12" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Equal widths</strong>: Every bar takes the full available width</li>
            <li><strong>Tight rhythm</strong>: Rows stack with the tighter gap so the bars read as table rows, not body copy</li>
            <li><strong>Default rows</strong>: 7 rows when the rows input is omitted</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Variant · table-varied"
            description="Same row layout as table, but each bar takes a different width from a fixed cycle so the placeholder reads as data-shaped rows."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start">
              <org-skeleton variant="table-varied" [rows]="3" />
              <org-skeleton variant="table-varied" [rows]="7" />
              <org-skeleton variant="table-varied" [rows]="12" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Width cycle</strong>: Cycles through full → 3/4 → 2/3 → 1/2 → full → 3/4 → 1/3 → 2/3 → 3/4 → 1/2 → full → 1/4</li>
            <li><strong>Same gap rhythm</strong>: Inherits the tight stack gap from the table variant</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Bordered framing"
            description="Variants render their own bordered surface frame by default. Set bordered to false when the skeleton sits inside a container that already provides the framing."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start">
              <div class="w-2xs">
                <org-skeleton variant="card" [bordered]="true" />
              </div>
              <div class="w-2xs">
                <org-skeleton variant="card" [bordered]="false" />
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>bordered=true (default)</strong>: Renders the surface background and border tokens that match the Card component</li>
            <li><strong>bordered=false</strong>: Drops the frame; the media block picks up its own rounding so it does not float as a raw rectangle</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Reduced motion"
            description="When the OS-level prefers-reduced-motion: reduce setting is active, the pulse stops and the bars hold at their resting (max-opacity) frame."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="w-2xs">
              <org-skeleton variant="card" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>OS-driven</strong>: The reduced-motion behaviour is driven by the user's system setting, not a component input</li>
            <li><strong>Placeholder remains visible</strong>: Bars rest at the max-opacity frame so the loading silhouette stays readable</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [Skeleton, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas, DesignSystemDemoExpectedBehaviour],
    },
  }),
};

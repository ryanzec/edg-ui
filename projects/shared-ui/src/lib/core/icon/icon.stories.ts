import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { allIconNames, type IconName } from '../../brain/icon-brain/icon-brain';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Input } from '../input/input';
import { Icon, allIconColors, allIconSizes, type IconColor, type IconSize } from './icon';

const liveDemoSizeItems: ButtonToggleItem[] = allIconSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allIconColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const validIconNames = new Set<string>(allIconNames);

@Component({
  selector: 'story-icon-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    Input,
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
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 6rem;
      }
      .invalid-name {
        color: var(--color-fg-faint);
        font-style: italic;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Pick an icon and tune it. Use the controls to drive every visual input on the icon (name, size, color, label) and observe the live result in the canvas."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Icon">
            <org-input name="live-demo-icon-name" formControlName="name" placeholder="icon name…" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Labeled (a11y)">
            <org-checkbox-toggle name="live-demo-labeled" value="labeled" formControlName="labeled">
              {{ liveDemoForm.controls.labeled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (resolvedIconName(); as iconName) {
              <org-icon
                [name]="iconName"
                [size]="liveDemoForm.controls.size.value"
                [color]="liveDemoForm.controls.color.value"
                [label]="resolvedLabel()"
              />
            } @else {
              <span class="invalid-name">unknown icon name</span>
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class IconLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly colorItems = liveDemoColorItems;

  protected readonly liveDemoForm = new FormGroup({
    name: new FormControl<string>('sparkles', { nonNullable: true }),
    size: new FormControl<IconSize>('base', { nonNullable: true }),
    color: new FormControl<IconColor>('inherit', { nonNullable: true }),
    labeled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  private readonly _nameValue = toSignal(this.liveDemoForm.controls.name.valueChanges, {
    initialValue: this.liveDemoForm.controls.name.value,
  });

  private readonly _labeledValue = toSignal(this.liveDemoForm.controls.labeled.valueChanges, {
    initialValue: this.liveDemoForm.controls.labeled.value,
  });

  protected readonly resolvedIconName = computed<IconName | null>(() => {
    const value = this._nameValue();

    return validIconNames.has(value) ? (value as IconName) : null;
  });

  protected readonly resolvedLabel = computed<string | null>(() => {
    const iconName = this.resolvedIconName();

    if (!iconName || !this._labeledValue()) {
      return null;
    }

    return iconName;
  });
}

@Component({
  selector: 'story-icon-catalogue',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Icon,
    Input,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  template: `
    <form [formGroup]="catalogueForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Catalogue"
          description="Every icon in the curated set. Click any icon card to copy its name to the clipboard."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Filter">
            <org-input name="catalogue-filter" formControlName="search" placeholder="search by name…" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-12 gap-4">
              @for (iconName of filteredIcons(); track iconName) {
                <button
                  type="button"
                  class="cursor-pointer flex flex-col items-center gap-2 rounded border border-default-color p-3 transition-colors hover:bg-hover focus-visible:bg-hover"
                  (click)="copyToClipboard(iconName)"
                >
                  <org-icon [name]="iconName" />
                  <span class="text-xs text-fg">{{ iconName }}</span>
                </button>
              }
            </div>
            <p class="text-xs text-fg-faint">{{ filteredIcons().length }} of {{ totalIcons }} icons</p>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class IconCatalogueStory {
  protected readonly totalIcons = allIconNames.length;

  protected readonly catalogueForm = new FormGroup({
    search: new FormControl<string>('', { nonNullable: true }),
  });

  private readonly _searchValue = toSignal(this.catalogueForm.controls.search.valueChanges, {
    initialValue: this.catalogueForm.controls.search.value,
  });

  protected readonly filteredIcons = computed<readonly IconName[]>(() => {
    const search = this._searchValue().trim().toLowerCase();

    if (!search) {
      return allIconNames;
    }

    return allIconNames.filter((iconName) => iconName.toLowerCase().includes(search));
  });

  protected async copyToClipboard(iconName: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(iconName);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }
}

const meta: Meta<Icon> = {
  title: 'Core/Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Icon Component

  A component for rendering Lucide Icons with configurable size and color options.

  ### Features
  - Uses Lucide Icons library via [\`@lucide/angular\`](https://lucide.dev/guide/packages/angular)
  - Dynamic icon rendering via \`[lucideIcon]\` directive
  - Ten size options: 2xs, xs, sm, base (default), lg, xl, 2xl, 3xl, 4xl, 5xl
  - Eleven color options: inherit (default), muted, faint, primary, secondary, neutral, safe, info, caution, warning, danger
  - Inline display for easy integration with text
  - Accessible — decorative by default (\`aria-hidden\`); meaningful when a \`label\` is provided (\`role="img"\`, \`aria-label\`)

  ### Color Options
  - **inherit**: Inherits text color from parent elements (default)
  - **muted**: Muted foreground — supporting glyphs that shouldn't compete with the label they sit beside
  - **faint**: Faint foreground — quiet meta affordances (timestamps, helper hints)
  - **primary**: Primary color
  - **secondary**: Secondary accent color
  - **neutral**: Neutral/gray color
  - **safe**: Success/positive state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Error/danger state (red)

  ### Usage Examples
  \`\`\`html
  <!-- Default icon -->
  <org-icon name="check" />

  <!-- Icon with size -->
  <org-icon name="check" size="lg" />

  <!-- Icon with color -->
  <org-icon name="check" color="primary" />

  <!-- Icon with custom color (via parent) -->
  <div class="text-blue-500">
    <org-icon name="check" />
  </div>

  <!-- Meaningful icon (announced to screen readers) -->
  <org-icon name="check" label="Task completed" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Icon & { name: IconName; label: string | undefined }>;

export const Default: Story = {
  args: {
    name: 'check',
    size: 'base',
    color: 'inherit',
    label: undefined,
  },
  argTypes: {
    name: {
      control: 'select',
      options: allIconNames,
      description: 'The name of the icon to display from the Lucide Icons library',
    },
    size: {
      control: 'select',
      options: allIconSizes,
      description: 'The size of the icon',
    },
    color: {
      control: 'select',
      options: allIconColors,
      description: 'The color of the icon',
    },
    label: {
      control: 'text',
      description:
        'Accessible label for the icon; when provided the icon is treated as meaningful (role="img"); omit for decorative icons',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default icon with base size and inherit color. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<org-icon [name]="name" [size]="size" [color]="color" [label]="label" />`,
    moduleMetadata: {
      imports: [Icon],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the icon (name, size, color, accessibility label) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-icon-live-demo />`,
    moduleMetadata: {
      imports: [IconLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every icon variant axis — size, color, color inheritance, and accessibility label behaviour.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Size Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-baseline">
              <org-icon name="check" size="2xs" />
              <org-icon name="check" size="xs" />
              <org-icon name="check" size="sm" />
              <org-icon name="check" size="base" />
              <org-icon name="check" size="lg" />
              <org-icon name="check" size="xl" />
              <org-icon name="check" size="2xl" />
              <org-icon name="check" size="3xl" />
              <org-icon name="check" size="4xl" />
              <org-icon name="check" size="5xl" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>2xs</strong>: 0.625rem / 10px</li>
            <li><strong>xs</strong>: 0.75rem / 12px</li>
            <li><strong>sm</strong>: 0.8125rem / 13px</li>
            <li><strong>base</strong>: 0.875rem / 14px - default</li>
            <li><strong>lg</strong>: 1.125rem / 18px</li>
            <li><strong>xl</strong>: 1.25rem / 20px</li>
            <li><strong>2xl</strong>: 1.5rem / 24px</li>
            <li><strong>3xl</strong>: 1.875rem / 30px</li>
            <li><strong>4xl</strong>: 2.25rem / 36px</li>
            <li><strong>5xl</strong>: 2.5rem / 40px</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-center flex-wrap">
              <org-icon name="check" color="inherit" />
              <org-icon name="check" color="muted" />
              <org-icon name="check" color="faint" />
              <org-icon name="check" color="primary" />
              <org-icon name="check" color="secondary" />
              <org-icon name="check" color="neutral" />
              <org-icon name="check" color="safe" />
              <org-icon name="check" color="info" />
              <org-icon name="check" color="caution" />
              <org-icon name="check" color="warning" />
              <org-icon name="check" color="danger" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>inherit</strong>: Inherits text color from parent elements (default)</li>
            <li><strong>muted</strong>: Muted foreground — supporting glyphs that shouldn't compete with the label</li>
            <li><strong>faint</strong>: Faint foreground — quiet meta affordances (timestamps, helper hints)</li>
            <li><strong>primary</strong>: Primary color</li>
            <li><strong>secondary</strong>: Secondary accent color</li>
            <li><strong>neutral</strong>: Neutral/gray color</li>
            <li><strong>safe</strong>: Success/positive state (green)</li>
            <li><strong>info</strong>: Informational state (blue)</li>
            <li><strong>caution</strong>: Caution state (yellow)</li>
            <li><strong>warning</strong>: Warning state (orange)</li>
            <li><strong>danger</strong>: Error/danger state (red)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Inheritance" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-center flex-wrap">
              <org-icon name="check" />
              <div class="text-blue-500">
                <org-icon name="check" />
              </div>
              <div class="text-red-500">
                <org-icon name="x" />
              </div>
              <div class="text-green-500">
                <org-icon name="plus" />
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Icons automatically inherit the text color from their parent element</li>
            <li>Use css color variables on parent elements to style icons</li>
            <li>This allows icons to adapt to different contexts and themes</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Decorative vs Labeled (Accessibility)" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-6 items-center">
              <org-icon name="mail" />
              <org-icon name="circle-check-big" label="Verified" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Decorative icons (no label) have <strong>aria-hidden="true"</strong> — hidden from assistive technology</li>
            <li>Meaningful icons (label provided) have <strong>role="img"</strong> and <strong>aria-label</strong> set — announced by screen readers</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Icon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const Catalogue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complete searchable catalogue of every icon in the curated set. Type in the filter to narrow the list, and click any icon card to copy its name to the clipboard.',
      },
    },
  },
  render: () => ({
    template: `<story-icon-catalogue />`,
    moduleMetadata: {
      imports: [IconCatalogueStory],
    },
  }),
};

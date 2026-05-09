import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  DROP_DOWN_SELECTOR_DISABLED_DEFAULT,
  DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT,
  DROP_DOWN_SELECTOR_POSITION_DEFAULT,
  DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT,
  DROP_DOWN_SELECTOR_SIZE_DEFAULT,
  DropDownSelector,
  type DropDownSelectorPosition,
  type DropDownSelectorSize,
} from './drop-down-selector';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import { DataSelectionStore } from '../data-selection-store/data-selection-store';
import {
  type DropDownSelectorSelectionMode,
  type SelectionValue,
} from '../../brain/drop-down-selector-brain/drop-down-selector-brain';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const STATUS_ITEMS: SelectionValue<string>[] = [
  { value: 'active', display: 'Active only' },
  { value: 'deleted', display: 'Deleted only' },
  { value: 'all', display: 'Show all' },
];

const ROLE_ITEMS: SelectionValue<string>[] = [
  { value: 'user', display: 'User' },
  { value: 'admin', display: 'Admin' },
  { value: 'owner', display: 'Owner' },
  { value: 'viewer', display: 'Viewer' },
];

@Component({
  selector: 'story-drop-down-selector-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownSelector],
  template: `
    <org-drop-down-selector
      [items]="items()"
      [label]="label()"
      [selectionMode]="selectionMode()"
      [disabled]="disabled()"
      [size]="size()"
      [position]="position()"
      [iconName]="iconName()"
      [selectedItems]="selectedItems()"
      (selectedItemsChange)="onSelectedItemsChange($event)"
    />
  `,
})
class DropDownSelectorHost {
  protected readonly selectionStore = new DataSelectionStore<SelectionValue<string>>();

  public readonly items = input.required<SelectionValue<string>[]>();
  public readonly label = input<string>('Status');
  public readonly selectionMode = input<DropDownSelectorSelectionMode>(DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT);
  public readonly disabled = input<boolean>(DROP_DOWN_SELECTOR_DISABLED_DEFAULT);
  public readonly size = input<DropDownSelectorSize>(DROP_DOWN_SELECTOR_SIZE_DEFAULT);
  public readonly position = input<DropDownSelectorPosition>(DROP_DOWN_SELECTOR_POSITION_DEFAULT);
  public readonly iconName = input<IconName | undefined>(DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT);
  public readonly initialSelection = input<SelectionValue<string>[]>([]);

  protected readonly selectedItems = computed<SelectionValue<string>[]>(() => this.selectionStore.selectedItemsArray());

  constructor() {
    queueMicrotask(() => {
      const initial = this.initialSelection();

      if (initial.length > 0) {
        this.selectionStore.selectMultiple(initial);
      }
    });
  }

  protected onSelectedItemsChange(items: SelectionValue<string>[]): void {
    this.selectionStore.replaceSelection(items);
  }
}

const meta: Meta<DropDownSelectorHost> = {
  title: 'Core/Components/Drop Down Selector',
  component: DropDownSelectorHost,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Drop Down Selector Component

  A button-like trigger that opens an overlay menu of selectable options. Selection logic is owned by the
  headless \`DropDownSelectorBrainDirective\`, while the presentation layer renders the trigger button and
  CDK menu overlay. The trigger displays a chevron icon and updates its label to reflect the current
  selection state.

  ### Features
  - Single (\`'single'\`) and multiple (\`'multiple'\`) selection modes via the \`selectionMode\` input
  - Two-way bindable \`selectedItems\` model using the \`SelectionValue<TValue>\` shape
  - Trigger label updates to \`"label"\` when empty, \`"label: value"\` when one is selected, and
    \`"label: N selected"\` when more than one is selected
  - Single-select mode shows a check icon next to the selected item
  - Multi-select mode shows a checkbox visual next to each item plus a \`Clear\` action when at least one
    item is selected
  - Size variants (\`'sm'\`, \`'base'\`, \`'lg'\`) and configurable position (\`'below'\`, \`'above'\`, \`'before'\`, \`'after'\`)
  - Built on Angular CDK Menu for keyboard navigation, focus management, and click-outside-to-close

  ### Data Shape
  \`\`\`typescript
  type SelectionValue<TValue> = {
    value: TValue;
    display: string;
  };
  \`\`\`

  ### Usage Example
  \`\`\`html
  <org-drop-down-selector
    [items]="items"
    label="Status"
    selectionMode="multiple"
    [(selectedItems)]="selectedItems"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DropDownSelectorHost>;

export const Default: Story = {
  args: {
    label: 'Status',
    selectionMode: DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT,
    disabled: DROP_DOWN_SELECTOR_DISABLED_DEFAULT,
    size: DROP_DOWN_SELECTOR_SIZE_DEFAULT,
    position: DROP_DOWN_SELECTOR_POSITION_DEFAULT,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label rendered inside the trigger before the selected value text',
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether a single or multiple items can be selected at a time',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the drop-down selector is disabled',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size variant of the trigger element',
    },
    position: {
      control: 'select',
      options: ['below', 'above', 'before', 'after'],
      description: 'The position of the dropdown menu relative to the trigger',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default drop-down selector with full controls. Use the controls to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: { ...args, items: STATUS_ITEMS },
    template: `
      <story-drop-down-selector-host
        [items]="items"
        [label]="label"
        [selectionMode]="selectionMode"
        [disabled]="disabled"
        [size]="size"
        [position]="position"
      />
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost],
    },
  }),
};

export const SelectionModes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of single (`single`) and multiple (`multiple`) selection modes. Single mode replaces the selection on click and shows a check icon next to the selected item. Multiple mode toggles each clicked item, displays a checkbox visual, and reveals a `Clear` action when at least one item is selected.',
      },
    },
  },
  render: () => ({
    props: { statusItems: STATUS_ITEMS, roleItems: ROLE_ITEMS },
    template: `
      <org-storybook-example-container
        title="Selection Modes"
        currentState="Open each trigger to compare single vs multiple selection behavior"
      >
        <org-storybook-example-container-section label="Single Selection (single)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" selectionMode="single" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple Selection (multiple)">
          <story-drop-down-selector-host [items]="roleItems" label="Role" selectionMode="multiple" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Single</strong>: Trigger label becomes <code>Status: Active only</code> after a selection and the menu closes on click</li>
          <li><strong>Multiple</strong>: Trigger label becomes <code>Role: 1 selected</code> when 1 is selected and <code>Role: 2 selected</code> when more</li>
          <li><strong>Multiple</strong>: Menu stays open across selections and shows a <strong>Clear</strong> action once anything is selected</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three size variants for the trigger button.',
      },
    },
  },
  render: () => ({
    props: { statusItems: STATUS_ITEMS },
    template: `
      <org-storybook-example-container title="Trigger Sizes" currentState="Comparing small, base, and large sizes">
        <org-storybook-example-container-section label="Small">
          <story-drop-down-selector-host [items]="statusItems" label="Status" size="sm" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (default)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" size="base" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large">
          <story-drop-down-selector-host [items]="statusItems" label="Status" size="lg" />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Positions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of the four supported menu positions relative to the trigger.',
      },
    },
  },
  render: () => ({
    props: { statusItems: STATUS_ITEMS },
    template: `
      <org-storybook-example-container title="Menu Positions" currentState="Open each trigger to see how the menu aligns">
        <org-storybook-example-container-section label="Below (default)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" position="below" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Above">
          <story-drop-down-selector-host [items]="statusItems" label="Status" position="above" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Before (left)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" position="before" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="After (right)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" position="after" />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithExistingSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Drop-down selectors initialized with existing selection state via the `DataSelectionStore` instance owned by the host component.',
      },
    },
  },
  render: () => ({
    props: {
      statusItems: STATUS_ITEMS,
      roleItems: ROLE_ITEMS,
      singleInitial: [STATUS_ITEMS[1]],
      multipleInitial: [ROLE_ITEMS[0], ROLE_ITEMS[1]],
    },
    template: `
      <org-storybook-example-container
        title="With Existing Selection"
        currentState="Both selectors are pre-populated via the data selection store"
      >
        <org-storybook-example-container-section label="Single Selection (Deleted only)">
          <story-drop-down-selector-host
            [items]="statusItems"
            label="Status"
            selectionMode="single"
            [initialSelection]="singleInitial"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple Selection (User &amp; Admin)">
          <story-drop-down-selector-host
            [items]="roleItems"
            label="Role"
            selectionMode="multiple"
            [initialSelection]="multipleInitial"
          />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Drop-down selectors with a leading icon rendered before the label via the `iconName` input. The icon size scales with the trigger size variant.',
      },
    },
  },
  render: () => ({
    props: { statusItems: STATUS_ITEMS, roleItems: ROLE_ITEMS, preselected: [STATUS_ITEMS[0]] },
    template: `
      <org-storybook-example-container
        title="With Leading Icon"
        currentState="Each trigger renders a leading icon that scales with the trigger size"
      >
        <org-storybook-example-container-section label="Small Trigger (filter icon)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" size="sm" iconName="settings" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base Trigger (settings icon)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" size="base" iconName="settings" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large Trigger (settings icon)">
          <story-drop-down-selector-host [items]="statusItems" label="Status" size="lg" iconName="settings" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Selection (search icon)">
          <story-drop-down-selector-host
            [items]="statusItems"
            label="Status"
            iconName="search"
            [initialSelection]="preselected"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple Selection (eye icon)">
          <story-drop-down-selector-host
            [items]="roleItems"
            label="Role"
            selectionMode="multiple"
            iconName="eye"
          />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled drop-down selector cannot be opened or interacted with.',
      },
    },
  },
  render: () => ({
    props: {
      statusItems: STATUS_ITEMS,
      preselected: [STATUS_ITEMS[0]],
    },
    template: `
      <org-storybook-example-container title="Disabled State" currentState="Disabled selectors cannot be opened">
        <org-storybook-example-container-section label="Disabled Without Selection">
          <story-drop-down-selector-host [items]="statusItems" label="Status" [disabled]="true" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled With Selection">
          <story-drop-down-selector-host
            [items]="statusItems"
            label="Status"
            [disabled]="true"
            [initialSelection]="preselected"
          />
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

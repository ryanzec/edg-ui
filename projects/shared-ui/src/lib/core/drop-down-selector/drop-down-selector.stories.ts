import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  DROP_DOWN_SELECTOR_DISABLED_DEFAULT,
  DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT,
  DROP_DOWN_SELECTOR_POSITION_DEFAULT,
  DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT,
  DROP_DOWN_SELECTOR_SHOW_LABEL_WITH_VALUE_DEFAULT,
  DROP_DOWN_SELECTOR_SIZE_DEFAULT,
  DropDownSelector,
  allDropDownSelectorPositions,
  allDropDownSelectorSizes,
  type DropDownSelectorPosition,
  type DropDownSelectorSize,
} from './drop-down-selector';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import { DataSelectionStore } from '../data-selection-store/data-selection-store';
import {
  allDropDownSelectorSelectionModes,
  type DropDownSelectorSelectionMode,
  type SelectionValue,
} from '../../brain/drop-down-selector-brain/drop-down-selector-brain';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

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

const SORT_ITEMS: SelectionValue<string>[] = [
  { value: 'last-updated', display: 'Last updated' },
  { value: 'name-asc', display: 'Name (A → Z)' },
  { value: 'created-date', display: 'Created date' },
  { value: 'owner', display: 'Owner' },
];

const LONG_VALUE_ITEMS: SelectionValue<string>[] = [
  { value: 'aurora', display: 'Aurora — Mobile redesign initiative' },
  { value: 'beacon', display: 'Beacon — Billing v2 platform refresh' },
];

const MANY_ITEMS: SelectionValue<string>[] = Array.from({ length: 40 }, (_, index) => ({
  value: `item-${index + 1}`,
  display: `Item ${index + 1}`,
}));

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
      [showLabelWithValue]="showLabelWithValue()"
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
  public readonly showLabelWithValue = input<boolean>(DROP_DOWN_SELECTOR_SHOW_LABEL_WITH_VALUE_DEFAULT);
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
  headless \`DropDownSelectorBrainDirective\`, while the presentation layer composes the trigger as a real
  \`<org-button>\` with a projected \`#content\` template, an overlay panel surfaced via the CDK overlay,
  and \`<org-list-item>\` rows. The trigger displays a chevron, an optional pre icon, an optional label
  (controlled by \`showLabelWithValue\`), and either the selected value text (single mode / one selection)
  or an \`<org-tag>\` count chip (multi mode with two or more selections).

  ### Features
  - Single (\`'single'\`) and multiple (\`'multiple'\`) selection modes via the \`selectionMode\` input
  - Two-way bindable \`selectedItems\` model using the \`SelectionValue<TValue>\` shape
  - When a value is picked, the trigger shows the value text (single selection) or a count chip (2+ selections)
  - The label can be kept visible alongside the value via \`showLabelWithValue\`; otherwise it is hidden once a value is picked
  - Single-select mode shows a check icon next to the selected item
  - Multi-select mode shows a checkbox visual next to each item plus a \`Clear selection\` action when at least one item is selected
  - Size variants (\`'sm'\`, \`'base'\`, \`'lg'\`) and configurable position (\`'below'\`, \`'above'\`, \`'before'\`, \`'after'\`)
  - Built on Angular CDK overlay for click-outside-to-close, anchored positioning, and keyboard navigation

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
    [showLabelWithValue]="true"
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
    showLabelWithValue: DROP_DOWN_SELECTOR_SHOW_LABEL_WITH_VALUE_DEFAULT,
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
    showLabelWithValue: {
      control: 'boolean',
      description: 'Whether the label remains visible alongside the value once a selection is made',
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
        [showLabelWithValue]="showLabelWithValue"
      />
    `,
    moduleMetadata: {
      imports: [DropDownSelectorHost],
    },
  }),
};

type LiveDemoIconChoice = 'none' | 'settings' | 'search' | 'eye' | 'filter';

const allLiveDemoIconChoices = ['none', 'settings', 'search', 'eye', 'filter'] as const;

const liveDemoSelectionModeItems: ButtonToggleItem[] = allDropDownSelectorSelectionModes.map((mode) => ({
  label: mode,
  value: mode,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allDropDownSelectorSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoPositionItems: ButtonToggleItem[] = allDropDownSelectorPositions.map((position) => ({
  label: position,
  value: position,
  buttonColor: 'primary',
}));

const liveDemoIconItems: ButtonToggleItem[] = allLiveDemoIconChoices.map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-drop-down-selector-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonToggle,
    CheckboxToggle,
    DropDownSelectorHost,
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
        min-height: 6rem; /* 96px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="The drop-down selector below is real and interactive — open it, pick items, and use the controls to drive every visual axis."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Selection Mode">
            <org-button-toggle [items]="selectionModeItems" formControlName="selectionMode" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Position">
            <org-button-toggle [items]="positionItems" formControlName="position" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icon">
            <org-button-toggle [items]="iconItems" formControlName="icon" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="With Value">
            <org-checkbox-toggle name="live-demo-with-value" value="with-value" formControlName="showLabelWithValue">
              {{ liveDemoForm.controls.showLabelWithValue.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <story-drop-down-selector-host
              [items]="items"
              label="Status"
              [selectionMode]="liveDemoForm.controls.selectionMode.value"
              [size]="liveDemoForm.controls.size.value"
              [position]="liveDemoForm.controls.position.value"
              [iconName]="resolvedIconName()"
              [showLabelWithValue]="liveDemoForm.controls.showLabelWithValue.value"
              [disabled]="liveDemoForm.controls.disabled.value"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class DropDownSelectorLiveDemoStory {
  protected readonly selectionModeItems = liveDemoSelectionModeItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly positionItems = liveDemoPositionItems;
  protected readonly iconItems = liveDemoIconItems;
  protected readonly items = STATUS_ITEMS;

  protected readonly liveDemoForm = new FormGroup({
    selectionMode: new FormControl<DropDownSelectorSelectionMode>('single', { nonNullable: true }),
    size: new FormControl<DropDownSelectorSize>('base', { nonNullable: true }),
    position: new FormControl<DropDownSelectorPosition>('below', { nonNullable: true }),
    icon: new FormControl<LiveDemoIconChoice>('none', { nonNullable: true }),
    showLabelWithValue: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected resolvedIconName(): IconName | undefined {
    const choice = this.liveDemoForm.controls.icon.value;

    if (choice === 'none') {
      return undefined;
    }

    return choice;
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive selection mode, size, position, pre icon, label visibility, and disabled state on a live drop-down selector.',
      },
    },
  },
  render: () => ({
    template: `<story-drop-down-selector-live-demo />`,
    moduleMetadata: {
      imports: [DropDownSelectorLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every drop-down selector variant axis — trigger states, selection modes, sizes, positions, pre icons, existing selection, overflow scrolling, and disabled state — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    props: {
      statusItems: STATUS_ITEMS,
      roleItems: ROLE_ITEMS,
      sortItems: SORT_ITEMS,
      longValueItems: LONG_VALUE_ITEMS,
      manyItems: MANY_ITEMS,
      singleStatusInitial: [STATUS_ITEMS[0]],
      multipleRoleInitial: [ROLE_ITEMS[0], ROLE_ITEMS[1], ROLE_ITEMS[2]],
      singleSortInitial: [SORT_ITEMS[0]],
      singleLongInitial: [LONG_VALUE_ITEMS[0]],
      preselectedStatus: [STATUS_ITEMS[0]],
    },
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Trigger States" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 flex-wrap">
              <story-drop-down-selector-host [items]="statusItems" label="Status" />
              <story-drop-down-selector-host
                [items]="statusItems"
                label="Status"
                [showLabelWithValue]="true"
                [initialSelection]="singleStatusInitial"
              />
              <story-drop-down-selector-host
                [items]="roleItems"
                label="Owner"
                iconName="user"
                [showLabelWithValue]="true"
                [initialSelection]="[roleItems[0]]"
              />
              <story-drop-down-selector-host
                [items]="roleItems"
                label="Labels"
                selectionMode="multiple"
                [showLabelWithValue]="true"
                [initialSelection]="multipleRoleInitial"
              />
              <story-drop-down-selector-host
                [items]="sortItems"
                label="Sort by"
                [showLabelWithValue]="true"
                [initialSelection]="singleSortInitial"
              />
              <story-drop-down-selector-host [items]="statusItems" label="Status" [disabled]="true" />
              <story-drop-down-selector-host
                [items]="longValueItems"
                label="Workspace"
                [showLabelWithValue]="true"
                [initialSelection]="singleLongInitial"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Empty</strong>: Trigger reads as a normal Button — label and chevron only</li>
            <li><strong>With value (showLabelWithValue=true)</strong>: Label drops to muted, hairline divides label and value, value carries the visual weight</li>
            <li><strong>Multi · count chip</strong>: When two or more items are picked, the value is replaced by an <code>org-tag</code> count chip</li>
            <li><strong>Disabled</strong>: Trigger cannot be opened or interacted with and the surface is dimmed</li>
            <li><strong>Long value · truncates</strong>: The value text ellipses inside the trigger's max-width cap</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Selection Modes" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host [items]="sortItems" label="Sort by" selectionMode="single" />
            <story-drop-down-selector-host [items]="statusItems" label="Status" selectionMode="multiple" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Single</strong>: Picking a row replaces the selection and closes the panel; the picked row shows a check icon</li>
            <li><strong>Multiple</strong>: Picking a row toggles its selection and the panel stays open; rows show a checkbox visual</li>
            <li><strong>Multiple · clear</strong>: A <strong>Clear selection</strong> footer row appears once at least one item is picked</li>
            <li>The trigger swaps the value text for a count chip once two or more items are picked</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Trigger Sizes" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 items-baseline">
              <story-drop-down-selector-host [items]="statusItems" label="Status" size="sm" />
              <story-drop-down-selector-host [items]="statusItems" label="Status" size="base" />
              <story-drop-down-selector-host [items]="statusItems" label="Status" size="lg" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Small</strong>: Compact trigger for dense toolbars</li>
            <li><strong>Base</strong>: Standard trigger size for most use cases (default)</li>
            <li><strong>Large</strong>: Prominent trigger for primary surfaces</li>
            <li>The pre icon and chevron sizes scale with the trigger size variant</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Menu Positions" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host [items]="statusItems" label="Status" position="below" />
            <story-drop-down-selector-host [items]="statusItems" label="Status" position="above" />
            <story-drop-down-selector-host [items]="statusItems" label="Status" position="before" />
            <story-drop-down-selector-host [items]="statusItems" label="Status" position="after" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Below (default)</strong>: Panel anchors directly under the trigger</li>
            <li><strong>Above</strong>: Useful when the trigger sits at the bottom of a viewport or footer bar</li>
            <li><strong>Before / After</strong>: Useful when the trigger sits inline next to a label and the panel needs to flow horizontally</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Pre Icon" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host [items]="statusItems" label="Status" size="sm" iconName="settings" />
            <story-drop-down-selector-host [items]="statusItems" label="Status" size="base" iconName="settings" />
            <story-drop-down-selector-host [items]="statusItems" label="Status" size="lg" iconName="settings" />
            <story-drop-down-selector-host
              [items]="statusItems"
              label="Status"
              iconName="search"
              [showLabelWithValue]="true"
              [initialSelection]="preselectedStatus"
            />
            <story-drop-down-selector-host
              [items]="roleItems"
              label="Role"
              selectionMode="multiple"
              iconName="eye"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The <code>iconName</code> input renders an icon before the label and scales with the trigger size</li>
            <li>The icon stays in place whether or not a value is picked</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Label Visibility With Value" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host
              [items]="statusItems"
              label="Status"
              [initialSelection]="preselectedStatus"
            />
            <story-drop-down-selector-host
              [items]="statusItems"
              label="Status"
              [showLabelWithValue]="true"
              [initialSelection]="preselectedStatus"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>showLabelWithValue=false</strong> (default): Once a value is picked, only the value text is shown; the label is hidden</li>
            <li><strong>showLabelWithValue=true</strong>: The label remains visible alongside the value, separated by a hairline</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Existing Selection" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host
              [items]="statusItems"
              label="Status"
              selectionMode="single"
              [showLabelWithValue]="true"
              [initialSelection]="singleStatusInitial"
            />
            <story-drop-down-selector-host
              [items]="roleItems"
              label="Role"
              selectionMode="multiple"
              [showLabelWithValue]="true"
              [initialSelection]="multipleRoleInitial"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Both selectors are pre-populated via the <code>DataSelectionStore</code> instance owned by the host component</li>
            <li>The single-mode trigger reflects the picked value, the multi-mode trigger shows the count chip</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Overflow Scrolling" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host [items]="manyItems" label="Item" selectionMode="single" />
            <story-drop-down-selector-host [items]="manyItems" label="Item" selectionMode="multiple" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The overlay menu caps at 32rem tall and scrolls when content exceeds that height via <code>org-scroll-area</code></li>
            <li>The compact overlay scrollbar only renders when overflow is present</li>
            <li>In <strong>multiple</strong> mode, the <strong>Clear selection</strong> action sits at the end of the scroll list</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Disabled State" />
          <org-design-system-demo-canvas slot="canvas">
            <story-drop-down-selector-host [items]="statusItems" label="Status" [disabled]="true" />
            <story-drop-down-selector-host
              [items]="statusItems"
              label="Status"
              [disabled]="true"
              [showLabelWithValue]="true"
              [initialSelection]="preselectedStatus"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Disabled selectors cannot be opened or interacted with</li>
            <li>The trigger surface is dimmed and pointer interactions are gated</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        DropDownSelectorHost,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

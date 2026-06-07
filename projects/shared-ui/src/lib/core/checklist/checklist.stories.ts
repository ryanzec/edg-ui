import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Checklist, type ChecklistItemData } from './checklist';

type LiveDemoComposition = 'flat' | 'with-meta' | 'nested';

const allLiveDemoCompositions = ['flat', 'with-meta', 'nested'] as const;

const liveDemoCompositionItems: ButtonToggleItem[] = allLiveDemoCompositions.map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

const liveDemoFlatItems: ChecklistItemData[] = [
  { id: 'flat-1', label: 'Parse input', status: 'in-progress' },
  { id: 'flat-2', label: 'Plan retrieval', status: 'not-started' },
  { id: 'flat-3', label: 'Run tools', status: 'not-started' },
  { id: 'flat-4', label: 'Compose response', status: 'not-started' },
  { id: 'flat-5', label: 'Apply guardrails', status: 'not-started' },
];

const liveDemoMetaItems: ChecklistItemData[] = [
  { id: 'meta-1', label: 'Parse input', status: 'valid', meta: '0.4s' },
  { id: 'meta-2', label: 'Plan retrieval', status: 'valid', meta: '0.9s' },
  { id: 'meta-3', label: 'Run tools', status: 'in-progress', meta: '2.3s' },
  { id: 'meta-4', label: 'Compose response', status: 'not-started' },
  { id: 'meta-5', label: 'Apply guardrails', status: 'not-started' },
];

const liveDemoNestedItems: ChecklistItemData[] = [
  { id: 'nested-1', label: 'Parse user input', status: 'valid', count: '3/3', meta: '0.4s' },
  { id: 'nested-2', label: 'Plan retrieval', status: 'valid', meta: '0.9s' },
  {
    id: 'nested-3',
    label: 'Run tools',
    status: 'in-progress',
    count: '2/4',
    meta: '2.3s',
    items: [
      { id: 'nested-3-1', label: 'search · "incident logs"', status: 'valid', meta: '412ms' },
      { id: 'nested-3-2', label: 'read_file · runbook.md', status: 'valid', meta: '88ms' },
      { id: 'nested-3-3', label: 'grep · /panic|fatal/', status: 'in-progress', meta: '1.8s' },
      { id: 'nested-3-4', label: 'summarize_findings', status: 'not-started' },
    ],
  },
  { id: 'nested-4', label: 'Compose response', status: 'not-started' },
  { id: 'nested-5', label: 'Apply guardrails', status: 'not-started' },
];

/** explicit args shape so Storybook controls cover both component-level and brain-exposed inputs */
type ChecklistStoryArgs = {
  items: ChecklistItemData[];
  emphasizeInvalid: boolean;
  showStatusBackground: boolean;
  isEditable: boolean;
};

const meta: Meta<ChecklistStoryArgs> = {
  title: 'Core/Components/Checklist',
  component: Checklist,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Checklist Component

  A vertical list of status-bearing rows for multi-step processes, validation rule readouts, and AI step traces. Each row carries a fixed-footprint status glyph, a label, an optional count pill, optional post meta, and (for parent rows) a chevron that rotates 90° when expanded.

  ### Features
  - 4 status types — \`not-started\` / \`in-progress\` / \`valid\` / \`invalid\`
  - Optional count pill (tabular fraction, e.g. \`2/4\`)
  - Optional post meta (durations, tail status)
  - Optional one level of nested sub-items with expand/collapse
  - Consumer opt-in to emphasize invalid rows in danger color
  - Consumer opt-in to paint a soft tile background behind every status glyph
  - Consumer opt-in to make leaf rows togglable between \`not-started\` and \`valid\` on click
  - Single chevron-right glyph rotated 90° when expanded — no glyph swap, no flicker
  - Spinner glyph for \`in-progress\` shares the same status color via \`currentColor\`
  - Indent rail anchored to the children block via a single hairline pseudo-element

  ### Status Types
  - **not-started**: Neutral circle glyph indicating the item hasn't started
  - **in-progress**: Info-colored loader spinner indicating ongoing work
  - **valid**: Safe-colored check glyph for successful completion
  - **invalid**: Danger-colored x glyph for errors or failures

  ### Usage Examples
  \`\`\`html
  <!-- Simple flat list -->
  <org-checklist [items]="items" />

  <!-- List with nested items, count, and meta -->
  <org-checklist [items]="itemsWithNesting" />

  <!-- Emphasize invalid rows with a danger-colored label -->
  <org-checklist [items]="items" [emphasizeInvalid]="true" />

  <!-- Paint a soft tile background behind every status glyph -->
  <org-checklist [items]="items" [showStatusBackground]="true" />

  <!-- Editable mode — leaf rows toggle between not-started and valid on click; use two-way binding to persist -->
  <org-checklist [(items)]="items" [isEditable]="true" />
  \`\`\`

  ### TypeScript Types
  \`\`\`typescript
  type ChecklistItemStatus = 'not-started' | 'in-progress' | 'valid' | 'invalid';

  type BaseChecklistItemData = {
    id: string;
    label: string;
    status: ChecklistItemStatus;
    meta?: string;
    count?: string;
  };

  type ChecklistItemData = BaseChecklistItemData & {
    items?: BaseChecklistItemData[];
  };
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ChecklistStoryArgs>;

const defaultItems: ChecklistItemData[] = [
  { id: '1', label: 'Initialize project', status: 'valid', meta: '0.4s' },
  { id: '2', label: 'Configure dependencies', status: 'valid', meta: '0.9s' },
  { id: '3', label: 'Building application', status: 'in-progress', meta: '2.3s' },
  { id: '4', label: 'Run tests', status: 'not-started' },
  { id: '5', label: 'Deploy to production', status: 'not-started' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    emphasizeInvalid: false,
    showStatusBackground: false,
    isEditable: false,
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of checklist items to display',
    },
    emphasizeInvalid: {
      control: 'boolean',
      description: 'When true, invalid rows paint their label in the danger color',
    },
    showStatusBackground: {
      control: 'boolean',
      description: 'When true, every status slot paints a soft tile background matching its status',
    },
    isEditable: {
      control: 'boolean',
      description:
        "When true, leaf rows toggle between 'not-started' and 'valid' on click; 'in-progress' and 'invalid' rows do nothing, and parent rows of nested groups derive their status from their children",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default checklist with a flat list of items in various states. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-checklist
        [items]="items"
        [emphasizeInvalid]="emphasizeInvalid"
        [showStatusBackground]="showStatusBackground"
        [isEditable]="isEditable"
      />
    `,
    moduleMetadata: {
      imports: [Checklist],
    },
  }),
};

@Component({
  selector: 'story-checklist-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Checklist,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .canvas-stage {
        display: flex;
        align-items: stretch;
        justify-content: center;
        min-width: 24rem; /* 384px */
      }

      .canvas-stage org-checklist {
        flex: 1 1 auto;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle between rendering modes — flat, flat-with-meta, and nested with count + meta — to see how a single Checklist composes across the documented use cases. Flip Editable on to click leaf rows and watch parent rows auto-derive their status from their children."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Composition">
            <org-button-toggle [items]="compositionItems" formControlName="composition" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Emphasize invalid">
            <org-checkbox-toggle
              name="live-demo-emphasize-invalid"
              value="emphasize-invalid"
              formControlName="emphasizeInvalid"
            >
              {{ liveDemoForm.controls.emphasizeInvalid.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Status background">
            <org-checkbox-toggle
              name="live-demo-status-background"
              value="status-background"
              formControlName="showStatusBackground"
            >
              {{ liveDemoForm.controls.showStatusBackground.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Editable">
            <org-checkbox-toggle name="live-demo-editable" value="editable" formControlName="isEditable">
              {{ liveDemoForm.controls.isEditable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @switch (liveDemoForm.controls.composition.value) {
              @case ('flat') {
                <org-checklist
                  [(items)]="flatItems"
                  [emphasizeInvalid]="liveDemoForm.controls.emphasizeInvalid.value"
                  [showStatusBackground]="liveDemoForm.controls.showStatusBackground.value"
                  [isEditable]="liveDemoForm.controls.isEditable.value"
                />
              }
              @case ('with-meta') {
                <org-checklist
                  [(items)]="metaItems"
                  [emphasizeInvalid]="liveDemoForm.controls.emphasizeInvalid.value"
                  [showStatusBackground]="liveDemoForm.controls.showStatusBackground.value"
                  [isEditable]="liveDemoForm.controls.isEditable.value"
                />
              }
              @case ('nested') {
                <org-checklist
                  [(items)]="nestedItems"
                  [emphasizeInvalid]="liveDemoForm.controls.emphasizeInvalid.value"
                  [showStatusBackground]="liveDemoForm.controls.showStatusBackground.value"
                  [isEditable]="liveDemoForm.controls.isEditable.value"
                />
              }
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ChecklistLiveDemoStory {
  protected readonly compositionItems = liveDemoCompositionItems;
  protected readonly flatItems = signal<ChecklistItemData[]>(liveDemoFlatItems);
  protected readonly metaItems = signal<ChecklistItemData[]>(liveDemoMetaItems);
  protected readonly nestedItems = signal<ChecklistItemData[]>(liveDemoNestedItems);

  protected readonly liveDemoForm = new FormGroup({
    composition: new FormControl<LiveDemoComposition>('nested', { nonNullable: true }),
    emphasizeInvalid: new FormControl<boolean>(false, { nonNullable: true }),
    showStatusBackground: new FormControl<boolean>(false, { nonNullable: true }),
    isEditable: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Toggle between composition modes (flat, with meta, nested with count+meta) and the consumer-opt-in flags (emphasize invalid, status background) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-checklist-live-demo />`,
    moduleMetadata: {
      imports: [ChecklistLiveDemoStory],
    },
  }),
};

const showcaseStatusItems: ChecklistItemData[] = [
  { id: 'not-started', label: 'Awaiting action.', status: 'not-started' },
  { id: 'in-progress', label: 'Active work, spinner glyph.', status: 'in-progress' },
  { id: 'valid', label: 'Passed, terminal.', status: 'valid' },
  { id: 'invalid', label: 'Failed, terminal.', status: 'invalid' },
];

const showcaseAnatomyItems: ChecklistItemData[] = [
  { id: 'anatomy-1', label: 'Label only', status: 'valid' },
  { id: 'anatomy-2', label: 'Label with post meta', status: 'valid', meta: '2m 35s' },
  {
    id: 'anatomy-3',
    label: 'Parent — count + meta + chevron',
    status: 'in-progress',
    count: '2/5',
    meta: 'streaming…',
    items: [
      { id: 'anatomy-3-1', label: 'Streaming child row', status: 'in-progress' },
      { id: 'anatomy-3-2', label: 'Resolved child row', status: 'valid' },
    ],
  },
];

const showcaseFlatItems: ChecklistItemData[] = [
  { id: 'flat-1', label: 'Initialize project', status: 'valid' },
  { id: 'flat-2', label: 'Configure dependencies', status: 'valid' },
  { id: 'flat-3', label: 'Building application', status: 'in-progress' },
  { id: 'flat-4', label: 'Run tests', status: 'not-started' },
  { id: 'flat-5', label: 'Deploy to production', status: 'not-started' },
];

const showcaseInvalidItems: ChecklistItemData[] = [
  { id: 'invalid-1', label: 'Database connection', status: 'invalid' },
  { id: 'invalid-2', label: 'API authentication', status: 'invalid' },
  {
    id: 'invalid-3',
    label: 'File system checks',
    status: 'invalid',
    count: '1/3',
    items: [
      { id: 'invalid-3-1', label: 'Read permissions', status: 'invalid' },
      { id: 'invalid-3-2', label: 'Write permissions', status: 'invalid' },
      { id: 'invalid-3-3', label: 'Storage space', status: 'valid' },
    ],
  },
];

const showcaseEditableFlatItems: ChecklistItemData[] = [
  { id: 'edit-flat-1', label: 'Read the contract', status: 'valid' },
  { id: 'edit-flat-2', label: 'Sign the contract', status: 'valid' },
  { id: 'edit-flat-3', label: 'Counter-sign returned', status: 'not-started' },
  { id: 'edit-flat-4', label: 'Initial payment received', status: 'not-started' },
];

const showcaseEditableNestedItems: ChecklistItemData[] = [
  {
    id: 'edit-nested-1',
    label: 'Onboarding tasks',
    status: 'not-started',
    items: [
      { id: 'edit-nested-1-1', label: 'Watch intro video', status: 'not-started' },
      { id: 'edit-nested-1-2', label: 'Configure profile', status: 'not-started' },
      { id: 'edit-nested-1-3', label: 'Invite a teammate', status: 'not-started' },
    ],
  },
  {
    id: 'edit-nested-2',
    label: 'Permissions review',
    status: 'in-progress',
    items: [
      { id: 'edit-nested-2-1', label: 'Owner access granted', status: 'valid' },
      { id: 'edit-nested-2-2', label: 'Billing access pending', status: 'in-progress' },
      { id: 'edit-nested-2-3', label: 'Audit access', status: 'not-started' },
    ],
  },
];

@Component({
  selector: 'story-checklist-editable-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Checklist,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Editable — flat"
          description="Consumer opt-in: when isEditable is true, leaf rows toggle between not-started and valid on click. Try it — every row in this list starts as a togglable leaf."
        />
        <org-design-system-demo-canvas slot="canvas">
          <org-checklist [(items)]="editableFlatItems" [isEditable]="true" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Clicking a <strong>not-started</strong> leaf row flips it to <strong>valid</strong></li>
          <li>Clicking a <strong>valid</strong> leaf row flips it back to <strong>not-started</strong></li>
          <li>
            Rows render as native <code>&lt;button&gt;</code> elements — focus + keyboard activation work for free
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Editable — nested (parent auto-derives status)"
          description="When isEditable is true and the checklist is nested, parent rows are NOT directly clickable for status — they derive their status from the resolved statuses of their children. Try toggling children to see the parent settle."
        />
        <org-design-system-demo-canvas slot="canvas">
          <org-checklist [(items)]="editableNestedItems" [isEditable]="true" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Parent rows still expand / collapse on click — only their status is locked to derivation</li>
          <li>
            Children in <strong>in-progress</strong> or <strong>invalid</strong> status are non-interactive (no hover,
            click is a no-op)
          </li>
          <li>
            Auto-status: any child invalid → parent invalid · any child in-progress → parent in-progress · ≥1 valid (not
            all) → parent in-progress · all valid → parent valid · all not-started → parent not-started
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class ChecklistEditableShowcaseStory {
  protected readonly editableFlatItems = signal<ChecklistItemData[]>(showcaseEditableFlatItems);
  protected readonly editableNestedItems = signal<ChecklistItemData[]>(showcaseEditableNestedItems);
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every checklist axis — statuses, anatomy, flat/nested composition, count + meta, emphasize invalid, and the soft tile status background — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    props: {
      statusItems: showcaseStatusItems,
      anatomyItems: showcaseAnatomyItems,
      flatItems: showcaseFlatItems,
      invalidItems: showcaseInvalidItems,
    },
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Statuses"
            description="Four semantic statuses, each tied to a shared color ramp. The status icon does the heavy lifting — labels stay at default fg so the row reads cleanly even when stacked."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checklist [items]="statusItems" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>not-started</strong>: Neutral circle glyph</li>
            <li><strong>in-progress</strong>: Info-colored loader spinner</li>
            <li><strong>valid</strong>: Safe-colored check glyph</li>
            <li><strong>invalid</strong>: Danger-colored x glyph</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Anatomy"
            description="A row is a single horizontal line: a fixed-footprint status slot, a label (flex), an optional count pill, optional post meta, and — when the item has children — a chevron that rotates 90° when expanded."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checklist [items]="anatomyItems" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Status slot</strong>: Fixed footprint so labels align across rows regardless of which glyph renders</li>
            <li><strong>Label</strong>: Single-line, ellipsis-truncated, only flex-grow element</li>
            <li><strong>Count pill</strong>: Optional fraction; tabular numerals so values like 1/3 vs 12/12 don't wobble</li>
            <li><strong>Meta</strong>: Optional post detail (durations, tail status)</li>
            <li><strong>Chevron</strong>: Parent rows only; rotates 90° when expanded — no glyph swap</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Flat list"
            description="A simple flat list with no nesting — useful for sequential workflows where each item is terminal."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checklist [items]="flatItems" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Every row is a non-interactive leaf — no chevron, no expand/collapse</li>
            <li>Items sit 2px apart for readability without crowding</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Emphasize invalid"
            description="Consumer opt-in: when emphasizeInvalid is true, invalid rows paint their label in the danger color so failures jump to the eye even when the row is collapsed."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checklist [items]="invalidItems" [emphasizeInvalid]="true" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Invalid rows paint their label in the danger color</li>
            <li>Other statuses keep the default label color</li>
            <li>The status icon always carries hue — emphasizeInvalid is purely a label-color escalation</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Status background"
            description="Consumer opt-in: when showStatusBackground is true, every status slot paints a soft tile background matching its status hue."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checklist [items]="statusItems" [showStatusBackground]="true" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Each status slot picks up the matching <code>color-&lt;status&gt;-soft</code> background</li>
            <li>The status glyph color is unchanged — only the slot's fill shifts</li>
            <li>Useful for higher-density readouts where each row needs to read independently</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-checklist-editable-showcase />
      </div>
    `,
    moduleMetadata: {
      imports: [
        Checklist,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        ChecklistEditableShowcaseStory,
      ],
    },
  }),
};

const recipeAiStepTraceItems: ChecklistItemData[] = [
  { id: 'ai-1', label: 'Parse user input', status: 'valid', count: '3/3', meta: '0.4s' },
  { id: 'ai-2', label: 'Plan retrieval', status: 'valid', meta: '0.9s' },
  {
    id: 'ai-3',
    label: 'Run tools',
    status: 'in-progress',
    count: '2/4',
    meta: '2.3s',
    items: [
      { id: 'ai-3-1', label: 'search · "incident logs"', status: 'valid', meta: '412ms' },
      { id: 'ai-3-2', label: 'read_file · runbook.md', status: 'valid', meta: '88ms' },
      { id: 'ai-3-3', label: 'grep · /panic|fatal/', status: 'in-progress', meta: '1.8s' },
      { id: 'ai-3-4', label: 'summarize_findings', status: 'not-started' },
    ],
  },
  { id: 'ai-4', label: 'Compose response', status: 'not-started' },
  { id: 'ai-5', label: 'Apply guardrails', status: 'not-started' },
];

const recipeValidationItems: ChecklistItemData[] = [
  { id: 'val-1', label: 'Schema parses', status: 'valid' },
  { id: 'val-2', label: 'All migrations applied', status: 'valid' },
  {
    id: 'val-3',
    label: 'Required environment variables',
    status: 'invalid',
    count: '2/4',
    items: [
      { id: 'val-3-1', label: 'DATABASE_URL', status: 'valid' },
      { id: 'val-3-2', label: 'REDIS_URL', status: 'valid' },
      { id: 'val-3-3', label: 'STRIPE_WEBHOOK_SECRET', status: 'invalid', meta: 'missing' },
      { id: 'val-3-4', label: 'SENTRY_DSN', status: 'invalid', meta: 'malformed' },
    ],
  },
  { id: 'val-4', label: 'No high-severity vulnerabilities', status: 'invalid', meta: '3 found' },
  { id: 'val-5', label: 'Smoke tests pass', status: 'not-started', meta: 'queued' },
];

const recipeOnboardingItems: ChecklistItemData[] = [
  { id: 'onb-1', label: 'Create your account', status: 'valid' },
  { id: 'onb-2', label: 'Verify your email', status: 'valid' },
  { id: 'onb-3', label: 'Invite your team', status: 'in-progress', meta: '2 of 5 invited' },
  { id: 'onb-4', label: 'Connect a data source', status: 'not-started' },
  { id: 'onb-5', label: 'Pick a starter template', status: 'not-started' },
];

export const RecipeAiStepTrace: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A long-running AI run rendered as a checklist. Each top-level step is a phase; sub-items are individual tool calls. The currently-streaming step is in-progress with a count badge of how many sub-steps have completed; finished steps collapse to a single line.',
      },
    },
  },
  render: () => ({
    props: { items: recipeAiStepTraceItems },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Recipe · AI step trace" />
        <org-design-system-demo-canvas slot="canvas">
          <org-checklist [items]="items" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    `,
    moduleMetadata: {
      imports: [Checklist, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
    },
  }),
};

export const RecipeValidationRules: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A static readout of validation rules — each rule resolves to valid or invalid, and failed rules expand to show the specific cases that failed. The count pill on a parent reads as failed/total when any child is invalid.',
      },
    },
  },
  render: () => ({
    props: { items: recipeValidationItems },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Recipe · Validation rules" />
        <org-design-system-demo-canvas slot="canvas">
          <org-checklist [items]="items" [emphasizeInvalid]="true" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    `,
    moduleMetadata: {
      imports: [Checklist, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
    },
  }),
};

export const RecipeOnboardingProcess: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A flat checklist tracking a multi-step onboarding process. No sub-items, no chevrons — just status, label, and a contextual meta line for the current step. The not-started rows sit muted, the active step sits in-progress, and finished steps wear a check.',
      },
    },
  },
  render: () => ({
    props: { items: recipeOnboardingItems },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Recipe · Onboarding process" />
        <org-design-system-demo-canvas slot="canvas">
          <org-checklist [items]="items" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    `,
    moduleMetadata: {
      imports: [Checklist, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
    },
  }),
};

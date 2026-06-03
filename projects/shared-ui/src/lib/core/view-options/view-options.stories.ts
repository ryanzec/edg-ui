import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Input } from '../input/input';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { ViewOptions, type ViewField } from './view-options';

const defaultFields: ViewField[] = [
  { name: 'name', label: 'Name', enabled: true, iconName: 'at-sign', locked: true },
  { name: 'email', label: 'Email', enabled: true, iconName: 'at-sign' },
  { name: 'role', label: 'Role', enabled: true, iconName: 'shield' },
  { name: 'status', label: 'Status', enabled: true, iconName: 'circle' },
  { name: 'team', label: 'Team', enabled: true, iconName: 'users' },
  { name: 'location', label: 'Location', enabled: true, iconName: 'globe' },
  { name: 'lastActive', label: 'Last active', enabled: true, iconName: 'clock' },
  { name: 'joined', label: 'Joined', enabled: false, iconName: 'calendar' },
  { name: 'twoFa', label: '2FA', enabled: false, iconName: 'lock-keyhole' },
];

@Component({
  selector: 'story-view-options-default-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  styles: [
    `
      :host {
        display: block;
        max-width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <org-view-options
      [(fields)]="fields"
      [panelLabel]="panelLabel"
      [sectionLabel]="sectionLabel"
      [closable]="true"
      (closed)="onClose()"
    />
  `,
})
class ViewOptionsDefaultHostStory {
  protected readonly fields = signal<ViewField[]>(structuredClone(defaultFields));
  public panelLabel = 'View options';
  public sectionLabel = 'Fields';

  protected onClose(): void {
    console.log('view options closed');
  }
}

@Component({
  selector: 'story-view-options-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ViewOptions,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    StorybookExampleContainer,
  ],
  styles: [
    `
      .panel-frame {
        max-width: 22rem; /* 352px */
      }

      .table-usage {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }

      .table-usage .panel-frame {
        flex: 0 0 22rem; /* 352px */
      }

      .demo-table {
        flex: 1;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      .demo-table th,
      .demo-table td {
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--color-border-soft);
        text-align: left;
      }

      .demo-table th {
        background: var(--color-bg-surface-secondary);
        font-weight: 600;
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-storybook-example-container title="Default panel">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Default — 9 fields, Name is locked" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="panel-frame">
              <org-view-options [(fields)]="defaultStateFields" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Locked row</strong>: "Name" shows a lock icon, has no toggle, cannot be dragged</li>
            <li><strong>Toggle</strong>: every unlocked row has a checkbox-toggle bound to its enabled flag</li>
            <li><strong>Count tag</strong>: shows enabled / total; updates immediately when toggles flip</li>
            <li><strong>Drag handle</strong>: grip icon at the start of each unlocked row; drag to reorder</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </org-storybook-example-container>

      <org-storybook-example-container title="All locked">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="All rows locked — no toggles, no drag affordance" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="panel-frame">
              <org-view-options [(fields)]="allLockedFields" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Every row shows a lock icon instead of a toggle</li>
            <li>Drag handles are hidden; nothing can be reordered</li>
            <li>The count tag still renders, showing all rows are enabled</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </org-storybook-example-container>

      <org-storybook-example-container title="No locked rows">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="No locked rows — everything is toggleable and reorderable"
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="panel-frame">
              <org-view-options [(fields)]="noLockedFields" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Every row has a drag handle and a toggle</li>
            <li>Drag any row above or below another to change the order</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </org-storybook-example-container>

      <org-storybook-example-container title="Custom labels">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Custom panel and section labels" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="panel-frame">
              <org-view-options [(fields)]="customLabelFields" panelLabel="Customize view" sectionLabel="Columns" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The panel header reads "Customize view" instead of the default</li>
            <li>The section header reads "COLUMNS" (rendered uppercase)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </org-storybook-example-container>

      <org-storybook-example-container title="Table usage">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Single fields model drives both the panel AND a table" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="table-usage">
              <div class="panel-frame">
                <org-view-options [(fields)]="tableFields" />
              </div>
              <table class="demo-table" data-testid="view-options-demo-table">
                <thead>
                  <tr>
                    @for (field of tableFields(); track field.name) {
                      @if (field.enabled) {
                        <th>{{ field.label }}</th>
                      }
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of tableRows; track row.name) {
                    <tr>
                      @for (field of tableFields(); track field.name) {
                        @if (field.enabled) {
                          <td>{{ row[field.name] }}</td>
                        }
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Toggling a field in the panel hides or shows its column in the table</li>
            <li>Reordering rows in the panel reorders the table columns to match</li>
            <li>
              The same <code>fields</code> signal is bound to both — the panel mutates it via <code>[(fields)]</code>
            </li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </org-storybook-example-container>
    </div>
  `,
})
class ViewOptionsShowcaseStory {
  protected readonly defaultStateFields = signal<ViewField[]>(structuredClone(defaultFields));

  protected readonly allLockedFields = signal<ViewField[]>(
    defaultFields.map((field) => ({ ...field, enabled: true, locked: true }))
  );

  protected readonly noLockedFields = signal<ViewField[]>(defaultFields.map((field) => ({ ...field, locked: false })));

  protected readonly customLabelFields = signal<ViewField[]>(structuredClone(defaultFields));

  protected readonly tableFields = signal<ViewField[]>(structuredClone(defaultFields));

  protected readonly tableRows: readonly Record<string, string>[] = [
    {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'Admin',
      status: 'Active',
      team: 'Platform',
      location: 'London',
      lastActive: '2 min ago',
      joined: '2024-01-12',
      twoFa: 'Enabled',
    },
    {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      role: 'Member',
      status: 'Active',
      team: 'Compilers',
      location: 'NYC',
      lastActive: '12 min ago',
      joined: '2023-09-04',
      twoFa: 'Disabled',
    },
    {
      name: 'Alan Turing',
      email: 'alan@example.com',
      role: 'Member',
      status: 'Away',
      team: 'Research',
      location: 'Bletchley',
      lastActive: '3 hours ago',
      joined: '2024-04-18',
      twoFa: 'Enabled',
    },
  ];
}

const meta: Meta<ViewOptions> = {
  title: 'Core/Components/ViewOptions',
  component: ViewOptions,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ViewOptions],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## ViewOptions Component

  A right-rail panel that controls which fields of a list / table view are visible and in what order. The external api is exactly one component — \`&lt;org-view-options&gt;\` — which takes a \`fields\` model and renders the entire panel internally.

  ### Features
  - Single component external api (\`&lt;org-view-options&gt;\`); internal sub-components are not exported
  - Two-way \`fields\` model — the array order is the field order
  - Drag-and-drop reordering powered by \`@atlaskit/pragmatic-drag-and-drop\`
  - Locked rows (lock icon, no toggle, no drag) — other rows can still be moved above / below them
  - Optional per-row icon via \`field.iconName\`; rows without one render a generic icon
  - Live enabled / total count tag in the section header
  - Optional close button rendered when \`[closable]="true"\`; emits \`(closed)\` on click
  - Keyboard reorder via ArrowUp / ArrowDown on the focused drag handle

  ### Data shape
  \`\`\`ts
  export type ViewField = {
    name: string;       // stable id; unique within the array
    label: string;      // human-readable label
    enabled: boolean;   // visibility flag
    iconName?: IconName; // optional row icon; defaults to a generic icon
    locked?: boolean;   // when true: no toggle, no drag pickup, lock icon shown
  };
  \`\`\`

  ### Usage
  \`\`\`html
  &lt;org-view-options
    [(fields)]="fields"
    panelLabel="View options"
    sectionLabel="Fields"
    [closable]="true"
    (closed)="onClose()"
  /&gt;
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ViewOptions>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default panel rendering the reference set of nine demo fields. The first row ("Name") is locked; the rest are toggleable and reorderable.',
      },
    },
  },
  render: () => ({
    template: `<story-view-options-default-host />`,
    moduleMetadata: {
      imports: [ViewOptionsDefaultHostStory],
    },
  }),
};

@Component({
  selector: 'story-view-options-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ViewOptions,
    CheckboxToggle,
    Input,
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
        justify-content: center;
        align-items: flex-start;
      }

      .panel-frame {
        max-width: 22rem; /* 352px */
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
          description="Tweak inputs and toggle the closable affordance. The panel reacts immediately."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Panel label">
            <org-input name="live-demo-panel-label" formControlName="panelLabel" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Section label">
            <org-input name="live-demo-section-label" formControlName="sectionLabel" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Closable">
            <org-checkbox-toggle name="live-demo-closable" value="closable" formControlName="closable">
              {{ liveDemoForm.controls.closable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label='Lock the "Name" row'>
            <org-checkbox-toggle name="live-demo-name-locked" value="name-locked" formControlName="nameLocked">
              {{ liveDemoForm.controls.nameLocked.value ? 'locked' : 'unlocked' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Closed event count">
            <span>{{ closedCount() }}</span>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Enabled count">
            <span>{{ enabledCount() }} / {{ fields().length }}</span>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="panel-frame">
              <org-view-options
                [(fields)]="fields"
                [panelLabel]="liveDemoForm.controls.panelLabel.value"
                [sectionLabel]="liveDemoForm.controls.sectionLabel.value"
                [closable]="liveDemoForm.controls.closable.value"
                (closed)="onClose()"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ViewOptionsLiveDemoStory {
  protected readonly fields = signal<ViewField[]>(structuredClone(defaultFields));
  protected readonly closedCount = signal<number>(0);

  protected readonly enabledCount = computed<number>(() => this.fields().filter((field) => field.enabled).length);

  protected readonly liveDemoForm = new FormGroup({
    panelLabel: new FormControl<string>('View options', { nonNullable: true }),
    sectionLabel: new FormControl<string>('Fields', { nonNullable: true }),
    closable: new FormControl<boolean>(true, { nonNullable: true }),
    nameLocked: new FormControl<boolean>(true, { nonNullable: true }),
  });

  constructor() {
    this.liveDemoForm.controls.nameLocked.valueChanges.subscribe((locked) => {
      this.fields.update((fields) => {
        const next = [...fields];

        if (next[0]) {
          next[0] = { ...next[0], locked };
        }

        return next;
      });
    });
  }

  protected onClose(): void {
    this.closedCount.update((value) => value + 1);
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Drag rows in the panel, flip toggles, and tweak the panel / section labels on the right.',
      },
    },
  },
  render: () => ({
    template: `<story-view-options-live-demo />`,
    moduleMetadata: {
      imports: [ViewOptionsLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Comprehensive showcase covering the default panel, all-locked rows, fully reorderable rows, custom labels, and a live table whose columns are driven by the panel's fields model.",
      },
    },
  },
  render: () => ({
    template: `<story-view-options-showcase />`,
    moduleMetadata: {
      imports: [ViewOptionsShowcaseStory],
    },
  }),
};

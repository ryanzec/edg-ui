import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { distinctUntilChanged, map } from 'rxjs';
import { Button } from '../button/button';
import { Box } from '../box/box';
import { BoxContent } from '../box/box-content';
import { BoxHeader } from '../box/box-header';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Input } from '../input/input';
import { Tag } from '../tags/tag';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { KanbanBoard } from './kanban-board';
import type { KanbanItemsMovedEvent } from './kanban-board';
import { KanbanLane } from './kanban-lane';
import type { KanbanItem } from './kanban-lane';

type DemoCard = KanbanItem & {
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
};

type DemoLane = {
  id: string;
  heading: string;
  items: DemoCard[];
};

const allPriorities: DemoCard['priority'][] = ['low', 'medium', 'high'];

const makeCard = (
  id: string,
  title: string,
  description: string,
  assignee: string,
  priority: DemoCard['priority']
): DemoCard => ({
  id,
  title,
  description,
  assignee,
  priority,
});

const buildBasicLanes = (): DemoLane[] => [
  {
    id: 'todo',
    heading: 'To Do',
    items: [
      makeCard('c-1', 'Audit logging gaps', 'Identify endpoints missing structured logging', 'Maya', 'high'),
      makeCard('c-2', 'Update onboarding doc', 'Reflect the new sso flow', 'Lior', 'medium'),
      makeCard('c-3', 'Triage support tickets', 'Drain the backlog before friday', 'Maya', 'low'),
    ],
  },
  {
    id: 'in-progress',
    heading: 'In Progress',
    items: [
      makeCard('c-4', 'Migrate auth middleware', 'Replace legacy token store with vault adapter', 'Devon', 'high'),
      makeCard('c-5', 'Refactor billing module', 'Extract usage calculation into a service', 'Aki', 'medium'),
    ],
  },
  {
    id: 'review',
    heading: 'Review',
    items: [makeCard('c-6', 'Telemetry dashboard PR', 'Awaiting two approvals', 'Lior', 'medium')],
  },
  {
    id: 'done',
    heading: 'Done',
    items: [
      makeCard('c-7', 'Q1 retro notes', 'Published to confluence', 'Maya', 'low'),
      makeCard('c-8', 'Vendor security review', 'Approved by legal', 'Devon', 'low'),
    ],
  },
];

const buildManyLanes = (): DemoLane[] => {
  return Array.from({ length: 8 }).map((_, laneIndex) => ({
    id: `many-lane-${laneIndex}`,
    heading: `Stage ${laneIndex + 1}`,
    items: Array.from({ length: 3 + (laneIndex % 4) }).map((__, itemIndex) =>
      makeCard(
        `many-${laneIndex}-${itemIndex}`,
        `Task ${laneIndex + 1}.${itemIndex + 1}`,
        'A representative ticket for horizontal-scroll demonstration',
        ['Maya', 'Lior', 'Devon', 'Aki'][itemIndex % 4],
        allPriorities[itemIndex % 3]
      )
    ),
  }));
};

const moveItems = (lanes: DemoLane[], event: KanbanItemsMovedEvent): DemoLane[] => {
  const draggedItems: DemoCard[] = [];

  const lanesAfterRemoval = lanes.map((lane) => {
    if (lane.id !== event.sourceLaneId) {
      return lane;
    }

    const keptItems: DemoCard[] = [];
    const movedItemsForLane: DemoCard[] = [];

    for (const item of lane.items) {
      if (event.itemIds.includes(item.id)) {
        movedItemsForLane.push(item);
        continue;
      }

      keptItems.push(item);
    }

    draggedItems.push(...movedItemsForLane);

    return { ...lane, items: keptItems };
  });

  return lanesAfterRemoval.map((lane) => {
    if (lane.id !== event.targetLaneId) {
      return lane;
    }

    const next = [...lane.items];
    next.splice(event.targetIndex, 0, ...draggedItems);

    return { ...lane, items: next };
  });
};

@Component({
  selector: 'story-kanban-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxHeader, BoxContent, Tag],
  template: `
    <org-box>
      <org-box-header [title]="card().title" [subtitle]="card().description" />
      <org-box-content>
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-muted">{{ card().assignee }}</span>
          <org-tag [color]="priorityColor()" size="sm">{{ card().priority }}</org-tag>
        </div>
      </org-box-content>
    </org-box>
  `,
})
class StoryKanbanCardContent {
  public readonly card = input.required<DemoCard>();

  protected readonly priorityColor = computed<'danger' | 'caution' | 'neutral'>(() => {
    const priority = this.card().priority;

    if (priority === 'high') {
      return 'danger';
    }

    if (priority === 'medium') {
      return 'caution';
    }

    return 'neutral';
  });
}

@Component({
  selector: 'story-kanban-basic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane, StoryKanbanCardContent],
  host: { class: 'block h-lg' },
  template: `
    <org-kanban-board
      [ariaLabel]="ariaLabel()"
      [selectedIds]="selected()"
      (selectedIdsChange)="selected.set($event)"
      (itemsMoved)="onMoved($event)"
    >
      @for (lane of lanes(); track lane.id) {
        <org-kanban-lane [laneId]="lane.id" [heading]="lane.heading" [items]="lane.items">
          <ng-template #card let-item>
            <story-kanban-card-content [card]="item" />
          </ng-template>
        </org-kanban-lane>
      }
    </org-kanban-board>
  `,
})
class StoryKanbanBasic {
  public readonly ariaLabel = input<string>('Engineering tasks');

  protected readonly lanes = signal<DemoLane[]>(buildBasicLanes());
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());

  protected onMoved(event: KanbanItemsMovedEvent): void {
    this.lanes.update((current) => moveItems(current, event));
  }
}

@Component({
  selector: 'story-kanban-many-lanes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane, StoryKanbanCardContent],
  host: { class: 'block h-lg' },
  template: `
    <org-kanban-board
      ariaLabel="Many lanes"
      [selectedIds]="selected()"
      (selectedIdsChange)="selected.set($event)"
      (itemsMoved)="onMoved($event)"
    >
      @for (lane of lanes(); track lane.id) {
        <org-kanban-lane [laneId]="lane.id" [heading]="lane.heading" [items]="lane.items">
          <ng-template #card let-item>
            <story-kanban-card-content [card]="item" />
          </ng-template>
        </org-kanban-lane>
      }
    </org-kanban-board>
  `,
})
class StoryKanbanManyLanes {
  protected readonly lanes = signal<DemoLane[]>(buildManyLanes());
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());

  protected onMoved(event: KanbanItemsMovedEvent): void {
    this.lanes.update((current) => moveItems(current, event));
  }
}

@Component({
  selector: 'story-kanban-with-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane, StoryKanbanCardContent, Button],
  host: { class: 'block h-base' },
  template: `
    <org-kanban-board
      ariaLabel="Lanes with header actions"
      [selectedIds]="selected()"
      (selectedIdsChange)="selected.set($event)"
      (itemsMoved)="onMoved($event)"
    >
      @for (lane of lanes(); track lane.id) {
        <org-kanban-lane [laneId]="lane.id" [heading]="lane.heading" [items]="lane.items">
          <ng-template #card let-item>
            <story-kanban-card-content [card]="item" />
          </ng-template>
          <org-button
            actions
            size="sm"
            variant="ghost"
            color="neutral"
            preIcon="plus"
            [iconOnly]="true"
            ariaLabel="Add card to lane"
            label="Add"
          />
        </org-kanban-lane>
      }
    </org-kanban-board>
  `,
})
class StoryKanbanWithActions {
  protected readonly lanes = signal<DemoLane[]>(buildBasicLanes().slice(0, 3));
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());

  protected onMoved(event: KanbanItemsMovedEvent): void {
    this.lanes.update((current) => moveItems(current, event));
  }
}

@Component({
  selector: 'story-kanban-empty-lane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane, StoryKanbanCardContent],
  host: { class: 'block h-base' },
  template: `
    <org-kanban-board
      ariaLabel="Empty lane example"
      [selectedIds]="selected()"
      (selectedIdsChange)="selected.set($event)"
      (itemsMoved)="onMoved($event)"
    >
      @for (lane of lanes(); track lane.id) {
        <org-kanban-lane [laneId]="lane.id" [heading]="lane.heading" [items]="lane.items">
          <ng-template #card let-item>
            <story-kanban-card-content [card]="item" />
          </ng-template>
        </org-kanban-lane>
      }
    </org-kanban-board>
  `,
})
class StoryKanbanEmptyLane {
  protected readonly lanes = signal<DemoLane[]>([
    {
      id: 'todo',
      heading: 'To Do',
      items: [makeCard('e-1', 'Single item', 'Drag me to the empty lane', 'Maya', 'medium')],
    },
    { id: 'blocked', heading: 'Blocked', items: [] },
    { id: 'done', heading: 'Done', items: [] },
  ]);
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());

  protected onMoved(event: KanbanItemsMovedEvent): void {
    this.lanes.update((current) => moveItems(current, event));
  }
}

@Component({
  selector: 'story-kanban-show-count',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane, StoryKanbanCardContent],
  host: { class: 'block h-base' },
  template: `
    <org-kanban-board ariaLabel="Show count variations">
      <org-kanban-lane laneId="with-count" heading="With Count" [items]="withCountItems()" [showCount]="true">
        <ng-template #card let-item>
          <story-kanban-card-content [card]="item" />
        </ng-template>
      </org-kanban-lane>
      <org-kanban-lane laneId="without-count" heading="Without Count" [items]="withoutCountItems()" [showCount]="false">
        <ng-template #card let-item>
          <story-kanban-card-content [card]="item" />
        </ng-template>
      </org-kanban-lane>
    </org-kanban-board>
  `,
})
class StoryKanbanShowCount {
  protected readonly withCountItems = signal<DemoCard[]>([
    makeCard('sc-with-1', 'Set up CI cache', 'Wire moon cache to s3', 'Maya', 'medium'),
    makeCard('sc-with-2', 'Adopt structured logs', 'Replace ad-hoc console output', 'Devon', 'low'),
  ]);

  protected readonly withoutCountItems = signal<DemoCard[]>([
    makeCard('sc-without-1', 'Set up CI cache', 'Wire moon cache to s3', 'Maya', 'medium'),
    makeCard('sc-without-2', 'Adopt structured logs', 'Replace ad-hoc console output', 'Devon', 'low'),
  ]);
}

@Component({
  selector: 'story-kanban-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    KanbanBoard,
    KanbanLane,
    StoryKanbanCardContent,
    CheckboxToggle,
    Input,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
    DesignSystemDemoCanvas,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Configure lane count, item count, and count-pill visibility. Click cards to select; cmd/ctrl+click toggles, shift+click extends a range within a lane. Drag a selected card to move the whole selection."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Lane count">
            <org-input name="kanban-live-demo-lane-count" type="number" formControlName="laneCount" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Items per lane">
            <org-input name="kanban-live-demo-items-per-lane" type="number" formControlName="itemsPerLane" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Show count pill">
            <org-checkbox-toggle name="kanban-live-demo-show-count" value="show-count" formControlName="showCount">
              {{ liveDemoForm.controls.showCount.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="block h-base">
            <org-kanban-board
              ariaLabel="Live demo"
              [selectedIds]="selected()"
              (selectedIdsChange)="selected.set($event)"
              (itemsMoved)="onMoved($event)"
            >
              @for (lane of lanes(); track lane.id) {
                <org-kanban-lane
                  [laneId]="lane.id"
                  [heading]="lane.heading"
                  [items]="lane.items"
                  [showCount]="liveDemoForm.controls.showCount.value"
                >
                  <ng-template #card let-item>
                    <story-kanban-card-content [card]="item" />
                  </ng-template>
                </org-kanban-lane>
              }
            </org-kanban-board>
          </div>
          <div class="text-xs text-muted pt-2">
            Selected: <strong>{{ selectedCount() }}</strong>
            @if (selectedCount() > 0) {
              ({{ selectedIdsList() }})
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class StoryKanbanLiveDemo {
  protected readonly liveDemoForm = new FormGroup({
    laneCount: new FormControl<string>('3', { nonNullable: true }),
    itemsPerLane: new FormControl<string>('4', { nonNullable: true }),
    showCount: new FormControl<boolean>(true, { nonNullable: true }),
  });

  protected readonly lanes = signal<DemoLane[]>(this._buildLanes(3, 4));
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());

  protected readonly selectedCount = (): number => this.selected().size;
  protected readonly selectedIdsList = (): string => Array.from(this.selected()).join(', ');

  constructor() {
    this.liveDemoForm.valueChanges
      .pipe(
        map((value) => ({
          laneCount: Math.max(1, Math.min(8, Number(value.laneCount) || 1)),
          itemsPerLane: Math.max(0, Math.min(20, Number(value.itemsPerLane) || 0)),
        })),
        distinctUntilChanged(
          (previous, current) =>
            previous.laneCount === current.laneCount && previous.itemsPerLane === current.itemsPerLane
        ),
        takeUntilDestroyed()
      )
      .subscribe(({ laneCount, itemsPerLane }) => {
        this.lanes.set(this._buildLanes(laneCount, itemsPerLane));
        this.selected.set(new Set<string>());
      });
  }

  protected onMoved(event: KanbanItemsMovedEvent): void {
    this.lanes.update((current) => moveItems(current, event));
  }

  private _buildLanes(laneCount: number, itemsPerLane: number): DemoLane[] {
    return Array.from({ length: laneCount }).map((_, laneIndex) => ({
      id: `live-lane-${laneIndex}`,
      heading: ['To Do', 'In Progress', 'Review', 'Blocked', 'Done', 'Archived', 'Backlog', 'Triage'][laneIndex % 8],
      items: Array.from({ length: itemsPerLane }).map((__, itemIndex) =>
        makeCard(
          `live-${laneIndex}-${itemIndex}`,
          `Task ${laneIndex + 1}.${itemIndex + 1}`,
          'Drag me, multi-select me, drop me anywhere',
          ['Maya', 'Lior', 'Devon', 'Aki'][itemIndex % 4],
          allPriorities[itemIndex % 3]
        )
      ),
    }));
  }
}

const meta: Meta<KanbanBoard> = {
  title: 'Core/Components/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Kanban Board Component

  A swimlane kanban board with multi-select drag-and-drop, drop indicators, and per-lane independent scroll.

  ### Features
  - Multiple swimlanes laid out horizontally with horizontal scroll on overflow
  - Each lane is independently vertically scrollable
  - Lane header with heading, item count pill, and an [actions] slot
  - Drag any card to any lane
  - Cmd/Ctrl+click toggles selection; Shift+click extends a range within a lane
  - Dragging a selected card moves the whole selection as a group, with a stacked preview and count badge
  - Drop indicator line shows where the card(s) will land
  - Within-lane reordering and cross-lane move share the same drop semantics

  ### Card Template
  Cards are rendered via a per-lane \`<ng-template #card let-item>\` so each lane can render different shapes.

  ### Usage
  \`\`\`html
  <org-kanban-board
    ariaLabel="Engineering tasks"
    [selectedIds]="selected()"
    (selectedIdsChange)="selected.set($event)"
    (itemsMoved)="onMoved($event)"
  >
    &#64;for (lane of lanes(); track lane.id) {
      <org-kanban-lane [laneId]="lane.id" [heading]="lane.heading" [items]="lane.items">
        <ng-template #card let-item>
          <my-card-content [item]="item" />
        </ng-template>
      </org-kanban-lane>
    }
  </org-kanban-board>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<KanbanBoard>;

// loosely typed because ariaLabel is forwarded to KanbanBoard via hostDirectives, not declared on the class
export const Default: StoryObj<{ ariaLabel: string }> = {
  args: {
    ariaLabel: 'Engineering tasks',
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'accessible label for the board landmark; falls back to a generic label when omitted',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'default kanban board with four lanes and a small set of cards. lanes are content children of the board; use the control below to drive the ariaLabel input.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<story-kanban-basic [ariaLabel]="ariaLabel" />`,
    moduleMetadata: {
      imports: [StoryKanbanBasic],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to change lane count and items per lane. Try multi-select (cmd/ctrl+click, shift+click) and drag.',
      },
    },
  },
  render: () => ({
    template: `<story-kanban-live-demo />`,
    moduleMetadata: {
      imports: [StoryKanbanLiveDemo],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of every kanban variation: basic 4-lane board, many-lane horizontal scroll, empty lanes, and lanes with header actions.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Basic 4-Lane Board" />
          <org-design-system-demo-canvas slot="canvas">
            <story-kanban-basic />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Click</strong>: Selects a single card</li>
            <li><strong>Cmd/Ctrl+click</strong>: Toggles a card in/out of the selection</li>
            <li><strong>Shift+click</strong>: Selects a range within the same lane from the anchor card to the clicked card</li>
            <li><strong>Drag selected card</strong>: Moves the whole selection together</li>
            <li><strong>Drop indicator</strong>: A horizontal line appears at the top or bottom edge of the card the pointer is closer to</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Many Lanes (Horizontal Scroll)" />
          <org-design-system-demo-canvas slot="canvas">
            <story-kanban-many-lanes />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Horizontal scroll</strong>: The board container scrolls horizontally when total lane width exceeds the viewport</li>
            <li><strong>Lane width</strong>: Each lane has a fixed min-width / max-width range driven by design tokens</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Lanes With Header Actions" />
          <org-design-system-demo-canvas slot="canvas">
            <story-kanban-with-actions />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>[actions] slot</strong>: Project a button or any element with the <code>actions</code> attribute to render it in the lane header on the right side</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Empty Lane Drop Target" />
          <org-design-system-demo-canvas slot="canvas">
            <story-kanban-empty-lane />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Empty lane</strong>: Renders a "No items" placeholder and still accepts drops</li>
            <li><strong>Append on empty</strong>: Dropping on the empty lane body appends to the end (which is index 0 when empty)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Lane Item Count Pill" />
          <org-design-system-demo-canvas slot="canvas">
            <story-kanban-show-count />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>showCount=true</strong> (default): Renders an item-count pill next to the lane heading</li>
            <li><strong>showCount=false</strong>: Hides the count pill so the header shows only the heading and any projected actions</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        StoryKanbanBasic,
        StoryKanbanManyLanes,
        StoryKanbanWithActions,
        StoryKanbanEmptyLane,
        StoryKanbanShowCount,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

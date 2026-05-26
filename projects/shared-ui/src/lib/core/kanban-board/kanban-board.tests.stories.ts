/**
 * NOTE: drag-and-drop scenarios are intentionally NOT covered by these storybook tests, even though they are a
 * critical part of this component's functionality. @atlaskit/pragmatic-drag-and-drop emits native html5
 * dragstart / dragover / drop events and the board brain's drop-index resolution depends on real dom geometry
 * (getBoundingClientRect + live pointer coordinates). storybook-test's userEvent / fireEvent helpers cannot
 * reliably simulate that native drag pipeline in jsdom, so any attempt to exercise drag-and-drop here would be
 * brittle and produce false positives / negatives. these flows are exercised manually via the development
 * stories in kanban-board.stories.ts; please keep this gap in mind when modifying the brain's drag logic.
 */
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { KanbanBoard } from './kanban-board';
import { KanbanLane } from './kanban-lane';
import type { KanbanItem } from './kanban-lane';

type DemoCard = KanbanItem & { title: string };

type DemoLane = {
  id: string;
  heading: string | undefined;
  ariaLabel: string | undefined;
  showCount: boolean;
  items: DemoCard[];
};

const buildLanes = (): DemoLane[] => [
  {
    id: 'lane-a',
    heading: 'Lane A',
    ariaLabel: undefined,
    showCount: true,
    items: [
      { id: 'a-1', title: 'A-1' },
      { id: 'a-2', title: 'A-2' },
      { id: 'a-3', title: 'A-3' },
      { id: 'a-4', title: 'A-4' },
    ],
  },
  {
    id: 'lane-b',
    heading: 'Lane B',
    ariaLabel: undefined,
    showCount: true,
    items: [
      { id: 'b-1', title: 'B-1' },
      { id: 'b-2', title: 'B-2' },
    ],
  },
  {
    id: 'lane-empty',
    heading: 'Empty Lane',
    ariaLabel: undefined,
    showCount: true,
    items: [],
  },
];

type LanePatch = Partial<Pick<DemoLane, 'heading' | 'ariaLabel' | 'showCount'>>;

@Component({
  selector: 'story-kanban-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane],
  host: { class: 'block h-sm' },
  template: `
    <org-kanban-board
      data-testid="board"
      [ariaLabel]="boardAriaLabel()"
      [selectedIds]="selected()"
      (selectedIdsChange)="selected.set($event)"
    >
      @for (lane of lanes(); track lane.id) {
        <org-kanban-lane
          [attr.data-testid]="'lane-' + lane.id"
          [laneId]="lane.id"
          [heading]="lane.heading"
          [ariaLabel]="lane.ariaLabel"
          [items]="lane.items"
          [showCount]="lane.showCount"
        >
          <ng-template #card let-item>
            <span [attr.data-testid]="'card-' + item.id">{{ item.title }}</span>
          </ng-template>
        </org-kanban-lane>
      }
    </org-kanban-board>
    <div class="text-xs pt-2" data-testid="selection-readout">{{ selectedSummary() }}</div>
    <div class="flex flex-wrap gap-1 pt-2">
      <button type="button" data-testid="ctl-board-aria-label-set" (click)="boardAriaLabel.set('Custom Board Label')">
        board-aria-label-set
      </button>
      <button type="button" data-testid="ctl-board-aria-label-clear" (click)="boardAriaLabel.set(undefined)">
        board-aria-label-clear
      </button>
      <button type="button" data-testid="ctl-lane-a-show-count-off" (click)="patchLaneA({ showCount: false })">
        lane-a-show-count-off
      </button>
      <button
        type="button"
        data-testid="ctl-lane-a-aria-label-set"
        (click)="patchLaneA({ ariaLabel: 'Explicit Lane A Label' })"
      >
        lane-a-aria-label-set
      </button>
      <button type="button" data-testid="ctl-lane-a-heading-clear" (click)="patchLaneA({ heading: undefined })">
        lane-a-heading-clear
      </button>
      <button type="button" data-testid="ctl-select-a-2" (click)="setSelection(['a-2'])">select-a-2</button>
      <button type="button" data-testid="ctl-select-a-1-a-3" (click)="setSelection(['a-1', 'a-3'])">
        select-a-1-a-3
      </button>
      <button type="button" data-testid="ctl-select-clear" (click)="setSelection([])">select-clear</button>
    </div>
  `,
})
class StoryKanbanTestsShell {
  protected readonly lanes = signal<DemoLane[]>(buildLanes());
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());
  protected readonly boardAriaLabel = signal<string | undefined>('Tests');
  protected readonly selectedSummary = (): string => Array.from(this.selected()).sort().join(',');

  protected patchLaneA(patch: LanePatch): void {
    this.lanes.update((lanes) => lanes.map((lane) => (lane.id === 'lane-a' ? { ...lane, ...patch } : lane)));
  }

  protected setSelection(ids: readonly string[]): void {
    this.selected.set(new Set(ids));
  }
}

const meta: Meta = {
  title: 'Core/Components/KanbanBoard/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-kanban-tests-shell />`,
  moduleMetadata: { imports: [StoryKanbanTestsShell] },
});

export const ClickSelectsSingleCard: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    // userEvent.setup() returns an instance that preserves held-modifier state across calls; direct
    // userEvent.* helpers spin up a fresh instance per call and silently drop the modifier on the next click
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const card = await canvas.findByTestId('card-a-2');
    await user.click(card);
    const readout = await canvas.findByTestId('selection-readout');
    await expect(readout.textContent).toBe('a-2');
  },
};

export const CmdClickTogglesSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardA3 = await canvas.findByTestId('card-a-3');
    const readout = await canvas.findByTestId('selection-readout');

    await user.click(cardA1);
    await expect(readout.textContent).toBe('a-1');

    await user.keyboard('{Control>}');
    await user.click(cardA3);
    await user.keyboard('{/Control}');
    await expect(readout.textContent).toBe('a-1,a-3');

    // toggling a-1 off
    await user.keyboard('{Control>}');
    await user.click(cardA1);
    await user.keyboard('{/Control}');
    await expect(readout.textContent).toBe('a-3');
  },
};

export const ShiftClickSelectsRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardA4 = await canvas.findByTestId('card-a-4');
    const readout = await canvas.findByTestId('selection-readout');

    await user.click(cardA1);
    await user.keyboard('{Shift>}');
    await user.click(cardA4);
    await user.keyboard('{/Shift}');
    await expect(readout.textContent).toBe('a-1,a-2,a-3,a-4');
  },
};

export const ShiftClickCrossLaneFallsBackToSingle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardB2 = await canvas.findByTestId('card-b-2');
    const readout = await canvas.findByTestId('selection-readout');

    await user.click(cardA1);
    await user.keyboard('{Shift>}');
    await user.click(cardB2);
    await user.keyboard('{/Shift}');
    // anchor in lane-a, shift-click in lane-b → falls back to single-select on the clicked card
    await expect(readout.textContent).toBe('b-2');
  },
};

export const EnterKeySelectsCard: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA2 = await canvas.findByTestId('card-a-2');
    const cardHost = cardA2.closest<HTMLElement>('org-kanban-card');
    const readout = await canvas.findByTestId('selection-readout');

    cardHost?.focus();
    await user.keyboard('{Enter}');

    await expect(readout.textContent).toBe('a-2');
  },
};

export const SpaceKeySelectsCard: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA3 = await canvas.findByTestId('card-a-3');
    const cardHost = cardA3.closest<HTMLElement>('org-kanban-card');
    const readout = await canvas.findByTestId('selection-readout');

    cardHost?.focus();
    await user.keyboard(' ');

    await expect(readout.textContent).toBe('a-3');
  },
};

export const CtrlEnterTogglesCardSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardA3 = await canvas.findByTestId('card-a-3');
    const cardA3Host = cardA3.closest<HTMLElement>('org-kanban-card');
    const readout = await canvas.findByTestId('selection-readout');

    await user.click(cardA1);
    await expect(readout.textContent).toBe('a-1');

    cardA3Host?.focus();
    await user.keyboard('{Control>}{Enter}{/Control}');

    await expect(readout.textContent).toBe('a-1,a-3');
  },
};

export const ShiftEnterSelectsRangeInLane: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardA4 = await canvas.findByTestId('card-a-4');
    const cardA4Host = cardA4.closest<HTMLElement>('org-kanban-card');
    const readout = await canvas.findByTestId('selection-readout');

    await user.click(cardA1);
    cardA4Host?.focus();
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    await expect(readout.textContent).toBe('a-1,a-2,a-3,a-4');
  },
};

export const BoardHostHasRegionRoleAndAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const board = await canvas.findByTestId('board');

    await expect(board.getAttribute('role')).toBe('region');
    await expect(board.getAttribute('aria-label')).toBe('Tests');
  },
};

export const BoardAriaLabelFallsBackToDefaultWhenCleared: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await user.click(canvas.getByTestId('ctl-board-aria-label-clear'));

    const board = await canvas.findByTestId('board');
    await expect(board.getAttribute('aria-label')).toBe('Kanban board');
  },
};

export const BoardAriaLabelReflectsConfiguredValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await user.click(canvas.getByTestId('ctl-board-aria-label-set'));

    const board = await canvas.findByTestId('board');
    await expect(board.getAttribute('aria-label')).toBe('Custom Board Label');
  },
};

export const LaneHostHasListRoleAndDataLaneId: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lane = await canvas.findByTestId('lane-lane-a');

    await expect(lane.getAttribute('role')).toBe('list');
    await expect(lane.getAttribute('data-lane-id')).toBe('lane-a');
  },
};

export const LaneAriaLabelFallsBackToHeading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lane = await canvas.findByTestId('lane-lane-a');

    await expect(lane.getAttribute('aria-label')).toBe('Lane A');
  },
};

export const LaneAriaLabelExplicitWinsOverHeading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await user.click(canvas.getByTestId('ctl-lane-a-aria-label-set'));

    const lane = await canvas.findByTestId('lane-lane-a');
    await expect(lane.getAttribute('aria-label')).toBe('Explicit Lane A Label');
  },
};

export const LaneAriaLabelFallsBackToDefaultWhenNoHeadingOrLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await user.click(canvas.getByTestId('ctl-lane-a-heading-clear'));

    const lane = await canvas.findByTestId('lane-lane-a');
    await expect(lane.getAttribute('aria-label')).toBe('Kanban lane');
  },
};

export const LaneRendersHeadingText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lane = await canvas.findByTestId('lane-lane-a');
    const heading = lane.querySelector('.kanban-lane-heading');

    await expect(heading?.textContent?.trim()).toBe('Lane A');
  },
};

export const LaneRendersCountPillWhenShowCountTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lane = await canvas.findByTestId('lane-lane-a');
    const countTag = lane.querySelector('.kanban-lane-header org-tag');

    await expect(lane.getAttribute('data-show-count')).toBe('');
    await expect(countTag).not.toBeNull();
    await expect(countTag?.textContent?.trim()).toBe('4');
  },
};

export const LaneHidesCountPillWhenShowCountFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await user.click(canvas.getByTestId('ctl-lane-a-show-count-off'));

    const lane = await canvas.findByTestId('lane-lane-a');
    const countTag = lane.querySelector('.kanban-lane-header org-tag');

    await expect(lane.getAttribute('data-show-count')).toBeNull();
    await expect(countTag).toBeNull();
  },
};

export const LaneRendersItemsViaCardTemplate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lane = await canvas.findByTestId('lane-lane-a');
    const cards = lane.querySelectorAll('org-kanban-card');

    await expect(cards.length).toBe(4);
    await expect(await canvas.findByTestId('card-a-1')).not.toBeNull();
    await expect(await canvas.findByTestId('card-a-4')).not.toBeNull();
  },
};

export const LaneDoesNotShowEmptyHintWhenNotDragging: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyLane = await canvas.findByTestId('lane-lane-empty');
    const hint = emptyLane.querySelector('[data-testid="kanban-lane-empty-hint"]');

    await expect(hint).toBeNull();
  },
};

export const CardHostHasListitemRoleAndDataAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardA2 = await canvas.findByTestId('card-a-2');
    const cardHost = cardA2.closest<HTMLElement>('org-kanban-card');

    await expect(cardHost?.getAttribute('role')).toBe('listitem');
    await expect(cardHost?.getAttribute('data-card-id')).toBe('a-2');
    await expect(cardHost?.getAttribute('data-lane-id')).toBe('lane-a');
  },
};

export const CardHasTabindexZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardHost = cardA1.closest<HTMLElement>('org-kanban-card');

    await expect(cardHost?.getAttribute('tabindex')).toBe('0');
  },
};

export const CardAriaSelectedReflectsSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const cardA2 = await canvas.findByTestId('card-a-2');
    const cardHost = cardA2.closest<HTMLElement>('org-kanban-card');

    await expect(cardHost?.getAttribute('aria-selected')).toBe('false');

    await user.click(cardA2);

    await expect(cardHost?.getAttribute('aria-selected')).toBe('true');
  },
};

export const ParentDrivenSelectedIdsReflectsOnCard: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await user.click(canvas.getByTestId('ctl-select-a-1-a-3'));

    const cardA1Host = (await canvas.findByTestId('card-a-1')).closest<HTMLElement>('org-kanban-card');
    const cardA2Host = (await canvas.findByTestId('card-a-2')).closest<HTMLElement>('org-kanban-card');
    const cardA3Host = (await canvas.findByTestId('card-a-3')).closest<HTMLElement>('org-kanban-card');

    await expect(cardA1Host?.getAttribute('aria-selected')).toBe('true');
    await expect(cardA2Host?.getAttribute('aria-selected')).toBe('false');
    await expect(cardA3Host?.getAttribute('aria-selected')).toBe('true');

    await user.click(canvas.getByTestId('ctl-select-clear'));

    await expect(cardA1Host?.getAttribute('aria-selected')).toBe('false');
    await expect(cardA3Host?.getAttribute('aria-selected')).toBe('false');
  },
};

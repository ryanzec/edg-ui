import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { KanbanBoard } from './kanban-board';
import { KanbanLane } from './kanban-lane';
import type { KanbanItem } from './kanban-lane';

type DemoCard = KanbanItem & { title: string };

const buildLanes = (): { id: string; heading: string; items: DemoCard[] }[] => [
  {
    id: 'lane-a',
    heading: 'Lane A',
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
    items: [
      { id: 'b-1', title: 'B-1' },
      { id: 'b-2', title: 'B-2' },
    ],
  },
];

@Component({
  selector: 'story-kanban-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane],
  host: { class: 'block h-sm' },
  template: `
    <org-kanban-board ariaLabel="Tests" [selectedIds]="selected()" (selectedIdsChange)="selected.set($event)">
      @for (lane of lanes(); track lane.id) {
        <org-kanban-lane [laneId]="lane.id" [heading]="lane.heading" [items]="lane.items">
          <ng-template #card let-item>
            <span [attr.data-testid]="'card-' + item.id">{{ item.title }}</span>
          </ng-template>
        </org-kanban-lane>
      }
    </org-kanban-board>
    <div class="text-xs pt-2" data-testid="selection-readout">{{ selectedSummary() }}</div>
  `,
})
class StoryKanbanTestsShell {
  protected readonly lanes = signal(buildLanes());
  protected readonly selected = signal<ReadonlySet<string>>(new Set<string>());
  protected readonly selectedSummary = (): string => Array.from(this.selected()).sort().join(',');
}

const meta: Meta = {
  title: 'Core/Components/KanbanBoard/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const ClickSelectsSingleCard: Story = {
  render: () => ({
    template: `<story-kanban-tests-shell />`,
    moduleMetadata: { imports: [StoryKanbanTestsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = await canvas.findByTestId('card-a-2');
    await userEvent.click(card);
    const readout = await canvas.findByTestId('selection-readout');
    await expect(readout.textContent).toBe('a-2');
  },
};

export const CmdClickTogglesSelection: Story = {
  render: () => ({
    template: `<story-kanban-tests-shell />`,
    moduleMetadata: { imports: [StoryKanbanTestsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardA3 = await canvas.findByTestId('card-a-3');
    const readout = await canvas.findByTestId('selection-readout');

    await userEvent.click(cardA1);
    await expect(readout.textContent).toBe('a-1');

    await userEvent.keyboard('{Control>}');
    await userEvent.click(cardA3);
    await userEvent.keyboard('{/Control}');
    await expect(readout.textContent).toBe('a-1,a-3');

    // toggling a-1 off
    await userEvent.keyboard('{Control>}');
    await userEvent.click(cardA1);
    await userEvent.keyboard('{/Control}');
    await expect(readout.textContent).toBe('a-3');
  },
};

export const ShiftClickSelectsRange: Story = {
  render: () => ({
    template: `<story-kanban-tests-shell />`,
    moduleMetadata: { imports: [StoryKanbanTestsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardA4 = await canvas.findByTestId('card-a-4');
    const readout = await canvas.findByTestId('selection-readout');

    await userEvent.click(cardA1);
    await userEvent.keyboard('{Shift>}');
    await userEvent.click(cardA4);
    await userEvent.keyboard('{/Shift}');
    await expect(readout.textContent).toBe('a-1,a-2,a-3,a-4');
  },
};

export const ShiftClickCrossLaneFallsBackToSingle: Story = {
  render: () => ({
    template: `<story-kanban-tests-shell />`,
    moduleMetadata: { imports: [StoryKanbanTestsShell] },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardA1 = await canvas.findByTestId('card-a-1');
    const cardB2 = await canvas.findByTestId('card-b-2');
    const readout = await canvas.findByTestId('selection-readout');

    await userEvent.click(cardA1);
    await userEvent.keyboard('{Shift>}');
    await userEvent.click(cardB2);
    await userEvent.keyboard('{/Shift}');
    // anchor in lane-a, shift-click in lane-b → falls back to single-select on the clicked card
    await expect(readout.textContent).toBe('b-2');
  },
};

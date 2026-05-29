/**
 * NOTE: drag-and-drop scenarios are intentionally NOT covered by these tests, even though they are a critical
 * part of this component's functionality. @atlaskit/pragmatic-drag-and-drop emits native html5 dragstart /
 * dragover / drop events and the board brain's drop-index resolution depends on real dom geometry
 * (getBoundingClientRect + live pointer coordinates), which cannot be reliably simulated through userEvent.
 * those flows are exercised manually via the development stories in kanban-board.stories.ts; please keep this
 * gap in mind when modifying the brain's drag logic.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { KanbanBoard } from './kanban-board';
import { KanbanLane, type KanbanItem } from './kanban-lane';

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
  selector: 'test-kanban-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane],
  // the board resolves its lane scroll height from an ancestor with a definite height (height: 100% chain);
  // h-sm gives that context so lower cards are scrollable into view rather than clipped / "not visible"
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
    <div data-testid="selection-readout">{{ selectedSummary() }}</div>
  `,
})
class KanbanTestsHost {
  public readonly lanes = signal<DemoLane[]>(buildLanes());
  public readonly selected = signal<ReadonlySet<string>>(new Set<string>());
  public readonly boardAriaLabel = signal<string | undefined>('Tests');

  protected readonly selectedSummary = (): string => Array.from(this.selected()).sort().join(',');

  public patchLaneA(patch: LanePatch): void {
    this.lanes.update((lanes) => lanes.map((lane) => (lane.id === 'lane-a' ? { ...lane, ...patch } : lane)));
  }

  public setSelection(ids: readonly string[]): void {
    this.selected.set(new Set(ids));
  }
}

describe('KanbanBoard (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  const cardHostOf = (fixture: ComponentFixture<unknown>, testId: string): HTMLElement =>
    queryByTestId(fixture, testId).closest<HTMLElement>('org-kanban-card') as HTMLElement;

  // the card brain binds a native (click) and reads ctrl/meta/shift flags off the event. held modifiers
  // across the playwright-backed userEvent.click do not reliably persist, so dispatch a synthetic
  // MouseEvent that sets the modifier flags deterministically while still exercising the real onClick handler
  const clickCard = async (
    fixture: ComponentFixture<unknown>,
    testId: string,
    init: MouseEventInit = {}
  ): Promise<void> => {
    queryByTestId(fixture, testId).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
    await flush(fixture);
  };

  describe('mouse selection', () => {
    it('selects a single card on click', async () => {
      const user = userEvent.setup();
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      await user.click(queryByTestId(fixture, 'card-a-2'));

      await waitFor(() => expect(readout.textContent).toBe('a-2'));
    });

    it('toggles selection on cmd/ctrl click', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      await clickCard(fixture, 'card-a-1');
      await waitFor(() => expect(readout.textContent).toBe('a-1'));

      await clickCard(fixture, 'card-a-3', { ctrlKey: true });
      await waitFor(() => expect(readout.textContent).toBe('a-1,a-3'));

      await clickCard(fixture, 'card-a-1', { ctrlKey: true });
      await waitFor(() => expect(readout.textContent).toBe('a-3'));
    });

    it('selects a range on shift click', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      await clickCard(fixture, 'card-a-1');
      await clickCard(fixture, 'card-a-4', { shiftKey: true });

      await waitFor(() => expect(readout.textContent).toBe('a-1,a-2,a-3,a-4'));
    });

    it('falls back to single-select on a cross-lane shift click', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      await clickCard(fixture, 'card-a-1');
      await clickCard(fixture, 'card-b-2', { shiftKey: true });

      await waitFor(() => expect(readout.textContent).toBe('b-2'));
    });
  });

  describe('keyboard selection', () => {
    it('selects a card on Enter', async () => {
      const user = userEvent.setup();
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      cardHostOf(fixture, 'card-a-2').focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(readout.textContent).toBe('a-2'));
    });

    it('selects a card on Space', async () => {
      const user = userEvent.setup();
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      cardHostOf(fixture, 'card-a-3').focus();
      await user.keyboard(' ');

      await waitFor(() => expect(readout.textContent).toBe('a-3'));
    });

    it('toggles selection on Ctrl+Enter', async () => {
      const user = userEvent.setup();
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      await user.click(queryByTestId(fixture, 'card-a-1'));
      await waitFor(() => expect(readout.textContent).toBe('a-1'));

      cardHostOf(fixture, 'card-a-3').focus();
      await user.keyboard('{Control>}{Enter}{/Control}');

      await waitFor(() => expect(readout.textContent).toBe('a-1,a-3'));
    });

    it('selects a range in lane on Shift+Enter', async () => {
      const user = userEvent.setup();
      const fixture = createFixture(KanbanTestsHost);
      const readout = queryByTestId(fixture, 'selection-readout');

      await user.click(queryByTestId(fixture, 'card-a-1'));
      cardHostOf(fixture, 'card-a-4').focus();
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      await waitFor(() => expect(readout.textContent).toBe('a-1,a-2,a-3,a-4'));
    });
  });

  describe('board a11y', () => {
    it('exposes the region role and configured aria-label', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const board = queryByTestId(fixture, 'board');

      await flush(fixture);

      expect(board.getAttribute('role')).toBe('region');
      expect(board.getAttribute('aria-label')).toBe('Tests');
    });

    it('falls back to the default aria-label when cleared', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const board = queryByTestId(fixture, 'board');

      fixture.componentInstance.boardAriaLabel.set(undefined);
      await flush(fixture);

      await waitFor(() => expect(board.getAttribute('aria-label')).toBe('Kanban board'));
    });

    it('reflects a configured aria-label value', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const board = queryByTestId(fixture, 'board');

      fixture.componentInstance.boardAriaLabel.set('Custom Board Label');
      await flush(fixture);

      await waitFor(() => expect(board.getAttribute('aria-label')).toBe('Custom Board Label'));
    });
  });

  describe('lane a11y & rendering', () => {
    it('exposes the list role and data-lane-id', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      await flush(fixture);

      expect(lane.getAttribute('role')).toBe('list');
      expect(lane.getAttribute('data-lane-id')).toBe('lane-a');
    });

    it('falls back the aria-label to the heading', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      await flush(fixture);

      expect(lane.getAttribute('aria-label')).toBe('Lane A');
    });

    it('prefers an explicit aria-label over the heading', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      fixture.componentInstance.patchLaneA({ ariaLabel: 'Explicit Lane A Label' });
      await flush(fixture);

      await waitFor(() => expect(lane.getAttribute('aria-label')).toBe('Explicit Lane A Label'));
    });

    it('falls back the aria-label to the default with no heading or label', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      fixture.componentInstance.patchLaneA({ heading: undefined });
      await flush(fixture);

      await waitFor(() => expect(lane.getAttribute('aria-label')).toBe('Kanban lane'));
    });

    it('renders the heading text', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      await flush(fixture);

      expect(lane.querySelector('.kanban-lane-heading')?.textContent?.trim()).toBe('Lane A');
    });

    it('renders the count pill when show-count is true', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      await flush(fixture);

      const countTag = lane.querySelector('.kanban-lane-header org-tag');

      expect(lane.getAttribute('data-show-count')).toBe('');
      expect(countTag).not.toBeNull();
      expect(countTag?.textContent?.trim()).toBe('4');
    });

    it('hides the count pill when show-count is false', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      fixture.componentInstance.patchLaneA({ showCount: false });
      await flush(fixture);

      await waitFor(() => {
        expect(lane.getAttribute('data-show-count')).toBeNull();
        expect(lane.querySelector('.kanban-lane-header org-tag')).toBeNull();
      });
    });

    it('renders items via the card template', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const lane = queryByTestId(fixture, 'lane-lane-a');

      await flush(fixture);

      expect(lane.querySelectorAll('org-kanban-card').length).toBe(4);
      expect(queryByTestId(fixture, 'card-a-1')).not.toBeNull();
      expect(queryByTestId(fixture, 'card-a-4')).not.toBeNull();
    });

    it('does not show the empty hint when not dragging', async () => {
      const fixture = createFixture(KanbanTestsHost);
      const emptyLane = queryByTestId(fixture, 'lane-lane-empty');

      await flush(fixture);

      expect(emptyLane.querySelector('[data-testid="kanban-lane-empty-hint"]')).toBeNull();
    });
  });

  describe('card a11y & selection state', () => {
    it('exposes the listitem role and data attributes', async () => {
      const fixture = createFixture(KanbanTestsHost);

      await flush(fixture);

      const cardHost = cardHostOf(fixture, 'card-a-2');

      expect(cardHost.getAttribute('role')).toBe('listitem');
      expect(cardHost.getAttribute('data-card-id')).toBe('a-2');
      expect(cardHost.getAttribute('data-lane-id')).toBe('lane-a');
    });

    it('makes the card focusable with tabindex zero', async () => {
      const fixture = createFixture(KanbanTestsHost);

      await flush(fixture);

      expect(cardHostOf(fixture, 'card-a-1').getAttribute('tabindex')).toBe('0');
    });

    it('reflects selection in aria-selected', async () => {
      const user = userEvent.setup();
      const fixture = createFixture(KanbanTestsHost);

      await flush(fixture);

      const cardHost = cardHostOf(fixture, 'card-a-2');
      expect(cardHost.getAttribute('aria-selected')).toBe('false');

      await user.click(queryByTestId(fixture, 'card-a-2'));

      await waitFor(() => expect(cardHost.getAttribute('aria-selected')).toBe('true'));
    });

    it('reflects parent-driven selectedIds on cards', async () => {
      const fixture = createFixture(KanbanTestsHost);

      fixture.componentInstance.setSelection(['a-1', 'a-3']);
      await flush(fixture);

      const cardA1Host = cardHostOf(fixture, 'card-a-1');
      const cardA2Host = cardHostOf(fixture, 'card-a-2');
      const cardA3Host = cardHostOf(fixture, 'card-a-3');

      await waitFor(() => {
        expect(cardA1Host.getAttribute('aria-selected')).toBe('true');
        expect(cardA2Host.getAttribute('aria-selected')).toBe('false');
        expect(cardA3Host.getAttribute('aria-selected')).toBe('true');
      });

      fixture.componentInstance.setSelection([]);
      await flush(fixture);

      await waitFor(() => {
        expect(cardA1Host.getAttribute('aria-selected')).toBe('false');
        expect(cardA3Host.getAttribute('aria-selected')).toBe('false');
      });
    });
  });
});

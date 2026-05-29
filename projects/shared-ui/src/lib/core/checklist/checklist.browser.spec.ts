import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Checklist, type ChecklistItemData } from './checklist';

@Component({
  selector: 'test-checklist-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checklist],
  host: { class: 'block' },
  template: `
    <org-checklist
      data-testid="checklist"
      [items]="items()"
      (itemsChange)="items.set($event)"
      [emphasizeInvalid]="emphasizeInvalid()"
      [showStatusBackground]="showStatusBackground()"
      [isEditable]="isEditable()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ChecklistInteractiveHost {
  public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
  public readonly emphasizeInvalid = signal<boolean>(false);
  public readonly showStatusBackground = signal<boolean>(false);
  public readonly isEditable = signal<boolean>(false);

  protected readout(): string {
    const summary = this.items()
      .map((item) => {
        const childSummary = item.items?.map((child) => `${child.id}=${child.status}`).join(',') ?? '';
        const childPart = childSummary ? `[${childSummary}]` : '';

        return `${item.id}=${item.status}${childPart}`;
      })
      .join(' ');

    return `items=${summary}`;
  }
}

const FLAT_ITEMS: ChecklistItemData[] = [
  { id: 'a', label: 'Item A', status: 'not-started' },
  { id: 'b', label: 'Item B', status: 'valid' },
  { id: 'c', label: 'Item C', status: 'invalid' },
];

const ITEM_WITH_META: ChecklistItemData[] = [{ id: 'a', label: 'Item A', status: 'valid', meta: '1.2s' }];

const PARENT_WITH_COUNT: ChecklistItemData[] = [
  {
    id: 'a',
    label: 'Parent',
    status: 'in-progress',
    count: '2/4',
    items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
  },
];

const PARENT_SIMPLE: ChecklistItemData[] = [
  { id: 'a', label: 'Parent', status: 'in-progress', items: [{ id: 'a-1', label: 'Child', status: 'not-started' }] },
];

const NESTED_MIXED: ChecklistItemData[] = [
  {
    id: 'a',
    label: 'Parent',
    status: 'in-progress',
    items: [
      { id: 'a-1', label: 'Child One', status: 'not-started' },
      { id: 'a-2', label: 'Child Two', status: 'valid' },
      { id: 'a-3', label: 'Child Three', status: 'invalid' },
    ],
  },
];

const NESTED_ALL_NOT_STARTED: ChecklistItemData[] = [
  {
    id: 'a',
    label: 'Parent',
    status: 'in-progress',
    items: [
      { id: 'a-1', label: 'Child One', status: 'not-started' },
      { id: 'a-2', label: 'Child Two', status: 'not-started' },
    ],
  },
];

const NESTED_VALID_AND_NOT_STARTED: ChecklistItemData[] = [
  {
    id: 'a',
    label: 'Parent',
    status: 'in-progress',
    items: [
      { id: 'a-1', label: 'Child One', status: 'not-started' },
      { id: 'a-2', label: 'Child Two', status: 'valid' },
    ],
  },
];

const NESTED_WITH_INVALID: ChecklistItemData[] = [
  {
    id: 'a',
    label: 'Parent',
    status: 'invalid',
    items: [
      { id: 'a-1', label: 'Child One', status: 'not-started' },
      { id: 'a-2', label: 'Child Two', status: 'invalid' },
    ],
  },
];

const NESTED_WITH_IN_PROGRESS: ChecklistItemData[] = [
  {
    id: 'a',
    label: 'Parent',
    status: 'in-progress',
    items: [
      { id: 'a-1', label: 'Child One', status: 'not-started' },
      { id: 'a-2', label: 'Child Two', status: 'in-progress' },
    ],
  },
];

const NESTED_SINGLE_IN_PROGRESS_CHILD: ChecklistItemData[] = [
  { id: 'a', label: 'Parent', status: 'in-progress', items: [{ id: 'a-1', label: 'Child', status: 'in-progress' }] },
];

const NESTED_SINGLE_INVALID_CHILD: ChecklistItemData[] = [
  { id: 'a', label: 'Parent', status: 'invalid', items: [{ id: 'a-1', label: 'Child', status: 'invalid' }] },
];

const TWO_PARENTS: ChecklistItemData[] = [
  { id: 'a', label: 'Parent A', status: 'in-progress', items: [{ id: 'a-1', label: 'Child', status: 'not-started' }] },
  { id: 'b', label: 'Parent B', status: 'in-progress', items: [{ id: 'b-1', label: 'Child', status: 'not-started' }] },
];

describe('Checklist (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  type ChecklistHostConfig = {
    items?: ChecklistItemData[];
    emphasizeInvalid?: boolean;
    showStatusBackground?: boolean;
    isEditable?: boolean;
  };

  const createChecklist = (config: ChecklistHostConfig = {}): ComponentFixture<ChecklistInteractiveHost> =>
    createFixture(ChecklistInteractiveHost, (instance) => {
      if (config.items !== undefined) {
        instance.items.set(config.items);
      }

      if (config.emphasizeInvalid !== undefined) {
        instance.emphasizeInvalid.set(config.emphasizeInvalid);
      }

      if (config.showStatusBackground !== undefined) {
        instance.showStatusBackground.set(config.showStatusBackground);
      }

      if (config.isEditable !== undefined) {
        instance.isEditable.set(config.isEditable);
      }
    });

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  describe('host attributes', () => {
    it('applies role="list" to the host element', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');

      expect(host.getAttribute('role')).toBe('list');
    });

    it('omits data attributes by default', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');

      expect(host.getAttribute('data-emphasize-invalid')).toBeNull();
      expect(host.getAttribute('data-status-background')).toBeNull();
      expect(host.getAttribute('data-editable')).toBeNull();
    });

    it('reflects data-emphasize-invalid when enabled', async () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');

      fixture.componentInstance.emphasizeInvalid.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-emphasize-invalid')).toBe('');
    });

    it('reflects data-status-background when enabled', async () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');

      fixture.componentInstance.showStatusBackground.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-status-background')).toBe('');
    });

    it('reflects data-editable when isEditable is set', async () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');

      fixture.componentInstance.isEditable.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-editable')).toBe('');
    });
  });

  describe('item rendering', () => {
    it('renders one checklist item per item in the list', () => {
      const fixture = createChecklist({ items: FLAT_ITEMS });
      const host = queryByTestId(fixture, 'checklist');

      expect(host.querySelectorAll('org-checklist-item').length).toBe(3);
    });

    it('updates rendered items when the items model changes', async () => {
      const fixture = createChecklist({ items: FLAT_ITEMS });
      const host = queryByTestId(fixture, 'checklist');

      expect(host.querySelectorAll('org-checklist-item').length).toBe(3);

      fixture.componentInstance.items.set([{ id: 'only', label: 'Only one', status: 'not-started' }]);
      await flush(fixture);

      expect(host.querySelectorAll('org-checklist-item').length).toBe(1);
    });

    it('applies role="listitem" on each checklist item', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('role')).toBe('listitem');
    });

    it('reflects item status on data-status attribute', () => {
      const fixture = createChecklist({ items: [{ id: 'a', label: 'Item A', status: 'in-progress' }] });
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('in-progress');
    });

    it('updates data-status when the item status changes', async () => {
      const fixture = createChecklist({ items: [{ id: 'a', label: 'Item A', status: 'in-progress' }] });
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('in-progress');

      fixture.componentInstance.items.set([{ id: 'a', label: 'Item A', status: 'valid' }]);
      await flush(fixture);

      expect(item.getAttribute('data-status')).toBe('valid');
    });
  });

  describe('leaf rendering', () => {
    it('omits data-expanded when item is not expanded', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-expanded')).toBeNull();
    });

    it('renders leaf as a static div when not editable', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.querySelector('button')).toBeNull();
      expect(item.querySelector('div.row')).not.toBeNull();
    });

    it('renders leaf as a button when editable', () => {
      const fixture = createChecklist({ isEditable: true });
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.querySelector('button.row')).not.toBeNull();
    });

    it('does not mark not-started leaf as aria-disabled', () => {
      const fixture = createChecklist({ isEditable: true });
      const host = queryByTestId(fixture, 'checklist');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBeNull();
    });

    it('marks in-progress leaf button as aria-disabled', () => {
      const fixture = createChecklist({
        isEditable: true,
        items: [{ id: 'a', label: 'Item A', status: 'in-progress' }],
      });
      const host = queryByTestId(fixture, 'checklist');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('marks invalid leaf button as aria-disabled', () => {
      const fixture = createChecklist({ isEditable: true, items: [{ id: 'a', label: 'Item A', status: 'invalid' }] });
      const host = queryByTestId(fixture, 'checklist');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('parent row', () => {
    it('renders parent row as a button with aria-expanded even when not editable', () => {
      const fixture = createChecklist({ items: PARENT_SIMPLE });
      const host = queryByTestId(fixture, 'checklist');
      const button = host.querySelector('org-checklist-item > button.row') as HTMLButtonElement;

      expect(button).not.toBeNull();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('meta and count', () => {
    it('does not render the meta span when meta is omitted', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.querySelector('.meta')).toBeNull();
    });

    it('renders meta text in the meta span when provided', () => {
      const fixture = createChecklist({ items: ITEM_WITH_META });
      const host = queryByTestId(fixture, 'checklist');
      const meta = host.querySelector('org-checklist-item .meta') as HTMLElement;

      expect(meta.textContent?.trim()).toBe('1.2s');
    });

    it('renders count pill text on the parent row', () => {
      const fixture = createChecklist({ items: PARENT_WITH_COUNT });
      const host = queryByTestId(fixture, 'checklist');
      const count = host.querySelector('org-checklist-item .count') as HTMLElement;

      expect(count.textContent?.trim()).toBe('2/4');
    });
  });

  describe('expand and collapse', () => {
    it('clicking parent row flips aria-expanded and data-expanded', async () => {
      const fixture = createChecklist({ items: PARENT_SIMPLE });
      const host = queryByTestId(fixture, 'checklist');
      const item = host.querySelector('org-checklist-item') as HTMLElement;
      const button = item.querySelector('button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(item.getAttribute('data-expanded')).toBeNull();

      await userEvent.click(button);
      await flush(fixture);

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(item.getAttribute('data-expanded')).toBe('');

      await userEvent.click(button);
      await flush(fixture);

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(item.getAttribute('data-expanded')).toBeNull();
    });

    it('tracks multiple expanded parent rows independently', async () => {
      const fixture = createChecklist({ items: TWO_PARENTS });
      const host = queryByTestId(fixture, 'checklist');
      const items = host.querySelectorAll('org-checklist-item');
      const firstButton = (items[0] as HTMLElement).querySelector('button.row') as HTMLButtonElement;
      const secondButton = (items[1] as HTMLElement).querySelector('button.row') as HTMLButtonElement;

      await userEvent.click(firstButton);
      await flush(fixture);
      await userEvent.click(secondButton);
      await flush(fixture);

      expect(items[0].getAttribute('data-expanded')).toBe('');
      expect(items[1].getAttribute('data-expanded')).toBe('');
    });
  });

  describe('status toggling', () => {
    it('clicking editable not-started leaf toggles it to valid', async () => {
      const fixture = createChecklist({ isEditable: true });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      await userEvent.click(button);
      await flush(fixture);

      expect(readout.textContent).toContain('a=valid');
    });

    it('clicking editable valid leaf toggles it back to not-started', async () => {
      const fixture = createChecklist({ isEditable: true, items: [{ id: 'a', label: 'Item A', status: 'valid' }] });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      await userEvent.click(button);
      await flush(fixture);

      expect(readout.textContent).toContain('a=not-started');
    });

    it('clicking editable in-progress leaf does not change status', async () => {
      const fixture = createChecklist({
        isEditable: true,
        items: [{ id: 'a', label: 'Item A', status: 'in-progress' }],
      });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      // aria-disabled="true" buttons are not clickable via userEvent; dispatch natively to verify the brain ignores the click
      button.click();
      await flush(fixture);

      expect(readout.textContent).toContain('a=in-progress');
    });

    it('clicking editable invalid leaf does not change status', async () => {
      const fixture = createChecklist({ isEditable: true, items: [{ id: 'a', label: 'Item A', status: 'invalid' }] });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      // aria-disabled="true" buttons are not clickable via userEvent; dispatch natively to verify the brain ignores the click
      button.click();
      await flush(fixture);

      expect(readout.textContent).toContain('a=invalid');
    });

    it('clicking a non-editable leaf does not change status', async () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');
      const row = host.querySelector('org-checklist-item div.row') as HTMLElement;

      await userEvent.click(row);
      await flush(fixture);

      expect(readout.textContent).toContain('a=not-started');
    });

    it('clicking the parent row only expands and does not toggle status', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_ALL_NOT_STARTED });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');
      const parentButton = host.querySelector('org-checklist-item > button.row') as HTMLButtonElement;

      await userEvent.click(parentButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a=in-progress[a-1=not-started,a-2=not-started]');
    });
  });

  describe('nested children', () => {
    it('renders one nested item per child', () => {
      const fixture = createChecklist({ items: NESTED_MIXED });
      const host = queryByTestId(fixture, 'checklist');
      const nested = host.querySelectorAll('org-checklist-item .children .nested-item');

      expect(nested.length).toBe(3);
    });

    it('reflects each child status on the nested item data-status', () => {
      const fixture = createChecklist({ items: NESTED_MIXED });
      const host = queryByTestId(fixture, 'checklist');
      const nested = host.querySelectorAll<HTMLElement>('org-checklist-item .children .nested-item');

      expect(nested[0].getAttribute('data-status')).toBe('not-started');
      expect(nested[1].getAttribute('data-status')).toBe('valid');
      expect(nested[2].getAttribute('data-status')).toBe('invalid');
    });

    it('renders nested children as static divs when not editable', () => {
      const fixture = createChecklist({ items: NESTED_MIXED });
      const host = queryByTestId(fixture, 'checklist');
      const nested = host.querySelectorAll<HTMLElement>('org-checklist-item .children .nested-item');

      expect(nested[0].querySelector('button')).toBeNull();
      expect(nested[0].querySelector('div.row')).not.toBeNull();
    });

    it('renders nested children as buttons when editable and marks non-togglable as aria-disabled', () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_MIXED });
      const host = queryByTestId(fixture, 'checklist');
      const nested = host.querySelectorAll<HTMLElement>('org-checklist-item .children .nested-item');
      const notStartedButton = nested[0].querySelector('button.row') as HTMLButtonElement;
      const validButton = nested[1].querySelector('button.row') as HTMLButtonElement;
      const invalidButton = nested[2].querySelector('button.row') as HTMLButtonElement;

      expect(notStartedButton).not.toBeNull();
      expect(notStartedButton.getAttribute('aria-disabled')).toBeNull();
      expect(validButton.getAttribute('aria-disabled')).toBeNull();
      expect(invalidButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('clicking a not-started nested child toggles it to valid', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_ALL_NOT_STARTED });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      const firstChildButton = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      await userEvent.click(firstChildButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a-1=valid');
    });

    it('clicking a nested in-progress child does not change status', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_SINGLE_IN_PROGRESS_CHILD });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      // aria-disabled="true" buttons are not clickable via userEvent; dispatch natively
      const childButton = host.querySelector(
        'org-checklist-item .children .nested-item button.row'
      ) as HTMLButtonElement;

      childButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('a-1=in-progress');
    });

    it('clicking a nested invalid child does not change status', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_SINGLE_INVALID_CHILD });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      // aria-disabled="true" buttons are not clickable via userEvent; dispatch natively
      const childButton = host.querySelector(
        'org-checklist-item .children .nested-item button.row'
      ) as HTMLButtonElement;

      childButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('a-1=invalid');
    });
  });

  describe('parent status derivation', () => {
    it('parent becomes valid when all children are toggled to valid', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_VALID_AND_NOT_STARTED });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      const firstChildButton = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      await userEvent.click(firstChildButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a=valid');
    });

    it('parent becomes not-started when all children are toggled to not-started', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_VALID_AND_NOT_STARTED });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      const secondChildButton = host.querySelector(
        'org-checklist-item .children .nested-item:nth-child(2) button.row'
      ) as HTMLButtonElement;

      await userEvent.click(secondChildButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a=not-started');
    });

    it('parent becomes in-progress when children have mixed statuses', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_ALL_NOT_STARTED });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      const firstChildButton = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      await userEvent.click(firstChildButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a=in-progress');
    });

    it('parent stays in-progress when a sibling is in-progress', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_WITH_IN_PROGRESS });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      const firstChildButton = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      await userEvent.click(firstChildButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a=in-progress');
    });

    it('parent stays invalid when any sibling is invalid', async () => {
      const fixture = createChecklist({ isEditable: true, items: NESTED_WITH_INVALID });
      const host = queryByTestId(fixture, 'checklist');
      const readout = queryByTestId(fixture, 'readout');

      // children are CSS-hidden (display:none) until the parent is expanded
      await userEvent.click(host.querySelector('org-checklist-item > button.row') as HTMLButtonElement);
      await flush(fixture);

      const firstChildButton = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      await userEvent.click(firstChildButton);
      await flush(fixture);

      expect(readout.textContent).toContain('a=invalid');
    });
  });

  describe('status icon', () => {
    it('renders a circle icon for not-started status', () => {
      const fixture = createChecklist();
      const host = queryByTestId(fixture, 'checklist');
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;
      const icon = statusIcon.querySelector(':scope > org-icon');

      expect(statusIcon.getAttribute('data-status')).toBe('not-started');
      expect(icon).not.toBeNull();
      expect(icon?.getAttribute('name')).toBe('circle');
      expect(statusIcon.querySelector(':scope > org-loading-spinner')).toBeNull();
    });

    it('renders a loading spinner for in-progress status', () => {
      const fixture = createChecklist({ items: [{ id: 'a', label: 'Item A', status: 'in-progress' }] });
      const host = queryByTestId(fixture, 'checklist');
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;

      expect(statusIcon.getAttribute('data-status')).toBe('in-progress');
      expect(statusIcon.querySelector(':scope > org-loading-spinner')).not.toBeNull();
      expect(statusIcon.querySelector(':scope > org-icon')).toBeNull();
    });

    it('renders a check icon for valid status', () => {
      const fixture = createChecklist({ items: [{ id: 'a', label: 'Item A', status: 'valid' }] });
      const host = queryByTestId(fixture, 'checklist');
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;
      const icon = statusIcon.querySelector(':scope > org-icon');

      expect(statusIcon.getAttribute('data-status')).toBe('valid');
      expect(icon?.getAttribute('name')).toBe('check');
    });

    it('renders an x icon for invalid status', () => {
      const fixture = createChecklist({ items: [{ id: 'a', label: 'Item A', status: 'invalid' }] });
      const host = queryByTestId(fixture, 'checklist');
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;
      const icon = statusIcon.querySelector(':scope > org-icon');

      expect(statusIcon.getAttribute('data-status')).toBe('invalid');
      expect(icon?.getAttribute('name')).toBe('x');
    });
  });
});

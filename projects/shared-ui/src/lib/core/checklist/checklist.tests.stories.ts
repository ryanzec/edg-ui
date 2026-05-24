import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Checklist, type ChecklistItemData } from './checklist';

@Component({
  selector: 'story-checklist-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-emphasize-invalid-on" (click)="emphasizeInvalid.set(true)">
        emphasize-invalid-on
      </button>
      <button type="button" data-testid="ctl-status-background-on" (click)="showStatusBackground.set(true)">
        status-background-on
      </button>
      <button type="button" data-testid="ctl-editable-on" (click)="isEditable.set(true)">editable-on</button>
      <button type="button" data-testid="ctl-editable-off" (click)="isEditable.set(false)">editable-off</button>
      <button type="button" data-testid="ctl-items-flat" (click)="useFlatItems()">items-flat</button>
      <button type="button" data-testid="ctl-items-single" (click)="useSingleItem()">items-single</button>
      <button type="button" data-testid="ctl-items-status-not-started" (click)="useSingleItemWithStatus('not-started')">
        items-status-not-started
      </button>
      <button type="button" data-testid="ctl-items-status-in-progress" (click)="useSingleItemWithStatus('in-progress')">
        items-status-in-progress
      </button>
      <button type="button" data-testid="ctl-items-status-valid" (click)="useSingleItemWithStatus('valid')">
        items-status-valid
      </button>
      <button type="button" data-testid="ctl-items-status-invalid" (click)="useSingleItemWithStatus('invalid')">
        items-status-invalid
      </button>
      <button type="button" data-testid="ctl-items-with-meta" (click)="useItemWithMeta()">items-with-meta</button>
      <button type="button" data-testid="ctl-items-parent-with-count" (click)="useParentWithCount()">
        items-parent-with-count
      </button>
      <button type="button" data-testid="ctl-items-parent-simple" (click)="useParentSimple()">
        items-parent-simple
      </button>
      <button type="button" data-testid="ctl-items-nested-mixed" (click)="useNestedMixed()">items-nested-mixed</button>
      <button
        type="button"
        data-testid="ctl-items-nested-all-not-started"
        (click)="useNestedAllStatus('not-started', 'not-started')"
      >
        items-nested-all-not-started
      </button>
      <button
        type="button"
        data-testid="ctl-items-nested-valid-and-not-started"
        (click)="useNestedAllStatus('not-started', 'valid')"
      >
        items-nested-valid-and-not-started
      </button>
      <button type="button" data-testid="ctl-items-nested-with-invalid" (click)="useNestedWithInvalid()">
        items-nested-with-invalid
      </button>
      <button type="button" data-testid="ctl-items-nested-with-in-progress" (click)="useNestedWithInProgress()">
        items-nested-with-in-progress
      </button>
      <button
        type="button"
        data-testid="ctl-items-nested-single-in-progress-child"
        (click)="useNestedSingleStatusChild('in-progress')"
      >
        items-nested-single-in-progress-child
      </button>
      <button
        type="button"
        data-testid="ctl-items-nested-single-invalid-child"
        (click)="useNestedSingleStatusChild('invalid')"
      >
        items-nested-single-invalid-child
      </button>
      <button type="button" data-testid="ctl-items-two-parents" (click)="useTwoParents()">items-two-parents</button>
    </div>
  `,
})
class StoryChecklistTestsShell {
  protected readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
  protected readonly emphasizeInvalid = signal<boolean>(false);
  protected readonly showStatusBackground = signal<boolean>(false);
  protected readonly isEditable = signal<boolean>(false);

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

  protected useFlatItems(): void {
    this.items.set([
      { id: 'a', label: 'Item A', status: 'not-started' },
      { id: 'b', label: 'Item B', status: 'valid' },
      { id: 'c', label: 'Item C', status: 'invalid' },
    ]);
  }

  protected useSingleItem(): void {
    this.items.set([{ id: 'only', label: 'Only one', status: 'not-started' }]);
  }

  protected useSingleItemWithStatus(status: ChecklistItemData['status']): void {
    this.items.set([{ id: 'a', label: 'Item A', status }]);
  }

  protected useItemWithMeta(): void {
    this.items.set([{ id: 'a', label: 'Item A', status: 'valid', meta: '1.2s' }]);
  }

  protected useParentWithCount(): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent',
        status: 'in-progress',
        count: '2/4',
        items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
      },
    ]);
  }

  protected useParentSimple(): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent',
        status: 'in-progress',
        items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
      },
    ]);
  }

  protected useNestedMixed(): void {
    this.items.set([
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
    ]);
  }

  protected useNestedAllStatus(
    firstChildStatus: ChecklistItemData['status'],
    secondChildStatus: ChecklistItemData['status']
  ): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent',
        status: 'in-progress',
        items: [
          { id: 'a-1', label: 'Child One', status: firstChildStatus },
          { id: 'a-2', label: 'Child Two', status: secondChildStatus },
        ],
      },
    ]);
  }

  protected useNestedWithInvalid(): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent',
        status: 'invalid',
        items: [
          { id: 'a-1', label: 'Child One', status: 'not-started' },
          { id: 'a-2', label: 'Child Two', status: 'invalid' },
        ],
      },
    ]);
  }

  protected useNestedWithInProgress(): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent',
        status: 'in-progress',
        items: [
          { id: 'a-1', label: 'Child One', status: 'not-started' },
          { id: 'a-2', label: 'Child Two', status: 'in-progress' },
        ],
      },
    ]);
  }

  protected useNestedSingleStatusChild(childStatus: ChecklistItemData['status']): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent',
        status: childStatus,
        items: [{ id: 'a-1', label: 'Child', status: childStatus }],
      },
    ]);
  }

  protected useTwoParents(): void {
    this.items.set([
      {
        id: 'a',
        label: 'Parent A',
        status: 'in-progress',
        items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
      },
      {
        id: 'b',
        label: 'Parent B',
        status: 'in-progress',
        items: [{ id: 'b-1', label: 'Child', status: 'not-started' }],
      },
    ]);
  }
}

const meta: Meta = {
  title: 'Core/Components/Checklist/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-checklist-tests-shell />`,
  moduleMetadata: { imports: [StoryChecklistTestsShell] },
});

export const AppliesListRoleOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await expect(host.getAttribute('role')).toBe('list');
  },
};

export const OmitsDataAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await expect(host.getAttribute('data-emphasize-invalid')).toBeNull();
    await expect(host.getAttribute('data-status-background')).toBeNull();
    await expect(host.getAttribute('data-editable')).toBeNull();
  },
};

export const ReflectsEmphasizeInvalidAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-emphasize-invalid-on'));

    await waitFor(() => expect(host.getAttribute('data-emphasize-invalid')).toBe(''));
  },
};

export const ReflectsStatusBackgroundAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-status-background-on'));

    await waitFor(() => expect(host.getAttribute('data-status-background')).toBe(''));
  },
};

export const ReflectsEditableAttributeForwardedToBrain: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));

    await waitFor(() => expect(host.getAttribute('data-editable')).toBe(''));
  },
};

export const RendersOneChecklistItemPerItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-items-flat'));

    const host = await canvas.findByTestId('checklist');

    await waitFor(() => expect(host.querySelectorAll('org-checklist-item').length).toBe(3));
  },
};

export const UpdatesRenderedItemsWhenItemsModelChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-flat'));
    await waitFor(() => expect(host.querySelectorAll('org-checklist-item').length).toBe(3));

    await userEvent.click(canvas.getByTestId('ctl-items-single'));
    await waitFor(() => expect(host.querySelectorAll('org-checklist-item').length).toBe(1));
  },
};

export const AppliesListitemRoleOnItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const item = host.querySelector('org-checklist-item') as HTMLElement;

    await expect(item.getAttribute('role')).toBe('listitem');
  },
};

export const ReflectsItemStatusOnDataStatus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-status-in-progress'));

    await waitFor(() => {
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('in-progress');
    });
  },
};

export const UpdatesDataStatusWhenItemStatusChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-status-in-progress'));

    await waitFor(() => {
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('in-progress');
    });

    await userEvent.click(canvas.getByTestId('ctl-items-status-valid'));

    await waitFor(() => {
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('valid');
    });
  },
};

export const OmitsDataExpandedWhenNotExpanded: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const item = host.querySelector('org-checklist-item') as HTMLElement;

    await expect(item.getAttribute('data-expanded')).toBeNull();
  },
};

export const RendersLeafAsStaticDivWhenNotEditable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const item = host.querySelector('org-checklist-item') as HTMLElement;

    await expect(item.querySelector('button')).toBeNull();
    await expect(item.querySelector('div.row')).not.toBeNull();
  },
};

export const RendersLeafAsButtonWhenEditable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));

    await waitFor(() => {
      const item = host.querySelector('org-checklist-item') as HTMLElement;

      expect(item.querySelector('button.row')).not.toBeNull();
    });
  },
};

export const EditableNotStartedLeafIsNotAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));

    await waitFor(() => {
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBeNull();
    });
  },
};

export const EditableInProgressLeafIsAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-status-in-progress'));

    await waitFor(() => {
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const EditableInvalidLeafIsAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-status-invalid'));

    await waitFor(() => {
      const button = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const ParentRowIsButtonWithAriaExpandedEvenWhenNotEditable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-parent-simple'));

    await waitFor(() => {
      const button = host.querySelector('org-checklist-item > button.row') as HTMLButtonElement;

      expect(button).not.toBeNull();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  },
};

export const DoesNotRenderMetaSpanWhenMetaOmitted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const item = host.querySelector('org-checklist-item') as HTMLElement;

    await expect(item.querySelector('.meta')).toBeNull();
  },
};

export const RendersMetaTextWhenProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-with-meta'));

    await waitFor(() => {
      const meta = host.querySelector('org-checklist-item .meta') as HTMLElement;

      expect(meta.textContent?.trim()).toBe('1.2s');
    });
  },
};

export const RendersCountPillTextOnParentRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-parent-with-count'));

    await waitFor(() => {
      const count = host.querySelector('org-checklist-item .count') as HTMLElement;

      expect(count.textContent?.trim()).toBe('2/4');
    });
  },
};

export const ParentRowExpandToggleFlipsAriaExpandedAndDataExpanded: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-parent-simple'));

    const item = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item') as HTMLElement;

      expect(candidate.querySelector('button.row')).not.toBeNull();

      return candidate;
    });
    const button = item.querySelector('button.row') as HTMLButtonElement;

    await expect(button.getAttribute('aria-expanded')).toBe('false');
    await expect(item.getAttribute('data-expanded')).toBeNull();

    await userEvent.click(button);

    await waitFor(() => {
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(item.getAttribute('data-expanded')).toBe('');
    });

    await userEvent.click(button);

    await waitFor(() => {
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(item.getAttribute('data-expanded')).toBeNull();
    });
  },
};

export const TracksMultipleExpandedParentRowsIndependently: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-two-parents'));

    await waitFor(() => expect(host.querySelectorAll('org-checklist-item').length).toBe(2));

    const items = host.querySelectorAll('org-checklist-item');
    const firstButton = (items[0] as HTMLElement).querySelector('button.row') as HTMLButtonElement;
    const secondButton = (items[1] as HTMLElement).querySelector('button.row') as HTMLButtonElement;

    await userEvent.click(firstButton);
    await userEvent.click(secondButton);

    await waitFor(() => {
      expect(items[0].getAttribute('data-expanded')).toBe('');
      expect(items[1].getAttribute('data-expanded')).toBe('');
    });
  },
};

export const EditableLeafClickFlipsNotStartedToValid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));

    const button = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(button);

    await waitFor(() => expect(readout.textContent).toContain('a=valid'));
  },
};

export const EditableLeafClickFlipsValidBackToNotStarted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-status-valid'));

    const button = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(button);

    await waitFor(() => expect(readout.textContent).toContain('a=not-started'));
  },
};

export const EditableLeafClickDoesNotFlipInProgress: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-status-in-progress'));

    const button = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(button);

    await expect(readout.textContent).toContain('a=in-progress');
  },
};

export const EditableLeafClickDoesNotFlipInvalid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-status-invalid'));

    const button = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(button);

    await expect(readout.textContent).toContain('a=invalid');
  },
};

export const NonEditableLeafIsNotInteractive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    const row = host.querySelector('org-checklist-item div.row') as HTMLElement;

    await userEvent.click(row);

    await expect(readout.textContent).toContain('a=not-started');
  },
};

export const ParentRowIsNotDirectlyTogglableForStatus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-all-not-started'));

    const parentButton = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item > button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(parentButton);

    // parent click only toggles expanded — status stays parent-derived
    await expect(readout.textContent).toContain('a=in-progress[a-1=not-started,a-2=not-started]');
  },
};

export const RendersOneNestedItemPerChild: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-nested-mixed'));

    await waitFor(() => {
      const nested = host.querySelectorAll('org-checklist-item .children .nested-item');

      expect(nested.length).toBe(3);
    });
  },
};

export const ReflectsEachChildStatusOnNestedItemDataStatus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-nested-mixed'));

    await waitFor(() => {
      const nested = host.querySelectorAll<HTMLElement>('org-checklist-item .children .nested-item');

      expect(nested[0].getAttribute('data-status')).toBe('not-started');
      expect(nested[1].getAttribute('data-status')).toBe('valid');
      expect(nested[2].getAttribute('data-status')).toBe('invalid');
    });
  },
};

export const RendersNestedChildrenAsStaticDivsWhenNotEditable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-nested-mixed'));

    await waitFor(() => {
      const nested = host.querySelectorAll<HTMLElement>('org-checklist-item .children .nested-item');

      expect(nested[0].querySelector('button')).toBeNull();
      expect(nested[0].querySelector('div.row')).not.toBeNull();
    });
  },
};

export const RendersNestedChildrenAsButtonsWhenEditableMarksAriaDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-mixed'));

    await waitFor(() => {
      const nested = host.querySelectorAll<HTMLElement>('org-checklist-item .children .nested-item');
      const notStartedButton = nested[0].querySelector('button.row') as HTMLButtonElement;
      const validButton = nested[1].querySelector('button.row') as HTMLButtonElement;
      const invalidButton = nested[2].querySelector('button.row') as HTMLButtonElement;

      expect(notStartedButton).not.toBeNull();
      expect(notStartedButton.getAttribute('aria-disabled')).toBeNull();
      expect(validButton.getAttribute('aria-disabled')).toBeNull();
      expect(invalidButton.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const NestedChildToggleFlipsNotStartedToValid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-all-not-started'));

    const firstChildButton = await waitFor(() => {
      const candidate = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(firstChildButton);

    await waitFor(() => expect(readout.textContent).toContain('a-1=valid'));
  },
};

export const NestedChildInProgressIsNotTogglable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-single-in-progress-child'));

    const childButton = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item .children .nested-item button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(childButton);

    await expect(readout.textContent).toContain('a-1=in-progress');
  },
};

export const NestedChildInvalidIsNotTogglable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-single-invalid-child'));

    const childButton = await waitFor(() => {
      const candidate = host.querySelector('org-checklist-item .children .nested-item button.row') as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(childButton);

    await expect(readout.textContent).toContain('a-1=invalid');
  },
};

export const ParentStatusBecomesValidWhenAllChildrenValid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-valid-and-not-started'));

    const firstChildButton = await waitFor(() => {
      const candidate = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(firstChildButton);

    await waitFor(() => expect(readout.textContent).toContain('a=valid'));
  },
};

export const ParentStatusBecomesNotStartedWhenAllChildrenNotStarted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    // start with one valid and one not-started, parent is in-progress; toggling the valid back to
    // not-started should land the parent at not-started
    await userEvent.click(canvas.getByTestId('ctl-items-nested-valid-and-not-started'));

    const secondChildButton = await waitFor(() => {
      const candidate = host.querySelector(
        'org-checklist-item .children .nested-item:nth-child(2) button.row'
      ) as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(secondChildButton);

    await waitFor(() => expect(readout.textContent).toContain('a=not-started'));
  },
};

export const ParentStatusBecomesInProgressWhenChildrenMixed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-all-not-started'));

    const firstChildButton = await waitFor(() => {
      const candidate = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(firstChildButton);

    await waitFor(() => expect(readout.textContent).toContain('a=in-progress'));
  },
};

export const ParentStatusBecomesInProgressWhenAnyChildInProgress: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-with-in-progress'));

    // toggle the not-started child to valid; in-progress sibling forces parent to in-progress
    const firstChildButton = await waitFor(() => {
      const candidate = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(firstChildButton);

    await waitFor(() => expect(readout.textContent).toContain('a=in-progress'));
  },
};

export const ParentStatusStaysInvalidWhenAnyChildInvalid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-editable-on'));
    await userEvent.click(canvas.getByTestId('ctl-items-nested-with-invalid'));

    // toggle the togglable not-started child; invalid sibling locks parent to invalid
    const firstChildButton = await waitFor(() => {
      const candidate = host.querySelector(
        'org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      expect(candidate).not.toBeNull();

      return candidate;
    });

    await userEvent.click(firstChildButton);

    await waitFor(() => expect(readout.textContent).toContain('a=invalid'));
  },
};

export const StatusIconRendersCircleForNotStarted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');
    const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;

    await expect(statusIcon.getAttribute('data-status')).toBe('not-started');

    const icon = statusIcon.querySelector(':scope > org-icon');

    await expect(icon).not.toBeNull();
    await expect(icon?.getAttribute('name')).toBe('circle');
    await expect(statusIcon.querySelector(':scope > org-loading-spinner')).toBeNull();
  },
};

export const StatusIconRendersLoadingSpinnerForInProgress: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-status-in-progress'));

    await waitFor(() => {
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;

      expect(statusIcon.getAttribute('data-status')).toBe('in-progress');
      expect(statusIcon.querySelector(':scope > org-loading-spinner')).not.toBeNull();
      expect(statusIcon.querySelector(':scope > org-icon')).toBeNull();
    });
  },
};

export const StatusIconRendersCheckForValid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-status-valid'));

    await waitFor(() => {
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;
      const icon = statusIcon.querySelector(':scope > org-icon');

      expect(statusIcon.getAttribute('data-status')).toBe('valid');
      expect(icon?.getAttribute('name')).toBe('check');
    });
  },
};

export const StatusIconRendersXForInvalid: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checklist');

    await userEvent.click(canvas.getByTestId('ctl-items-status-invalid'));

    await waitFor(() => {
      const statusIcon = host.querySelector('org-checklist-status-icon') as HTMLElement;
      const icon = statusIcon.querySelector(':scope > org-icon');

      expect(statusIcon.getAttribute('data-status')).toBe('invalid');
      expect(icon?.getAttribute('name')).toBe('x');
    });
  },
};

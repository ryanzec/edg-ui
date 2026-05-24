import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect } from 'vitest';

import { Checklist, type ChecklistItemData, type ChecklistItemStatus } from './checklist';
import { ChecklistStatusIcon } from './checklist-status-icon';

describe('Checklist', () => {
  describe('host attributes', () => {
    @Component({
      selector: 'test-checklist-host-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: `
        <org-checklist
          [items]="items()"
          (itemsChange)="items.set($event)"
          [emphasizeInvalid]="emphasizeInvalid()"
          [showStatusBackground]="showStatusBackground()"
          [isEditable]="isEditable()"
          data-testid="checklist"
        />
      `,
    })
    class ChecklistHostAttrsHost {
      public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
      public readonly emphasizeInvalid = signal<boolean>(false);
      public readonly showStatusBackground = signal<boolean>(false);
      public readonly isEditable = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ChecklistHostAttrsHost>;
    let component: ChecklistHostAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistHostAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistHostAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the list role on the host element', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checklist"]') as HTMLElement;

      expect(host.getAttribute('role')).toBe('list');
    });

    it('omits data-emphasize-invalid, data-status-background, and data-editable by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checklist"]') as HTMLElement;

      expect(host.getAttribute('data-emphasize-invalid')).toBeNull();
      expect(host.getAttribute('data-status-background')).toBeNull();
      expect(host.getAttribute('data-editable')).toBeNull();
    });

    it('reflects data-emphasize-invalid when the emphasizeInvalid input is true', async () => {
      component.emphasizeInvalid.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checklist"]') as HTMLElement;

      expect(host.getAttribute('data-emphasize-invalid')).toBe('');
    });

    it('reflects data-status-background when the showStatusBackground input is true', async () => {
      component.showStatusBackground.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checklist"]') as HTMLElement;

      expect(host.getAttribute('data-status-background')).toBe('');
    });

    it('reflects data-editable when the isEditable input forwarded to the brain is true', async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checklist"]') as HTMLElement;

      expect(host.getAttribute('data-editable')).toBe('');
    });
  });

  describe('items rendering', () => {
    @Component({
      selector: 'test-checklist-items-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: ` <org-checklist [items]="items()" (itemsChange)="items.set($event)" data-testid="checklist" /> `,
    })
    class ChecklistItemsHost {
      public readonly items = signal<ChecklistItemData[]>([
        { id: 'a', label: 'Item A', status: 'not-started' },
        { id: 'b', label: 'Item B', status: 'valid' },
        { id: 'c', label: 'Item C', status: 'invalid' },
      ]);
    }

    let fixture: ComponentFixture<ChecklistItemsHost>;
    let component: ChecklistItemsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders one org-checklist-item per item in the items model', () => {
      const items = fixture.nativeElement.querySelectorAll('[data-testid="checklist"] org-checklist-item');

      expect(items.length).toBe(3);
    });

    it('updates the rendered items when the items model changes', async () => {
      component.items.set([{ id: 'only', label: 'Only one', status: 'not-started' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('[data-testid="checklist"] org-checklist-item');

      expect(items.length).toBe(1);
    });
  });
});

describe('ChecklistItem', () => {
  describe('host attributes', () => {
    @Component({
      selector: 'test-checklist-item-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: ` <org-checklist [items]="items()" (itemsChange)="items.set($event)" data-testid="checklist" /> `,
    })
    class ChecklistItemAttrsHost {
      public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'in-progress' }]);
    }

    let fixture: ComponentFixture<ChecklistItemAttrsHost>;
    let component: ChecklistItemAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the listitem role on the host element', () => {
      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.getAttribute('role')).toBe('listitem');
    });

    it('reflects the item status on the data-status attribute', () => {
      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('in-progress');
    });

    it('updates data-status when the item status changes', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'valid' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-status')).toBe('valid');
    });

    it('omits data-expanded when the item is not expanded', () => {
      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.getAttribute('data-expanded')).toBeNull();
    });
  });

  describe('row variants', () => {
    @Component({
      selector: 'test-checklist-item-variants-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: `
        <org-checklist
          [items]="items()"
          (itemsChange)="items.set($event)"
          [isEditable]="isEditable()"
          data-testid="checklist"
        />
      `,
    })
    class ChecklistItemVariantsHost {
      public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
      public readonly isEditable = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ChecklistItemVariantsHost>;
    let component: ChecklistItemVariantsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemVariantsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemVariantsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders a leaf as a static div when the checklist is not editable and has no children', () => {
      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.querySelector('button')).toBeNull();
      expect(item.querySelector('div.row')).not.toBeNull();
    });

    it('renders a leaf as a button when the checklist is editable', async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.querySelector('button.row')).not.toBeNull();
    });

    it('does not mark an editable not-started leaf as aria-disabled', async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBeNull();
    });

    it('marks an editable in-progress leaf as aria-disabled', async () => {
      component.isEditable.set(true);
      component.items.set([{ id: 'a', label: 'Item A', status: 'in-progress' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('marks an editable invalid leaf as aria-disabled', async () => {
      component.isEditable.set(true);
      component.items.set([{ id: 'a', label: 'Item A', status: 'invalid' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('renders a parent row as a button with aria-expanded even when not editable', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'in-progress',
          items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item > button.row'
      ) as HTMLButtonElement;

      expect(button).not.toBeNull();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('count and meta rendering', () => {
    @Component({
      selector: 'test-checklist-item-count-meta-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: ` <org-checklist [items]="items()" (itemsChange)="items.set($event)" data-testid="checklist" /> `,
    })
    class ChecklistItemCountMetaHost {
      public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
    }

    let fixture: ComponentFixture<ChecklistItemCountMetaHost>;
    let component: ChecklistItemCountMetaHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemCountMetaHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemCountMetaHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render the meta span when item.meta is omitted', () => {
      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;

      expect(item.querySelector('.meta')).toBeNull();
    });

    it('renders the meta text when item.meta is provided', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'valid', meta: '1.2s' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const meta = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item .meta'
      ) as HTMLElement;

      expect(meta.textContent?.trim()).toBe('1.2s');
    });

    it('renders the count pill text when item.count is provided on a parent row', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'in-progress',
          count: '2/4',
          items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      const count = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item .count'
      ) as HTMLElement;

      expect(count.textContent?.trim()).toBe('2/4');
    });
  });

  describe('parent row expand toggle', () => {
    @Component({
      selector: 'test-checklist-item-expand-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: ` <org-checklist [items]="items()" (itemsChange)="items.set($event)" data-testid="checklist" /> `,
    })
    class ChecklistItemExpandHost {
      public readonly items = signal<ChecklistItemData[]>([
        {
          id: 'a',
          label: 'Parent',
          status: 'in-progress',
          items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
        },
      ]);
    }

    let fixture: ComponentFixture<ChecklistItemExpandHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemExpandHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemExpandHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('flips aria-expanded and data-expanded when the parent row button is clicked', async () => {
      const item = fixture.nativeElement.querySelector('[data-testid="checklist"] org-checklist-item') as HTMLElement;
      const button = item.querySelector('button.row') as HTMLButtonElement;

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(item.getAttribute('data-expanded')).toBeNull();

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(item.getAttribute('data-expanded')).toBe('');

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(item.getAttribute('data-expanded')).toBeNull();
    });
  });

  describe('leaf editable status toggle', () => {
    @Component({
      selector: 'test-checklist-item-leaf-toggle-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: `
        <org-checklist
          [items]="items()"
          (itemsChange)="items.set($event)"
          [isEditable]="true"
          data-testid="checklist"
        />
      `,
    })
    class ChecklistItemLeafToggleHost {
      public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
    }

    let fixture: ComponentFixture<ChecklistItemLeafToggleHost>;
    let component: ChecklistItemLeafToggleHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemLeafToggleHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemLeafToggleHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('flips a not-started leaf to valid when the row is clicked', async () => {
      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('valid');
    });

    it('flips a valid leaf back to not-started when the row is clicked again', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'valid' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('not-started');
    });

    it('does not flip an in-progress leaf when the row is clicked', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'in-progress' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('in-progress');
    });

    it('does not flip an invalid leaf when the row is clicked', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'invalid' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item button.row'
      ) as HTMLButtonElement;

      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('invalid');
    });
  });

  describe('nested children', () => {
    @Component({
      selector: 'test-checklist-item-nested-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checklist],
      template: `
        <org-checklist
          [items]="items()"
          (itemsChange)="items.set($event)"
          [isEditable]="isEditable()"
          data-testid="checklist"
        />
      `,
    })
    class ChecklistItemNestedHost {
      public readonly items = signal<ChecklistItemData[]>([
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
      public readonly isEditable = signal<boolean>(false);
    }

    let fixture: ComponentFixture<ChecklistItemNestedHost>;
    let component: ChecklistItemNestedHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChecklistItemNestedHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistItemNestedHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders one li.nested-item per child in item.items', () => {
      const nested = fixture.nativeElement.querySelectorAll(
        '[data-testid="checklist"] org-checklist-item .children .nested-item'
      );

      expect(nested.length).toBe(3);
    });

    it('reflects each child status on its nested-item data-status attribute', () => {
      const nested: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(
        '[data-testid="checklist"] org-checklist-item .children .nested-item'
      );

      expect(nested[0].getAttribute('data-status')).toBe('not-started');
      expect(nested[1].getAttribute('data-status')).toBe('valid');
      expect(nested[2].getAttribute('data-status')).toBe('invalid');
    });

    it('renders nested children as static divs when not editable', () => {
      const nested: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(
        '[data-testid="checklist"] org-checklist-item .children .nested-item'
      );

      expect(nested[0].querySelector('button')).toBeNull();
      expect(nested[0].querySelector('div.row')).not.toBeNull();
    });

    it('renders nested children as buttons when editable, marking non-togglable statuses as aria-disabled', async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const nested: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(
        '[data-testid="checklist"] org-checklist-item .children .nested-item'
      );

      const notStartedButton = nested[0].querySelector('button.row') as HTMLButtonElement;
      const validButton = nested[1].querySelector('button.row') as HTMLButtonElement;
      const invalidButton = nested[2].querySelector('button.row') as HTMLButtonElement;

      expect(notStartedButton).not.toBeNull();
      expect(notStartedButton.getAttribute('aria-disabled')).toBeNull();
      expect(validButton.getAttribute('aria-disabled')).toBeNull();
      expect(invalidButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('toggles a nested not-started child to valid and recomputes the parent status when clicked', async () => {
      component.isEditable.set(true);
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'not-started',
          items: [
            { id: 'a-1', label: 'Child One', status: 'not-started' },
            { id: 'a-2', label: 'Child Two', status: 'not-started' },
          ],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      const firstChildButton = fixture.nativeElement.querySelector(
        '[data-testid="checklist"] org-checklist-item .children .nested-item:first-child button.row'
      ) as HTMLButtonElement;

      firstChildButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      const parent = component.items()[0];

      expect(parent.items?.[0].status).toBe('valid');
      expect(parent.status).toBe('in-progress');
    });
  });
});

describe('ChecklistStatusIcon', () => {
  @Component({
    selector: 'test-checklist-status-icon-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChecklistStatusIcon],
    template: `<org-checklist-status-icon [status]="status()" data-testid="status-icon" />`,
  })
  class ChecklistStatusIconHost {
    public readonly status = signal<ChecklistItemStatus>('not-started');
  }

  let fixture: ComponentFixture<ChecklistStatusIconHost>;
  let component: ChecklistStatusIconHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistStatusIconHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistStatusIconHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('reflects the status input on the host data-status attribute', async () => {
    component.status.set('valid');
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="status-icon"]') as HTMLElement;

    expect(host.getAttribute('data-status')).toBe('valid');
  });

  it('renders the circle icon as a direct child for the not-started status', () => {
    const host = fixture.nativeElement.querySelector('[data-testid="status-icon"]') as HTMLElement;
    const icon = host.querySelector(':scope > org-icon');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('name')).toBe('circle');
    expect(host.querySelector(':scope > org-loading-spinner')).toBeNull();
  });

  it('renders the loading-spinner as a direct child for the in-progress status', async () => {
    component.status.set('in-progress');
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="status-icon"]') as HTMLElement;

    expect(host.querySelector(':scope > org-loading-spinner')).not.toBeNull();
    expect(host.querySelector(':scope > org-icon')).toBeNull();
  });

  it('renders the check icon as a direct child for the valid status', async () => {
    component.status.set('valid');
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="status-icon"]') as HTMLElement;
    const icon = host.querySelector(':scope > org-icon');

    expect(icon?.getAttribute('name')).toBe('check');
  });

  it('renders the x icon as a direct child for the invalid status', async () => {
    component.status.set('invalid');
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-testid="status-icon"]') as HTMLElement;
    const icon = host.querySelector(':scope > org-icon');

    expect(icon?.getAttribute('name')).toBe('x');
  });
});

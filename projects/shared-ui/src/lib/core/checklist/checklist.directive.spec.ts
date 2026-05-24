import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect } from 'vitest';

import type { ChecklistItemData } from './checklist';
import { ChecklistBrainDirective } from './checklist-brain';
import { ChecklistItemBrainDirective } from './checklist-item-brain';

describe('ChecklistBrainDirective', () => {
  @Component({
    selector: 'test-checklist-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChecklistBrainDirective],
    template: `
      <div
        orgChecklistBrain
        #brain="orgChecklistBrain"
        [items]="items()"
        (itemsChange)="items.set($event)"
        [isEditable]="isEditable()"
        data-testid="brain"
      ></div>
    `,
  })
  class ChecklistBrainHost {
    public readonly items = signal<ChecklistItemData[]>([]);
    public readonly isEditable = signal<boolean>(false);

    public readonly brain = viewChild.required<ChecklistBrainDirective>('brain');
  }

  let fixture: ComponentFixture<ChecklistBrainHost>;
  let component: ChecklistBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('expandedIds and toggleExpanded', () => {
    it('starts with an empty expandedIds set', () => {
      expect(component.brain().expandedIds().size).toBe(0);
    });

    it('adds an id on first toggleExpanded and removes it on the second', () => {
      component.brain().toggleExpanded('a');

      expect(component.brain().expandedIds().has('a')).toBe(true);

      component.brain().toggleExpanded('a');

      expect(component.brain().expandedIds().has('a')).toBe(false);
    });

    it('tracks multiple expanded ids independently', () => {
      component.brain().toggleExpanded('a');
      component.brain().toggleExpanded('b');

      const expanded = component.brain().expandedIds();

      expect(expanded.has('a')).toBe(true);
      expect(expanded.has('b')).toBe(true);
      expect(expanded.size).toBe(2);
    });
  });

  describe('toggleStatus on a top-level leaf', () => {
    beforeEach(async () => {
      component.isEditable.set(true);
      component.items.set([{ id: 'a', label: 'Item A', status: 'not-started' }]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('is a no-op when isEditable is false', async () => {
      component.isEditable.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('not-started');
    });

    it('flips not-started to valid', async () => {
      component.brain().toggleStatus('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('valid');
    });

    it('flips valid to not-started', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'valid' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('not-started');
    });

    it('does not toggle an in-progress status', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'in-progress' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('in-progress');
    });

    it('does not toggle an invalid status', async () => {
      component.items.set([{ id: 'a', label: 'Item A', status: 'invalid' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('invalid');
    });

    it('does not toggle a parent row directly', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'not-started',
          items: [{ id: 'a-1', label: 'Child', status: 'not-started' }],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('not-started');
      expect(component.items()[0].items?.[0].status).toBe('not-started');
    });
  });

  describe('toggleStatus on a nested child', () => {
    beforeEach(async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('flips a nested child not-started to valid', async () => {
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

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].items?.[0].status).toBe('valid');
    });

    it('does not toggle a nested child with in-progress status', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'in-progress',
          items: [{ id: 'a-1', label: 'Child', status: 'in-progress' }],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].items?.[0].status).toBe('in-progress');
    });

    it('does not toggle a nested child with invalid status', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'invalid',
          items: [{ id: 'a-1', label: 'Child', status: 'invalid' }],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].items?.[0].status).toBe('invalid');
    });
  });

  describe('parent status recomputation when a nested child toggles', () => {
    beforeEach(async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('sets parent to valid when all children become valid', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'in-progress',
          items: [
            { id: 'a-1', label: 'Child One', status: 'not-started' },
            { id: 'a-2', label: 'Child Two', status: 'valid' },
          ],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('valid');
    });

    it('sets parent to not-started when all children become not-started', async () => {
      component.items.set([
        {
          id: 'a',
          label: 'Parent',
          status: 'in-progress',
          items: [
            { id: 'a-1', label: 'Child One', status: 'valid' },
            { id: 'a-2', label: 'Child Two', status: 'not-started' },
          ],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('not-started');
    });

    it('sets parent to in-progress when children are a mix of valid and not-started', async () => {
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

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('in-progress');
    });

    it('keeps parent invalid when any child is invalid', async () => {
      component.items.set([
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
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('invalid');
    });

    it('sets parent to in-progress when any child is in-progress and none invalid', async () => {
      component.items.set([
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
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().toggleStatus('a-1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('in-progress');
    });
  });
});

describe('ChecklistItemBrainDirective', () => {
  @Component({
    selector: 'test-checklist-item-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChecklistBrainDirective, ChecklistItemBrainDirective],
    template: `
      <div
        orgChecklistBrain
        #parentBrain="orgChecklistBrain"
        [items]="items()"
        (itemsChange)="items.set($event)"
        [isEditable]="isEditable()"
      >
        <div orgChecklistItemBrain #itemBrain="orgChecklistItemBrain" [id]="itemId()"></div>
      </div>
    `,
  })
  class ChecklistItemBrainHost {
    public readonly items = signal<ChecklistItemData[]>([{ id: 'a', label: 'Item A', status: 'not-started' }]);
    public readonly isEditable = signal<boolean>(false);
    public readonly itemId = signal<string>('a');

    public readonly parentBrain = viewChild.required<ChecklistBrainDirective>('parentBrain');
    public readonly itemBrain = viewChild.required<ChecklistItemBrainDirective>('itemBrain');
  }

  let fixture: ComponentFixture<ChecklistItemBrainHost>;
  let component: ChecklistItemBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistItemBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistItemBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('isExpanded', () => {
    it('is false when the id is not in the parent brain expandedIds set', () => {
      expect(component.itemBrain().isExpanded()).toBe(false);
    });

    it('becomes true when the parent brain expands this item id', async () => {
      component.parentBrain().toggleExpanded('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.itemBrain().isExpanded()).toBe(true);
    });

    it('returns to false after the parent brain collapses this item id', async () => {
      component.parentBrain().toggleExpanded('a');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.itemBrain().isExpanded()).toBe(true);

      component.parentBrain().toggleExpanded('a');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.itemBrain().isExpanded()).toBe(false);
    });
  });

  describe('isEditable', () => {
    it('mirrors the parent brain isEditable state', async () => {
      expect(component.itemBrain().isEditable()).toBe(false);

      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.itemBrain().isEditable()).toBe(true);
    });
  });

  describe('toggle', () => {
    it('expands this item via the parent brain', async () => {
      component.itemBrain().toggle();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.parentBrain().expandedIds().has('a')).toBe(true);
    });

    it('collapses this item when called twice', async () => {
      component.itemBrain().toggle();
      fixture.detectChanges();
      await fixture.whenStable();

      component.itemBrain().toggle();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.parentBrain().expandedIds().has('a')).toBe(false);
    });
  });

  describe('toggleStatus', () => {
    it('delegates to the parent brain toggleStatus for this item id', async () => {
      component.isEditable.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.itemBrain().toggleStatus();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('valid');
    });

    it('is a no-op when the parent brain is not editable', async () => {
      component.itemBrain().toggleStatus();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.items()[0].status).toBe('not-started');
    });
  });
});

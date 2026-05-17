import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, it, expect } from 'vitest';

import { KanbanView } from './kanban-view';

describe('KanbanView', () => {
  let component: KanbanView;
  let fixture: ComponentFixture<KanbanView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanView],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

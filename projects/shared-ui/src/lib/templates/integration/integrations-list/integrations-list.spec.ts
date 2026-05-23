import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { IntegrationsList } from './integrations-list';

describe('IntegrationsList', () => {
  let component: IntegrationsList;
  let fixture: ComponentFixture<IntegrationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationsList],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

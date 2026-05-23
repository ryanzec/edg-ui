import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { IntegrationCardAvailable, type AvailableIntegration } from './integration-card-available';

describe('IntegrationCardAvailable', () => {
  let component: IntegrationCardAvailable;
  let fixture: ComponentFixture<IntegrationCardAvailable>;

  const mockIntegration: AvailableIntegration = {
    id: 'integration-google-calendar',
    name: 'Google Calendar',
    description: 'Create events from incidents and pull team availability into scheduling flows.',
    iconName: 'calendar',
    tags: [{ label: 'Calendar' }, { label: 'Productivity' }, { label: 'Google' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationCardAvailable],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationCardAvailable);
    fixture.componentRef.setInput('integration', mockIntegration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

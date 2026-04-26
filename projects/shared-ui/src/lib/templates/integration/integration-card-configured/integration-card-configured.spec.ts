import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { IntegrationCardConfigured, type Integration } from './integration-card-configured';

describe('IntegrationCardConfigured', () => {
  let component: IntegrationCardConfigured;
  let fixture: ComponentFixture<IntegrationCardConfigured>;

  const mockIntegration: Integration = {
    id: 'integration-1',
    name: 'Slack',
    workspace: 'acme-engineering',
    channel: '#deploys',
    description: 'Send deploy notifications and error alerts to team channels in real time.',
    iconName: 'arrow-down',
    status: 'active',
    tags: [{ label: 'Messaging' }, { label: 'Notifications' }, { label: 'Team' }],
    createdAt: DateTime.fromISO('2026-04-12T00:00:00Z'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationCardConfigured],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationCardConfigured);
    fixture.componentRef.setInput('integration', mockIntegration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

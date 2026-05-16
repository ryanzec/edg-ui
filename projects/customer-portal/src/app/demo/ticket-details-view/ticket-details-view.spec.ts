import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, it, expect } from 'vitest';

import { TicketDetailsView } from './ticket-details-view';

describe('TicketDetailsView', () => {
  let component: TicketDetailsView;
  let fixture: ComponentFixture<TicketDetailsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailsView],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

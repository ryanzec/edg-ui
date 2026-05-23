import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { UserDetails } from './user-details';
import { mayaBrennanUser } from './user-details-types';

describe('UserDetails', () => {
  let component: UserDetails;
  let fixture: ComponentFixture<UserDetails>;

  beforeEach(async () => {
    // jsdom does not provide IntersectionObserver, which UserDetails instantiates in ngAfterViewInit
    globalThis.IntersectionObserver = class {
      public readonly root = null;
      public readonly rootMargin = '';
      public readonly thresholds: readonly number[] = [];
      public observe(): void {}
      public unobserve(): void {}
      public disconnect(): void {}
      public takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [UserDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetails);
    fixture.componentRef.setInput('user', mayaBrennanUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

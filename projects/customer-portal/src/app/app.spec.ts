import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  AUTHENTICATION_API_URL,
  DEFAULT_VIEW_ROUTE,
  LAUNCH_DARKLY_CLIENT_ID,
  LOCAL_STORAGE_SESSION_USER_KEY,
} from '@organization/shared-ui';
import { beforeEach, describe, it, expect } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AUTHENTICATION_API_URL, useValue: 'http://test.local/authentication' },
        { provide: LOCAL_STORAGE_SESSION_USER_KEY, useValue: 'test-session-user' },
        { provide: LAUNCH_DARKLY_CLIENT_ID, useValue: 'test-launch-darkly-client-id' },
        { provide: DEFAULT_VIEW_ROUTE, useValue: '/home' },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });
});

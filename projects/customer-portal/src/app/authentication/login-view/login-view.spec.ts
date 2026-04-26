import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { signal } from '@angular/core';

import { LoginView } from './login-view';
import { AuthenticationManager } from '@organization/shared-ui';
import { AuthenticationAuthenticateRequest } from '@organization/shared-types';

describe('LoginView', () => {
  let component: LoginView;
  let fixture: ComponentFixture<LoginView>;
  let router: Router;
  let authenticationManager: AuthenticationManager;

  const mockAuthenticationManager = {
    isAuthenticated: signal(false),
    error: signal<string | null>(null),
    authenticate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginView],
      providers: [
        provideRouter([{ path: 'home', component: class {} }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthenticationManager, useValue: mockAuthenticationManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginView);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authenticationManager = TestBed.inject(AuthenticationManager);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockAuthenticationManager.isAuthenticated.set(false);
    mockAuthenticationManager.error.set(null);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render login form', () => {
      fixture.detectChanges();
      const loginForm = fixture.nativeElement.querySelector('org-login-form');
      expect(loginForm).toBeTruthy();
    });
  });

  describe('Authentication Effects', () => {
    it('should navigate to home when user becomes authenticated', () => {
      fixture.detectChanges();

      mockAuthenticationManager.isAuthenticated.set(true);
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not navigate when user is not authenticated', () => {
      fixture.detectChanges();

      mockAuthenticationManager.isAuthenticated.set(false);
      fixture.detectChanges();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message in snackbar when error occurs', () => {
      const errorMessage = 'Invalid credentials';
      fixture.detectChanges();

      mockAuthenticationManager.error.set(errorMessage);
      fixture.detectChanges();
    });

    it('should not display snackbar when no error exists', () => {
      fixture.detectChanges();

      mockAuthenticationManager.error.set(null);
      fixture.detectChanges();
    });

    it('should display snackbar with correct configuration', () => {
      const errorMessage = 'Network error';
      fixture.detectChanges();

      mockAuthenticationManager.error.set(errorMessage);
      fixture.detectChanges();
    });
  });

  describe('Login Submission', () => {
    it('should call authentication store when login form is submitted', () => {
      const loginRequest: AuthenticationAuthenticateRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      component.onLoginSubmit(loginRequest);

      expect(authenticationManager.authenticate).toHaveBeenCalledWith(loginRequest);
    });

    it('should be called when login form emits loginSubmitted event', () => {
      const loginRequest: AuthenticationAuthenticateRequest = {
        email: 'user@example.com',
        password: 'securepassword',
      };

      vi.spyOn(component, 'onLoginSubmit');
      fixture.detectChanges();

      const loginForm = fixture.nativeElement.querySelector('org-login-form');
      loginForm.dispatchEvent(new CustomEvent('loginSubmitted', { detail: loginRequest }));

      expect(component.onLoginSubmit).toHaveBeenCalledWith(loginRequest);
    });
  });
});

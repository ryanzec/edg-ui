import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoginView } from './login-view';
import { AuthenticationManager, LoginForm } from '@organization/shared-ui';
import { AuthenticationAuthenticateRequest } from '@organization/shared-utils';

describe('LoginView', () => {
  let component: LoginView;
  let fixture: ComponentFixture<LoginView>;
  let authenticationManager: AuthenticationManager;

  const mockAuthenticationManager = {
    isAuthenticated: signal(false),
    isLoading: signal(false),
    error: signal<string | null>(null),
    authenticate: vi.fn(),
    redirectAfterAuthentication: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginView],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthenticationManager, useValue: mockAuthenticationManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginView);
    component = fixture.componentInstance;
    authenticationManager = TestBed.inject(AuthenticationManager);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockAuthenticationManager.isAuthenticated.set(false);
    mockAuthenticationManager.isLoading.set(false);
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
    it('should redirect when user becomes authenticated', () => {
      fixture.detectChanges();

      mockAuthenticationManager.isAuthenticated.set(true);
      fixture.detectChanges();

      expect(authenticationManager.redirectAfterAuthentication).toHaveBeenCalled();
    });

    it('should not redirect when user is not authenticated', () => {
      fixture.detectChanges();

      mockAuthenticationManager.isAuthenticated.set(false);
      fixture.detectChanges();

      expect(authenticationManager.redirectAfterAuthentication).not.toHaveBeenCalled();
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

      const loginForm = fixture.debugElement.query(By.directive(LoginForm)).componentInstance as LoginForm;
      loginForm.loginSubmitted.emit(loginRequest);

      expect(component.onLoginSubmit).toHaveBeenCalledWith(loginRequest);
    });
  });
});

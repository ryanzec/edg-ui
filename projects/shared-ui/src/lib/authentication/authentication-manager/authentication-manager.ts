import { Injectable, signal, computed, inject, InjectionToken } from '@angular/core';
import { AuthenticationApi } from '../authentication-api/authentication-api';
import { AuthenticationAuthenticateRequest, ErrorMessage, User } from '@organization/shared-types';
import { catchError, of, tap, map, Observable, delay } from 'rxjs';
import { FeatureFlagStore } from '../../core/feature-flag-store/feature-flag-store';
import { LocalStorageManager } from '../../core/local-storage-manager/local-storage-manager';
import { emailUtils, logManager } from '@organization/shared-utils';
import { Router } from '@angular/router';

type AuthenticationState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
};

export const DEFAULT_VIEW_ROUTE = new InjectionToken<string>('Default View Route');
export const LAUNCH_DARKLY_CLIENT_ID = new InjectionToken<string>('Launch Darkly Client ID');
export const LOCAL_STORAGE_SESSION_USER_KEY = new InjectionToken<string>('Local Storage Session User Key');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationManager {
  private readonly _localStorageManager = inject(LocalStorageManager);
  private readonly _authenticationApi = inject(AuthenticationApi);
  private readonly _featureFlagStore = inject(FeatureFlagStore);
  private readonly _router = inject(Router);
  private readonly _sessionUserKey = inject(LOCAL_STORAGE_SESSION_USER_KEY);
  private readonly _launchDarklyClientId = inject(LAUNCH_DARKLY_CLIENT_ID);
  private readonly _defaultViewRoute = inject(DEFAULT_VIEW_ROUTE);

  private _afterAuthenticationRedirectToUrl: string | null = null;

  private readonly _state = signal<AuthenticationState>({
    isLoading: false,
    hasInitialized: false,
    user: null,
    error: null,
  });

  public readonly user = computed(() => this._state().user);
  public readonly isLoading = computed(() => this._state().isLoading);
  public readonly error = computed(() => this._state().error);
  public readonly isAuthenticated = computed(() => !!this._state().user);
  public readonly hasInitialized = computed(() => this._state().hasInitialized);

  public setAfterAuthenticationRedirectToUrl(url: string): void {
    this._afterAuthenticationRedirectToUrl = url;
  }

  public redirectAfterAuthentication(): void {
    this._router.navigate([this._afterAuthenticationRedirectToUrl || this._defaultViewRoute]);
  }

  public check(): void {
    this.checkAsync().subscribe();
  }

  public checkAsync(): Observable<boolean> {
    const user = this._localStorageManager.get<User>(this._sessionUserKey);

    if (!user) {
      // if the user is not locally stored we assume this is not previous logged in session so no error messaged nedded
      this._deauthenticateUser();

      return of(false);
    }

    this._state.update((state) => ({ ...state, isLoading: true, error: null }));

    return this._authenticationApi.check().pipe(
      delay(2000),
      map((response) => {
        const { data } = response ?? {};

        if (data?.status !== 'ok') {
          logManager.error({
            type: 'authentication-check-error',
            message: 'authentication check responded with a success but not ok status',
            response,
          });

          // @todo refactor this
          throw new Error(ErrorMessage.UNKNOWN);
        }

        this._authenticateUser(user, data.launchDarklyHash);

        return true;
      }),
      catchError((error) => {
        logManager.error({
          type: 'authentication-check-error',
          error,
        });

        this._deauthenticateUser(error.message || ErrorMessage.UNKNOWN);

        return of(false);
      })
    );
  }

  public authenticate(request: AuthenticationAuthenticateRequest): void {
    this._state.update((state) => ({ ...state, isLoading: true, error: null }));

    this._authenticationApi
      .authenticate(request)
      .pipe(
        tap((response) => {
          const { data } = response ?? {};

          if (!data?.user) {
            logManager.error({
              type: 'authentication-authenticate-error',
              message: 'authentication authenticate responded with a success but no user',
              error: response,
            });

            throw new Error(ErrorMessage.UNKNOWN);
          }

          this._authenticateUser(data.user, data.launchDarklyHash);
        }),
        catchError((error) => {
          this._deauthenticateUser(error.message || ErrorMessage.UNKNOWN);

          return of(null);
        })
      )
      .subscribe();
  }

  public logout(): void {
    this._deauthenticateUser();

    this._router.navigate(['/login']);
  }

  private _authenticateUser(user: User, launchDarklyHash: string): void {
    const launchDarklyContext = {
      kind: 'user',
      key: user.id,
      emailDomain: emailUtils.getDomain(user.email),
    };

    this._localStorageManager.set<User>(this._sessionUserKey, user);
    this._featureFlagStore.initialize(this._launchDarklyClientId, launchDarklyContext, launchDarklyHash);
    this._state.update((state) => ({ ...state, user, isLoading: false, hasInitialized: true, error: null }));
  }

  private _deauthenticateUser(error?: string): void {
    this._state.update((state) => ({
      ...state,
      isLoading: false,
      hasInitialized: true,
      user: null,
      error: error || null,
    }));
    this._localStorageManager.remove(this._sessionUserKey);
  }
}

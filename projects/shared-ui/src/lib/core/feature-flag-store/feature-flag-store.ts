import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { logManager } from '@organization/shared-utils';

/** available feature flags in the application */
export type FeatureFlag = 'internal-tools' | 'work-in-progress';

/** all available feature flag values */
export const allFeatureFlags: FeatureFlag[] = ['internal-tools', 'work-in-progress'];

const defaultFeatureFlags: Record<FeatureFlag, boolean> = {
  'internal-tools': false,
  'work-in-progress': false,
};

type FeatureFlagState = {
  isInitialized: boolean;
  featureFlags: Record<FeatureFlag, boolean>;
};

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagStore implements OnDestroy {
  /** launchdarkly client instance */
  private _client: LDClient.LDClient | undefined;

  /** unified internal state */
  private _state = signal<FeatureFlagState>({
    isInitialized: false,
    featureFlags: defaultFeatureFlags,
  });

  /** whether the store has been initialized */
  public readonly isInitialized = computed<boolean>(() => this._state().isInitialized);

  /** stores the provided launchdarkly client and wires up feature flag event listeners */
  public initialize(client: LDClient.LDClient): void {
    this._client = client;

    this._client.on('ready', () => {
      if (!this._client) {
        logManager.error({
          type: 'launchdarkly-not-initialized',
          message: 'launch darkly client triggered ready event but client is not initialized',
        });

        return;
      }

      logManager.log({
        type: 'launchdarkly-connected',
        wasAlreadyInitialized: this.isInitialized(),
      });

      const featureFlags = allFeatureFlags.reduce<Record<FeatureFlag, boolean>>(
        (collector, flag) => {
          collector[flag] = this._client!.variation(flag, false);

          return collector;
        },
        { ...defaultFeatureFlags }
      );

      logManager.log({
        type: 'feature-flags',
        featureFlags,
      });

      this._state.set({
        isInitialized: true,
        featureFlags,
      });
    });

    this._client.on('change', (changes) => {
      const newFeatureFlags: Partial<Record<FeatureFlag, boolean>> = {};
      const keys = Object.keys(changes);

      for (const key of keys) {
        if (allFeatureFlags.includes(key as FeatureFlag) === false) {
          continue;
        }

        const value = changes[key].current;

        if (typeof value !== 'boolean') {
          logManager.warn({
            type: 'launchdarkly-invalid-flag-value',
            key,
            value,
          });

          continue;
        }

        newFeatureFlags[key as FeatureFlag] = value;
      }

      this._state.update((state) => ({
        ...state,
        featureFlags: {
          ...state.featureFlags,
          ...newFeatureFlags,
        },
      }));
    });

    this._client.on('error', (error) => {
      logManager.error({
        type: 'launchdarkly-error',
        error,
      });
    });
  }

  /** returns whether the given feature flag is enabled */
  public has(featureFlag: FeatureFlag): boolean {
    return this._state().featureFlags[featureFlag] ?? false;
  }

  /** resets all feature flags to defaults and marks the store as uninitialized */
  public reset(): void {
    this._state.set({
      isInitialized: false,
      featureFlags: defaultFeatureFlags,
    });
  }

  /** closes the launchdarkly client on destroy */
  public ngOnDestroy(): void {
    this._client?.close();
  }
}

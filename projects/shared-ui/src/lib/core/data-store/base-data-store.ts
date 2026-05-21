import { signal, computed } from '@angular/core';
import { logManager } from '@organization/shared-utils';
import { ResponseMeta } from '@organization/shared-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { DataStoreLoadingState, DataStoreRemoteType, DataStoreRemoteState } from './types';

export type { DataStoreLoadingState, DataStoreRemoteState, DataStoreRemoteType as DataStoreMutationType };

type BaseDataStoreState<T, TMeta = ResponseMeta> = {
  data: T[];
  meta?: TMeta;
  error: string | null;
  hasInitialized: boolean;
  remoteState: DataStoreRemoteState;
  remoteType: DataStoreRemoteType;
  isStale: boolean;
  errors: Record<string, string | null>;
  previousMutation: string | null;
  activeMutation: string | null;
};

const generateDefaultDataStoreState = <T, TMeta = ResponseMeta>(): BaseDataStoreState<T, TMeta> => ({
  data: [],
  meta: undefined,
  error: null,
  hasInitialized: false,
  remoteState: 'idle',
  remoteType: null,
  isStale: false,
  errors: {},
  previousMutation: null,
  activeMutation: null,
});

export abstract class BaseDataStore<T, TMeta = ResponseMeta> {
  private readonly _idField: keyof T | undefined;
  private readonly _state = signal<BaseDataStoreState<T, TMeta>>(generateDefaultDataStoreState());

  /** returns the configured id field for this store */
  protected readonly idField = () => this._idField;

  /** the current list of data items in the store */
  public readonly data = computed(() => this._state().data);

  /** the current response metadata */
  public readonly meta = computed(() => this._state().meta);

  // @todo deprecated replace with errors
  /** @deprecated use errors instead. the current top-level error message */
  public readonly error = computed(() => this._state().error);

  /** whether the current data is stale and should be re-fetched */
  public readonly isStale = computed(() => this._state().isStale);

  /** keyed error messages from the most recent operation */
  public readonly errors = computed(() => this._state().errors);

  /** the name of the last completed mutation */
  public readonly previousMutation = computed(() => this._state().previousMutation);

  /** the name of the currently running mutation, or null if none */
  public readonly activeMutation = computed(() => this._state().activeMutation);

  /** whether the store has completed at least one load */
  public readonly hasInitialized = computed(() => this._state().hasInitialized);

  /** the current loading state of the store, accounting for initialization */
  public readonly loadingState = computed<DataStoreLoadingState>(() => {
    const remoteState = this._state().remoteState;
    const hasInitialized = this._state().hasInitialized;
    const remoteType = this._state().remoteType;

    if (hasInitialized && remoteType !== 'loading') {
      return 'idle';
    }

    if (hasInitialized === false && remoteState === 'idle') {
      return 'uninitialized';
    }

    if (hasInitialized === false && remoteState === 'pending') {
      return 'initializing';
    }

    return remoteState;
  });

  /** whether the store is currently in a loading or initializing state */
  public readonly isLoading = computed(() => {
    const state = this.loadingState();

    return state === 'pending' || state === 'initializing';
  });

  /** the current state of any running mutation */
  public readonly mutationState = computed<DataStoreLoadingState>(() => {
    const remoteState = this._state().remoteState;
    const remoteType = this._state().remoteType;

    if (remoteType !== 'mutation') {
      return 'idle';
    }

    return remoteState;
  });

  /** whether the store is currently in a mutation state */
  public readonly isMutating = computed(() => {
    const remoteType = this._state().remoteType;
    const state = this.mutationState();

    return remoteType === 'mutation' && state !== 'idle';
  });

  /** the type of the current remote operation */
  public readonly remoteType = computed(() => this._state().remoteType);

  /** the raw remote operation state */
  public readonly remoteState = computed(() => this._state().remoteState);

  constructor(idField: keyof T | undefined) {
    this._idField = idField;
  }

  /** manually marks the store as initialized */
  public markAsInitialized(): void {
    this._state.update((currentState) => ({
      ...currentState,
      hasInitialized: true,
    }));
  }

  /** resets the store to its default state */
  public reset(): void {
    this._state.set(generateDefaultDataStoreState());
  }

  /** begins a remote loading operation */
  protected startRemoteLoading(): void {
    this._state.update((currentState) => ({
      ...currentState,
      remoteType: 'loading',
      remoteState: 'pending',
      error: null,
    }));
  }

  /** ends a remote loading operation, optionally recording an error */
  protected endRemoteLoading(error: unknown = null, errorKey: string | null = null): void {
    let errorMessage = null;

    // since HttpErrorResponse only implement Error and not extend it, we need to fully process this as the if
    // condition below will not catch this
    if (error instanceof HttpErrorResponse) {
      errorMessage = logManager.getErrorMessage(error, { overrideMessage: error.error?.error?.message });
    }

    if (error instanceof Error && !errorMessage) {
      errorMessage = logManager.getErrorMessage(error);
    }

    if (errorKey) {
      this.setError(errorMessage, errorKey);
    }

    this._state.update((currentState) => ({
      ...currentState,
      hasInitialized: true,
      remoteType: null,
      remoteState: 'idle',
      error: errorKey ? currentState.error : errorMessage,
      isStale: !!errorMessage,
    }));
  }

  /** begins a named mutation operation */
  protected startMutation(mutationName: string): void {
    this._state.update((currentState) => ({
      ...currentState,
      remoteType: 'mutation',
      remoteState: 'pending',
      error: null,
      activeMutation: mutationName,
    }));
  }

  /** ends a named mutation operation, optionally recording an error */
  protected endMutation(mutationName: string, error: unknown = null, errorKey: string | null = null): void {
    let errorMessage = null;

    // since HttpErrorResponse only implement Error and not extend it, we need to fully process this as the if
    // condition below will not catch this
    if (error instanceof HttpErrorResponse) {
      errorMessage = logManager.getErrorMessage(error, { overrideMessage: error.error?.error?.message });
    }

    if (error instanceof Error && !errorMessage) {
      errorMessage = logManager.getErrorMessage(error);
    }

    if (errorKey) {
      this.setError(errorMessage, errorKey);
    }

    this._state.update((currentState) => {
      if (currentState.activeMutation !== mutationName) {
        logManager.warn({
          type: 'base-data-store-end-mutation-mismatch',
          activeMutation: currentState.activeMutation,
          endingMutation: mutationName,
        });
      }

      return {
        ...currentState,
        remoteType: null,
        remoteState: 'idle',
        error: errorKey ? currentState.error : errorMessage,
        isStale: !!errorMessage,
        previousMutation: currentState.activeMutation,
        activeMutation: null,
      };
    });
  }

  /** prepends items to the local data array without a remote call */
  public unshiftLocalData(items: T[]): void {
    this._state.update((currentState) => ({
      ...currentState,
      data: [...items, ...currentState.data],
    }));
  }

  /** appends items to the local data array without a remote call */
  public pushLocalData(items: T[]): void {
    this._state.update((currentState) => ({
      ...currentState,
      data: [...currentState.data, ...items],
    }));
  }

  /** updates a matching item in the local data array by id field */
  public updateLocalData(updateItem: T): void {
    const idField = this._idField;

    if (!idField) {
      logManager.log({
        type: 'base-data-store-update-local-data-error',
        message: 'Cannot update local data without an id field',
      });

      return;
    }

    this._state.update((currentState) => {
      const existingIndex = currentState.data.findIndex((item) => item[idField] === updateItem[idField]);

      if (existingIndex === -1) {
        return currentState;
      }

      const updatedItems = [...currentState.data];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        ...updateItem,
      };

      return {
        ...currentState,
        data: updatedItems,
      };
    });
  }

  /** removes an item from the local data array by id */
  public deleteLocalData(id: unknown): void {
    const idField = this._idField;

    if (!idField) {
      logManager.log({
        type: 'base-data-store-update-local-data-error',
        message: 'Cannot update local data without an id field',
      });

      return;
    }

    this._state.update((currentState) => {
      const updatedItems = currentState.data.filter((item) => item[idField] !== id);

      return {
        ...currentState,
        data: updatedItems,
      };
    });
  }

  /** replaces the local data array without a remote call */
  public setLocalData(data: T[]): void {
    this._state.update((currentState) => ({ ...currentState, data }));
  }

  /** replaces the local meta without a remote call */
  public setLocalMeta(meta: TMeta | undefined): void {
    this._state.update((currentState) => ({ ...currentState, meta }));
  }

  /** sets an error message, optionally scoped to a key */
  public setError(error: string | null, errorKey: string | null = null): void {
    this._state.update((currentState) => {
      if (errorKey) {
        return { ...currentState, errors: { ...currentState.errors, [errorKey]: error } };
      }

      return { ...currentState, error };
    });
  }

  /** clears an error message, optionally scoped to a key */
  public clearError(errorKey: string | null = null): void {
    this._state.update((currentState) => {
      if (errorKey) {
        return { ...currentState, errors: { ...currentState.errors, [errorKey]: null } };
      }

      return { ...currentState, error: null };
    });
  }

  /** clears all error messages including the top-level error */
  public clearErrors(): void {
    this._state.update((currentState) => ({ ...currentState, errors: {}, error: null }));
  }

  /** marks the current data as stale */
  public markAsStale(): void {
    this._state.update((currentState) => ({ ...currentState, isStale: true }));
  }

  /** marks the current data as fresh */
  public markAsFresh(): void {
    this._state.update((currentState) => ({ ...currentState, isStale: false }));
  }
}

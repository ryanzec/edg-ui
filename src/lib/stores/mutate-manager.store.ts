import { writable, type Readable } from 'svelte/store';

export type MutateManagerStore<TResponse> = {
  response?: TResponse;
  fetchingState: MutateFetchingState;
};

export enum MutateFetchingState {
  PROCESSING = 'processing',
  IDLE = 'idle',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type MutateManagerOptions<TResponse, TMutateInput = undefined> = {
  mutateQuery: (input: TMutateInput) => Promise<TResponse>;
  onSuccess?: (response: TResponse) => void;
  onFailure?: (error: unknown) => void;
};

export type MutateOptions<TResponse> = {
  onSuccess?: (response: TResponse) => void;
  onFailure?: (error: unknown) => void;
};

export type MutateManagerStoreInstance<TResponse, TMutateInput = undefined> = {
  subscribe: Readable<MutateManagerStore<TResponse>>['subscribe'];
  mutate: (input: TMutateInput, option?: MutateOptions<TResponse>) => Promise<void>;
};

export const createMutateManagerStore = <TResponse, TMutateInput = undefined>(
  options: MutateManagerOptions<TResponse, TMutateInput>,
): MutateManagerStoreInstance<TResponse, TMutateInput> => {
  const mutateQuery = options.mutateQuery;

  const store = writable<MutateManagerStore<TResponse>>({ fetchingState: MutateFetchingState.IDLE });

  const mutate = async (input: TMutateInput, mutateOptions: MutateOptions<TResponse> = {}) => {
    store.update((currentState) => {
      return {
        ...currentState,
        isLoading: true,
        fetchingState: MutateFetchingState.PROCESSING,
      };
    });

    let response: TResponse;

    try {
      response = await mutateQuery(input);
    } catch (error: unknown) {
      store.update((currentState) => {
        return {
          ...currentState,
          isLoading: false,
          fetchingState: MutateFetchingState.ERROR,
        };
      });

      mutateOptions.onFailure?.(error);
      options.onFailure?.(error);

      // since the manager might not have code to process the error, we log it to make sure it is not swallowed
      console.error(error);
      return;
    }

    store.update((currentState) => {
      return {
        ...currentState,
        response,
        fetchingState: MutateFetchingState.IDLE,
      };
    });

    mutateOptions.onSuccess?.(response);
    options.onSuccess?.(response);
  };

  return {
    subscribe: store.subscribe,
    mutate,
  };
};

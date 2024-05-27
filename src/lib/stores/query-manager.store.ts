import type { ResponseStructure } from '$lib/api/utils';
import { get, writable, type Readable } from 'svelte/store';

export type QueryPaginationData = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type QueryManagerStore<TResponse> = {
  initialLoadIsComplete: boolean;
  isLoading: boolean;
  response?: TResponse;
  fetchingState: QueryFetchingState;
  dataState: QueryDataState;
} & QueryPaginationData;

export type FetchQueryOptions = {
  limit: number;
  offset: number;
};

export enum QueryFetchingState {
  INITIAL_LOADING = 'initial-loading',
  PROCESSING = 'processing',
  IDLE = 'idle',
  ERROR = 'error',
}

export enum QueryDataState {
  NOT_LOADED = 'not-loaded',
  LOADED = 'loaded',
}

export type QueryOptions<TResponse> = {
  onSuccess?: (response: TResponse) => void;
  onFailure?: (error: unknown) => void;
};

export type QueryManagerOptions<TResponse> = {
  fetchQuery: (fetchOptions: FetchQueryOptions) => Promise<TResponse>;
  doInitialFetch?: boolean;
  onSuccess?: (response: TResponse) => void;
  onFailure?: (error: unknown) => void;
  limit?: number;
  initialOffset?: number;
  usePagination?: boolean;
};

const defaultGetPaginationData = <TResponse>(response: ResponseStructure<TResponse>): QueryPaginationData => {
  if (!response.meta?.currentPage || !response.meta?.totalPageCount) {
    return {
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  return {
    hasPreviousPage: response.meta.currentPage > 1,
    hasNextPage: response.meta.currentPage < response.meta.totalPageCount,
  };
};

export type QueryManagerStoreInstance<TResponse> = {
  subscribe: Readable<QueryManagerStore<TResponse>>['subscribe'];
  query: (options?: QueryOptions<TResponse>) => Promise<void>;
  queryNextPage: () => void;
  queryPreviousPage: () => void;
};

export const createQueryManagerStore = <TResponse>(
  options: QueryManagerOptions<TResponse>,
): QueryManagerStoreInstance<TResponse> => {
  const doInitialFetch = options.doInitialFetch !== false;
  const fetchQuery = options.fetchQuery;

  const fetchQueryOptions = writable<FetchQueryOptions>({
    limit: options.limit || 10,
    offset: options.initialOffset || 0,
  });
  const store = writable<QueryManagerStore<TResponse>>({
    initialLoadIsComplete: false,
    isLoading: false,
    fetchingState: QueryFetchingState.IDLE,
    dataState: QueryDataState.NOT_LOADED,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const query = async (queryOptions: QueryOptions<TResponse> = {}) => {
    store.update((currentState) => {
      return {
        ...currentState,
        isLoading: true,
        fetchingState: !currentState.initialLoadIsComplete
          ? QueryFetchingState.INITIAL_LOADING
          : QueryFetchingState.PROCESSING,
      };
    });

    let response: TResponse;

    try {
      response = await fetchQuery(get(fetchQueryOptions));
    } catch (error: unknown) {
      store.update((currentState) => {
        return {
          ...currentState,
          isLoading: false,
          fetchingState: QueryFetchingState.ERROR,
          dataState: QueryDataState.NOT_LOADED,
        };
      });

      queryOptions.onFailure?.(error);
      options.onFailure?.(error);

      // since the manager might not have code to process the error, we log it to make sure it is not swallowed
      console.error(error);
      return;
    }

    if (options.usePagination) {
      fetchQueryOptions.update((currentState) => {
        return {
          ...currentState,
          ...defaultGetPaginationData(response as ResponseStructure<TResponse>),
        };
      });
    }

    store.update((currentState) => {
      return {
        ...currentState,
        isLoading: false,
        initialLoadIsComplete: true,
        response,
        fetchingState: QueryFetchingState.IDLE,
        dataState: QueryDataState.LOADED,
      };
    });

    queryOptions.onSuccess?.(response);
    options.onSuccess?.(response);
  };

  const queryNextPage = () => {
    fetchQueryOptions.update((currentState) => {
      return {
        ...currentState,
        offset: currentState.offset + currentState.limit,
      };
    });
  };

  const queryPreviousPage = () => {
    fetchQueryOptions.update((currentState) => {
      return {
        ...currentState,
        offset: currentState.offset - currentState.limit,
      };
    });
  };

  if (doInitialFetch) {
    query();
  }

  return {
    subscribe: store.subscribe,
    query,
    queryNextPage,
    queryPreviousPage,
  };
};

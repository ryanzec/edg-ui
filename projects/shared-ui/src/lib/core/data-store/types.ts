/** the possible loading states for a data store */
export type DataStoreLoadingState = 'idle' | 'uninitialized' | 'initializing' | 'pending';

/** all possible values for DataStoreLoadingState */
export const allDataStoreLoadingStates = ['idle', 'uninitialized', 'initializing', 'pending'] as const;

/** the possible remote operation states for a data store */
export type DataStoreRemoteState = 'idle' | 'pending';

/** all possible values for DataStoreRemoteState */
export const allDataStoreRemoteStates = ['idle', 'pending'] as const;

/** the type of remote operation currently in progress */
export type DataStoreRemoteType = 'loading' | 'mutation' | null;

/** all possible values for DataStoreRemoteType */
export const allDataStoreRemoteTypes = ['loading', 'mutation'] as const;

import { inject, Injectable } from '@angular/core';
import {
  CreateUser,
  CreateUserResponse,
  DeleteUserResponse,
  GetUsersRequest,
  UpdateUser,
  UpdateUserResponse,
  User,
} from '@organization/shared-utils';
import { UsersApi } from '../users-api/users-api';
import { Observable, tap, map, catchError, of, EMPTY } from 'rxjs';
import { BaseCursorDataStore } from '../../core/data-store/base-cursor-data-store';
import { logManager } from '@organization/shared-utils';

const mutationType = {
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const;

@Injectable({
  providedIn: 'root',
})
export class UsersInfiniteDataStore extends BaseCursorDataStore<User> {
  private readonly _usersApi = inject(UsersApi);

  constructor() {
    super('id');
  }

  public loadData(requestData: GetUsersRequest = {}): void {
    const nextCursor = this.nextCursor();

    if (this.data().length > 0 && !nextCursor) {
      return;
    }

    const finalRequestData: GetUsersRequest = {
      limit: this.limit(),
      ...requestData,
    };

    if (this.data().length > 0 && nextCursor) {
      // NOTE: this is for test purpose since we technically does have curosr support in the backend yet
      finalRequestData.offset = +nextCursor;
    }

    this.fetch(finalRequestData);
  }

  public fetch(requestData: GetUsersRequest = {}) {
    this.startRemoteLoading();

    this._usersApi
      .getUsers(requestData)
      .pipe(
        map((response) => {
          const { data, meta, error } = response;

          if (error?.message || !data) {
            throw new Error(error?.message ?? 'No data returned from the server');
          }

          return { data, meta, error };
        }),
        tap(({ data, meta }) => {
          this.pushLocalData(data);
          this.setLocalMeta(meta);
          this.endRemoteLoading();
        }),
        catchError((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

          logManager.warn({
            type: 'users-fetch-error',
            message: errorMessage,
            error,
          });
          this.endRemoteLoading(error);

          // to avoid the error from killing the stream
          return EMPTY;
        })
      )
      .subscribe();
  }

  public create(user: CreateUser): Observable<CreateUserResponse> {
    this.startMutation(mutationType.create);

    return this._usersApi.createUser(user).pipe(
      map((response) => {
        const { data, meta, error } = response;

        if (error?.message || !data) {
          throw new Error(error?.message ?? 'No data returned from the server');
        }

        return { data, meta, error };
      }),
      tap((response) => {
        this.pushLocalData([response.data]);
        this.endMutation(mutationType.create);
      }),
      catchError((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

        logManager.warn({
          type: 'users-create-error',
          message: errorMessage,
          error,
        });

        this.endMutation(mutationType.create, error);

        // to avoid the error from killing the stream
        return EMPTY;
      })
    );
  }

  public update(user: UpdateUser): Observable<UpdateUserResponse> {
    this.startMutation(mutationType.update);

    return this._usersApi.updateUser(user).pipe(
      map((response) => {
        const { data, meta, error } = response ?? {};

        if (error?.message || !data) {
          throw new Error(error?.message ?? 'No data returned from the server');
        }

        return { data, meta, error };
      }),
      tap((response) => {
        this.updateLocalData(response.data);
        this.endMutation(mutationType.update);
      }),
      catchError((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

        logManager.warn({
          type: 'users-update-error',
          message: errorMessage,
          error,
        });

        this.endMutation(mutationType.update, error);

        // to avoid the error from killing the stream
        return EMPTY;
      })
    );
  }

  public delete(id: User['id']): Observable<DeleteUserResponse> {
    this.startMutation(mutationType.delete);

    return this._usersApi.deleteUser(id).pipe(
      map((response) => {
        const { data, meta, error } = response;

        if (error?.message || !data) {
          throw new Error(error?.message ?? 'No data returned from the server');
        }

        return { data, meta, error };
      }),
      tap(() => {
        this.deleteLocalData(id);
        this.endMutation(mutationType.delete);
      }),
      catchError((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

        logManager.warn({
          type: 'users-delete-error',
          message: errorMessage,
          error,
        });

        this.endMutation(mutationType.delete, error);

        return of({ data: undefined, error: { message: errorMessage } });
      })
    );
  }
}

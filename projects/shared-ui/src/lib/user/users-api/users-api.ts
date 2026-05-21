import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  CreateUser,
  CreateUserResponse,
  DeleteUserResponse,
  GetUsersRequest,
  GetUserResponse,
  GetUsersResponse,
  UpdateUser,
  UpdateUserResponse,
  User,
} from '@organization/shared-utils';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { httpUtils, logManager } from '@organization/shared-utils';

export const USERS_API_URL = new InjectionToken<string>('Users API URL');

@Injectable({
  providedIn: 'root',
})
export class UsersApi {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = inject(USERS_API_URL);

  public getUsers(requestData: GetUsersRequest): Observable<GetUsersResponse> {
    const params = httpUtils.buildHttpParams(requestData);

    return this._http.get<GetUsersResponse>(`${this._baseUrl}`, { params }).pipe(catchError(this._onError));
  }

  public getUser(id: string): Observable<GetUserResponse> {
    return this._http.get<GetUserResponse>(`${this._baseUrl}/${id}`).pipe(catchError(this._onError));
  }

  public createUser(user: CreateUser): Observable<CreateUserResponse> {
    return this._http.post<CreateUserResponse>(`${this._baseUrl}`, user).pipe(catchError(this._onError));
  }

  public updateUser(user: UpdateUser): Observable<UpdateUserResponse> {
    const { id, ...restOfUser } = user;

    return this._http.patch<UpdateUserResponse>(`${this._baseUrl}/${id}`, restOfUser).pipe(catchError(this._onError));
  }

  public deleteUser(id: User['id']): Observable<DeleteUserResponse> {
    return this._http.delete<DeleteUserResponse>(`${this._baseUrl}/${id}`).pipe(catchError(this._onError));
  }

  private _onError = (error: unknown): Observable<never> => {
    logManager.error({
      type: 'users-api-error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });

    return throwError(() => new Error('Request failed. Please try again later.'));
  };
}

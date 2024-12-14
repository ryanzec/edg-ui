import { HttpError } from '$lib/utils/error';

export type HttpRequest<TResponse> = Omit<RequestInit, 'credentials'> & {
  withCredentials?: boolean;
  // since this for an api request which can basically have any data, any is valid in this case

  payload?: Record<string, any>;

  urlSearchParams?: URLSearchParams;

  // should return false to prevent further processing of the error
  onError?: (response: Response, responseJson: TResponse) => Promise<boolean>;
};

export type GraphqlRequest<T, K = undefined> = Omit<RequestInit, 'credentials'> & {
  query: string;
  variables?: K;
  withCredentials?: boolean;

  // should return false to prevent further processing of the error
  onError?: (response: Response, responseJson: T) => Promise<boolean>;
};

export enum GraphqlErrorCode {
  AUTH_NOT_AUTHORIZED = 'AUTH_NOT_AUTHORIZED',
}

export enum HttpMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

// this handles generic requests so it needs to allow for any

const httpRequestInterceptors: Array<(requestOptions: HttpRequest<any>) => HttpRequest<any>> = [];
// this handles generic requests so it needs to allow for any

const httpResponseInterceptors: Array<(requestOptions: HttpRequest<any>, response: any) => any> = [];

const addHttpRequestInterceptor = <TResponse>(
  // this handles generic requests so it needs to allow for any

  interceptor: (requestOptions: HttpRequest<any>) => HttpRequest<TResponse>,
) => {
  httpRequestInterceptors.push(interceptor);
};

const removeHttpRequestInterceptor = <TResponse>(
  // this handles generic requests so it needs to allow for any

  interceptor: (requestOptions: HttpRequest<any>) => HttpRequest<TResponse>,
) => {
  httpRequestInterceptors.push(interceptor);
};

const processRequestInterceptors = <TResponse>(requestOptions: HttpRequest<TResponse>): HttpRequest<TResponse> => {
  if (httpRequestInterceptors.length === 0) {
    return requestOptions;
  }

  let modifiedRequestOptions = requestOptions;

  for (let i = 0; i < httpRequestInterceptors.length; i++) {
    modifiedRequestOptions = httpRequestInterceptors[i](modifiedRequestOptions);
  }

  return modifiedRequestOptions;
};

const addHttpResponseInterceptor = <TResponse>(
  // this handles generic requests so it needs to allow for any

  interceptor: (requestOptions: HttpRequest<any>, response: any) => TResponse,
) => {
  httpResponseInterceptors.push(interceptor);
};

const removeHttpResponseInterceptor = <TResponse>(
  // this handles generic requests so it needs to allow for any

  interceptor: (requestOptions: HttpRequest<any>, response: any) => TResponse,
) => {
  httpResponseInterceptors.push(interceptor);
};

const processResponseInterceptors = <TResponse>(
  requestOptions: HttpRequest<TResponse>,
  response: TResponse,
): TResponse => {
  if (httpResponseInterceptors.length === 0) {
    return response;
  }

  let modifiedResponse = response;

  for (let i = 0; i < httpResponseInterceptors.length; i++) {
    modifiedResponse = httpResponseInterceptors[i](requestOptions, modifiedResponse);
  }

  return modifiedResponse;
};

const http = async <TResponse>(url: string, requestOptions: HttpRequest<TResponse> = {}): Promise<TResponse> => {
  const finalRequestOptions = processRequestInterceptors(requestOptions);
  const { withCredentials, payload, headers, onError, ...defaultOptions } = finalRequestOptions;

  const fetchOptions: RequestInit = {
    ...defaultOptions,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: withCredentials !== false ? 'include' : 'same-origin',
    mode: 'cors',
  };

  if (payload) {
    fetchOptions.body = JSON.stringify(payload);
  }

  const finalUrl = requestOptions.urlSearchParams ? `${url}?${requestOptions.urlSearchParams.toString()}` : url;
  const response = await fetch(finalUrl, fetchOptions);
  const jsonResponse = await response.json();
  const finalJsonResponse = processResponseInterceptors(finalRequestOptions, jsonResponse);

  if (!response.ok) {
    let throwError = true;

    if (onError) {
      throwError = await onError(response, finalJsonResponse);
    }

    if (throwError) {
      throw new HttpError(response.status, {
        message: `http request failed with: ${response.status} ${response.statusText}`,
        context: {
          url,
          requestOptions,
          jsonResponse: finalJsonResponse,
        },
      });
    }
  }

  return finalJsonResponse;
};

export const httpUtils = {
  http,
  addHttpRequestInterceptor,
  addHttpResponseInterceptor,
  removeHttpRequestInterceptor,
  removeHttpResponseInterceptor,
};

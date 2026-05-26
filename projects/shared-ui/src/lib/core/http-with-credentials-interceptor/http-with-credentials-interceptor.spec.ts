import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { httpWithCredentialsInterceptor } from './http-with-credentials-interceptor';

describe('httpWithCredentialsInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpWithCredentialsInterceptor])), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('sets withCredentials to true on the outgoing request', () => {
    httpClient.get('/api/example').subscribe();

    const testRequest = httpTestingController.expectOne('/api/example');

    expect(testRequest.request.withCredentials).toBe(true);

    testRequest.flush({});
  });

  it('preserves the original url, method, headers, and body when cloning the request', () => {
    const body = { name: 'example' };
    const headers = new HttpHeaders({ 'X-Custom-Header': 'custom-value' });

    httpClient.post('/api/example', body, { headers }).subscribe();

    const testRequest = httpTestingController.expectOne('/api/example');

    expect(testRequest.request.url).toBe('/api/example');
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(body);
    expect(testRequest.request.headers.get('X-Custom-Header')).toBe('custom-value');

    testRequest.flush({});
  });
});

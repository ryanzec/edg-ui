export type HttpStatusCode = 400 | 401 | 403 | 404 | 429 | 500;

export const httpStatusCodeMessage: Record<HttpStatusCode, string> = {
  [400]: 'Bad Request',
  [401]: 'Unauthorized',
  [403]: 'Forbidden',
  [404]: 'Not Found',
  [429]: 'Too Many Requests',
  [500]: 'Unknown Error Occurred',
};

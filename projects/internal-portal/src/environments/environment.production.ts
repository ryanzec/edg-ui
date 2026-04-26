import { type UiEnvironment } from '@organization/shared-types';

export const environment: UiEnvironment = {
  mode: 'production',
  applicationName: 'internal-portal',
  authenticationApiUrl: 'https://localhost:3000/authentication',
  usersApiUrl: 'https://localhost:3000/users',
  jetCookieName: 'internal-jwt',
  launchDarklyClientId: '688bca950d275b098948a2d1',
  localStorageSessionUserKey: 'sessionUser',
};

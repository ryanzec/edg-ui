export type EnvironmentMode = 'local' | 'development' | 'staging' | 'production';

export type ApplicationName = 'customer-portal' | 'internal-portal';

export type UiEnvironment = {
  mode: EnvironmentMode;
  applicationName: ApplicationName;
  jetCookieName: string;
  launchDarklyClientId: string;

  // api
  authenticationApiUrl: string;
  usersApiUrl: string;

  // local storage
  localStorageSessionUserKey: string;
};

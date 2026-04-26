import { Route } from '@angular/router';

export type ApplicationRoute = Omit<Route, 'data'> & {
  data?: {
    unauthenticatedRedirect?: string;
  };
};

import { loggedInGuard } from '@organization/shared-ui';
import { NotFoundView } from './not-found-view/not-found-view';
import { LoginView } from './authentication/login-view/login-view';
import { UsersView } from './user/users-view/users-view';
import { ApplicationRoute } from '@organization/shared-ui';

export const routes: ApplicationRoute[] = [
  {
    path: 'login',
    component: LoginView,
  },
  {
    path: 'users',
    component: UsersView,
    canActivate: [loggedInGuard],
    data: { unauthenticatedRedirect: '/login' },
  },
  // default
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundView,
  },
];

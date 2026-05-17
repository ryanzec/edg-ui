import { loggedInGuard } from '@organization/shared-ui';
import { NotFoundView } from './not-found-view/not-found-view';
import { LoginView } from './authentication/login-view/login-view';
import { UsersView } from './user/users-view/users-view';
import { UsersView as DemoUsersView } from './demo/users-view/users-view';
import { TicketDetailsView as DemoTicketDetailsView } from './demo/ticket-details-view/ticket-details-view';
import { UserDetailsView as DemoUserDetailsView } from './demo/user-details-view/user-details-view';
import { KanbanView as DemoKanbanView } from './demo/kanban-view/kanban-view';
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
  {
    path: 'demo/users',
    component: DemoUsersView,
    data: { unauthenticatedRedirect: '/login' },
  },
  {
    path: 'demo/ticket-details',
    component: DemoTicketDetailsView,
    data: { unauthenticatedRedirect: '/login' },
  },
  {
    path: 'demo/user-details',
    component: DemoUserDetailsView,
    data: { unauthenticatedRedirect: '/login' },
  },
  {
    path: 'demo/kanban',
    component: DemoKanbanView,
    data: { unauthenticatedRedirect: '/login' },
  },
  // default
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundView,
  },
];

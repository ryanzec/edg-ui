import { Component, ChangeDetectionStrategy, Injectable, signal } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Observable, of, delay } from 'rxjs';
import {
  ApplicationNavigation,
  UsersList,
  UsersDataStore,
  UsersApi,
  type NavigationItem,
  type NavigationSubItem,
  type SettingsMenuItem,
  type Theme,
} from '@organization/shared-ui';
import { logManager } from '@organization/shared-utils';
import {
  type User,
  type GetUsersRequest,
  type GetUsersResponse,
  type CreateUserResponse,
  type UpdateUserResponse,
  type DeleteUserResponse,
} from '@organization/shared-types';

/** simulated network delay (in ms) used by the mock api to mimic a real fetch */
const MOCK_FETCH_DELAY_MS = 150;

/** mocked user dataset used by the demo composition view */
const MOCK_USERS: User[] = [
  {
    id: '39b2ad01-0001-0000-0000-000000000001',
    firstName: 'Yuna',
    lastName: 'Sharma',
    email: 'yuna.sharma137@figment.app',
    roles: ['user'],
    permissions: ['read'],
    requirePasswordChange: false,
    createdAt: '2026-04-25T07:00:00Z',
    updatedAt: '2026-04-25T07:00:00Z',
    deletedAt: null,
  },
  {
    id: '143c7249-0002-0000-0000-000000000002',
    firstName: 'Linnea',
    lastName: 'Mori',
    email: 'linnea.mori24@figment.app',
    roles: ['user'],
    permissions: ['read', 'api'],
    requirePasswordChange: false,
    createdAt: '2026-04-24T16:00:00Z',
    updatedAt: '2026-04-24T16:00:00Z',
    deletedAt: null,
  },
  {
    id: 'be49e709-0003-0000-0000-000000000003',
    firstName: 'Theo',
    lastName: 'van Dijk',
    email: 'theo.vandijk11@monoprism.dev',
    roles: ['user'],
    permissions: ['read', 'api'],
    requirePasswordChange: false,
    createdAt: '2026-04-23T16:00:00Z',
    updatedAt: '2026-04-23T16:00:00Z',
    deletedAt: null,
  },
  {
    id: 'abe6d014-0004-0000-0000-000000000004',
    firstName: 'Wren',
    lastName: 'Aslan',
    email: 'wren.aslan142@northwind.io',
    roles: ['user'],
    permissions: ['delete'],
    requirePasswordChange: false,
    createdAt: '2026-04-22T16:00:00Z',
    updatedAt: '2026-04-22T16:00:00Z',
    deletedAt: null,
  },
  {
    id: '1064dd90-0005-0000-0000-000000000005',
    firstName: 'Kenji',
    lastName: 'Polanski',
    email: 'kenji.polanski29@northwind.io',
    roles: ['user'],
    permissions: ['delete', 'api'],
    requirePasswordChange: false,
    createdAt: '2026-04-17T16:00:00Z',
    updatedAt: '2026-04-17T16:00:00Z',
    deletedAt: null,
  },
  {
    id: '5799c3a2-0006-0000-0000-000000000006',
    firstName: 'Olu',
    lastName: 'de Vries',
    email: 'olu.devries219@figment.app',
    roles: ['owner', 'admin'],
    permissions: ['read', 'write', 'delete', 'api'],
    requirePasswordChange: false,
    createdAt: '2026-04-14T16:00:00Z',
    updatedAt: '2026-04-14T16:00:00Z',
    deletedAt: null,
  },
  {
    id: '0318863d-0007-0000-0000-000000000007',
    firstName: 'Ivo',
    lastName: 'Conti',
    email: 'ivo.conti243@acme.co',
    roles: ['user'],
    permissions: ['write', 'delete'],
    requirePasswordChange: false,
    createdAt: '2026-04-12T16:00:00Z',
    updatedAt: '2026-04-12T16:00:00Z',
    deletedAt: null,
  },
  {
    id: '9b5a0803-0008-0000-0000-000000000008',
    firstName: 'Tariq',
    lastName: 'van Dijk',
    email: 'tariq.vandijk105@northwind.io',
    roles: ['user'],
    permissions: ['delete', 'api'],
    requirePasswordChange: false,
    createdAt: '2026-04-11T16:00:00Z',
    updatedAt: '2026-04-11T16:00:00Z',
    deletedAt: null,
  },
  {
    id: '79e33643-0009-0000-0000-000000000009',
    firstName: 'Linnea',
    lastName: 'Iyer',
    email: 'linnea.iyer226@helix.systems',
    roles: ['user'],
    permissions: ['write', 'delete'],
    requirePasswordChange: false,
    createdAt: '2026-04-09T16:00:00Z',
    updatedAt: '2026-04-09T16:00:00Z',
    deletedAt: null,
  },
  {
    id: '216c1fe9-0010-0000-0000-000000000010',
    firstName: 'Caspar',
    lastName: 'Ó Briain',
    email: 'caspar.briain51@northwind.io',
    roles: ['admin'],
    permissions: ['write', 'api'],
    requirePasswordChange: false,
    createdAt: '2026-04-05T16:00:00Z',
    updatedAt: '2026-04-05T16:00:00Z',
    deletedAt: null,
  },
];

/** navigation items rendered in the demo application-navigation sidebar */
const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'house', routePath: '/overview', shortcut: 'G O' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', routePath: '/inbox', indicator: 3, shortcut: 'G I' },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'folder',
    shortcut: 'G P',
    children: [
      { id: 'projects-all', label: 'All projects', routePath: '/projects' },
      { id: 'projects-active', label: 'Active', routePath: '/projects/active', indicator: 12 },
      { id: 'projects-archived', label: 'Archived', routePath: '/projects/archived' },
      { id: 'projects-templates', label: 'Templates', routePath: '/projects/templates' },
    ],
  },
  { id: 'analytics', label: 'Analytics', icon: 'grid-2x2', routePath: '/analytics' },
  { id: 'team', label: 'Team', icon: 'users', routePath: '/team' },
  { id: 'docs', label: 'Docs', icon: 'file-text', routePath: '/docs' },
  { id: 'billing', label: 'Billing', icon: 'credit-card', routePath: '/billing' },
];

/** settings overlay menu items rendered alongside the appearance toggle */
const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  { id: 'workspace-settings', label: 'Workspace settings', icon: 'cog', shortcut: '⌘,' },
  { id: 'account', label: 'Account', icon: 'at-sign' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: 'sparkles', shortcut: '?' },
  { id: 'help', label: 'Help & docs', icon: 'circle-help' },
  { id: 'signout-divider', type: 'divider' },
  { id: 'signout', label: 'Sign out', icon: 'log-out', color: 'danger' },
];

/**
 * in-memory implementation of `UsersApi` used to satisfy `UsersDataStore`'s dependency in the demo view.
 * only `getUsers` is exercised by the embedded `UsersList`; the mutation methods return a no-op response
 * because this view does not wire up the create / update / delete dialogs.
 */
@Injectable()
class MockUsersApi {
  /** simulates a paginated, filtered, and sorted `getUsers` request against the in-memory dataset */
  public getUsers(request: GetUsersRequest): Observable<GetUsersResponse> {
    let users = [...MOCK_USERS];

    if (request.search) {
      const search = request.search.toLowerCase();

      users = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.id.toLowerCase().includes(search)
      );
    }

    if (request.roles && request.roles.length > 0) {
      const requestedRoles = request.roles;

      users = users.filter((user) => user.roles.some((role) => requestedRoles.includes(role)));
    }

    if (request.permissions && request.permissions.length > 0) {
      const requestedPermissions = request.permissions;

      users = users.filter((user) => user.permissions.some((permission) => requestedPermissions.includes(permission)));
    }

    if (request.orderBy && request.orderDirection) {
      const orderBy = request.orderBy;
      const direction = request.orderDirection === 'asc' ? 1 : -1;

      users.sort((left, right) => {
        const leftValue = left[orderBy];
        const rightValue = right[orderBy];

        if (leftValue < rightValue) {
          return -1 * direction;
        }

        if (leftValue > rightValue) {
          return direction;
        }

        return 0;
      });
    }

    const totalItemCount = users.length;
    const offset = request.offset ?? 0;
    const limit = request.limit ?? 10;
    const paged = users.slice(offset, offset + limit);

    return of<GetUsersResponse>({
      data: paged,
      meta: {
        offset,
        itemsPerPage: limit,
        totalItemCount,
        currentPage: Math.floor(offset / limit) + 1,
      },
    }).pipe(delay(MOCK_FETCH_DELAY_MS));
  }

  /** demo-only no-op; included to satisfy the `UsersApi` shape consumed by `UsersDataStore` */
  public createUser(): Observable<CreateUserResponse> {
    return of({ error: { message: 'createUser is not implemented in the demo view' } });
  }

  /** demo-only no-op; included to satisfy the `UsersApi` shape consumed by `UsersDataStore` */
  public updateUser(): Observable<UpdateUserResponse> {
    return of({ error: { message: 'updateUser is not implemented in the demo view' } });
  }

  /** demo-only no-op; included to satisfy the `UsersApi` shape consumed by `UsersDataStore` */
  public deleteUser(): Observable<DeleteUserResponse> {
    return of({ error: { message: 'deleteUser is not implemented in the demo view' } });
  }
}

/**
 * page-level demo view that composes `<org-application-navigation>` with `<org-users-list>`.
 * the users-list backing store is replaced at component scope with an in-memory mock api so the
 * view renders end-to-end without a real backend.
 */
@Component({
  selector: 'cp-demo-users-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationNavigation, UsersList, CdkScrollable],
  templateUrl: './users-view.html',
  providers: [{ provide: UsersApi, useClass: MockUsersApi }, UsersDataStore],
  host: {
    class: 'flex h-full min-h-0',
  },
})
export class UsersView {
  /** navigation items rendered in the sidebar */
  protected readonly navigationItems = NAVIGATION_ITEMS;

  /** settings overlay menu items rendered alongside the appearance toggle */
  protected readonly settingsMenuItems = SETTINGS_MENU_ITEMS;

  /** controls the collapsed / expanded state of the sidebar */
  protected readonly collapsed = signal<boolean>(false);

  /** controls the appearance toggle inside the settings menu */
  protected readonly theme = signal<Theme | undefined>('system');

  /** logs the workspace-header click for demo observability */
  protected onWorkspaceClicked(): void {
    logManager.log({ type: 'demo-users-view-workspace-clicked' });
  }

  /** logs a top-level navigation item click for demo observability */
  protected onNavigationItemClicked(item: NavigationItem): void {
    logManager.log({ type: 'demo-users-view-navigation-clicked', item });
  }

  /** logs a nested navigation sub-item click for demo observability */
  protected onSubNavigationItemClicked(subItem: NavigationSubItem): void {
    logManager.log({ type: 'demo-users-view-sub-navigation-clicked', subItem });
  }

  /** logs a settings menu item click for demo observability */
  protected onSettingsMenuItemClicked(item: SettingsMenuItem): void {
    logManager.log({ type: 'demo-users-view-settings-clicked', item });
  }

  /** logs a logout request for demo observability */
  protected onLogout(): void {
    logManager.log({ type: 'demo-users-view-logout' });
  }

  /** logs an edit-user request emitted by the users-list */
  protected onEditUser(user: User): void {
    logManager.log({ type: 'demo-users-view-edit-user', user });
  }

  /** logs a single delete-user request emitted by the users-list */
  protected onDeleteUser(user: User): void {
    logManager.log({ type: 'demo-users-view-delete-user', user });
  }

  /** logs a bulk delete-users request emitted by the users-list */
  protected onBulkDeleteUsers(users: User[]): void {
    logManager.log({ type: 'demo-users-view-bulk-delete-users', users });
  }

  /** logs an invite-member request emitted by the users-list */
  protected onInviteMemberClicked(): void {
    logManager.log({ type: 'demo-users-view-invite-member-clicked' });
  }
}

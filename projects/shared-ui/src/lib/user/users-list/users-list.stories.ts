import type { Meta, StoryObj } from '@storybook/angular';
import { Component, Injectable, signal, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { type User, type GetUsersRequest, type GetUsersResponse } from '@organization/shared-types';
import { UsersList } from './users-list';
import { UsersDataStore } from '../users-data-store/users-data-store';
import { UsersApi } from '../users-api/users-api';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const sampleUsers: User[] = [
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

const generateLargeUserSet = (count: number): User[] => {
  const firstNames = ['Yuna', 'Linnea', 'Theo', 'Wren', 'Kenji', 'Olu', 'Ivo', 'Tariq', 'Caspar', 'Reza', 'Margaux'];
  const lastNames = ['Sharma', 'Mori', 'van Dijk', 'Aslan', 'Polanski', 'de Vries', 'Conti', 'Iyer', 'Ó Briain'];
  const allRoles: User['roles'][] = [['user'], ['admin'], ['owner', 'admin'], ['user']];
  const allPermissions: User['permissions'][] = [
    ['read'],
    ['read', 'api'],
    ['write', 'delete'],
    ['delete', 'api'],
    ['read', 'write', 'delete', 'api'],
  ];

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const id = `${(index + 1).toString().padStart(8, '0')}-0000-0000-0000-000000000000`;

    return {
      id,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.replace(/\s+/g, '').toLowerCase()}${index}@figment.app`,
      roles: allRoles[index % allRoles.length],
      permissions: allPermissions[index % allPermissions.length],
      requirePasswordChange: false,
      createdAt: new Date(2026, 0, 1 + (index % 28), 10, 0).toISOString(),
      updatedAt: new Date(2026, 0, 15 + (index % 28), 12, 0).toISOString(),
      deletedAt: null,
    };
  });
};

/** in-memory api stub used by all stories so the data store can fetch without a real backend */
@Injectable()
class StoryUsersApi {
  private readonly _allUsers = signal<User[]>([]);

  public setUsers(users: User[]): void {
    this._allUsers.set(users);
  }

  public getUsers(request: GetUsersRequest): Observable<GetUsersResponse> {
    let users = [...this._allUsers()];

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
    }).pipe(delay(150));
  }

  public createUser(): Observable<never> {
    return of();
  }

  public updateUser(): Observable<never> {
    return of();
  }

  public deleteUser(): Observable<never> {
    return of();
  }
}

const buildHostProviders = (initialUsers: User[]) => [
  StoryUsersApi,
  {
    provide: UsersApi,
    useFactory: (api: StoryUsersApi) => {
      api.setUsers(initialUsers);

      return api;
    },
    deps: [StoryUsersApi],
  },
  UsersDataStore,
];

@Component({
  selector: 'story-users-list-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsersList],
  template: `
    <org-users-list
      (editUser)="onEditUser($event)"
      (deleteUser)="onDeleteUser($event)"
      (bulkDeleteUsers)="onBulkDeleteUsers($event)"
      (inviteMemberClicked)="onInviteMemberClick()"
    />
  `,
  providers: buildHostProviders(sampleUsers),
})
class UsersListHostStory {
  protected onEditUser(user: User): void {
    console.log('editUser', user);
  }

  protected onDeleteUser(user: User): void {
    console.log('deleteUser', user);
  }

  protected onBulkDeleteUsers(users: User[]): void {
    console.log('bulkDeleteUsers', users);
  }

  protected onInviteMemberClick(): void {
    console.log('inviteMemberClicked');
  }
}

@Component({
  selector: 'story-users-list-empty-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsersList],
  template: `<org-users-list />`,
  providers: buildHostProviders([]),
})
class UsersListEmptyHostStory {}

@Component({
  selector: 'story-users-list-large-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsersList],
  template: `<org-users-list />`,
  providers: buildHostProviders(generateLargeUserSet(229)),
})
class UsersListLargeHostStory {}

@Component({
  selector: 'story-users-list-interactive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsersList],
  template: `
    <div class="flex flex-col gap-2">
      <org-users-list
        (editUser)="onEditUser($event)"
        (deleteUser)="onDeleteUser($event)"
        (bulkDeleteUsers)="onBulkDeleteUsers($event)"
        (inviteMemberClicked)="onInviteMemberClick()"
      />
      <div class="flex flex-col gap-0.5">
        <h4 class="font-medium">Event Log:</h4>
        <div class="p-1 bg-secondary-background-subtle rounded text-sm font-mono max-h-64 overflow-y-auto">
          @for (event of events(); track $index) {
            <div class="mb-0.5 pb-0.5 border-b border-neutral-border last:border-b-0">
              <div class="font-bold">{{ event.timestamp }} - {{ event.action }}</div>
              <div class="whitespace-pre-wrap">{{ event.details }}</div>
            </div>
          }
          @if (events().length === 0) {
            <div>No events yet. Try editing, deleting, or inviting members.</div>
          }
        </div>
      </div>
    </div>
  `,
  providers: buildHostProviders(generateLargeUserSet(50)),
})
class UsersListInteractiveStory {
  protected readonly events = signal<{ timestamp: string; action: string; details: string }[]>([]);

  protected onEditUser(user: User): void {
    this._log('EDIT_USER', `${user.firstName} ${user.lastName} (${user.email})`);
  }

  protected onDeleteUser(user: User): void {
    this._log('DELETE_USER', `${user.firstName} ${user.lastName} (${user.email})`);
  }

  protected onBulkDeleteUsers(users: User[]): void {
    this._log('BULK_DELETE_USERS', users.map((user) => `${user.firstName} ${user.lastName}`).join(', '));
  }

  protected onInviteMemberClick(): void {
    this._log('INVITE_MEMBER', '');
  }

  private _log(action: string, details: string): void {
    const timestamp = new Date().toLocaleTimeString();

    this.events.update((events) => [{ timestamp, action, details }, ...events.slice(0, 9)]);
  }
}

const meta: Meta<UsersList> = {
  title: 'User/Components/Users List',
  component: UsersList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Users List Component

  A self-contained workspace members management view. The component injects \`UsersDataStore\` from the parent
  and renders the entire members section: header, toolbar, table, and pagination. The parent only provides
  the data store and listens for output events (edit, delete, bulk delete, invite member).

  ### Features
  - Hardcoded header section: "WORKSPACE SETTINGS" eyebrow, "Members" title, description, and Invite member button
  - Toolbar with debounced search across name / email / id, multi-select Role and Permission filters, and a member count
  - Sortable Member (firstName) and Created columns via clickable header sort
  - Per-row checkbox + select-all checkbox; bulk actions surface via the table's selected actions bar with a Delete button
  - Per-row 3-dot actions menu with Edit and Delete
  - Avatar with initials, name, and a short id derived from the first 8 characters of the user id
  - Role tags color-coded by role (Owner = caution, Admin = warning, User = neutral); Permission tags neutral
  - Created column shows relative time (e.g. "9h ago")
  - Distinct empty states for "No members yet" vs. "No matches" (when filters are active)
  - Pagination via \`org-pagination\` with the component's default items-per-page options
  - Loading skeleton on initial load; background-loading spinner on subsequent fetches
  - Selection automatically drops items that disappear after refetch

  ### Events
  - **editUser**: Emitted when the per-row Edit menu item is clicked
  - **deleteUser**: Emitted when the per-row Delete menu item is clicked
  - **bulkDeleteUsers**: Emitted when the bulk Delete button in the selected actions bar is clicked
  - **inviteMemberClicked**: Emitted when the header's Invite member button is clicked

  ### Provider Requirement
  The parent component must provide \`UsersDataStore\` (it is no longer auto-resolved from root):

  \\\`\\\`\\\`typescript
  @Component({
    providers: [UsersDataStore],
    // ...
  })
  export class UsersView {}
  \\\`\\\`\\\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<UsersList>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default users list with a sample data set. The wrapper component provides the data store and a story-only api stub so the component can fetch without a real backend.',
      },
    },
  },
  render: () => ({
    template: '<story-users-list-host />',
    moduleMetadata: {
      imports: [UsersListHostStory],
    },
  }),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of states: with data, with an empty data set ("No members yet"), and after filtering an empty data set yields no matches.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Users List States"
        currentState="Comparing data, empty, and filtered-empty states"
      >
        <org-storybook-example-container-section label="With Data">
          <story-users-list-host />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Members Yet (truly empty)">
          <story-users-list-empty-host />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>With Data</strong>: Full table, count display, pagination</li>
          <li><strong>No Members Yet</strong>: Empty state shown when there is no data and no filters</li>
          <li><strong>No Matches</strong>: Empty state changes when filters are active but yield no results — exercise this by typing in the search box of the With Data example with text that does not match</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        UsersListHostStory,
        UsersListEmptyHostStory,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const RoleAndPermissionVariations: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sample data set covers role variations (Owner + Admin combo, Admin only, User only) and a range of permission combinations (single, multiple, full).',
      },
    },
  },
  render: () => ({
    template: '<story-users-list-host />',
    moduleMetadata: {
      imports: [UsersListHostStory],
    },
  }),
};

export const WithFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filters are always available. Try the search input (debounced), Role multi-select, and Permission multi-select. Sort by clicking the Member or Created column headers.',
      },
    },
  },
  render: () => ({
    template: '<story-users-list-host />',
    moduleMetadata: {
      imports: [UsersListHostStory],
    },
  }),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example with event logging for editUser, deleteUser, bulkDeleteUsers, and inviteMemberClicked events. Uses a 50-user data set so pagination is exercised.',
      },
    },
  },
  render: () => ({
    template: '<story-users-list-interactive />',
    moduleMetadata: {
      imports: [UsersListInteractiveStory],
    },
  }),
};

export const WithPagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Renders a 229-member data set so pagination, sort, and filter behaviors all exercise properly. Selection is preserved within a page; navigating pages drops selections that are no longer visible.',
      },
    },
  },
  render: () => ({
    template: '<story-users-list-large-host />',
    moduleMetadata: {
      imports: [UsersListLargeHostStory],
    },
  }),
};

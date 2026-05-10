import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { Table } from './table';
import { TableHeader } from './table-header';
import { TableCell } from './table-cell';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { SortableDirective } from '../sortable-directive/sortable-directive';
import { SortingStore } from '../sorting-store/sorting-store';
import { Pagination } from '../pagination/pagination';
import { DataSelectionStore } from '../data-selection-store/data-selection-store';
import { Button } from '../button/button';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';

type User = {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  roles: string;
};

const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    organizationId: 'ORG-001',
    roles: 'Admin, Editor',
  },
  { id: '2', name: 'Bob Smith', email: 'bob.smith@example.com', organizationId: 'ORG-002', roles: 'Editor' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.brown@example.com', organizationId: 'ORG-001', roles: 'Viewer' },
  { id: '4', name: 'Diana Prince', email: 'diana.prince@example.com', organizationId: 'ORG-003', roles: 'Admin' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.hunt@example.com', organizationId: 'ORG-002', roles: 'Editor, Viewer' },
  {
    id: '6',
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@example.com',
    organizationId: 'ORG-001',
    roles: 'Viewer',
  },
  {
    id: '7',
    name: 'George Washington',
    email: 'george.washington@example.com',
    organizationId: 'ORG-004',
    roles: 'Admin',
  },
  { id: '8', name: 'Hannah Montana', email: 'hannah.montana@example.com', organizationId: 'ORG-003', roles: 'Editor' },
  { id: '9', name: 'Isaac Newton', email: 'isaac.newton@example.com', organizationId: 'ORG-002', roles: 'Viewer' },
  {
    id: '10',
    name: 'Julia Roberts',
    email: 'julia.roberts@example.com',
    organizationId: 'ORG-001',
    roles: 'Admin, Editor',
  },
  { id: '11', name: 'Kevin Hart', email: 'kevin.hart@example.com', organizationId: 'ORG-004', roles: 'Editor' },
  { id: '12', name: 'Laura Croft', email: 'laura.croft@example.com', organizationId: 'ORG-003', roles: 'Viewer' },
  { id: '13', name: 'Michael Scott', email: 'michael.scott@example.com', organizationId: 'ORG-002', roles: 'Admin' },
  { id: '14', name: 'Nancy Drew', email: 'nancy.drew@example.com', organizationId: 'ORG-001', roles: 'Editor, Viewer' },
  { id: '15', name: 'Oscar Wilde', email: 'oscar.wilde@example.com', organizationId: 'ORG-004', roles: 'Viewer' },
  { id: '16', name: 'Penny Lane', email: 'penny.lane@example.com', organizationId: 'ORG-003', roles: 'Admin' },
  { id: '17', name: 'Quincy Jones', email: 'quincy.jones@example.com', organizationId: 'ORG-002', roles: 'Editor' },
  { id: '18', name: 'Rachel Green', email: 'rachel.green@example.com', organizationId: 'ORG-001', roles: 'Viewer' },
  {
    id: '19',
    name: 'Steve Rogers',
    email: 'steve.rogers@example.com',
    organizationId: 'ORG-004',
    roles: 'Admin, Editor',
  },
  { id: '20', name: 'Tina Turner', email: 'tina.turner@example.com', organizationId: 'ORG-003', roles: 'Editor' },
];

@Component({
  selector: 'story-basic-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  template: `
    <org-table [data]="users" [style.maxHeight]="'400px'">
      <ng-template #header>
        <org-table-th>Name</org-table-th>
        <org-table-th>Email</org-table-th>
        <org-table-th>Organization ID</org-table-th>
        <org-table-th>Roles</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="users" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.email }}</org-table-td>
        <org-table-td>{{ user.organizationId }}</org-table-td>
        <org-table-td>{{ user.roles }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class BasicTableDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 10);
}

@Component({
  selector: 'story-sortable-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, SortableDirective, TypedContextDirective],
  providers: [SortingStore],
  template: `
    <div class="flex flex-col gap-4">
      <div class="text-sm">
        <strong>Sorting:</strong> {{ sortingStore.key() || 'None' }}
        @if (sortingStore.direction()) {
          <span>({{ sortingStore.direction() }})</span>
        }
      </div>
      <org-table [data]="sortedUsers()" [style.maxHeight]="'400px'">
        <ng-template #header>
          <org-table-th>
            <div [orgSortableKey]="'name'">Name</div>
          </org-table-th>
          <org-table-th>
            <div [orgSortableKey]="'email'">Email</div>
          </org-table-th>
          <org-table-th>
            <div [orgSortableKey]="'organizationId'">Organization ID</div>
          </org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="sortedUsers()" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class SortableTableDemo {
  protected readonly sortingStore = inject(SortingStore);
  private readonly _users = signal<User[]>(SAMPLE_USERS.slice(0, 15));

  protected readonly sortedUsers = computed<User[]>(() => {
    const users = [...this._users()];
    const key = this.sortingStore.key();
    const direction = this.sortingStore.direction();

    if (!key || !direction) {
      return users;
    }

    return users.sort((a, b) => {
      const aValue = a[key as keyof User];
      const bValue = b[key as keyof User];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  });
}

@Component({
  selector: 'story-paginated-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Pagination, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <org-table [data]="paginatedUsers()" [style.maxHeight]="'400px'">
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="paginatedUsers()" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
      <org-pagination
        [(currentPage)]="currentPage"
        [totalItems]="users.length"
        [(itemsPerPage)]="itemsPerPage"
        [itemsPerPageOptions]="[5, 10, 15]"
      />
    </div>
  `,
})
class PaginatedTableDemo {
  protected readonly users = SAMPLE_USERS;
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = signal(5);

  protected readonly paginatedUsers = computed<User[]>(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = Math.min(start + this.itemsPerPage(), this.users.length);

    return this.users.slice(start, end);
  });
}

@Component({
  selector: 'story-selection-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Pagination, Button, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="text-sm"><strong>Selected:</strong> {{ selectionStore.selectedCount() }} user(s)</div>
      <org-table [data]="paginatedUsers()" [selectionData]="selectionStore" [style.maxHeight]="'400px'">
        <ng-template #selectedActions>
          <org-button label="Resend invite" preIcon="mail" (clicked)="onResendInvite()" />
          <org-button label="Restore" (clicked)="onRestore()" />
          <org-button color="danger" label="Delete" preIcon="trash" (clicked)="onDelete()" />
        </ng-template>
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="paginatedUsers()" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
      <org-pagination
        [(currentPage)]="currentPage"
        [totalItems]="users.length"
        [(itemsPerPage)]="itemsPerPage"
        [itemsPerPageOptions]="[5, 10, 15]"
      />
    </div>
  `,
})
class SelectionTableDemo {
  protected readonly selectionStore = new DataSelectionStore<User>();

  protected readonly users = SAMPLE_USERS;
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = signal(5);

  protected readonly paginatedUsers = computed<User[]>(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = Math.min(start + this.itemsPerPage(), this.users.length);

    return this.users.slice(start, end);
  });

  protected onResendInvite(): void {
    console.log('Resend invite for selected users:', this.selectionStore.selectedItemsArray());
  }

  protected onRestore(): void {
    console.log('Restore selected users:', this.selectionStore.selectedItemsArray());
  }

  protected onDelete(): void {
    console.log('Delete selected users:', this.selectionStore.selectedItemsArray());
  }
}

@Component({
  selector: 'story-full-featured-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, SortableDirective, Pagination, Button, TypedContextDirective],
  providers: [SortingStore],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center text-sm">
        <div><strong>Selected:</strong> {{ selectionStore.selectedCount() }} user(s)</div>
        <div>
          <strong>Sorting:</strong> {{ sortingStore.key() || 'None' }}
          @if (sortingStore.direction()) {
            <span>({{ sortingStore.direction() }})</span>
          }
        </div>
      </div>
      <org-table [data]="displayUsers()" [selectionData]="selectionStore" [style.maxHeight]="'400px'">
        <ng-template #selectedActions>
          <org-button label="Resend invite" preIcon="mail" (clicked)="onResendInvite()" />
          <org-button label="Restore" (clicked)="onRestore()" />
          <org-button color="danger" label="Delete" preIcon="trash" (clicked)="onDelete()" />
        </ng-template>
        <ng-template #header>
          <org-table-th>
            <div [orgSortableKey]="'name'">Name</div>
          </org-table-th>
          <org-table-th>
            <div [orgSortableKey]="'email'">Email</div>
          </org-table-th>
          <org-table-th>
            <div [orgSortableKey]="'organizationId'">Organization ID</div>
          </org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="displayUsers()" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
      <org-pagination
        [(currentPage)]="currentPage"
        [totalItems]="users.length"
        [(itemsPerPage)]="itemsPerPage"
        [itemsPerPageOptions]="[5, 10, 15]"
      />
    </div>
  `,
})
class FullFeaturedTableDemo {
  protected readonly sortingStore = inject(SortingStore);
  protected readonly selectionStore = new DataSelectionStore<User>();

  protected readonly users = SAMPLE_USERS;
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = signal(5);

  protected readonly sortedUsers = computed<User[]>(() => {
    const users = [...this.users];
    const key = this.sortingStore.key();
    const direction = this.sortingStore.direction();

    if (!key || !direction) {
      return users;
    }

    return users.sort((a, b) => {
      const aValue = a[key as keyof User];
      const bValue = b[key as keyof User];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  });

  protected readonly displayUsers = computed<User[]>(() => {
    const sorted = this.sortedUsers();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = Math.min(start + this.itemsPerPage(), sorted.length);

    return sorted.slice(start, end);
  });

  protected onResendInvite(): void {
    console.log('Resend invite for selected users:', this.selectionStore.selectedItemsArray());
  }

  protected onRestore(): void {
    console.log('Restore selected users:', this.selectionStore.selectedItemsArray());
  }

  protected onDelete(): void {
    console.log('Delete selected users:', this.selectionStore.selectedItemsArray());
  }
}

type EllipsisUser = User & { description: string };

@Component({
  selector: 'story-ellipsis-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="text-sm">This table shows ellipsis for content that exceeds 2 lines in cells.</div>
      <org-table [data]="users" [style.maxHeight]="'400px'">
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Long Description</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td [ellipsisLines]="2">{{ user.name }}</org-table-td>
          <org-table-td [ellipsisLines]="2">{{ user.email }}</org-table-td>
          <org-table-td [ellipsisLines]="2">{{ user.description }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class EllipsisTableDemo {
  protected readonly users: EllipsisUser[] = SAMPLE_USERS.slice(0, 10).map((user) => ({
    ...user,
    description: 'This is a very long description that will be truncated with ellipsis after two lines. '.repeat(3),
  }));
}

@Component({
  selector: 'story-dynamic-width-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="text-sm">This table demonstrates dynamic column widths with fixed and flexible columns.</div>
      <org-table [data]="users" [style.maxHeight]="'400px'">
        <ng-template #header>
          <org-table-th [style.width]="'3.125rem'">ID</org-table-th
          ><!-- 50px -->
          <org-table-th [style.width]="'30%'">Name</org-table-th>
          <org-table-th [style.width]="'40%'">Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td>{{ user.id }}</org-table-td>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class DynamicWidthTableDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 10);
}

type ScrollingUser = User & { department: string; location: string; status: string };

@Component({
  selector: 'story-scrolling-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="text-sm">
        This table demonstrates both vertical and horizontal scrolling with many rows and columns.
      </div>
      <org-table [data]="users" [style]="{ height: '400px', maxWidth: '800px' }">
        <ng-template #header>
          <org-table-th>ID</org-table-th>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
          <org-table-th>Department</org-table-th>
          <org-table-th>Location</org-table-th>
          <org-table-th>Status</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td>{{ user.id }}</org-table-td>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
          <org-table-td>{{ user.department }}</org-table-td>
          <org-table-td>{{ user.location }}</org-table-td>
          <org-table-td>{{ user.status }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class ScrollingTableDemo {
  protected readonly users: ScrollingUser[] = SAMPLE_USERS.map((user, index) => ({
    ...user,
    department: ['Engineering', 'Sales', 'Marketing', 'Support', 'HR'][index % 5],
    location: ['New York', 'San Francisco', 'London', 'Tokyo', 'Sydney'][index % 5],
    status: ['Active', 'Inactive', 'Pending'][index % 3],
  }));
}

@Component({
  selector: 'story-loading-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Button, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <org-button [label]="isLoading() ? 'Stop Loading' : 'Start Loading'" (clicked)="toggleLoading()" />
        <div class="text-sm"><strong>Status:</strong> {{ isLoading() ? 'Loading...' : 'Ready' }}</div>
      </div>
      <org-table [data]="users" [isLoading]="isLoading()" [style.maxHeight]="'400px'">
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class LoadingTableDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 10);
  protected readonly isLoading = signal<boolean>(false);

  protected toggleLoading(): void {
    this.isLoading.set(!this.isLoading());
  }
}

@Component({
  selector: 'story-background-loading-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Button, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <org-button
          [label]="isBackgroundLoading() ? 'Stop Background Loading' : 'Start Background Loading'"
          (clicked)="toggleBackgroundLoading()"
        />
        <div class="text-sm">
          <strong>Status:</strong> {{ isBackgroundLoading() ? 'Refreshing data in background...' : 'Ready' }}
        </div>
      </div>
      <org-table [data]="users" [isBackgroundLoading]="isBackgroundLoading()" [style.maxHeight]="'400px'">
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class BackgroundLoadingTableDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 10);
  protected readonly isBackgroundLoading = signal<boolean>(false);

  protected toggleBackgroundLoading(): void {
    this.isBackgroundLoading.set(!this.isBackgroundLoading());
  }
}

@Component({
  selector: 'story-combined-loading-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Button, TypedContextDirective],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <org-button label="Simulate Initial Load" (clicked)="simulateInitialLoad()" />
        <org-button label="Simulate Refresh" (clicked)="simulateRefresh()" />
        <div class="text-sm">
          <strong>Status:</strong>
          @if (isLoading()) {
            <span>Loading initial data...</span>
          } @else if (isBackgroundLoading()) {
            <span>Refreshing data in background...</span>
          } @else {
            <span>Ready</span>
          }
        </div>
      </div>
      <org-table
        [data]="displayUsers()"
        [isLoading]="isLoading()"
        [isBackgroundLoading]="isBackgroundLoading()"
        [style.maxHeight]="'400px'"
      >
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="displayUsers()" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
    </div>
  `,
})
class CombinedLoadingTableDemo {
  private readonly _users = signal<User[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly isBackgroundLoading = signal<boolean>(false);

  protected readonly displayUsers = this._users.asReadonly();

  protected simulateInitialLoad(): void {
    this.isLoading.set(true);
    this._users.set([]);

    setTimeout(() => {
      this._users.set(SAMPLE_USERS.slice(0, 10));
      this.isLoading.set(false);
    }, 2000);
  }

  protected simulateRefresh(): void {
    this.isBackgroundLoading.set(true);

    setTimeout(() => {
      const shuffled = [...SAMPLE_USERS].sort(() => Math.random() - 0.5);
      this._users.set(shuffled.slice(0, 10));
      this.isBackgroundLoading.set(false);
    }, 2000);
  }
}

@Component({
  selector: 'story-empty-state-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  template: `
    <org-table [data]="users" [style.maxHeight]="'400px'">
      <ng-template #header>
        <org-table-th>Name</org-table-th>
        <org-table-th>Email</org-table-th>
        <org-table-th>Organization ID</org-table-th>
        <org-table-th>Roles</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="users" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.email }}</org-table-td>
        <org-table-td>{{ user.organizationId }}</org-table-td>
        <org-table-td>{{ user.roles }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class EmptyStateTableDemo {
  protected readonly users: User[] = [];
}

const meta: Meta<Table> = {
  title: 'Core/Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Table Component

  A flexible, medium-complexity table component with sorting, pagination, selection, and scrolling support.

  ### Features
  - Template-based header and body rendering (the table auto-wraps each in an \`<org-table-tr>\`)
  - Horizontal and vertical scrolling support
  - Dynamic column widths (fixed and percentage-based)
  - Built-in row selection column driven by a \`DataSelectionStore\`
  - Sortable columns
  - Pagination support
  - Text ellipsis for long content
  - Sticky header (toggleable)
  - Hover effects on rows
  - Light and dark mode support

  ### Usage Example
  \`\`\`html
  <org-table [data]="users" [style.maxHeight]="'400px'">
    <ng-template #header>
      <org-table-th>Name</org-table-th>
      <org-table-th>Email</org-table-th>
      <org-table-th>Organization ID</org-table-th>
      <org-table-th>Roles</org-table-th>
    </ng-template>
    <ng-template [orgTypedContext]="users" #body let-user>
      <org-table-td>{{ user.name }}</org-table-td>
      <org-table-td>{{ user.email }}</org-table-td>
      <org-table-td>{{ user.organizationId }}</org-table-td>
      <org-table-td>{{ user.roles }}</org-table-td>
    </ng-template>
  </org-table>
  \`\`\`

  ### Sub-components
  - **org-table-tr**: Row component with variant (header/body) and sticky support — auto-rendered by \`org-table\` around each template
  - **org-table-th**: Header cell component with default styling
  - **org-table-td**: Body cell component with ellipsis support

  ### Advanced Features
  - **Sorting**: Use \`sortableKey\` directive on table headers wrapped in divs
  - **Pagination**: Integrate with \`org-pagination\` component
  - **Selection**: Instantiate a \`DataSelectionStore\` directly (\`new DataSelectionStore<T>()\` where \`T extends { id: string }\`) and pass it via \`[selectionData]\`. The table renders the select-all and per-row checkboxes automatically.
  - **Selected Actions Bar**: Provide a \`<ng-template #selectedActions>\` for the actions slot. The bar shows automatically when the selection store has at least one selected item, and the built-in Clear button calls \`selectionData.clear()\`.
  - **Ellipsis**: Set \`[ellipsisLines]="2"\` on \`org-table-td\` to enable text truncation (ellipsis is automatically enabled when ellipsisLines > 0)
  - **Dynamic Widths**: Apply inline styles directly on \`org-table-th\` elements (e.g., \`[style.width]="'50px'"\`)
  - **Sticky Header**: Header is sticky by default; pass \`[stickyHeader]="false"\` to opt out
  - **Loading States**: Use \`isLoading\` for initial loads (blocks table), \`isBackgroundLoading\` for refreshes (shows spinner)
</div>
        `,
      },
    },
  },
};

export default meta;

// the isLoading / isBackgroundLoading / selectionData inputs come from the host-directive forwarding on
// `Table`, which storybook's signal-input type extraction does not see, so they are augmented onto the args
// type here.
type Story = StoryObj<
  Table & {
    isLoading: boolean;
    isBackgroundLoading: boolean;
    selectionData: DataSelectionStore<{ id: string }> | undefined;
  }
>;

export const Default: Story = {
  args: {
    data: SAMPLE_USERS.slice(0, 5),
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of data to display in the table',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading blocker overlay when table is loading (e.g., initial data fetch)',
    },
    isBackgroundLoading: {
      control: 'boolean',
      description: 'Shows loading spinner in top-right corner during background operations (e.g., data refresh)',
    },
    selectionData: {
      control: false,
      description:
        'Optional `DataSelectionStore` instance that drives the built-in selection column and selected actions bar',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Whether the auto-rendered header row should be sticky',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-table
        [data]="data"
        [style.maxHeight]="'400px'"
      >
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Organization ID</org-table-th>
          <org-table-th>Roles</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="data" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.email }}</org-table-td>
          <org-table-td>{{ user.organizationId }}</org-table-td>
          <org-table-td>{{ user.roles }}</org-table-td>
        </ng-template>
      </org-table>
    `,
    moduleMetadata: {
      imports: [Table, TableHeader, TableCell, TypedContextDirective],
    },
  }),
};

export const BasicTable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic table with scrollable content and sticky header.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Basic Table"
        currentState="Displaying user data with scrolling support"
      >
        <org-storybook-example-container-section label="Basic Implementation">
          <story-basic-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Header remains sticky when scrolling vertically</li>
          <li>Horizontal scrolling is supported for wide content</li>
          <li>Rows have hover effects for better UX</li>
          <li>Table takes full width of container</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [BasicTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithSorting: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with sortable columns using the sortable directive.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table with Sorting"
        currentState="Click column headers to sort (Name, Email, Organization ID are sortable)"
      >
        <org-storybook-example-container-section label="Sortable Columns">
          <story-sortable-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Click on sortable headers to toggle sort direction (asc → desc → none)</li>
          <li>Visual indicator shows current sort state with icons</li>
          <li>Only one column can be sorted at a time</li>
          <li>Sorting is maintained until changed or cleared</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [SortableTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithPagination: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with pagination controls to navigate through large datasets.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table with Pagination"
        currentState="Navigate through pages using pagination controls"
      >
        <org-storybook-example-container-section label="Paginated Table">
          <story-paginated-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Pagination controls allow navigation through data</li>
          <li>Items per page can be adjusted dynamically</li>
          <li>Current page and total items are displayed</li>
          <li>Previous/Next buttons are disabled at boundaries</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [PaginatedTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with row selection that persists across pagination.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table with Selection"
        currentState="Select rows using checkboxes - selections persist when changing pages"
      >
        <org-storybook-example-container-section label="Selectable Rows">
          <story-selection-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Checkboxes allow individual row selection</li>
          <li>Header checkbox selects/deselects all rows on current page</li>
          <li>Header checkbox shows indeterminate state when some rows are selected</li>
          <li>Selections persist when navigating between pages</li>
          <li>Selected count is displayed and updates in real-time</li>
          <li>Selected actions bar appears above the table header when rows are selected</li>
          <li>Action buttons (Resend invite, Restore, Delete) log the selected items to the console</li>
          <li>Clear button resets the selection</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [SelectionTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const FullFeatured: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table combining all features: sorting, pagination, and selection.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Full-Featured Table"
        currentState="Complete table with sorting, pagination, and selection working together"
      >
        <org-storybook-example-container-section label="All Features Combined">
          <story-full-featured-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>All features work together seamlessly</li>
          <li>Sorting applies to entire dataset, not just current page</li>
          <li>Selections persist when sorting or paginating</li>
          <li>Visual feedback for all interactive elements</li>
          <li>Header remains sticky during scrolling</li>
          <li>Selected actions bar appears above the table header when rows are selected</li>
          <li>Action buttons (Resend invite, Restore, Delete) log the selected items to the console</li>
          <li>Clear button resets the selection</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FullFeaturedTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithEllipsis: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with text ellipsis for cells with long content.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table with Ellipsis"
        currentState="Long content is truncated with ellipsis after 2 lines"
      >
        <org-storybook-example-container-section label="Ellipsis Support">
          <story-ellipsis-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Set <code>[ellipsisLines]</code> input to control number of lines before truncation (ellipsis is automatically enabled when > 0)</li>
          <li>Ellipsis preserves layout consistency</li>
          <li>Works with both horizontal and vertical scrolling</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EllipsisTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const DynamicWidths: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with dynamic column widths using fixed and percentage-based sizing.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dynamic Column Widths"
        currentState="Columns use a mix of fixed widths, percentages, and auto-sizing"
      >
        <org-storybook-example-container-section label="Mixed Width Columns">
          <story-dynamic-width-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>ID column has fixed width of 50px</li>
          <li>Name column takes 30% of available space</li>
          <li>Email column takes 40% of available space</li>
          <li>Remaining columns share the rest of the space</li>
          <li>Horizontal scrolling activates when content exceeds container</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DynamicWidthTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const VerticalAndHorizontalScrolling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table demonstrating both vertical and horizontal scrolling with many rows and columns.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Vertical and Horizontal Scrolling"
        currentState="Table with many rows and wide columns enabling both scroll directions"
      >
        <org-storybook-example-container-section label="Bidirectional Scrolling">
          <story-scrolling-table-demo />
        </org-storybook-example-container-section>
        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Container has fixed height (400px) and max width (800px)</li>
          <li>Vertical scrolling enabled with 20 rows of data</li>
          <li>Horizontal scrolling enabled with 8 columns and minimum widths</li>
          <li>Header remains sticky when scrolling vertically</li>
          <li>Smooth scrolling experience in both directions</li>
          <li>Scroll indicators appear when content overflows</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [ScrollingTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithLoading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table with loading state that shows a blocking overlay with spinner and message. Used for initial data loads.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table with Loading State"
        currentState="Toggle loading to see the blocking overlay with spinner and message"
      >
        <org-storybook-example-container-section label="Loading State">
          <story-loading-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Loading blocker appears as an overlay covering the entire table</li>
          <li>Shows loading spinner with "Loading data..." message</li>
          <li>Table content is not interactable while loading</li>
          <li>Focus is trapped within the loading blocker for accessibility</li>
          <li>Used for initial data fetches or when table content needs to be completely replaced</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LoadingTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithBackgroundLoading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table with background loading state that shows a small spinner in the top-right corner. Used for data refreshes.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table with Background Loading"
        currentState="Toggle background loading to see the spinner in the top-right corner"
      >
        <org-storybook-example-container-section label="Background Loading State">
          <story-background-loading-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Loading spinner appears in the top-right corner of the table</li>
          <li>Table remains fully interactable during background loading</li>
          <li>Spinner is positioned absolutely and doesn't affect layout</li>
          <li>Used for background data refreshes, polling, or auto-updates</li>
          <li>Provides visual feedback without blocking user interaction</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [BackgroundLoadingTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LoadingStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the difference between loading and background loading states with realistic scenarios.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Combined Loading States"
        currentState="Simulate different loading scenarios to see how they work"
      >
        <org-storybook-example-container-section label="Loading Scenarios">
          <story-combined-loading-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li><strong>Initial Load:</strong> Shows blocking overlay while data is empty/loading for the first time</li>
          <li><strong>Refresh:</strong> Shows background spinner while existing data is being updated</li>
          <li>Loading state takes precedence over background loading if both are true</li>
          <li>Data updates are reflected immediately after loading completes</li>
          <li>Both loading states provide appropriate UX for their use cases</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CombinedLoadingTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with no data rows, showing how the component renders when the data array is empty.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Empty State"
        currentState="Table with an empty data array"
      >
        <org-storybook-example-container-section label="No Data">
          <story-empty-state-table-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li>Header row is still rendered when no data rows are present</li>
          <li>Table body is empty with no rows rendered</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyStateTableDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

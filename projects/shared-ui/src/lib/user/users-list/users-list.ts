import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  computed,
  effect,
  AfterViewInit,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { isEqual } from 'es-toolkit';
import {
  type User,
  type UserRoleName,
  type UserPermission,
  type GetUsersRequest,
  assignableUserRoles,
  assignableUserPermissions,
} from '@organization/shared-utils';
import { Button } from '../../core/button/button';
import { Table } from '../../core/table/table';
import { TableHeader } from '../../core/table/table-header';
import { TableCell } from '../../core/table/table-cell';
import { Tag, type TagColor } from '../../core/tags/tag';
import { Tags } from '../../core/tags/tags';
import { OverlayMenu, type OverlayMenuItem } from '../../core/overlay-menu/overlay-menu';
import { OverlayMenuTriggerDirective } from '../../core/overlay-menu/overlay-menu-trigger';
import { Skeleton } from '../../core/skeleton/skeleton';
import { Input } from '../../core/input/input';
import { Avatar } from '../../core/avatar/avatar';
import { DropDownSelector } from '../../core/drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../../core/drop-down-selector/drop-down-selector-brain';
import { SortingStore } from '../../core/sorting-store/sorting-store';
import { SortableDirective } from '../../core/sortable-directive/sortable-directive';
import { TableActionsDirective } from '../../core/table/table-actions-directive';
import { TextDirective } from '../../core/text-directive/text-directive';
import { TypedContextDirective } from '../../core/typed-context-directive/typed-context-directive';
import { Pagination } from '../../core/pagination/pagination';
import { DataSelectionStore } from '../../core/data-selection-store/data-selection-store';
import { UsersDataStore } from '../users-data-store/users-data-store';

/** sub-id length used in the member display under the user's name */
const SUB_ID_LENGTH = 8;

/** internal state shape for filter values */
type UsersListFilterState = {
  search: string;
  roles: UserRoleName[];
  permissions: UserPermission[];
};

/** color mapping for role tags */
const ROLE_TAG_COLORS: Record<UserRoleName, TagColor> = {
  owner: 'caution',
  admin: 'warning',
  user: 'neutral',
};

/** display labels for the role filter dropdown */
const ROLE_FILTER_OPTIONS: SelectionValue<UserRoleName>[] = assignableUserRoles.map((role) => ({
  value: role,
  display: role.charAt(0).toUpperCase() + role.slice(1),
}));

/** display labels for the permission filter dropdown */
const PERMISSION_FILTER_OPTIONS: SelectionValue<UserPermission>[] = assignableUserPermissions.map((permission) => ({
  value: permission,
  display: permission.charAt(0).toUpperCase() + permission.slice(1),
}));

/** items per page options for pagination */
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/** action menu items for each row */
const ROW_ACTIONS_MENU_ITEMS: OverlayMenuItem[] = [
  { id: 'edit', label: 'Edit', icon: 'pencil' },
  { id: 'delete', label: 'Delete', icon: 'trash' },
];

@Component({
  selector: 'org-users-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    OverlayMenu,
    OverlayMenuTriggerDirective,
    Table,
    TableHeader,
    TableCell,
    Tag,
    Tags,
    Skeleton,
    Input,
    Avatar,
    DropDownSelector,
    ReactiveFormsModule,
    SortableDirective,
    TableActionsDirective,
    TextDirective,
    TypedContextDirective,
    Pagination,
  ],
  providers: [SortingStore],
  templateUrl: './users-list.html',
  host: {
    class: 'flex flex-col gap-3 w-full',
  },
})
export class UsersList implements AfterViewInit {
  private readonly _injector = inject(Injector);
  private readonly _usersDataStore = inject(UsersDataStore);
  private readonly _sortingStore = inject(SortingStore);
  protected readonly selectionStore = new DataSelectionStore<User>();

  /** model for the active pagination page (two-way bound to org-pagination) */
  protected readonly currentPage = signal<number>(1);

  /** model for the items-per-page value (two-way bound to org-pagination) */
  protected readonly itemsPerPage = signal<number>(ITEMS_PER_PAGE_OPTIONS[0]);

  // outputs
  public readonly editUser = output<User>();
  public readonly deleteUser = output<User>();
  public readonly bulkDeleteUsers = output<User[]>();
  public readonly inviteMemberClicked = output<void>();

  /** internal filter state combining all toolbar filter values */
  private readonly _filterState = signal<UsersListFilterState>({
    search: '',
    roles: [],
    permissions: [],
  });

  /** reactive form control for the debounced search input */
  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });

  /** drop-down selector items for the role filter (multi-select) */
  protected readonly roleFilterOptions = ROLE_FILTER_OPTIONS;

  /** drop-down selector items for the permission filter (multi-select) */
  protected readonly permissionFilterOptions = PERMISSION_FILTER_OPTIONS;

  /** items per page options for the pagination component */
  protected readonly itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS;

  /** action menu items rendered in the per-row 3-dot menu */
  protected readonly rowActionsMenuItems = ROW_ACTIONS_MENU_ITEMS;

  /** model for the role filter selected items (drop-down-selector two-way binding) */
  protected readonly selectedRoleFilters = signal<SelectionValue<UserRoleName>[]>([]);

  /** model for the permission filter selected items (drop-down-selector two-way binding) */
  protected readonly selectedPermissionFilters = signal<SelectionValue<UserPermission>[]>([]);

  /** users from the data store */
  protected readonly users = this._usersDataStore.data;

  /** total item count from the data store, used in the count display and pagination */
  protected readonly totalItems = this._usersDataStore.totalItemCount;

  /** whether the data store has completed at least one fetch */
  protected readonly hasInitialized = this._usersDataStore.hasInitialized;

  /** the loading state of the data store */
  protected readonly loadingState = this._usersDataStore.loadingState;

  /** whether the table is performing its very first load */
  protected readonly isInitialLoading = computed<boolean>(() => this.hasInitialized() === false);

  /** whether the table is loading data after the initial load */
  protected readonly isBackgroundLoading = computed<boolean>(
    () => this.hasInitialized() && this.loadingState() === 'pending'
  );

  /** whether any filter or selection-aware empty state should reflect a "no matches" message */
  protected readonly hasActiveFilters = computed<boolean>(() => {
    const filters = this._filterState();

    return filters.search.length > 0 || filters.roles.length > 0 || filters.permissions.length > 0;
  });

  /** combined fetch request data driven by filters, sorting, and pagination */
  private readonly _fetchRequestData = computed<GetUsersRequest>(() => {
    const filters = this._filterState();
    const sortKey = this._sortingStore.key();
    const sortDirection = this._sortingStore.direction();
    const currentPage = this.currentPage();
    const itemsPerPage = this.itemsPerPage();

    const requestData: GetUsersRequest = {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    };

    if (filters.search.length > 0) {
      requestData.search = filters.search;
    }

    if (filters.roles.length > 0) {
      requestData.roles = filters.roles;
      requestData.role_filter_type = 'any';
    }

    if (filters.permissions.length > 0) {
      requestData.permissions = filters.permissions;
      requestData.permission_filter_type = 'any';
    }

    if (sortKey && sortDirection) {
      requestData.orderBy = sortKey as GetUsersRequest['orderBy'];
      requestData.orderDirection = sortDirection;
    }

    return requestData;
  });

  constructor() {
    // default sort is most-recently created first to match the header sort indicator in the image
    this._sortingStore.setSort('createdAt', 'desc');

    // wire the search input into the filter state with a debounce to avoid event storms
    this.searchControl.valueChanges.pipe(debounceTime(300), takeUntilDestroyed()).subscribe((value) => {
      this._updateFilterState({ search: value ?? '' });
    });

    // sync the role filter dropdown selection into the filter state
    effect(() => {
      const selectedRoles = this.selectedRoleFilters().map((item) => item.value);

      this._updateFilterState({ roles: selectedRoles });
    });

    // sync the permission filter dropdown selection into the filter state
    effect(() => {
      const selectedPermissions = this.selectedPermissionFilters().map((item) => item.value);

      this._updateFilterState({ permissions: selectedPermissions });
    });

    // any time the underlying data set changes (after a fetch), drop any selection that no longer exists
    effect(() => {
      const currentUsers = this.users();
      const currentIds = new Set(currentUsers.map((user) => user.id));
      const selectedItems = this.selectionStore.selectedItemsArray();
      const stillSelected = selectedItems.filter((item) => currentIds.has(item.id));

      if (stillSelected.length !== selectedItems.length) {
        this.selectionStore.replaceSelection(stillSelected);
      }
    });
  }

  public ngAfterViewInit(): void {
    // run the fetch subscription inside the injection context so takeUntilDestroyed() can find a destroy ref;
    // we use afterview to avoid an init-time event storm from child components emitting events as they mount
    runInInjectionContext(this._injector, () => {
      toObservable(this._fetchRequestData)
        .pipe(debounceTime(0), takeUntilDestroyed(), distinctUntilChanged(isEqual))
        .subscribe((requestData) => {
          this._usersDataStore.fetch(requestData);
        });
    });
  }

  protected fullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  protected subId(user: User): string {
    return user.id.replace(/-/g, '').slice(0, SUB_ID_LENGTH);
  }

  protected createdAtRelative(user: User): string {
    // backend dates can come through with a space separator instead of T; normalize before parsing
    const date = DateTime.fromISO(user.createdAt.split(' ').join('T'));

    if (!date.isValid) {
      return '';
    }

    return date.toRelative() ?? '';
  }

  protected getRoleColor(role: UserRoleName): TagColor {
    return ROLE_TAG_COLORS[role];
  }

  protected onRowActionMenuItemClick(menuItem: OverlayMenuItem, user: User): void {
    if (menuItem.id === 'edit') {
      this.editUser.emit(user);

      return;
    }

    if (menuItem.id === 'delete') {
      this.deleteUser.emit(user);

      return;
    }
  }

  protected onInviteMemberClick(): void {
    this.inviteMemberClicked.emit();
  }

  protected onBulkDeleteClick(): void {
    const selected = this.selectionStore.selectedItemsArray();

    if (selected.length === 0) {
      return;
    }

    this.bulkDeleteUsers.emit(selected);
  }

  /** updates the filter state and resets pagination back to the first page */
  private _updateFilterState(partial: Partial<UsersListFilterState>): void {
    const current = this._filterState();
    const next = { ...current, ...partial };

    if (isEqual(current, next)) {
      return;
    }

    this._filterState.set(next);
    this.currentPage.set(1);
  }
}

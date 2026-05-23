import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Avatar } from '../../core/avatar/avatar';
import { Button } from '../../core/button/button';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { DropDownSelector } from '../../core/drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../../core/drop-down-selector/drop-down-selector-brain';
import { Divider } from '../../core/divider/divider';
import { Link } from '../../core/link/link';
import {
  allUserDetailsRoles,
  userDetailsRoleLabelMap,
  type UserDetailsRole,
  type UserDetailsWorkspaceMembership,
  type UserDetailsWorkspaceRoleChangedEvent,
} from './user-details-types';

@Component({
  selector: 'org-user-details-workspaces',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Button, Card, CardContent, CardHeader, Divider, DropDownSelector, Link],
  templateUrl: './user-details-workspaces.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsWorkspaces {
  private readonly _addWorkspaceClicked$ = new Subject<void>();

  private readonly _workspaceRemoved$ = new Subject<string>();

  private readonly _workspaceRoleChanged$ = new Subject<UserDetailsWorkspaceRoleChangedEvent>();

  /** the workspace memberships to render */
  public readonly workspaces = input.required<UserDetailsWorkspaceMembership[]>();

  /** emitted when the user clicks Add workspace */
  public readonly addWorkspaceClicked = outputFromObservable(this._addWorkspaceClicked$);

  /** emitted with the workspace id when the user clicks Remove */
  public readonly workspaceRemoved = outputFromObservable(this._workspaceRemoved$);

  /** emitted when the user changes the per-workspace role */
  public readonly workspaceRoleChanged = outputFromObservable(this._workspaceRoleChanged$);

  /** subtitle showing the live count */
  protected readonly countLabel = computed<string>(
    () =>
      `Member of ${this.workspaces().length} workspaces. Per-workspace role overrides the primary role within that workspace.`
  );

  /** role items rendered in each per-workspace dropdown */
  protected readonly roleItems: SelectionValue<UserDetailsRole>[] = allUserDetailsRoles.map((role) => ({
    value: role,
    display: userDetailsRoleLabelMap[role],
  }));

  /** computes a selectedItems array for a given workspace's current role */
  protected selectedRoleItemsFor(role: UserDetailsRole): SelectionValue<UserDetailsRole>[] {
    return [{ value: role, display: userDetailsRoleLabelMap[role] }];
  }

  /** handles the Add workspace click */
  protected onAddWorkspaceClicked(): void {
    this._addWorkspaceClicked$.next();
  }

  /** handles a per-workspace role change */
  protected onRoleChanged(
    workspace: UserDetailsWorkspaceMembership,
    selected: SelectionValue<UserDetailsRole>[]
  ): void {
    const first = selected[0];

    if (!first) {
      return;
    }

    if (first.value === workspace.role) {
      return;
    }

    this._workspaceRoleChanged$.next({ workspaceId: workspace.id, role: first.value });
  }

  /** handles a per-workspace Remove click */
  protected onRemoveClicked(workspace: UserDetailsWorkspaceMembership): void {
    this._workspaceRemoved$.next(workspace.id);
  }
}

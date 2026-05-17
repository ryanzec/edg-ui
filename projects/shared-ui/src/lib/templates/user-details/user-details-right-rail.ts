import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Divider } from '../../core/divider/divider';
import { Icon } from '../../core/icon/icon';
import { Tag } from '../../core/tags/tag';
import {
  allUserDetailsSectionIds,
  userDetailsSectionIndexMap,
  userDetailsSectionLabelMap,
  type UserDetailsData,
  type UserDetailsSectionId,
} from './user-details-types';

/** the shape of one nav item rendered in the rail's ON THIS PAGE list */
type RightRailNavItem = {
  /** the section id this item targets */
  id: UserDetailsSectionId;
  /** the numeric index label rendered before the title */
  index: string;
  /** the section title */
  label: string;
};

/** default value for the activeSectionId input */
export const USER_DETAILS_RIGHT_RAIL_ACTIVE_SECTION_ID_DEFAULT: UserDetailsSectionId = 'profile';

/** default value for the isDirty input */
export const USER_DETAILS_RIGHT_RAIL_IS_DIRTY_DEFAULT = false;

@Component({
  selector: 'org-user-details-right-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Divider, Icon, Tag],
  templateUrl: './user-details-right-rail.html',
  styleUrl: './user-details-right-rail.css',
  host: {
    class: 'block',
  },
})
export class UserDetailsRightRail {
  private readonly _saveClicked$ = new Subject<void>();

  private readonly _navItemClicked$ = new Subject<UserDetailsSectionId>();

  /** account-at-a-glance summary surfaced under the nav */
  public readonly glance = input.required<UserDetailsData['glance']>();

  /** the currently-active section id (drives the visual active state in the nav list) */
  public readonly activeSectionId = input<UserDetailsSectionId>(USER_DETAILS_RIGHT_RAIL_ACTIVE_SECTION_ID_DEFAULT);

  /** whether the form has unsaved changes (drives the status line) */
  public readonly isDirty = input<boolean>(USER_DETAILS_RIGHT_RAIL_IS_DIRTY_DEFAULT);

  /** emitted when the user clicks Save */
  public readonly saveClicked = outputFromObservable(this._saveClicked$);

  /** emitted when the user clicks a nav item; the section id is the payload */
  public readonly navItemClicked = outputFromObservable(this._navItemClicked$);

  /** the rendered nav items derived from the canonical section list */
  protected readonly navItems = computed<RightRailNavItem[]>(() =>
    allUserDetailsSectionIds.map((id) => ({
      id,
      index: userDetailsSectionIndexMap[id],
      label: userDetailsSectionLabelMap[id],
    }))
  );

  /** handles the Save button click */
  protected onSaveClicked(): void {
    this._saveClicked$.next();
  }

  /** handles a nav-item click */
  protected onNavItemClicked(id: UserDetailsSectionId): void {
    this._navItemClicked$.next(id);
  }
}

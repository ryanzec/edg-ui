import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Divider } from '../../core/divider/divider';
import { Indicator } from '../../core/indicator/indicator';
import { Link } from '../../core/link/link';
import { Tag } from '../../core/tags/tag';
import { userDetailsAuditCategoryColorMap, type UserDetailsAuditEntry } from './user-details-types';

@Component({
  selector: 'org-user-details-role-audit-log',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, Divider, Indicator, Link, Tag],
  templateUrl: './user-details-role-audit-log.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsRoleAuditLog {
  private readonly _seeAllClicked$ = new Subject<void>();

  /** the audit entries to render */
  public readonly entries = input.required<UserDetailsAuditEntry[]>();

  /** emitted when the user clicks See all */
  public readonly seeAllClicked = outputFromObservable(this._seeAllClicked$);

  /** map from category to tag color */
  protected readonly categoryColorMap = userDetailsAuditCategoryColorMap;

  /** handles the See all click */
  protected onSeeAllClicked(): void {
    this._seeAllClicked$.next();
  }
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Table } from '../../core/table/table';
import { TableCell } from '../../core/table/table-cell';
import { TableHeader } from '../../core/table/table-header';
import { Tag } from '../../core/tags/tag';
import { TypedContextDirective } from '../../core/typed-context-directive/typed-context-directive';
import type { UserDetailsSigninHistoryEntry } from './user-details-types';

@Component({
  selector: 'org-user-details-signin-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, Table, TableCell, TableHeader, Tag, TypedContextDirective],
  templateUrl: './user-details-signin-history.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsSigninHistory {
  /** the sign-in history entries to render */
  public readonly entries = input.required<UserDetailsSigninHistoryEntry[]>();
}

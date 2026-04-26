import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'org-table-th',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <th class="header-cell">
      <ng-content />
    </th>
  `,
  styleUrl: './table-header.css',
})
export class TableHeader {}

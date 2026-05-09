import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TableHeaderBrainDirective } from '../../brain/table-header-brain/table-header-brain';

@Component({
  selector: 'org-table-th',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <th class="header-cell" [attr.scope]="brain.scope() ?? null">
      <ng-content />
    </th>
  `,
  styleUrl: './table-header.css',
  hostDirectives: [
    {
      directive: TableHeaderBrainDirective,
      inputs: ['scope'],
    },
  ],
})
export class TableHeader {
  protected readonly brain = inject(TableHeaderBrainDirective, { self: true });
}

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TableRowBrainDirective } from '../../brain/table-row-brain/table-row-brain';

@Component({
  selector: 'org-table-tr',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <tr
      [attr.data-variant]="brain.variant()"
      [attr.data-selected]="brain.selected() ? '' : null"
      [attr.data-clickable]="brain.clickable() ? '' : null"
      [attr.data-empty]="brain.empty() ? '' : null"
      [attr.aria-selected]="brain.ariaSelected()"
      [attr.tabindex]="brain.clickable() ? 0 : null"
      [attr.role]="brain.clickable() ? 'button' : null"
      (click)="brain.activate()"
      (keydown.enter)="brain.handleKeydown($event)"
      (keydown.space)="brain.handleKeydown($event)"
    >
      <ng-content />
    </tr>
  `,
  styleUrl: './table-row.css',
  hostDirectives: [
    {
      directive: TableRowBrainDirective,
      inputs: ['variant', 'selected', 'clickable', 'empty'],
      outputs: ['clicked'],
    },
  ],
})
export class TableRow {
  protected readonly brain = inject(TableRowBrainDirective, { self: true });
}

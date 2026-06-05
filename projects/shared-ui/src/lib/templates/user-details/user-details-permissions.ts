import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { Checkbox } from '../../core/checkbox/checkbox';
import { Table } from '../../core/table/table';
import { TableCell } from '../../core/table/table-cell';
import { TableHeader } from '../../core/table/table-header';
import { TypedContextDirective } from '../../core/typed-context-directive/typed-context-directive';
import type { UserDetailsPermissionResource } from './user-details-types';

@Component({
  selector: 'org-user-details-permissions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Box,
    BoxContent,
    BoxHeader,
    Checkbox,
    ReactiveFormsModule,
    Table,
    TableCell,
    TableHeader,
    TypedContextDirective,
  ],
  templateUrl: './user-details-permissions.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsPermissions {
  /** the FormArray of FormGroup<{id,read,write,delete}> for each permission resource */
  public readonly formArray = input.required<FormArray<FormGroup>>();

  /** the permission rows to render (parallel to the form array entries) */
  public readonly permissions = input.required<UserDetailsPermissionResource[]>();

  /** the resolved controls list, indexable by row index */
  protected readonly controls = computed<FormGroup[]>(() => this.formArray().controls as FormGroup[]);

  /** finds the FormGroup whose `id` control matches the permission row's id */
  protected controlFor(resourceId: string): FormGroup | undefined {
    return this.controls().find((group) => group.get('id')?.value === resourceId);
  }
}

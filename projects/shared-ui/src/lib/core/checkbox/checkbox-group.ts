import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ComponentSize } from '../types/component-types';
import { FORM_FIELD_COMPONENT } from '../form-fields/form-field';

/** all available checkbox group size values */
export const allCheckboxGroupSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant cascaded to child checkboxes in the group */
export type CheckboxGroupSize = (typeof allCheckboxGroupSizes)[number];

/** default value for the size input */
export const CHECKBOX_GROUP_SIZE_DEFAULT: CheckboxGroupSize = 'base';

/** default value for the disabled input */
export const CHECKBOX_GROUP_DISABLED_DEFAULT = false;

/** default value for the legend input */
export const CHECKBOX_GROUP_LEGEND_DEFAULT = '';

/** default value for the description input */
export const CHECKBOX_GROUP_DESCRIPTION_DEFAULT = '';

/** default value for the required input */
export const CHECKBOX_GROUP_REQUIRED_DEFAULT = false;

@Component({
  selector: 'org-checkbox-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox-group.html',
  styleUrl: './checkbox-group.css',
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'isInError() ? "error" : null',
    '[attr.data-disabled]': 'disabled() ? "1" : null',
    '[attr.aria-labelledby]': 'legend() ? legendId : null',
  },
})
export class CheckboxGroup {
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });

  /** stable dom id for the legend element so the host can reference it via aria-labelledby */
  public readonly legendId = `checkbox-group-legend-${uuidv4()}`;

  /** whether all checkboxes in the group are disabled */
  public readonly disabled = input<boolean>(CHECKBOX_GROUP_DISABLED_DEFAULT);

  /** the size variant cascaded to child checkboxes via the host data-size attribute */
  public readonly size = input<CheckboxGroupSize>(CHECKBOX_GROUP_SIZE_DEFAULT);

  /** optional legend text rendered above the options */
  public readonly legend = input<string>(CHECKBOX_GROUP_LEGEND_DEFAULT);

  /** optional description rendered between the legend and the options */
  public readonly description = input<string>(CHECKBOX_GROUP_DESCRIPTION_DEFAULT);

  /** whether the group is required — drives the asterisk indicator on the legend */
  public readonly required = input<boolean>(CHECKBOX_GROUP_REQUIRED_DEFAULT);

  /** whether the group is currently in an error state — driven from a parent form-field's validation context */
  protected readonly isInError = computed<boolean>(() => {
    return !!this._formField?.brain.hasValidationMessage();
  });
}

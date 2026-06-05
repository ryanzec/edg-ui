import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { Divider } from '../../core/divider/divider';

@Component({
  selector: 'org-user-details-preferences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxContent, BoxHeader, CheckboxToggle, Divider, ReactiveFormsModule],
  templateUrl: './user-details-preferences.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsPreferences {
  /** the FormGroup slice for the preference toggles */
  public readonly formGroup = input.required<FormGroup>();
}

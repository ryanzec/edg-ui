import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { Divider } from '../../core/divider/divider';

@Component({
  selector: 'org-user-details-preferences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, CheckboxToggle, Divider, ReactiveFormsModule],
  templateUrl: './user-details-preferences.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsPreferences {
  /** the FormGroup slice for the preference toggles */
  public readonly formGroup = input.required<FormGroup>();
}

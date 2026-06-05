import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Avatar } from '../../core/avatar/avatar';
import { Button } from '../../core/button/button';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { Divider } from '../../core/divider/divider';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { Input } from '../../core/input/input';
import { Label } from '../../core/label/label';
import { Link } from '../../core/link/link';
import type { UserDetailsIdentitySection } from './user-details-types';

/** validation messages keyed by control name within the identity form group */
export type UserDetailsIdentityErrors = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  pronouns?: string;
};

/** default value for the errors input */
export const USER_DETAILS_IDENTITY_ERRORS_DEFAULT: UserDetailsIdentityErrors = {};

@Component({
  selector: 'org-user-details-identity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Avatar,
    Button,
    Box,
    BoxContent,
    BoxHeader,
    Divider,
    FormField,
    FormFields,
    Input,
    Label,
    Link,
    ReactiveFormsModule,
  ],
  templateUrl: './user-details-identity.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsIdentity {
  private readonly _uploadPhotoRequested$ = new Subject<void>();

  private readonly _removePhotoRequested$ = new Subject<void>();

  private readonly _useGravatarRequested$ = new Subject<void>();

  /** the FormGroup slice for the identity fields */
  public readonly formGroup = input.required<FormGroup>();

  /** the identity data record (used for non-editable avatar display) */
  public readonly identity = input.required<UserDetailsIdentitySection>();

  /** validation messages keyed by control name */
  public readonly errors = input<UserDetailsIdentityErrors>(USER_DETAILS_IDENTITY_ERRORS_DEFAULT);

  /** emitted when the user clicks Upload photo */
  public readonly uploadPhotoRequested = outputFromObservable(this._uploadPhotoRequested$);

  /** emitted when the user clicks Remove */
  public readonly removePhotoRequested = outputFromObservable(this._removePhotoRequested$);

  /** emitted when the user clicks Use Gravatar */
  public readonly useGravatarRequested = outputFromObservable(this._useGravatarRequested$);

  /** handles the Upload photo button click */
  protected onUploadPhoto(): void {
    this._uploadPhotoRequested$.next();
  }

  /** handles the Remove link click */
  protected onRemovePhoto(): void {
    this._removePhotoRequested$.next();
  }

  /** handles the Use Gravatar link click */
  protected onUseGravatar(): void {
    this._useGravatarRequested$.next();
  }
}

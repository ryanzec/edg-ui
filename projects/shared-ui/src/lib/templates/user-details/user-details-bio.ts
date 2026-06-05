import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, startWith, switchMap } from 'rxjs';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { FormField } from '../../core/form-fields/form-field';
import { Textarea } from '../../core/textarea/textarea';
import type { UserDetailsBioSection } from './user-details-types';

/** validation messages for the bio form group */
export type UserDetailsBioErrors = {
  body?: string;
};

/** default value for the errors input */
export const USER_DETAILS_BIO_ERRORS_DEFAULT: UserDetailsBioErrors = {};

@Component({
  selector: 'org-user-details-bio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxContent, BoxHeader, FormField, Textarea, ReactiveFormsModule],
  templateUrl: './user-details-bio.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsBio {
  private readonly _bodyValue = signal<string>('');

  /** the FormGroup slice for the bio fields */
  public readonly formGroup = input.required<FormGroup>();

  /** the bio data record */
  public readonly bio = input.required<UserDetailsBioSection>();

  /** validation messages keyed by control name */
  public readonly errors = input<UserDetailsBioErrors>(USER_DETAILS_BIO_ERRORS_DEFAULT);

  /** live character count derived from the body control's value */
  protected readonly currentLength = computed<number>(() => this._bodyValue().length);

  constructor() {
    /**
     * subscribes to the bio body control's value changes so the live character count signal stays in sync.
     * re-subscribes if the FormGroup instance ever changes.
     */
    toObservable(this.formGroup)
      .pipe(
        switchMap((formGroup) => {
          const control = formGroup.get('body');

          if (!control) {
            return EMPTY;
          }

          return control.valueChanges.pipe(startWith(control.value));
        }),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe((value: string | null | undefined) => this._bodyValue.set(value ?? ''));
  }
}

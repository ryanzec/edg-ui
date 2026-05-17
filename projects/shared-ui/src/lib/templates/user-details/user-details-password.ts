import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Tag } from '../../core/tags/tag';
import { type ComponentColor } from '../../core/types/component-types';
import type { UserDetailsPasswordSection } from './user-details-types';

/** map from password-strength label to tag color */
const PASSWORD_STRENGTH_COLOR_MAP: Record<UserDetailsPasswordSection['strength'], ComponentColor> = {
  weak: 'danger',
  fair: 'warning',
  strong: 'safe',
};

/** map from password-strength label to display text */
const PASSWORD_STRENGTH_LABEL_MAP: Record<UserDetailsPasswordSection['strength'], string> = {
  weak: 'Weak',
  fair: 'Fair',
  strong: 'Strong',
};

@Component({
  selector: 'org-user-details-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, CardContent, CardHeader, Tag],
  templateUrl: './user-details-password.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsPassword {
  private readonly _changePasswordClicked$ = new Subject<void>();

  /** the password section data */
  public readonly password = input.required<UserDetailsPasswordSection>();

  /** emitted when the user clicks Change password */
  public readonly changePasswordClicked = outputFromObservable(this._changePasswordClicked$);

  /** the resolved strength label */
  protected readonly strengthLabel = computed<string>(() => PASSWORD_STRENGTH_LABEL_MAP[this.password().strength]);

  /** the resolved strength color */
  protected readonly strengthColor = computed<ComponentColor>(
    () => PASSWORD_STRENGTH_COLOR_MAP[this.password().strength]
  );

  /** pre-formatted relative "last changed" label (e.g. "Last changed 23 days ago.") */
  protected readonly lastChangedLabel = computed<string>(() => {
    const days = Math.max(0, Math.round(-this.password().lastChangedAt.diffNow('days').days));

    return `Last changed ${days} days ago.`;
  });

  /** pre-formatted "Strong, 14 characters, with symbols." line */
  protected readonly strengthDetail = computed<string>(() => {
    const parts = [
      this.strengthLabel(),
      `${this.password().characterCount} characters`,
      this.password().hasSymbols ? 'with symbols' : 'no symbols',
    ];

    return parts.join(', ') + '.';
  });

  /** pre-formatted "Rotation reminder: every 180 days · next on Nov 11 2026" line */
  protected readonly rotationLine = computed<string>(() => {
    return `Rotation reminder: every ${this.password().rotationDays} days · next on ${this.password().nextRotationAt.toFormat('MMM d, yyyy')}`;
  });

  /** the joined subtitle text shown in the card header */
  protected readonly subtitle = computed<string>(() => `${this.lastChangedLabel()} ${this.strengthDetail()}`);

  /** handles the Change password button click */
  protected onChangePasswordClicked(): void {
    this._changePasswordClicked$.next();
  }
}

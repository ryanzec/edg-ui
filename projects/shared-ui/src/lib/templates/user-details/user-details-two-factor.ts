import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { Divider } from '../../core/divider/divider';
import { Tag } from '../../core/tags/tag';
import type { UserDetailsTwoFactorActionEvent, UserDetailsTwoFactorMethod } from './user-details-types';

@Component({
  selector: 'org-user-details-two-factor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Box, BoxContent, BoxHeader, Divider, Tag],
  templateUrl: './user-details-two-factor.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsTwoFactor {
  private readonly _manageClicked$ = new Subject<void>();

  private readonly _methodActionClicked$ = new Subject<UserDetailsTwoFactorActionEvent>();

  /** the two-factor methods to render */
  public readonly methods = input.required<UserDetailsTwoFactorMethod[]>();

  /** emitted when the user clicks Manage in the header */
  public readonly manageClicked = outputFromObservable(this._manageClicked$);

  /** emitted when the user clicks the per-method action (Reconfigure, Add key, etc.) */
  public readonly methodActionClicked = outputFromObservable(this._methodActionClicked$);

  /** handles the Manage button click */
  protected onManageClicked(): void {
    this._manageClicked$.next();
  }

  /** handles a per-method action button click */
  protected onMethodActionClicked(method: UserDetailsTwoFactorMethod): void {
    this._methodActionClicked$.next({ id: method.id, kind: method.kind });
  }
}

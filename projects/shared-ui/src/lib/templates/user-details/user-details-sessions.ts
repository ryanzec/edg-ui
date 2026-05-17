import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Divider } from '../../core/divider/divider';
import { Icon } from '../../core/icon/icon';
import { Link } from '../../core/link/link';
import { Tag } from '../../core/tags/tag';
import type { UserDetailsSession } from './user-details-types';

@Component({
  selector: 'org-user-details-sessions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, CardContent, CardHeader, Divider, Icon, Link, Tag],
  templateUrl: './user-details-sessions.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsSessions {
  private readonly _signOutAllClicked$ = new Subject<void>();

  private readonly _sessionRevoked$ = new Subject<string>();

  /** the active sessions to render */
  public readonly sessions = input.required<UserDetailsSession[]>();

  /** emitted when the user clicks Sign out all others */
  public readonly signOutAllClicked = outputFromObservable(this._signOutAllClicked$);

  /** emitted with the session id when the user clicks Revoke on a row */
  public readonly sessionRevoked = outputFromObservable(this._sessionRevoked$);

  /** subtitle showing the live device count */
  protected readonly deviceCountLabel = computed<string>(() => `${this.sessions().length} devices signed in.`);

  /** handles the Sign out all others click */
  protected onSignOutAllClicked(): void {
    this._signOutAllClicked$.next();
  }

  /** handles a per-row Revoke click */
  protected onRevokeClicked(session: UserDetailsSession): void {
    this._sessionRevoked$.next(session.id);
  }
}

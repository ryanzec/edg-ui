import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { Divider } from '../../core/divider/divider';
import { Icon } from '../../core/icon/icon';
import { Link } from '../../core/link/link';
import { Tag } from '../../core/tags/tag';
import type { UserDetailsApiToken } from './user-details-types';

@Component({
  selector: 'org-user-details-api-tokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Box, BoxContent, BoxHeader, Divider, Icon, Link, Tag],
  templateUrl: './user-details-api-tokens.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsApiTokens {
  private readonly _newTokenClicked$ = new Subject<void>();

  private readonly _tokenRevoked$ = new Subject<string>();

  /** the api tokens to render */
  public readonly tokens = input.required<UserDetailsApiToken[]>();

  /** emitted when the user clicks New token */
  public readonly newTokenClicked = outputFromObservable(this._newTokenClicked$);

  /** emitted with the token id when the user clicks Revoke on a row */
  public readonly tokenRevoked = outputFromObservable(this._tokenRevoked$);

  /** handles the New token click */
  protected onNewTokenClicked(): void {
    this._newTokenClicked$.next();
  }

  /** handles a per-row Revoke click */
  protected onRevokeClicked(token: UserDetailsApiToken): void {
    this._tokenRevoked$.next(token.id);
  }
}

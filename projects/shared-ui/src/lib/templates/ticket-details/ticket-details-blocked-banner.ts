import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Box } from '../../core/box/box';
import { Button } from '../../core/button/button';
import { Icon } from '../../core/icon/icon';
import { type TicketBlockedInfo } from './ticket-details-types';

@Component({
  selector: 'org-ticket-details-blocked-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, Button, Icon],
  templateUrl: './ticket-details-blocked-banner.html',
  host: {
    class: 'block',
    role: 'status',
  },
})
export class TicketDetailsBlockedBanner {
  private readonly _unblockClicked$ = new Subject<void>();

  private readonly _pingOwnerClicked$ = new Subject<void>();

  /** the blocked metadata to render */
  public readonly blocked = input.required<TicketBlockedInfo>();

  /** emitted when the user clicks the Unblock action */
  public readonly unblock = outputFromObservable(this._unblockClicked$);

  /** emitted when the user clicks the Ping owner action */
  public readonly pingOwner = outputFromObservable(this._pingOwnerClicked$);

  /** forwards the Unblock button activation to the public output */
  protected onUnblockClicked(): void {
    this._unblockClicked$.next();
  }

  /** forwards the Ping owner button activation to the public output */
  protected onPingOwnerClicked(): void {
    this._pingOwnerClicked$.next();
  }
}

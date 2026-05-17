import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Avatar } from '../../core/avatar/avatar';
import { Button } from '../../core/button/button';
import { Tag } from '../../core/tags/tag';
import { type ComponentColor } from '../../core/types/component-types';
import {
  userDetailsRoleLabelMap,
  userDetailsStatusColorMap,
  userDetailsStatusLabelMap,
  type UserDetailsData,
} from './user-details-types';

@Component({
  selector: 'org-user-details-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Button, Tag],
  templateUrl: './user-details-header.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsHeader {
  private readonly _messageClicked$ = new Subject<void>();

  private readonly _overflowMenuClicked$ = new Subject<void>();

  /** the header slice of the user-details record */
  public readonly header = input.required<UserDetailsData['header']>();

  /** emitted when the user clicks the Message button */
  public readonly messageClicked = outputFromObservable(this._messageClicked$);

  /** emitted when the user clicks the overflow menu (...) button */
  public readonly overflowMenuClicked = outputFromObservable(this._overflowMenuClicked$);

  /** resolved role label for the role tag */
  protected readonly roleLabel = computed<string>(() => userDetailsRoleLabelMap[this.header().role]);

  /** resolved status label for the status tag */
  protected readonly statusLabel = computed<string>(() => userDetailsStatusLabelMap[this.header().status]);

  /** resolved status color for the status tag */
  protected readonly statusColor = computed<ComponentColor>(() => userDetailsStatusColorMap[this.header().status]);

  /** formatted joined date (e.g. "Mar 4, 2022") */
  protected readonly joinedAtFormatted = computed<string>(() => this.header().joinedAt.toFormat('MMM d, yyyy'));

  /** handles the Message button click */
  protected onMessageClicked(): void {
    this._messageClicked$.next();
  }

  /** handles the overflow menu (...) button click */
  protected onOverflowMenuClicked(): void {
    this._overflowMenuClicked$.next();
  }
}

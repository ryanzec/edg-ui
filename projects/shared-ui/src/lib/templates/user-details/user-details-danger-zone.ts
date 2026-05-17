import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Divider } from '../../core/divider/divider';

@Component({
  selector: 'org-user-details-danger-zone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, CardContent, CardHeader, Divider],
  templateUrl: './user-details-danger-zone.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsDangerZone {
  private readonly _suspendClicked$ = new Subject<void>();

  private readonly _deleteClicked$ = new Subject<void>();

  /** emitted when the user clicks Suspend */
  public readonly suspendClicked = outputFromObservable(this._suspendClicked$);

  /** emitted when the user clicks Delete account */
  public readonly deleteClicked = outputFromObservable(this._deleteClicked$);

  /** handles the Suspend click */
  protected onSuspendClicked(): void {
    this._suspendClicked$.next();
  }

  /** handles the Delete click */
  protected onDeleteClicked(): void {
    this._deleteClicked$.next();
  }
}

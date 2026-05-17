import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { Divider } from '../../core/divider/divider';
import { Icon } from '../../core/icon/icon';
import { Link } from '../../core/link/link';
import { Tag } from '../../core/tags/tag';
import { type ComponentColor } from '../../core/types/component-types';
import type { UserDetailsSsoSection } from './user-details-types';

@Component({
  selector: 'org-user-details-sso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, CheckboxToggle, Divider, Icon, Link, Tag],
  templateUrl: './user-details-sso.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsSso {
  private readonly _disconnectClicked$ = new Subject<void>();

  private readonly _enforcedChanged$ = new Subject<boolean>();

  /** the sso section data */
  public readonly sso = input.required<UserDetailsSsoSection>();

  /** emitted when the user clicks Disconnect */
  public readonly disconnectClicked = outputFromObservable(this._disconnectClicked$);

  /** emitted when the Enforce SSO toggle changes */
  public readonly enforcedChanged = outputFromObservable(this._enforcedChanged$);

  /** local mirror of the enforced toggle state so it can be two-way bound */
  protected readonly enforcedToggle = signal<boolean>(false);

  /** the resolved status label */
  protected readonly statusLabel = computed<string>(() => (this.sso().status === 'active' ? 'Active' : 'Inactive'));

  /** the resolved status color */
  protected readonly statusColor = computed<ComponentColor>(() =>
    this.sso().status === 'active' ? 'safe' : 'neutral'
  );

  constructor() {
    /** keeps the local toggle in sync with the source `enforced` value whenever the input changes */
    effect(() => {
      this.enforcedToggle.set(this.sso().enforced);
    });
  }

  /** handles the Disconnect link click */
  protected onDisconnectClicked(): void {
    this._disconnectClicked$.next();
  }

  /** handles the enforced toggle change */
  protected onEnforcedChange(checked: boolean): void {
    this.enforcedToggle.set(checked);
    this._enforcedChanged$.next(checked);
  }
}

import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Input, type InputInlineItem } from '../../core/input/input';
import { Tag } from '../../core/tags/tag';
import type { UserDetailsCustomScope } from './user-details-types';

@Component({
  selector: 'org-user-details-custom-scopes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, CardContent, CardHeader, Input, Tag],
  templateUrl: './user-details-custom-scopes.html',
  styleUrl: './user-details-custom-scopes.css',
  host: {
    class: 'block',
  },
})
export class UserDetailsCustomScopes {
  private readonly _scopeAdded$ = new Subject<string>();

  private readonly _scopeRemoved$ = new Subject<string>();

  /** the live working value of the new-scope input */
  protected readonly newScopeValue = signal<string>('');

  /** the custom scopes currently assigned */
  public readonly scopes = input.required<UserDetailsCustomScope[]>();

  /** the suggested scope labels surfaced beneath the input */
  public readonly suggestedScopes = input.required<string[]>();

  /** emitted with the new scope text when the user adds a scope */
  public readonly scopeAdded = outputFromObservable(this._scopeAdded$);

  /** emitted with the scope id when the user removes a scope */
  public readonly scopeRemoved = outputFromObservable(this._scopeRemoved$);

  /** the chip items rendered inline in the input — mapped from the scopes input */
  protected readonly inlineItems = computed<InputInlineItem[]>(() =>
    this.scopes().map((scope) => ({ id: scope.id, label: scope.label, removable: true }))
  );

  /** handles the Add scope button click */
  protected onAddScopeClicked(): void {
    const value = this.newScopeValue().trim();

    if (!value) {
      return;
    }

    this._scopeAdded$.next(value);
    this.newScopeValue.set('');
  }

  /** handles a suggested-chip click */
  protected onSuggestedClicked(suggestion: string): void {
    this._scopeAdded$.next(suggestion);
  }

  /** handles an inline-chip removal */
  protected onInlineItemRemoved(item: InputInlineItem): void {
    this._scopeRemoved$.next(item.id);
  }
}

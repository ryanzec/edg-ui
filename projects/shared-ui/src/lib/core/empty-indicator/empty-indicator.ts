import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { angularUtils } from '@organization/shared-utils';
import { Button } from '../button/button';
import {
  Box,
  BOX_BORDER_DEFAULT,
  BOX_COLOR_DEFAULT,
  BOX_PADDING_DEFAULT,
  type BoxBorder,
  type BoxColor,
  type BoxPadding,
} from '../box/box';

/** default value for the {@link EmptyIndicator.description} input */
export const EMPTY_INDICATOR_DESCRIPTION_DEFAULT: string | undefined = undefined;

/** default value for the {@link EmptyIndicator.actionLabel} input */
export const EMPTY_INDICATOR_ACTION_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the {@link EmptyIndicator.boxColor} input */
export const EMPTY_INDICATOR_BOX_COLOR_DEFAULT: BoxColor | undefined = BOX_COLOR_DEFAULT;

/** default value for the {@link EmptyIndicator.boxBorder} input */
export const EMPTY_INDICATOR_BOX_BORDER_DEFAULT: BoxBorder = BOX_BORDER_DEFAULT;

/** default value for the {@link EmptyIndicator.boxPadding} input */
export const EMPTY_INDICATOR_BOX_PADDING_DEFAULT: BoxPadding = BOX_PADDING_DEFAULT;

@Component({
  selector: 'org-empty-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Box],
  templateUrl: './empty-indicator.html',
  styleUrl: './empty-indicator.css',
  host: {
    role: 'status',
  },
})
export class EmptyIndicator {
  /** tracks the number of active listeners on the actionTriggered output */
  private readonly _actionTriggeredListenerCount = signal<number>(0);

  /** subject that drives the actionTriggered output */
  private readonly _actionTriggeredSubject = new Subject<void>();

  /** observable wrapper that keeps _actionTriggeredListenerCount in sync with subscription state */
  private readonly _actionTriggeredObservable = new Observable<void>((subscriber) => {
    this._actionTriggeredListenerCount.update((count) => count + 1);
    const subscription = this._actionTriggeredSubject.subscribe(subscriber);

    return () => {
      this._actionTriggeredListenerCount.update((count) => count - 1);
      subscription.unsubscribe();
    };
  });

  /** required header text displayed above the description */
  public header = input.required<string>();

  /** optional description text displayed below the header; when undefined no description is rendered */
  public description = input<string | undefined, string | null | undefined>(EMPTY_INDICATOR_DESCRIPTION_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional label for the action button; when undefined no button is rendered */
  public actionLabel = input<string | undefined, string | null | undefined>(EMPTY_INDICATOR_ACTION_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the semantic color applied to the inner Box component */
  public boxColor = input<BoxColor | undefined, BoxColor | null | undefined>(EMPTY_INDICATOR_BOX_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the border/visual style variant applied to the inner Box component */
  public boxBorder = input<BoxBorder>(EMPTY_INDICATOR_BOX_BORDER_DEFAULT);

  /** the internal padding size applied to the inner Box component */
  public boxPadding = input<BoxPadding>(EMPTY_INDICATOR_BOX_PADDING_DEFAULT);

  /** emitted when the action button is clicked */
  public actionTriggered = outputFromObservable(this._actionTriggeredObservable);

  /** whether the action button should be rendered */
  protected readonly hasActionButton = computed<boolean>(() => {
    return !!this.actionLabel() && this._actionTriggeredListenerCount() > 0;
  });

  /** handles the action button click */
  protected onActionClick(): void {
    this._actionTriggeredSubject.next();
  }
}

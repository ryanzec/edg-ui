import { Directive, computed, input, output, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { angularUtils } from '@organization/shared-utils';
import { type IconName } from '../icon-brain/icon-brain';

/** default value for the name input */
export const TAG_ICON_NAME_DEFAULT: IconName | undefined = undefined;

/** default value for the removable input */
export const TAG_ICON_REMOVABLE_DEFAULT = false;

/** default value for the ariaLabel input */
export const TAG_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default accessible label used when removable and no ariaLabel is provided */
export const TAG_ICON_REMOVABLE_DEFAULT_LABEL = 'Remove tag';

/** default accessible label used when clickable and no ariaLabel is provided */
export const TAG_ICON_CLICKABLE_DEFAULT_LABEL = 'Icon action';

/** the static html button type for the inner button */
export const TAG_ICON_BUTTON_TYPE = 'button';

/**
 * headless brain directive for the tag-icon. owns icon name resolution (substituting the remove "x" affordance
 * when removable), interactive state (clickable when the clicked output is observed or when removable),
 * disabled derivation for the inner button, click event routing between the clicked and removed outputs, the
 * static button type that prevents form submission, and the accessible label derivation. carries no styling,
 * sizing, or template — apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgTagIconBrain]',
  exportAs: 'orgTagIconBrain',
  host: {
    '(click)': 'click($event)',
  },
})
export class TagIconBrainDirective {
  private readonly _clickedSubject = new Subject<MouseEvent>();

  /** tracks the number of active listeners on the clicked output */
  private readonly _clickedListenerCount = signal<number>(0);

  /** observable wrapper that keeps _clickedListenerCount in sync with subscription state */
  private readonly _clickedObservable = new Observable<MouseEvent>((subscriber) => {
    this._clickedListenerCount.update((count) => count + 1);
    const subscription = this._clickedSubject.subscribe(subscriber);

    return () => {
      this._clickedListenerCount.update((count) => count - 1);
      subscription.unsubscribe();
    };
  });

  /** the icon to display; when undefined and removable is false nothing renders */
  public readonly name = input<IconName | undefined, IconName | null | undefined>(TAG_ICON_NAME_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** when true, the icon renders as the remove (x) affordance and emits removed on click */
  public readonly removable = input<boolean>(TAG_ICON_REMOVABLE_DEFAULT);

  /** accessible label for the icon button */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(TAG_ICON_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** emitted when the icon is clicked while not in removable mode */
  public readonly clicked = outputFromObservable(this._clickedObservable);

  /** emitted when the icon is clicked while in removable mode */
  public readonly removed = output<void>();

  /** the static html button type — owned by brain so interaction behavior stays in brain */
  public readonly buttonType = TAG_ICON_BUTTON_TYPE;

  /** the resolved icon name, substituting the remove icon when removable */
  public readonly resolvedIconName = computed<IconName | undefined>(() => {
    if (this.removable()) {
      return 'x';
    }

    return this.name();
  });

  /** whether the icon has something to render */
  public readonly hasIcon = computed<boolean>(() => !!this.resolvedIconName());

  /** whether the icon button is interactive */
  public readonly isClickable = computed<boolean>(() => this.removable() || this._clickedListenerCount() > 0);

  /** the resolved accessible label for the icon button */
  public readonly resolvedAriaLabel = computed<string>(() => {
    if (this.removable()) {
      return this.ariaLabel() ?? TAG_ICON_REMOVABLE_DEFAULT_LABEL;
    }

    return this.ariaLabel() ?? TAG_ICON_CLICKABLE_DEFAULT_LABEL;
  });

  /** handles click events bubbling from the inner button, routing to the appropriate output */
  protected click(event: MouseEvent): void {
    if (this.removable()) {
      this.removed.emit();

      return;
    }

    this._clickedSubject.next(event);
  }
}

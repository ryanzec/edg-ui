import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Icon, type IconName } from '../icon/icon';
import { Tag } from './tag';

/** the default icon name of the tag-icon */
export const TAG_ICON_NAME_DEFAULT: IconName | null = null;

/** the default removable state of the tag-icon */
export const TAG_ICON_REMOVABLE_DEFAULT = false;

/** the default accessible label of the tag-icon button */
export const TAG_ICON_ARIA_LABEL_DEFAULT: string | null = null;

@Component({
  selector: 'org-tag-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './tag-icon.html',
  styleUrl: './tag-icon.css',
  host: {
    '[attr.data-removable]': 'removable() ? "" : null',
  },
})
export class TagIcon {
  /** reference to the parent tag for shared size context */
  private readonly _tagComponent = inject(Tag, { host: true });

  // needed in order to determine if the clicked output event is being listened to
  private readonly _clicked$ = new Subject<MouseEvent>();

  /** the icon to display; when null and removable is false nothing renders */
  public readonly name = input<IconName | null>(TAG_ICON_NAME_DEFAULT);

  /** when true, the icon renders as the remove (x) affordance and emits removed on click */
  public readonly removable = input<boolean>(TAG_ICON_REMOVABLE_DEFAULT);

  /** accessible label for the icon button */
  public readonly ariaLabel = input<string | null>(TAG_ICON_ARIA_LABEL_DEFAULT);

  /** emitted when the icon is clicked while not in removable mode */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** emitted when the icon is clicked while in removable mode */
  public readonly removed = output<void>();

  /** the resolved icon name, substituting the remove icon when removable */
  protected readonly resolvedIconName = computed<IconName | null>(() => {
    if (this.removable()) {
      return 'x';
    }

    return this.name();
  });

  /** whether the icon has something to render */
  protected readonly hasIcon = computed<boolean>(() => !!this.resolvedIconName());

  /** whether the icon button is interactive */
  protected readonly isClickable = computed<boolean>(() => this.removable() || this._clicked$.observed);

  /** the resolved accessible label for the icon button */
  protected readonly resolvedAriaLabel = computed<string>(() => {
    if (this.removable()) {
      return this.ariaLabel() ?? 'Remove tag';
    }

    return this.ariaLabel() ?? 'Icon action';
  });

  /** the size inherited from the parent tag */
  protected readonly size = computed(() => this._tagComponent.size());

  /** handles click on the icon button */
  protected click(event: MouseEvent): void {
    if (this.removable()) {
      this.removed.emit();

      return;
    }

    this._clicked$.next(event);
  }
}

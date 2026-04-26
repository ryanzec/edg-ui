import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Icon, type IconName } from '../icon/icon';
import { ListItem } from './list-item';
import type { ListSize } from './list';

/** renders an icon inside a list item; sized from the parent list item */
@Component({
  selector: 'org-list-item-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './list-item-icon.html',
  styleUrl: './list-item-icon.css',
})
export class ListItemIcon {
  /** @internal reference to the parent list item component for size inheritance */
  private readonly _listItemComponent = inject(ListItem, { host: true });

  /** the icon to render inside the list item */
  public name = input.required<IconName>();

  /** resolved size, inherited from the parent list item */
  protected readonly size = computed<ListSize>(() => this._listItemComponent.finalSize());
}

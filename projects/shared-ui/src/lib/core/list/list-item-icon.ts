import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { type IconName } from '../icon/icon-brain';
import { Icon } from '../icon/icon';
import { ListItem } from './list-item';

/**
 * renders an icon inside a list item; size is inherited from the parent list item via css — must be used inside
 * an org-list-item (instantiation fails if missing)
 */
@Component({
  selector: 'org-list-item-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './list-item-icon.html',
  styleUrl: './list-item-icon.css',
})
export class ListItemIcon {
  /**
   * @internal required parent list item — instantiation fails if used outside an org-list-item; the value is
   * unused at runtime because sizing is driven by css `:host-context()` reading the parent's data-size attribute
   */
  private readonly _listItemComponent = inject(ListItem);

  /** the icon to render inside the list item */
  public name = input.required<IconName>();
}

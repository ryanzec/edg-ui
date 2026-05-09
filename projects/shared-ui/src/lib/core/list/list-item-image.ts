import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ListItem } from './list-item';

/**
 * renders an image inside a list item; size is inherited from the parent list item via css to match the icon
 * footprint — must be used inside an org-list-item (instantiation fails if missing)
 */
@Component({
  selector: 'org-list-item-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './list-item-image.html',
  styleUrl: './list-item-image.css',
})
export class ListItemImage {
  /**
   * @internal required parent list item — instantiation fails if used outside an org-list-item; the value is
   * unused at runtime because sizing is driven by css `:host-context()` reading the parent's data-size attribute
   */
  private readonly _listItemComponent = inject(ListItem);

  /** the image source url */
  public src = input.required<string>();

  /** the alternative text description for the image */
  public alt = input.required<string>();
}

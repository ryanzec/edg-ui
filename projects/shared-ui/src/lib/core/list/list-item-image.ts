import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ListItem } from './list-item';
import type { ListSize } from './list';

/** renders an image inside a list item; sized from the parent list item to match the icon footprint */
@Component({
  selector: 'org-list-item-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './list-item-image.html',
  styleUrl: './list-item-image.css',
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class ListItemImage {
  /** @internal reference to the parent list item component for size inheritance */
  private readonly _listItemComponent = inject(ListItem, { host: true });

  /** the image source url */
  public src = input.required<string>();

  /** the alternative text description for the image */
  public alt = input.required<string>();

  /** resolved size, inherited from the parent list item */
  protected readonly size = computed<ListSize>(() => this._listItemComponent.finalSize());
}

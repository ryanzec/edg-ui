import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { List } from '../../core/list/list';
import { ListItem } from '../../core/list/list-item';

@Component({
  selector: 'org-virtualized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, List, ListItem],
  templateUrl: './virtualized.html',
  host: {},
})
export class Virtualized {
  protected items = signal<{ id: number; content: string }[]>(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      content: `Item ${i + 1}`,
    }))
  );
  protected lastClickedItem = signal<number | null>(null);

  protected onItemClick(itemId: number): void {
    console.log('Item clicked:', itemId);
    this.lastClickedItem.set(itemId);
  }
}

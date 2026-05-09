import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, ViewChild, afterNextRender } from '@angular/core';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { CdkAutoSizeVirtualScroll } from '@angular/cdk-experimental/scrolling';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { List } from '../../core/list/list';
import { ListItem } from '../../core/list/list-item';
import { Button } from '../../core/button/button';
import { Input } from '../../core/input/input';
import { Label } from '../../core/label/label';

@Component({
  selector: 'story-fixed-size-virtual-scroll-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    List,
    ListItem,
    Button,
  ],
  template: `
    <org-storybook-example-container
      title="Fixed Size Virtual Scroll"
      currentState="10,000 items with fixed 40px height using Angular CDK Virtual Scroll"
    >
      <org-storybook-example-container-section label="Virtual Scroll Viewport">
        <div class="flex gap-2 mb-2">
          <org-button color="primary" size="sm" (clicked)="scrollToFirst()">Scroll to First</org-button>
          <org-button color="primary" size="sm" (clicked)="scrollToMiddle()">Scroll to Middle</org-button>
          <org-button color="primary" size="sm" (clicked)="scrollToLast()">Scroll to Last</org-button>
        </div>
        <cdk-virtual-scroll-viewport
          #viewport
          [itemSize]="37"
          class="h-lg w-full border border-neutral rounded-base"
          (scrolledIndexChange)="onScrollIndexChange($event)"
        >
          <org-list>
            <org-list-item
              *cdkVirtualFor="let item of items()"
              asTag="button"
              [label]="item.content"
              (clicked)="onItemClick(item.id)"
            />
          </org-list>
        </cdk-virtual-scroll-viewport>
      </org-storybook-example-container-section>

      <div class="flex gap-2 mt-3">
        <div class="rounded-base bg-neutral-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Scroll Information:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Total Items: {{ items().length }}</div>
            <div>First Visible Index: {{ firstVisibleIndex() }}</div>
            <div>Items in DOM: ~{{ itemsInDom() }}</div>
          </div>
        </div>

        @if (lastClickedItem(); as clickedId) {
          <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
            <div class="font-medium mb-2">Last Clicked:</div>
            <div class="text-xs font-mono">Item {{ clickedId }}</div>
          </div>
        }
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Fixed Size</strong>: All items have a consistent 40px height</li>
        <li><strong>Performance</strong>: Only renders visible items (~13 items) instead of all 10,000</li>
        <li><strong>Smooth Scrolling</strong>: Scroll through thousands of items with no lag</li>
        <li><strong>Memory Efficient</strong>: Constant DOM size regardless of total items</li>
        <li><strong>Click Handling</strong>: Items are fully interactive and clickable</li>
        <li><strong>Scroll Controls</strong>: Buttons to quickly navigate to first, middle, or last item</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class FixedSizeVirtualScrollDemoComponent {
  @ViewChild('viewport', { static: false })
  public readonly viewport!: CdkVirtualScrollViewport;

  protected items = signal<{ id: number; content: string }[]>(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      content: `Item ${i + 1}`,
    }))
  );
  protected lastClickedItem = signal<number | null>(null);
  protected firstVisibleIndex = signal<number>(0);
  protected itemsInDom = signal<number>(13);

  protected onItemClick(itemId: number): void {
    console.log('Item clicked:', itemId);
    this.lastClickedItem.set(itemId);
  }

  protected onScrollIndexChange(index: number): void {
    this.firstVisibleIndex.set(index);
  }

  protected scrollToFirst(): void {
    this.viewport.scrollToIndex(0, 'smooth');
  }

  protected scrollToMiddle(): void {
    const middleIndex = Math.floor(this.items().length / 2);
    this.viewport.scrollToIndex(middleIndex, 'smooth');
  }

  protected scrollToLast(): void {
    this.viewport.scrollToIndex(this.items().length - 1, 'smooth');
  }
}

@Component({
  selector: 'story-dynamic-size-virtual-scroll-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkVirtualScrollViewport,
    CdkAutoSizeVirtualScroll,
    CdkVirtualForOf,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    List,
    ListItem,
    Button,
  ],
  template: `
    <org-storybook-example-container
      title="Dynamic Size Virtual Scroll"
      currentState="10,000 items with variable heights (1-4 lines) using Angular CDK Virtual Scroll"
    >
      <org-storybook-example-container-section label="Virtual Scroll Viewport">
        <div class="flex gap-2 mb-2">
          <org-button color="primary" size="sm" (clicked)="scrollToFirst()">Scroll to First</org-button>
          <org-button color="primary" size="sm" (clicked)="scrollToMiddle()">Scroll to Middle</org-button>
          <org-button color="primary" size="sm" (clicked)="scrollToLast()">Scroll to Last</org-button>
        </div>
        <cdk-virtual-scroll-viewport
          #viewport
          autosize
          [minBufferPx]="500"
          [maxBufferPx]="1000"
          class="h-lg w-full border border-neutral rounded-base"
          (scrolledIndexChange)="onScrollIndexChange($event)"
        >
          <org-list>
            <org-list-item
              *cdkVirtualFor="let item of items()"
              asTag="button"
              [label]="item.content"
              (clicked)="onItemClick(item.id)"
            />
          </org-list>
        </cdk-virtual-scroll-viewport>
      </org-storybook-example-container-section>

      <div class="flex gap-2 mt-3">
        <div class="rounded-base bg-neutral-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Scroll Information:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Total Items: {{ items().length }}</div>
            <div>First Visible Index: {{ firstVisibleIndex() }}</div>
            <div>Variable Heights: 1-4 lines per item</div>
          </div>
        </div>

        @if (lastClickedItem(); as clickedId) {
          <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
            <div class="font-medium mb-2">Last Clicked:</div>
            <div class="text-xs font-mono">
              <div>Item {{ clickedId }}</div>
              <div class="mt-1 text-neutral">Lines: {{ getItemLines(clickedId) }}</div>
            </div>
          </div>
        }
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Dynamic Heights</strong>: Items have variable heights based on content (1-4 lines randomly)</li>
        <li><strong>Autosize</strong>: Uses autosize to automatically measure and adjust for variable heights</li>
        <li><strong>Accurate Sizing</strong>: Autosize measures actual heights dynamically</li>
        <li><strong>Buffer Zones</strong>: minBufferPx and maxBufferPx ensure smooth scrolling</li>
        <li><strong>Performance</strong>: Still only renders visible items even with variable sizes</li>
        <li><strong>Smooth Scrolling</strong>: Maintains smooth scrolling experience with dynamic content</li>
        <li><strong>Memory Efficient</strong>: Constant DOM size regardless of total items or varying heights</li>
        <li><strong>Click Handling</strong>: Items are fully interactive and clickable</li>
        <li><strong>Scroll Controls</strong>: Buttons work with scrollToIndex</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DynamicSizeVirtualScrollDemoComponent {
  @ViewChild('viewport', { static: false })
  public readonly viewport!: CdkVirtualScrollViewport;

  protected items = signal<{ id: number; content: string; lines: number }[]>(
    Array.from({ length: 10000 }, (_, i) => {
      const lines = Math.floor(Math.random() * 4) + 1;
      const content = this.generateContent(i + 1, lines);

      return {
        id: i + 1,
        content,
        lines,
      };
    })
  );
  protected lastClickedItem = signal<number | null>(null);
  protected firstVisibleIndex = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      if (this.viewport) {
        this.viewport.checkViewportSize();
      }
    });
  }

  protected onItemClick(itemId: number): void {
    console.log('Item clicked:', itemId);
    this.lastClickedItem.set(itemId);
  }

  protected onScrollIndexChange(index: number): void {
    this.firstVisibleIndex.set(index);
  }

  protected getItemLines(itemId: number): number {
    const item = this.items().find((i) => i.id === itemId);

    return item?.lines || 1;
  }

  protected scrollToFirst(): void {
    this.viewport.scrollToIndex(0, 'smooth');
  }

  protected scrollToMiddle(): void {
    const middleIndex = Math.floor(this.items().length / 2);
    this.viewport.scrollToIndex(middleIndex, 'smooth');
  }

  protected scrollToLast(): void {
    this.viewport.scrollToIndex(this.items().length - 1, 'smooth');
  }

  private generateContent(itemNumber: number, lines: number): string {
    const baseContent = `Item ${itemNumber}`;

    if (lines === 1) {
      return baseContent;
    }

    const additionalContent = [
      'with extended description text that spans multiple lines',
      'containing additional information for demonstration',
      'showing how virtual scroll handles variable content heights',
      'and maintains smooth scrolling performance',
    ];

    let content = baseContent;

    for (let i = 0; i < lines - 1; i++) {
      content += ` ${additionalContent[i % additionalContent.length]}`;
    }

    return content;
  }
}

@Component({
  selector: 'story-filtered-virtual-scroll-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkVirtualScrollViewport,
    CdkAutoSizeVirtualScroll,
    CdkVirtualForOf,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    List,
    ListItem,
    Button,
    Input,
    Label,
  ],
  template: `
    <org-storybook-example-container
      title="Filtered Dynamic Size Virtual Scroll"
      currentState="10,000 items with variable heights and search filtering"
    >
      <org-storybook-example-container-section label="Virtual Scroll Viewport with Filter">
        <div class="flex items-center gap-2 mb-2">
          <org-label htmlFor="search-input" text="Search:" />
          <org-input
            name="search-input"
            placeholder="Filter items..."
            [value]="searchQuery()"
            (valueChange)="onSearchChange($event)"
            inputClass="flex-1"
          />
          <span class="text-sm text-neutral whitespace-nowrap">
            Showing {{ filteredItems().length }} of {{ items().length }} items
          </span>
        </div>

        <div class="flex gap-2 mb-2">
          <org-button color="primary" size="sm" (clicked)="scrollToFirst()">Scroll to First</org-button>
          <org-button color="primary" size="sm" (clicked)="scrollToMiddle()">Scroll to Middle</org-button>
          <org-button color="primary" size="sm" (clicked)="scrollToLast()">Scroll to Last</org-button>
        </div>

        <cdk-virtual-scroll-viewport
          #viewport
          autosize
          [minBufferPx]="500"
          [maxBufferPx]="1000"
          class="h-lg w-full border border-neutral rounded-base"
          (scrolledIndexChange)="onScrollIndexChange($event)"
        >
          <org-list>
            <org-list-item
              *cdkVirtualFor="let item of filteredItems()"
              asTag="button"
              [label]="item.content"
              (clicked)="onItemClick(item.id)"
            />
          </org-list>
        </cdk-virtual-scroll-viewport>
      </org-storybook-example-container-section>

      <div class="flex gap-2 mt-3">
        <div class="rounded-base bg-neutral-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Scroll Information:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Total Items: {{ items().length }}</div>
            <div>Filtered Items: {{ filteredItems().length }}</div>
            <div>First Visible Index: {{ firstVisibleIndex() }}</div>
            <div>Search Query: "{{ searchQuery() }}"</div>
          </div>
        </div>

        @if (lastClickedItem(); as clickedId) {
          <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
            <div class="font-medium mb-2">Last Clicked:</div>
            <div class="text-xs font-mono">
              <div>Item {{ clickedId }}</div>
              <div class="mt-1 text-neutral">Lines: {{ getItemLines(clickedId) }}</div>
            </div>
          </div>
        }
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Search Filtering</strong>: Case-insensitive filtering using includes() check</li>
        <li><strong>Search Suffix</strong>: Each item has a search suffix (searcha-searchz) based on index % 26</li>
        <li><strong>Real-time Updates</strong>: Virtual scroll automatically adjusts to filtered results</li>
        <li><strong>Auto Scroll</strong>: Scrolls to top when filter changes</li>
        <li><strong>Filtered Count</strong>: Shows count of filtered items vs total items</li>
        <li><strong>Dynamic Heights</strong>: Items have variable heights based on content (1-4 lines randomly)</li>
        <li><strong>Autosize</strong>: Uses autosize to automatically measure and adjust for variable heights</li>
        <li><strong>Performance</strong>: Still only renders visible items even with filtering</li>
        <li><strong>Scroll Controls</strong>: Buttons work with scrollToIndex on filtered results</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class FilteredVirtualScrollDemoComponent {
  @ViewChild('viewport', { static: false })
  public readonly viewport!: CdkVirtualScrollViewport;

  protected items = signal<{ id: number; content: string; lines: number }[]>(
    Array.from({ length: 10000 }, (_, i) => {
      const lines = Math.floor(Math.random() * 4) + 1;
      const letterIndex = i % 26;
      const searchSuffix = String.fromCharCode(97 + letterIndex); // 97 is 'a'
      const content = this.generateContent(i + 1, lines, searchSuffix);

      return {
        id: i + 1,
        content,
        lines,
      };
    })
  );
  protected searchQuery = signal<string>('');
  protected filteredItems = signal<{ id: number; content: string; lines: number }[]>([]);
  protected lastClickedItem = signal<number | null>(null);
  protected firstVisibleIndex = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      if (this.viewport) {
        this.viewport.checkViewportSize();
      }
    });

    // Initialize with all items
    this.filteredItems.set(this.items());
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);

    const lowerQuery = query.toLowerCase();

    if (!lowerQuery) {
      this.filteredItems.set(this.items());
    } else {
      const filtered = this.items().filter((item) => item.content.toLowerCase().includes(lowerQuery));
      this.filteredItems.set(filtered);
    }

    // Scroll to top when filter changes
    if (this.viewport) {
      this.viewport.scrollToIndex(0);
    }
  }

  protected onItemClick(itemId: number): void {
    console.log('Item clicked:', itemId);
    this.lastClickedItem.set(itemId);
  }

  protected onScrollIndexChange(index: number): void {
    this.firstVisibleIndex.set(index);
  }

  protected getItemLines(itemId: number): number {
    const item = this.items().find((i) => i.id === itemId);

    return item?.lines || 1;
  }

  protected scrollToFirst(): void {
    this.viewport.scrollToIndex(0, 'smooth');
  }

  protected scrollToMiddle(): void {
    const middleIndex = Math.floor(this.filteredItems().length / 2);
    this.viewport.scrollToIndex(middleIndex, 'smooth');
  }

  protected scrollToLast(): void {
    this.viewport.scrollToIndex(this.filteredItems().length - 1, 'smooth');
  }

  private generateContent(itemNumber: number, lines: number, searchSuffix: string): string {
    const baseContent = `Item ${itemNumber}`;

    if (lines === 1) {
      return `${baseContent} search${searchSuffix}`;
    }

    const additionalContent = [
      'with extended description text that spans multiple lines',
      'containing additional information for demonstration',
      'showing how virtual scroll handles variable content heights',
      'and maintains smooth scrolling performance',
    ];

    let content = baseContent;

    for (let i = 0; i < lines - 1; i++) {
      content += ` ${additionalContent[i % additionalContent.length]}`;
    }

    return `${content} search${searchSuffix}`;
  }
}

const meta: Meta = {
  title: 'Examples/Virtualized',
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Virtual Scroll Examples

  This example demonstrates how to use Angular CDK's Virtual Scroll to efficiently render large lists with 10,000 items.

  ### Features
  - **Fixed Size**: All items with consistent height using itemSize
  - **Dynamic Size**: Variable height items that automatically adjust
  - **Performance**: Only renders visible items instead of entire list
  - **Smooth Scrolling**: No lag even with thousands of items
  - **Memory Efficient**: Constant DOM size regardless of total items
  - **Interactive**: Full support for click handlers and events

  ### Use Cases
  1. **Fixed Size Virtual Scroll**: Best for lists where all items have the same height (e.g., simple text lists, uniform cards)
  2. **Dynamic Size Virtual Scroll**: Best for lists with variable height content (e.g., chat messages, posts with varying content). Uses autosize to automatically measure and adjust for variable heights

  ### Usage Pattern
  \`\`\`typescript
  // Fixed Size
  <cdk-virtual-scroll-viewport [itemSize]="40" class="h-lg">
    <org-list>
      <org-list-item *cdkVirtualFor="let item of items()" [label]="item" />
    </org-list>
  </cdk-virtual-scroll-viewport>

  // Dynamic Size (autosize for variable heights)
  <cdk-virtual-scroll-viewport
    autosize
    [minBufferPx]="500"
    [maxBufferPx]="1000"
    class="h-lg">
    <org-list>
      <org-list-item *cdkVirtualFor="let item of items()" [label]="item.content" />
    </org-list>
  </cdk-virtual-scroll-viewport>
  \`\`\`

  ### Performance Benefits
  - Renders only ~13 items in DOM instead of all 10,000
  - Smooth 60fps scrolling
  - Minimal memory footprint
  - Instant initial load time
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const FixedSize: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [FixedSizeVirtualScrollDemoComponent],
    },
    template: '<story-fixed-size-virtual-scroll-demo />',
  }),
};

export const DynamicSize: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DynamicSizeVirtualScrollDemoComponent],
    },
    template: '<story-dynamic-size-virtual-scroll-demo />',
  }),
};

export const FilteredDynamicSize: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [FilteredVirtualScrollDemoComponent],
    },
    template: '<story-filtered-virtual-scroll-demo />',
  }),
};

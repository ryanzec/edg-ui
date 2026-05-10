import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  contentChildren,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Button } from '../button/button';
import { TabsBrainDirective } from '../../brain/tabs-brain/tabs-brain';
import { TabBrainDirective } from '../../brain/tab-brain/tab-brain';

/** all available tabs visual variant values */
export const allTabsVariants = ['underline', 'pills', 'enclosed'] as const;

/** the visual variant of the tabs strip */
export type TabsVariant = (typeof allTabsVariants)[number];

/** all available tabs size values */
export const allTabsSizes = ['sm', 'base', 'lg'] as const;

/** the size variant of the tabs strip */
export type TabsSize = (typeof allTabsSizes)[number];

/** default value for the variant input */
export const TABS_VARIANT_DEFAULT: TabsVariant = 'underline';

/** default value for the size input */
export const TABS_SIZE_DEFAULT: TabsSize = 'base';

/** default value for the stretch input */
export const TABS_STRETCH_DEFAULT = false;

@Component({
  selector: 'org-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
  hostDirectives: [
    {
      directive: TabsBrainDirective,
      inputs: ['value', 'scrollable'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    '[attr.data-value]': 'brain.value()',
    '[attr.data-scrollable]': 'brain.scrollable() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-stretch]': 'stretch() ? "" : null',
  },
})
export class Tabs {
  protected readonly brain = inject(TabsBrainDirective, { self: true });

  /** reference to the inner tablist scroll container element */
  private readonly _tabsContainerRef = viewChild<ElementRef<HTMLDivElement>>('tabsContainerRef');

  /** all tab brain directives projected into the tablist; provides ordered access for focus / scroll routing */
  private readonly _tabBrains = contentChildren(TabBrainDirective, { descendants: true });

  /** the visual variant of the tabs strip */
  public readonly variant = input<TabsVariant>(TABS_VARIANT_DEFAULT);

  /** the size variant of the tabs strip */
  public readonly size = input<TabsSize>(TABS_SIZE_DEFAULT);

  /** whether the tabs fill the row equally (segmented-control style) */
  public readonly stretch = input<boolean>(TABS_STRETCH_DEFAULT);

  constructor() {
    this.brain.setOrderedTabsProvider(() => this._tabBrains());

    // keep the brain's scroll container in sync with the inner tablist view ref
    effect(() => {
      this.brain.registerScrollContainer(this._tabsContainerRef()?.nativeElement ?? null);
    });

    // scroll the active tab into view after each render when the active value changes
    afterRenderEffect(() => {
      this.brain.scrollActiveIntoView();
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  contentChildren,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { TabsBrainDirective } from '../../brain/tabs-brain/tabs-brain';
import { TabBrainDirective } from '../../brain/tab-brain/tab-brain';

@Component({
  selector: 'org-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonIcon],
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
  },
})
export class Tabs {
  protected readonly brain = inject(TabsBrainDirective, { self: true });

  /** reference to the inner tablist scroll container element */
  private readonly _tabsContainerRef = viewChild<ElementRef<HTMLDivElement>>('tabsContainerRef');

  /** all tab brain directives projected into the tablist; provides ordered access for focus / scroll routing */
  private readonly _tabBrains = contentChildren(TabBrainDirective, { descendants: true });

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

import {
  Component,
  ChangeDetectionStrategy,
  model,
  input,
  ViewChild,
  ElementRef,
  InjectionToken,
  afterNextRender,
  afterRenderEffect,
  contentChildren,
  inject,
} from '@angular/core';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { TabsBrainDirective } from '../../brain/tabs-brain/tabs-brain';
import { Tab } from './tab';

/** injection token for accessing the tabs component from child tab components */
export const TABS_COMPONENT = new InjectionToken<Tabs>('Tabs Component');

/** default value for the scrollable input */
export const TABS_SCROLLABLE_DEFAULT = false;

@Component({
  selector: 'org-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonIcon],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
  providers: [{ provide: TABS_COMPONENT, useExisting: Tabs }],
  hostDirectives: [TabsBrainDirective],
  host: {
    '[attr.data-value]': 'value()',
    '[attr.data-scrollable]': 'scrollable() ? "" : null',
  },
})
export class Tabs {
  protected readonly brain = inject(TabsBrainDirective, { self: true });

  @ViewChild('tabsContainerRef')
  private readonly tabsContainerRef!: ElementRef<HTMLDivElement>;

  /** all tab components projected into the tablist */
  private readonly _tabs = contentChildren(Tab);

  /** the value of the currently active tab */
  public readonly value = model.required<string>();

  /** whether the tabs are scrollable with navigation controls */
  public readonly scrollable = input<boolean>(TABS_SCROLLABLE_DEFAULT);

  constructor() {
    afterNextRender(() => {
      if (this.scrollable() && this.tabsContainerRef) {
        this.brain.recalcScrollState(this.tabsContainerRef.nativeElement);
      }
    });

    // scroll the active tab into view after each render when the value changes
    afterRenderEffect(() => {
      this._scrollActiveTabIntoView(this.value());
    });
  }

  protected onScrollLeft(): void {
    if (!this.tabsContainerRef) {
      return;
    }

    this.brain.scrollLeft(this.tabsContainerRef.nativeElement);
  }

  protected onScrollRight(): void {
    if (!this.tabsContainerRef) {
      return;
    }

    this.brain.scrollRight(this.tabsContainerRef.nativeElement);
  }

  protected onScroll(): void {
    if (!this.tabsContainerRef) {
      return;
    }

    this.brain.recalcScrollState(this.tabsContainerRef.nativeElement);
  }

  protected onScrollEnd(): void {
    if (!this.tabsContainerRef) {
      return;
    }

    this.brain.recalcScrollState(this.tabsContainerRef.nativeElement);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const tabs = this._tabs();

    if (tabs.length === 0) {
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab.hasFocus());

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        tabs[prevIndex]?.focus();
        break;
      }

      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        tabs[nextIndex]?.focus();
        break;
      }

      case 'Home': {
        event.preventDefault();
        tabs[0]?.focus();
        break;
      }

      case 'End': {
        event.preventDefault();
        tabs[tabs.length - 1]?.focus();
        break;
      }
    }
  }

  private _scrollActiveTabIntoView(activeValue: string): void {
    if (!this.scrollable()) {
      return;
    }

    const activeTab = this._tabs().find((tab) => tab.value() === activeValue);

    activeTab?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}

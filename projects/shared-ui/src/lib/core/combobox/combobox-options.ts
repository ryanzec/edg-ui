import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ScrollArea } from '../scroll-area/scroll-area';
import { Combobox } from './combobox';
import { ComboboxOption } from './combobox-option';
import { ComboboxOptionsBrainDirective } from '../../brain/combobox-options-brain/combobox-options-brain';
import type { ComboboxGroupedOptions, ComboboxOption as ComboboxOptionData } from '../combobox-store/combobox-store';

/**
 * renders the dropdown panel for the combobox — scrollable listbox of options with optional
 * grouping and a synthetic new-option suggestion. reads its data from the parent combobox
 * via injection.
 */
@Component({
  selector: 'org-combobox-options',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollArea, List, ListItem, ComboboxOption],
  templateUrl: './combobox-options.html',
  styleUrl: './combobox-options.css',
  hostDirectives: [ComboboxOptionsBrainDirective],
})
export class ComboboxOptions {
  private readonly _comboboxComponent = inject(Combobox);
  private readonly _injector = inject(Injector);
  protected readonly brain = inject(ComboboxOptionsBrainDirective, { self: true });

  @ViewChild('optionsScrollAreaComponent')
  protected readonly optionsScrollAreaComponent?: ScrollArea;

  /** whether the options container needs scrolling (proxied from brain). */
  protected readonly isScrollNeeded = computed<boolean>(() => this.brain.isScrollNeeded());

  /** filtered options from the parent combobox (used when grouping is disabled). */
  protected readonly filteredOptions = computed<ComboboxOptionData[]>(() => this._comboboxComponent.filteredOptions());

  /** grouped filtered options from the parent combobox (used when grouping is enabled). */
  protected readonly filteredGroupedOptions = computed<ComboboxGroupedOptions[]>(() =>
    this._comboboxComponent.filteredGroupedOptions()
  );

  /** whether there is at least one filtered option to render. */
  protected readonly hasFilteredOptions = computed<boolean>(() => this.filteredOptions().length > 0);

  /** whether options should be rendered in groups. */
  protected readonly isGroupingEnabled = computed<boolean>(() => this._comboboxComponent.isGroupingEnabled());

  /** synthetic option representing a new value the user can add. */
  protected readonly newOptionSuggestion = computed<ComboboxOptionData | null>(() =>
    this._comboboxComponent.newOptionSuggestion()
  );

  /** dom id for the listbox element. */
  protected readonly listboxId = computed<string>(() => this._comboboxComponent.listboxId());

  constructor() {
    // scroll the focused option into view when it changes while the dropdown is open
    effect(() => {
      const focusedOption = this._comboboxComponent.focusedOption();
      const isOpened = this._comboboxComponent.isOpened();

      if (!focusedOption || !isOpened) {
        return;
      }

      untracked(() => {
        afterNextRender(
          () => {
            const container = this.optionsScrollAreaComponent?.containerElement() ?? null;

            this.brain.scrollOptionIntoViewIfNeeded(container, focusedOption.value);
          },
          { injector: this._injector }
        );
      });
    });

    // recompute whether the options container needs scrolling whenever it is open and the options change
    effect(() => {
      const isOpened = this._comboboxComponent.isOpened();
      const filteredOptions = this.filteredOptions();

      if (!isOpened || !filteredOptions) {
        return;
      }

      untracked(() => {
        afterNextRender(
          () => {
            const container = this.optionsScrollAreaComponent?.containerElement() ?? null;

            this.brain.recalcScrollNeeded(container);
          },
          { injector: this._injector }
        );
      });
    });
  }
}

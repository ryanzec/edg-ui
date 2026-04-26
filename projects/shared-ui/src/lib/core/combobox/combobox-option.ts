import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { Combobox } from './combobox';
import type { ComboboxOption as ComboboxOptionData } from '../combobox-store/combobox-store';

/** default value for the displayLabelPrefix input */
export const COMBOBOX_OPTION_DISPLAY_LABEL_PREFIX_DEFAULT: string | undefined = undefined;

/**
 * renders a single option inside the combobox dropdown; reads focused state and forwards
 * mouse events to the parent combobox.
 */
@Component({
  selector: 'org-combobox-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItem],
  templateUrl: './combobox-option.html',
  // re-provides the parent List so the inner ListItem's host-scoped inject(List, { host: true })
  // can still resolve past this wrapper component
  viewProviders: [
    {
      provide: List,
      useFactory: () => inject(List, { skipSelf: true }),
    },
  ],
})
export class ComboboxOption {
  /** reference to the parent combobox for focused-option state and mouse handlers. */
  private readonly _comboboxComponent = inject(Combobox);

  /** the option data to render. */
  public option = input.required<ComboboxOptionData>();

  /** optional label-wrapper prefix (e.g. `Add` to produce `Add "label"`); when undefined the raw label is rendered. */
  public displayLabelPrefix = input<string | undefined, string | null | undefined>(
    COMBOBOX_OPTION_DISPLAY_LABEL_PREFIX_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** whether this option matches the currently focused option in the parent combobox. */
  protected readonly isFocused = computed<boolean>(
    () => this._comboboxComponent.focusedOption()?.value === this.option().value
  );

  /** computed dom id for the rendered option element. */
  protected readonly optionId = computed<string>(() => `org-combobox-option-${this.option().value}`);

  /** forwards mousedown to the parent combobox. */
  protected mouseDown(event: MouseEvent): void {
    this._comboboxComponent.optionMouseDown(event, this.option());
  }

  /** forwards mouseenter to the parent combobox. */
  protected mouseEnter(event: MouseEvent): void {
    this._comboboxComponent.optionMouseEnter(event, this.option());
  }

  /** forwards mouseleave to the parent combobox. */
  protected mouseLeave(event: MouseEvent): void {
    this._comboboxComponent.optionMouseLeave(event, this.option());
  }
}

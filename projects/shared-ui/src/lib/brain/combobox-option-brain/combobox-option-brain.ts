import { Directive, computed, inject, input } from '@angular/core';
import { ComboboxStore, type ComboboxOption } from '../../core/combobox-store/combobox-store';
import { ComboboxBrainDirective } from '../combobox-brain/combobox-brain';

/** static a11y role applied to the option element */
export const COMBOBOX_OPTION_ROLE = 'option';

/**
 * headless brain directive for the combobox-option component. owns the per-option interaction state
 * (focused / selected / disabled), the dom id used for `aria-activedescendant` linking, the listbox-option
 * a11y attributes (`role`, `aria-selected`, `aria-disabled`), and the mouse event handlers that route back
 * to the parent combobox brain. host bindings ensure the listbox-option a11y attrs are applied directly
 * to the option's host element.
 */
@Directive({
  selector: '[orgComboboxOptionBrain]',
  exportAs: 'orgComboboxOptionBrain',
  host: {
    '[attr.role]': 'role',
    '[attr.id]': 'optionId()',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-option-value]': 'option().value',
    '(mousedown)': 'handleMouseDown($event)',
    '(mouseenter)': 'handleMouseEnter($event)',
    '(mouseleave)': 'handleMouseLeave($event)',
  },
})
export class ComboboxOptionBrainDirective {
  private readonly _store = inject(ComboboxStore);
  private readonly _comboboxBrain = inject(ComboboxBrainDirective);

  /** the option data this directive represents */
  public readonly option = input.required<ComboboxOption>();

  /** static a11y role applied to the option's host element */
  public readonly role = COMBOBOX_OPTION_ROLE;

  /** dom id derived from the option's value, used for aria-activedescendant linking */
  public readonly optionId = computed<string>(() => `org-combobox-option-${this.option().value}`);

  /** whether this option is currently the focused (active-descendant) option */
  public readonly isFocused = computed<boolean>(() => this._store.focusedOption()?.value === this.option().value);

  /** whether this option is among the user-selected values */
  public readonly isSelected = computed<boolean>(() => this._store.selectedValues().includes(this.option().value));

  /** whether this option is disabled */
  public readonly isDisabled = computed<boolean>(() => this.option().disabled);

  /** routes mousedown to the parent combobox brain */
  public handleMouseDown(event: MouseEvent): void {
    this._comboboxBrain.handleOptionMouseDown(event, this.option());
  }

  /** routes mouseenter to the parent combobox brain */
  public handleMouseEnter(event: MouseEvent): void {
    this._comboboxBrain.handleOptionMouseEnter(event, this.option());
  }

  /** routes mouseleave to the parent combobox brain */
  public handleMouseLeave(event: MouseEvent): void {
    this._comboboxBrain.handleOptionMouseLeave(event, this.option());
  }
}

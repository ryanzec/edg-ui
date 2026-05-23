import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonToggleBrainDirective } from '../button-toggle/button-toggle-brain';
import { Button, ButtonColor, ButtonSize } from '../button/button';
import { ButtonGroup } from '../button/button-group';

/** an item rendered as a button within the button-toggle */
export type ButtonToggleItem = {
  label: string;
  value: string;
  buttonColor: ButtonColor;
  buttonDisabled?: boolean;
};

/** default value for the items input */
export const BUTTON_TOGGLE_ITEMS_DEFAULT: ButtonToggleItem[] = [];

/** default value for the value input */
export const BUTTON_TOGGLE_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const BUTTON_TOGGLE_DISABLED_DEFAULT = false;

/** default value for the buttonSize input */
export const BUTTON_TOGGLE_BUTTON_SIZE_DEFAULT: ButtonSize = 'base';

/** default value for the fullWidth input */
export const BUTTON_TOGGLE_FULL_WIDTH_DEFAULT = false;

@Component({
  selector: 'org-button-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonGroup],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.css',
  hostDirectives: [
    {
      directive: ButtonToggleBrainDirective,
      inputs: ['value', 'disabled'],
      outputs: ['changed'],
    },
  ],
  host: {
    role: 'group',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-full-width]': 'fullWidth() ? "" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonToggle),
      multi: true,
    },
  ],
})
export class ButtonToggle implements ControlValueAccessor {
  private readonly _brain = inject(ButtonToggleBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** the items rendered as buttons within the toggle */
  public readonly items = input<ButtonToggleItem[]>(BUTTON_TOGGLE_ITEMS_DEFAULT);

  /** the externally bound value input (used in non-form binding) */
  public readonly value = input<string>(BUTTON_TOGGLE_VALUE_DEFAULT);

  /** whether the entire toggle is disabled */
  public readonly disabled = input<boolean>(BUTTON_TOGGLE_DISABLED_DEFAULT);

  /** the size applied to every button rendered within the toggle */
  public readonly buttonSize = input<ButtonSize>(BUTTON_TOGGLE_BUTTON_SIZE_DEFAULT);

  /** when true, the toggle stretches to fill its parent's width and each button takes an equal share */
  public readonly fullWidth = input<boolean>(BUTTON_TOGGLE_FULL_WIDTH_DEFAULT);

  /** the resolved current value — proxied from the brain */
  public readonly currentValue = computed<string>(() => this._brain.currentValue());

  /** the resolved current disabled state — proxied from the brain */
  public readonly isDisabled = computed<boolean>(() => this._brain.isDisabled());

  constructor() {
    this._brain.changed.subscribe((value) => {
      this._onChange(value);
      this._onTouched();
    });
  }

  /** handles a button click by delegating selection to the brain */
  protected onItemClicked(value: string): void {
    this._brain.selectValue(value);
  }

  /** sets the selected value from the reactive forms api */
  public writeValue(value: string): void {
    this._brain.setInternalValue(value);
  }

  /** registers the on-change callback for reactive forms */
  public registerOnChange(fn: (value: string) => void): void {
    this._brain.setFormControlled();
    this._onChange = fn;
  }

  /** registers the on-touched callback for reactive forms */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** receives the form-disabled state from reactive forms */
  public setDisabledState(isDisabled: boolean): void {
    this._brain.setFormDisabled(isDisabled);
  }
}

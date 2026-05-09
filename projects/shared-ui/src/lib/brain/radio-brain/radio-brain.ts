import { Directive, DestroyRef, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { RadioGroupBrainDirective, RegisterableRadio } from '../radio-group-brain/radio-group-brain';

/** default value for the disabled input */
export const RADIO_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the radio component. owns the local selected state, host a11y attributes
 * (role, aria-checked, aria-disabled, tabindex), and the click / keyboard event handlers. when nested in a
 * `RadioGroupBrainDirective` it registers itself so the group can drive its selected state and dom focus
 * directly; standalone usage manages local state and emits `selectionRequested` for external consumers.
 */
@Directive({
  selector: '[orgRadioBrain]',
  exportAs: 'orgRadioBrain',
  host: {
    '[attr.role]': '"radio"',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.aria-disabled]': 'effectiveDisabled() ? "true" : null',
    '[attr.tabindex]': 'effectiveDisabled() ? -1 : 0',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeyDown($event)',
  },
})
export class RadioBrainDirective implements RegisterableRadio {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _groupBrain = inject(RadioGroupBrainDirective, { optional: true });
  private readonly _selected = signal<boolean>(false);

  /** the value this radio represents */
  public readonly value = input.required<string>();

  /** whether the radio is locally disabled */
  public readonly disabled = input<boolean>(RADIO_DISABLED_DEFAULT);

  /** whether this radio is currently selected */
  public readonly isChecked = computed<boolean>(() => this._selected());

  /** the resolved disabled state — local disabled OR the parent group's disabled */
  public readonly effectiveDisabled = computed<boolean>(() => {
    return this.disabled() || (this._groupBrain?.disabled() ?? false);
  });

  /** emitted when the user activates this radio via click, space, or enter (only meaningful for standalone use) */
  public readonly selectionRequested = output<void>();

  constructor() {
    if (this._groupBrain) {
      this._groupBrain.registerRadio(this);
      inject(DestroyRef).onDestroy(() => this._groupBrain?.unregisterRadio(this));
    }
  }

  /** sets the local selected state; called by the group brain to sync selection */
  public setSelected(selected: boolean): void {
    this._selected.set(selected);
  }

  /** moves dom focus to the host element */
  public focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** the host element, exposed so the group brain can sort registrants in dom order */
  public hostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** handles click interaction; routes selection to the group when present, else manages local state */
  public handleClick(event: Event): void {
    event.preventDefault();

    if (this.effectiveDisabled()) {
      return;
    }

    this._handleSelectionActivation();
  }

  /** handles keyboard interaction; space / enter selects, arrow keys navigate within a group */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) {
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this._handleSelectionActivation();

      return;
    }

    if (!this._groupBrain) {
      return;
    }

    const orientation = this._groupBrain.orientation();

    if (orientation === 'vertical' && event.key === 'ArrowDown') {
      event.preventDefault();
      this._groupBrain.focusNext(this.value());

      return;
    }

    if (orientation === 'vertical' && event.key === 'ArrowUp') {
      event.preventDefault();
      this._groupBrain.focusPrevious(this.value());

      return;
    }

    if (orientation === 'horizontal' && event.key === 'ArrowRight') {
      event.preventDefault();
      this._groupBrain.focusNext(this.value());

      return;
    }

    if (orientation === 'horizontal' && event.key === 'ArrowLeft') {
      event.preventDefault();
      this._groupBrain.focusPrevious(this.value());
    }
  }

  /** routes a selection trigger to the group brain when present, else updates local state */
  private _handleSelectionActivation(): void {
    if (this._groupBrain) {
      this._groupBrain.selectValue(this.value());

      return;
    }

    if (!this.isChecked()) {
      this._selected.set(true);
    }

    this.selectionRequested.emit();
  }
}

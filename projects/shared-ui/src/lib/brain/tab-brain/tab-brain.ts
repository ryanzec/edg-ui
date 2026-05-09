import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { TabsBrainDirective } from '../tabs-brain/tabs-brain';

type TabRole = 'tab';

/** default value for the disabled input */
export const TAB_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the tab component. owns the per-tab value, disabled state, click event,
 * focus-management api consumed by the parent tabs brain, and the static / dynamic accessibility
 * attributes (role, aria-selected, aria-disabled). looks up the parent tabs brain via dependency
 * injection to derive its active state.
 */
@Directive({
  selector: '[orgTabBrain]',
  exportAs: 'orgTabBrain',
})
export class TabBrainDirective {
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _parentTabsBrain = inject(TabsBrainDirective);

  /** the inner focusable element registered by the presentation; used by the parent for keyboard nav */
  private _focusableElement: HTMLElement | null = null;

  /** clicked subject; emits the tab value when the host is activated while not disabled */
  private readonly _clicked$ = new Subject<string>();

  /** the value identifying this tab; compared against the parent value to derive the active state */
  public readonly value = input.required<string>();

  /** whether this tab is disabled; when true, click-driven activation is suppressed */
  public readonly disabled = input<boolean>(TAB_DISABLED_DEFAULT);

  /** emits the tab value when the host is activated by click and the tab is not disabled */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** whether this tab is the currently active tab in its parent tabs brain */
  public readonly isActive = computed<boolean>(() => this._parentTabsBrain.value() === this.value());

  /** static aria role applied by the presentation to the focusable element */
  public readonly tabRole: TabRole = 'tab';

  /** the host element of the tab; used by the parent brain when scrolling the active tab into view */
  public get hostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** registers the inner focusable element so the brain can drive focus during keyboard navigation */
  public registerFocusable(element: HTMLElement | null): void {
    this._focusableElement = element;
  }

  /** focuses the registered focusable element if one is registered */
  public focus(): void {
    this._focusableElement?.focus();
  }

  /** whether the registered focusable element currently holds focus */
  public hasFocus(): boolean {
    return !!this._focusableElement && document.activeElement === this._focusableElement;
  }

  /** handles click activation; suppresses the action when disabled, otherwise updates parent state and emits */
  public handleClick(): void {
    if (this.disabled()) {
      return;
    }

    this._parentTabsBrain.value.set(this.value());
    this._clicked$.next(this.value());
  }
}

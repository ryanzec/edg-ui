import { Component, ChangeDetectionStrategy, ElementRef, effect, inject, viewChild } from '@angular/core';
import { TabBrainDirective } from '../../brain/tab-brain/tab-brain';

@Component({
  selector: 'org-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
  hostDirectives: [
    {
      directive: TabBrainDirective,
      inputs: ['value', 'disabled'],
      outputs: ['clicked'],
    },
  ],
  host: {
    '[attr.data-value]': 'brain.value()',
    '[attr.data-disabled]': 'brain.disabled() ? "" : null',
  },
})
export class Tab {
  protected readonly brain = inject(TabBrainDirective, { self: true });

  /** reference to the inner focusable button element */
  private readonly _buttonRef = viewChild<ElementRef<HTMLButtonElement>>('buttonRef');

  constructor() {
    // keep the brain's focusable target in sync with the inner button view ref
    effect(() => {
      this.brain.registerFocusable(this._buttonRef()?.nativeElement ?? null);
    });
  }
}

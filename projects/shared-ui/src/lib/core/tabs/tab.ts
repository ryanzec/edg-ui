import { Component, ChangeDetectionStrategy, ElementRef, effect, inject, viewChild } from '@angular/core';
import { TabBrainDirective } from '../../brain/tabs-brain/tab-brain';
import { Button } from '../button/button';

@Component({
  selector: 'org-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
  hostDirectives: [
    {
      directive: TabBrainDirective,
      inputs: ['value', 'disabled', 'closable'],
      outputs: ['clicked', 'closed'],
    },
  ],
  host: {
    '[attr.data-value]': 'brain.value()',
    '[attr.data-disabled]': 'brain.disabled() ? "" : null',
    '[attr.data-closable]': 'brain.closable() ? "" : null',
  },
})
export class Tab {
  protected readonly brain = inject(TabBrainDirective, { self: true });

  /** reference to the inner focusable element (button or div in closable mode) */
  private readonly _buttonRef = viewChild<ElementRef<HTMLElement>>('buttonRef');

  constructor() {
    // keep the brain's focusable target in sync with the inner focusable view ref
    effect(() => {
      this.brain.registerFocusable(this._buttonRef()?.nativeElement ?? null);
    });
  }
}

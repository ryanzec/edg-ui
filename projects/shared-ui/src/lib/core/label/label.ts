import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { LabelBrainDirective } from '../../brain/label-brain/label-brain';

@Component({
  selector: 'org-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner, NgTemplateOutlet],
  templateUrl: './label.html',
  styleUrl: './label.css',
  hostDirectives: [
    {
      directive: LabelBrainDirective,
      inputs: ['asLabel', 'text', 'isLoading', 'isRequired', 'htmlFor'],
    },
  ],
  host: {
    '[attr.data-as-label]': 'labelBrainDirective.asLabel() ? "" : null',
    '[attr.data-is-loading]': 'labelBrainDirective.isLoading() ? "" : null',
    '[attr.data-is-required]': 'labelBrainDirective.isRequired() ? "" : null',
  },
})
export class Label {
  /** reference to the host label brain directive owning state, accessibility, and validation */
  protected readonly labelBrainDirective = inject(LabelBrainDirective);
}

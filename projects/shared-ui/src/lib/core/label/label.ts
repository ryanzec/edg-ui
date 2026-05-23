import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { LabelBrainDirective } from '../label/label-brain';

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
})
export class Label {
  /** reference to the host label brain directive owning state, accessibility, and validation */
  protected readonly labelBrainDirective = inject(LabelBrainDirective);
}

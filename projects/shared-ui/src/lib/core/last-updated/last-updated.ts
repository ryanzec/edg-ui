import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Indicator } from '../indicator/indicator';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { Button } from '../button/button';
import { Tooltip } from '../tooltip/tooltip';
import { TooltipContent } from '../tooltip/tooltip-content';
import { LastUpdatedBrainDirective } from '../last-updated/last-updated-brain';

@Component({
  selector: 'org-last-updated',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Indicator, LoadingSpinner, Button, Tooltip, TooltipContent],
  templateUrl: './last-updated.html',
  styleUrl: './last-updated.css',
  hostDirectives: [
    {
      directive: LastUpdatedBrainDirective,
      inputs: ['state', 'format', 'dateTime', 'label', 'refreshable', 'tooltipText'],
      outputs: ['refresh'],
    },
  ],
  host: {
    '[attr.data-state]': 'brain.state()',
    '[attr.data-format]': 'brain.formatAttribute()',
  },
})
export class LastUpdated {
  /** reference to the host last-updated brain directive owning state and the a11y surface */
  protected readonly brain = inject(LastUpdatedBrainDirective, { self: true });
}

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LoadingBlockerBrainDirective } from '../../brain/loading-blocker-brain/loading-blocker-brain';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'org-loading-blocker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner],
  templateUrl: './loading-blocker.html',
  styleUrl: './loading-blocker.css',
  hostDirectives: [
    {
      directive: LoadingBlockerBrainDirective,
      inputs: ['isVisible', 'label'],
    },
  ],
})
export class LoadingBlocker {
  /** reference to the host loading-blocker brain directive owning visibility, a11y, and focus trapping */
  protected readonly brain = inject(LoadingBlockerBrainDirective, { self: true });
}
